import { useEffect, useRef, type RefObject } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import {
  WebSocketEvent,
  MessageEvent as MessageEventKind,
} from '../types/Event';
import type {
  Message,
  MessageHandler,
  JoinRoomMessageData,
  JoinedRoomMessage,
  MovedCursorMessage,
  AddUserMessage,
  DeleteUserMessage,
  AddedLineMessage,
  AddedLinePointMessage,
} from '../types/Message';
import type { SetStateFn } from '../pages/Room/types/CanvasState';
import type User from '../types/User';
import type Room from '../types/Room';
import type RoomLocationState from '../types/RoomsLocationState';
import type Line from '../models/Line';

interface RoomData {
  handleSendMessage: MessageHandler;
  room: Room | null;
}

const useWebSocketHandlers = (
  url: string,
  setCanvasState: RefObject<SetStateFn>,
): RoomData => {
  const socketRef = useRef<WebSocket | null>(null);
  const userRef = useRef<User | null>(null);
  const roomRef = useRef<Room | null>(null);
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();

  const handleOpen = (): void => {
    handleSendMessage<MessageEventKind.JoinRoom, JoinRoomMessageData>({
      event: MessageEventKind.JoinRoom,
      data: {
        roomId: id as string,
        username: (state as RoomLocationState)!.username,
      },
    });
  };

  const handleClose = (): void => {
    console.log('Connection terminated');
  };

  const handleMessage = (messageData: MessageEvent): void => {
    const message = JSON.parse(messageData.data) as Message<
      MessageEventKind,
      unknown
    >;

    switch (message.event) {
      case MessageEventKind.JoinedRoom:
        handleJoinedRoomMessage(message as JoinedRoomMessage);
        break;
      case MessageEventKind.UpdateCursor:
        handleMovedCursorMessage(message as MovedCursorMessage);
        break;
      case MessageEventKind.AddUser:
        handleAddUserMessage(message as AddUserMessage);
        break;
      case MessageEventKind.DeleteUser:
        handleDeleteUserMessage(message as DeleteUserMessage);
        break;
      case MessageEventKind.AddedLine:
        handleAddedLine(message as AddedLineMessage);
        break;
      case MessageEventKind.AddedLinePoint:
        handleAddedLinePoint(message as AddedLinePointMessage);
        break;
      default:
        console.log(message);
        break;
    }
  };

  const handleJoinedRoomMessage = ({
    data: { user, room },
  }: JoinedRoomMessage): void => {
    userRef.current = user;
    roomRef.current = room;

    setCanvasState.current?.(
      'users',
      Object.entries(room.users).reduce(
        (acc, [id, roomUser]) =>
          id === user.id ? acc : { ...acc, [id]: roomUser },
        {},
      ),
    );
  };

  const handleMovedCursorMessage = ({
    data: { userId, position },
  }: MovedCursorMessage): void => {
    setCanvasState.current?.('users', (users) => ({
      ...users,
      [userId]: {
        ...users[userId],
        cursor: { ...users[userId].cursor, position },
      },
    }));
  };

  const handleAddUserMessage = ({ data }: AddUserMessage): void => {
    setCanvasState.current?.('users', (users) => ({
      ...users,
      [data.id]: data,
    }));
  };

  const handleDeleteUserMessage = ({ data }: DeleteUserMessage): void => {
    setCanvasState.current?.('users', (users) => {
      delete users[data];
      return users;
    });
  };

  const handleAddedLine = ({
    data: { userId, line },
  }: AddedLineMessage): void => {
    setCanvasState.current?.('users', (users) => ({
      ...users,
      [userId]: {
        ...users[userId],
        lines: [...users[userId].lines, line],
      },
    }));
  };

  const handleAddedLinePoint = ({
    data: { userId, point },
  }: AddedLinePointMessage): void => {
    setCanvasState.current?.('users', (users) => {
      const user = users[userId];
      if (!user) return users;

      const { lines } = user;
      const lastLine = lines[lines.length - 1];

      return {
        ...users,
        [userId]: {
          ...user,
          lines: lastLine
            ? [
                ...lines.slice(0, -1),
                { ...lastLine, points: [...lastLine.points, point] } as Line,
              ]
            : [],
        },
      };
    });
  };

  const handleError = (error: Event): void => {
    console.error(error);
  };

  const handleSendMessage: MessageHandler = (message) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) return;

    socket.send(JSON.stringify(message));
  };

  const handleCleanup = (socket: WebSocket): void => {
    handleSendMessage<MessageEventKind.LeaveRoom, undefined>({
      event: MessageEventKind.LeaveRoom,
      data: undefined,
    });

    if ([WebSocket.OPEN, WebSocket.CONNECTING].includes(socket.readyState)) {
      socket.close();
    }
    socket.removeEventListener(WebSocketEvent.Open, handleOpen);
    socket.removeEventListener(WebSocketEvent.Close, handleClose);
    socket.removeEventListener(WebSocketEvent.Message, handleMessage);
    socket.removeEventListener(WebSocketEvent.Error, handleError);
  };

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.addEventListener(WebSocketEvent.Open, handleOpen);
    socket.addEventListener(WebSocketEvent.Close, handleClose);
    socket.addEventListener(WebSocketEvent.Message, handleMessage);
    socket.addEventListener(WebSocketEvent.Error, handleError);

    return () => {
      handleCleanup(socket);
    };
  }, []);

  return { handleSendMessage, room: roomRef.current };
};

export default useWebSocketHandlers;
