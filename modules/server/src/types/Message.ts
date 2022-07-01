import { MessageEvent } from './Event';

import type Room from '../models/Room';
import type User from '../models/User';
import type Line from '../models/Line';
import type Position from '../models/Position';

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

export interface MovedCursorData {
  userId: string;
  position: Position;
}

type AddLineMessageData = Pick<Line, 'size' | 'points' | 'color'>;

export interface AddedLineMessageData {
  line: Line;
  userId: string;
}

export interface AddedLinePointMessageData {
  point: Position;
  userId: string;
}

export type JoinRoomMessage = Message<
  MessageEvent.JoinRoom,
  JoinRoomMessageData
>;

export type LeaveRoomMessage = Message<MessageEvent.LeaveRoom, undefined>;

export type MoveCursorMessage = Message<MessageEvent.MoveCursor, Position>;

export type AddLineMessage = Message<MessageEvent.AddLine, AddLineMessageData>;

export type AddLinePointMessage = Message<MessageEvent.AddLinePoint, Position>;
