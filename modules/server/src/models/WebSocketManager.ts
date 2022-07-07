import WebSocket from 'ws';
import log from 'npmlog';

import {
  WebSocketEvent,
  WebSocketServerEvent,
  MessageEvent,
} from '../types/Event';
import type {
  Message,
  JoinRoomMessage,
  JoinedRoomMessageData,
  MoveCursorMessage,
  MovedCursorData,
  AddLineMessage,
  AddedLineMessageData,
  AddLinePointMessage,
  AddedLinePointMessageData,
} from '../types/Message';
import type AuthData from '../types/AuthData';
import type State from './State';
import type User from './User';
import Line from './Line';

export default class WebSocketManager {
  constructor(
    private readonly wss: WebSocket.Server,
    private readonly state: State,
  ) {}

  private handleConnection(socket: WebSocket.WebSocket): void {
    log.info('WSOPEN', 'Connection established');

    socket.on(WebSocketEvent.Message, this.handleMessage(socket).bind(this));
    socket.on(WebSocketEvent.Close, this.handleClose.bind(this));
    socket.on(WebSocketEvent.Error, this.logError.bind(this));
  }

  private handleClose(): void {
    log.info('WSCLOSE', 'Connection closed');
  }

  private handleMessage(socket: WebSocket.WebSocket) {
    return (rawMessage: string): void => {
      const message: Message<MessageEvent, unknown> = JSON.parse(rawMessage);
      log.info('MESSAGE', 'Incoming message', message);

      switch (message.event) {
        case MessageEvent.JoinRoom:
          this.handleJoinRoom(socket, message as JoinRoomMessage);
          break;
        case MessageEvent.LeaveRoom:
          this.handleLeaveRoom(socket);
          break;
        case MessageEvent.MoveCursor:
          this.handleMoveCursor(socket, message as MoveCursorMessage);
          break;
        case MessageEvent.AddLine:
          this.handleAddLine(socket, message as AddLineMessage);
          break;
        case MessageEvent.AddLinePoint:
          this.handleAddLinePoint(socket, message as AddLinePointMessage);
          break;
        default:
          break;
      }
    };
  }

  private logError(error: Error, shouldThrow = false): void {
    log.error('ERROR', error.message);
    if (shouldThrow) {
      throw error;
    }
  }

  private handleSendMessage<T extends MessageEvent, U>(
    socket: WebSocket.WebSocket,
    message: Message<T, U>,
  ): void {
    socket.send(JSON.stringify(message), (err) => {
      if (err) {
        this.logError(err);
      }
    });
  }

  private handleJoinRoom(
    socket: WebSocket.WebSocket,
    { data: { username, roomId } }: JoinRoomMessage,
  ): void {
    const room = this.state.getRoom(roomId);
    if (!room) {
      this.logError(new Error(`Room not found: "${roomId}"`));
      return;
    }

    if (socket.userId) {
      if (socket.roomId === room.id) {
        if (!room.isJoined(socket.userId)) {
          this.logError(new Error("User not included in room's state"));
        }
        return;
      }

      this.logError(new Error('This users is in other room'));
    }

    const user = room.addUser(username);
    socket.userId = user.id;
    socket.roomId = roomId;

    this.setPingInterval(socket, 10000);
    this.handleSendMessage<MessageEvent.JoinedRoom, JoinedRoomMessageData>(
      socket,
      { event: MessageEvent.JoinedRoom, data: { user, room } },
    );
    this.broadcast<MessageEvent.AddUser, User>(socket, {
      event: MessageEvent.AddUser,
      data: user,
    });
  }

  private handleLeaveRoom(socket: WebSocket.WebSocket): void {
    const authResult = this.authSocket(socket);
    if (authResult instanceof Error) return;

    const { user, room } = authResult;

    if (!room.isJoined(user.id)) {
      this.logError(
        new Error(`User not found: "${user.id}" in room: ${room.id}`),
      );
      return;
    }

    room.deleteUser(user.id);

    this.broadcast<MessageEvent.DeleteUser, string>(socket, {
      event: MessageEvent.DeleteUser,
      data: user.id,
    });
  }

  private handleMoveCursor(
    socket: WebSocket.WebSocket,
    { data }: MoveCursorMessage,
  ): void {
    const authResult = this.authSocket(socket);
    if (authResult instanceof Error) return;

    const { user } = authResult;

    user.moveCursor(data);
    this.broadcast<MessageEvent.UpdateCursor, MovedCursorData>(socket, {
      event: MessageEvent.UpdateCursor,
      data: { userId: user.id, position: data },
    });
  }

  private handleAddLine(
    socket: WebSocket.WebSocket,
    { data: { color, points, size } }: AddLineMessage,
  ): void {
    const authResult = this.authSocket(socket);
    if (authResult instanceof Error) return;

    const { user } = authResult;

    const line = new Line(color, size, points);
    user.addLine(line);

    this.broadcast<MessageEvent.AddedLine, AddedLineMessageData>(socket, {
      event: MessageEvent.AddedLine,
      data: { line, userId: user.id },
    });
  }

  private handleAddLinePoint(
    socket: WebSocket.WebSocket,
    { data }: AddLinePointMessage,
  ): void {
    const authResult = this.authSocket(socket);
    if (authResult instanceof Error) return;

    const { user } = authResult;

    user.addLinePoint(data);

    this.broadcast<MessageEvent.AddedLinePoint, AddedLinePointMessageData>(
      socket,
      {
        event: MessageEvent.AddedLinePoint,
        data: { point: data, userId: user.id },
      },
    );
  }

  private setPingInterval(socket: WebSocket.WebSocket, ms: number): void {
    const interval = setInterval(() => {
      socket.ping(undefined, undefined, (err) => {
        if (err) {
          log.error('PING ERROR', err.message);

          clearInterval(interval);

          if (!socket.userId || !socket.roomId) return;

          const room = this.state.getRoom(socket.roomId);
          if (room) {
            room.deleteUser(socket.userId);
          }

          this.broadcast<MessageEvent.DeleteUser, string>(socket, {
            event: MessageEvent.DeleteUser,
            data: socket.userId,
          });
        }
      });
    }, ms);
  }

  private authSocket(socket: WebSocket.WebSocket): Error | AuthData {
    if (!socket.userId || !socket.roomId) {
      const error = new Error('Unknown socket');
      this.logError(error);
      return error;
    }

    const room = this.state.getRoom(socket.roomId);
    if (!room) {
      const error = new Error('Room not fund');
      this.logError(error);
      return error;
    }

    const user = room.getUser(socket.userId);
    if (!user) {
      const error = new Error('User not fund');
      this.logError(error);
      return error;
    }

    return { user, room };
  }

  private broadcast<T extends MessageEvent, U>(
    socket: WebSocket.WebSocket,
    message: Message<T, U>,
  ): void {
    const authResult = this.authSocket(socket);
    if (authResult instanceof Error) return;

    const { room } = authResult;

    Array.from(this.wss.clients)
      .filter(
        (client) =>
          client.readyState === WebSocket.OPEN &&
          Object.keys(room.users).some((id) => id === client.userId) &&
          client.userId !== socket.userId,
      )
      .forEach((client) => this.handleSendMessage(client, message));
  }

  unregisterHandlers(): void {
    this.wss.removeAllListeners();
  }

  registerHandlers(): void {
    this.wss.on(
      WebSocketServerEvent.Connection,
      this.handleConnection.bind(this),
    );
    this.wss.on(WebSocketServerEvent.Error, this.logError.bind(this));
    this.wss.on(WebSocketServerEvent.Close, this.unregisterHandlers.bind(this));
  }
}
