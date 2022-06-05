import { MessageEvent } from './Event';

export interface Message<T extends MessageEvent, V> {
  event: T;
  data: V;
}

interface JoinRoomMessageData {
  username: string;
  roomId: string;
}

interface LeaveRoomMessageData {
  userId: string;
  roomId: string;
}

export type JoinRoomMessage = Message<
  MessageEvent.JoinRoom,
  JoinRoomMessageData
>;

export type LeaveRoomMessage = Message<
  MessageEvent.LeaveRoom,
  LeaveRoomMessageData
>;
