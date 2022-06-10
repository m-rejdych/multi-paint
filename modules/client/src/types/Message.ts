import { MessageEvent } from './Event';
import type Room from './Room';
import type User from './User';

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

export type JoinedRoomMessage = Message<
  MessageEvent.JoinedRoom,
  JoinedRoomMessageData
>;

export type MessageHandler = <T extends MessageEvent, U>(
  message: Message<T, U>,
) => void;
