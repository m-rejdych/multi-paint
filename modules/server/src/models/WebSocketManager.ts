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
} from '../types/Message';
import type State from './State';

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

  // TODO: Emit error event to client socket
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
      { event: MessageEvent.JoinedRoom, data: { room, user } },
    );
  }

  // TODO: Emit error event to client socket
  private handleLeaveRoom(socket: WebSocket.WebSocket): void {
    if (!socket.userId || !socket.roomId) {
      this.logError(new Error('Unknown socket'));
      return;
    }

    const room = this.state.getRoom(socket.roomId);
    if (!room) {
      this.logError(new Error(`Room not found: "${socket.roomId}"`));
      return;
    }

    if (!room.isJoined(socket.userId)) {
      this.logError(
        new Error(
          `User not found: "${socket.userId}" in room: ${socket.roomId}`,
        ),
      );
      return;
    }

    room.deleteUser(socket.userId);
  }

  private handleMoveCursor(
    socket: WebSocket.WebSocket,
    { data }: MoveCursorMessage,
  ): void {
    if (!socket.userId || !socket.roomId) {
      this.logError(new Error('Unknown socket'));
      return;
    }

    const room = this.state.getRoom(socket.roomId);
    if (!room) {
      this.logError(new Error('Room not fund'));
      return;
    }

    const user = room.getUser(socket.userId);
    if (!user) {
      this.logError(new Error('User not fund'));
      return;
    }

    user.moveCursor(data);
    this.broadcast<MessageEvent.MovedCursor, MovedCursorData>(socket, {
      event: MessageEvent.MovedCursor,
      data: { userId: socket.userId, position: data },
    });
  }

  private setPingInterval(socket: WebSocket.WebSocket, ms: number): void {
    const interval = setInterval(() => {
      socket.ping(undefined, undefined, (err) => {
        if (err) {
          log.error('PING ERROR', err.message);

          clearInterval(interval);

          if (!socket.roomId) return;

          const room = this.state.getRoom(socket.roomId as string);
          if (room) {
            room.deleteUser(socket.userId as string);
          }
        }
      });
    }, ms);
  }

  private broadcast<T extends MessageEvent, U>(
    socket: WebSocket.WebSocket,
    message: Message<T, U>,
  ): void {
    if (!socket.userId || !socket.roomId) {
      this.logError(new Error('Unknown socket'));
      return;
    }

    const room = this.state.getRoom(socket.roomId);
    if (!room) {
      this.logError(new Error('Room not found'));
      return;
    }

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
