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
  LeaveRoomMessage,
} from '../types/Message';
import type State from './State';

export default class WebSocketManager {
  constructor(
    private readonly _wss: WebSocket.Server,
    private readonly _state: State,
  ) {}

  private _handleConnection(socket: WebSocket.WebSocket): void {
    log.info('WSOPEN', 'Connection established');

    socket.on(WebSocketEvent.Message, this._handleMessage);
    socket.on(WebSocketEvent.Close, this._handleClose);
  }

  private _handleClose(): void {
    log.info('WSCLOSE', 'Connection closed');
  }

  private _handleMessage(rawMessage: string): void {
    const message: Message<MessageEvent, unknown> = JSON.parse(rawMessage);

    switch (message.event) {
      case MessageEvent.JoinRoom:
        this._handleJoinRoom(message as JoinRoomMessage);
        break;
      case MessageEvent.LeaveRoom:
        this.handleLeaveRoom(message as LeaveRoomMessage);
        break;
      default:
        break;
    }
  }

  // TODO: Emit error / success event to client socket
  private _handleJoinRoom({
    data: { username, roomId },
  }: JoinRoomMessage): void {
    const room = this._state.getRoom(roomId);
    if (!room) {
      log.error('ERROR', `Room not found: "${roomId}"`);
      return;
    }

    room.addUser(username);
  }

  // TODO: Emit error / success event to client socket
  private handleLeaveRoom({
    data: { roomId, userId },
  }: LeaveRoomMessage): void {
    const room = this._state.getRoom(roomId);
    if (!room) {
      log.error('ERROR', `Room not found: "${roomId}"`);
      return;
    }

    if (!room.getUser(userId)) {
      log.error('ERROR', `User not found: "${userId}" in room: ${roomId}`);
      return;
    }

    room.deleteUser(userId);
  }

  registerHandlers(): void {
    this._wss.on(WebSocketServerEvent.Connection, this._handleConnection);
  }
}
