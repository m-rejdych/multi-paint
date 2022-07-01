import { MessageEvent } from './Event';
import type Room from './Room';
import type User from './User';
import type Position from '../models/Position';
import type Line from '../models/Line';

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

interface AddedLineMessageData {
  line: Line;
  userId: string;
}

interface AddedLinePointMessageData {
  point: Position;
  userId: string;
}

export type JoinedRoomMessage = Message<
  MessageEvent.JoinedRoom,
  JoinedRoomMessageData
>;

export type MovedCursorMessage = Message<
  MessageEvent.UpdateCursor,
  MovedCursorMessageData
>;

export type AddUserMessage = Message<MessageEvent.AddUser, User>;

export type DeleteUserMessage = Message<MessageEvent.DeleteUser, string>;

export type AddedLineMessage = Message<MessageEvent.AddedLine, AddedLineMessageData>;

export type AddedLinePointMessage = Message<MessageEvent.AddedLinePoint, AddedLinePointMessageData>;

export type MessageHandler = <T extends MessageEvent, U>(
  message: Message<T, U>,
) => void;
