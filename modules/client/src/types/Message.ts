import { MessageEvent } from './Event';
import type Room from './Room';
import type User from './User';
import type Position from '../models/Position';

export interface Message<T extends MessageEvent, U> {
  event: T;
  data: U;
}

export interface JoinRoomMessageData {
  roomId: string;
  username: string;
}

interface JoinedRoomMessageData {
  room: Room;
  user: User;
}

interface MovedCursorMessageData {
  userId: string;
  position: Position;
}

export type JoinedRoomMessage = Message<
  MessageEvent.JoinedRoom,
  JoinedRoomMessageData
>;

export type MovedCursorMessage = Message<
  MessageEvent.MovedCursor,
  MovedCursorMessageData
>;

export type MessageHandler = <T extends MessageEvent, U>(
  message: Message<T, U>,
) => void;
