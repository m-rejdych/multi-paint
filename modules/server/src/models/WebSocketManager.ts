import WebSocket from 'ws';
import log from 'npmlog';

import {
  WebSocketEvent,
  WebSocketServerEvent,
  MessageEvent,
} from '../types/Event';
import User from './User';
import type {
  Message,
  JoinRoomMessage,
  LeaveRoomMessage,
} from '../types/Message';
import type State from './State';

export default class WebSocketManager {
  constructor(
    private readonly wss: WebSocket.Server,
    private readonly state: State,
  ) {}

  private handleConnection(socket: WebSocket.WebSocket): void {
    log.info('WSOPEN', 'Connection established');

    socket.on(WebSocketEvent.Message, this.handleMessage);
    socket.on(WebSocketEvent.Close, this.handleClose);
  }

  private handleClose(): void {
    log.info('WSCLOSE', 'Connection closed');
  }

  private handleMessage(rawMessage: string): void {
    const message: Message<MessageEvent, unknown> = JSON.parse(rawMessage);

    switch (message.event) {
      case MessageEvent.JoinRoom:
        this.handleJoinRoom(message as JoinRoomMessage);
        break;
      case MessageEvent.LeaveRoom:
        this.handleLeaveRoom(message as LeaveRoomMessage);
        break;
      default:
        break;
    }
  }

  // TODO: Emit error / success event to client socket
  private handleJoinRoom({
    data: { username, roomId },
  }: JoinRoomMessage): void {
    const room = this.state.rooms[roomId];
    if (!room) {
      log.error('ERROR', `Room not found: "${roomId}"`);
      return;
    }

    const user = new User(username);

    room.addUser(user);
  }

  // TODO: Emit error / success event to client socket
  private handleLeaveRoom({
    data: { roomId, userId },
  }: LeaveRoomMessage): void {
    const room = this.state.rooms[roomId];
    if (!room) {
      log.error('ERROR', `Room not found: "${roomId}"`);
      return;
    }

    if (!room.users[userId]) {
      log.error('ERROR', `User not found: "${userId}" in room: ${roomId}`);
      return;
    }

    room.deleteUser(userId);
  }

  registerHandlers(): void {
    this.wss.on(WebSocketServerEvent.Connection, this.handleConnection);
  }
}
