import { MessageEvent } from './Event';

import type Room from '../models/Room';
import type User from '../models/User';

export interface Message<T extends MessageEvent, V> {
  event: T;
  data: V;
}

interface JoinRoomMessageData {
  username: string;
  roomId: string;
}

export interface JoinedRoomMessageData {
  room: Room;
  user: User;
}

export type JoinRoomMessage = Message<
  MessageEvent.JoinRoom,
  JoinRoomMessageData
>;

export type LeaveRoomMessage = Message<MessageEvent.LeaveRoom, undefined>;
