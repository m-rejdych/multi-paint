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
    socket.on(WebSocketEvent.Error, this.handleError.bind(this));
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
        default:
          break;
      }
    };
  }

  private handleError(): void {
    log.error('ERROR', '');
  }

  private handleSendMessage<T extends MessageEvent, U>(
    socket: WebSocket.WebSocket,
    message: Message<T, U>,
  ): void {
    socket.send(JSON.stringify(message), (err) => {
      if (err) {
        log.error('ERROR', err.message);
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
      log.error('ERROR', `Room not found: "${roomId}"`);
      return;
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
      log.error('ERROR', `Unknown socket`);
      return;
    }

    const room = this.state.getRoom(socket.roomId);
    if (!room) {
      log.error('ERROR', `Room not found: "${socket.roomId}"`);
      return;
    }

    if (!room.getUser(socket.userId)) {
      log.error('ERROR', `User not found: "${socket.userId}" in room: ${socket.roomId}`);
      return;
    }

    room.deleteUser(socket.userId);
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

  unregisterHandlers(): void {
    this.wss.removeAllListeners();
  }

  registerHandlers(): void {
    this.wss.on(
      WebSocketServerEvent.Connection,
      this.handleConnection.bind(this),
    );
    this.wss.on(WebSocketServerEvent.Error, this.handleError.bind(this));
    this.wss.on(WebSocketServerEvent.Close, this.unregisterHandlers.bind(this));
  }
}
