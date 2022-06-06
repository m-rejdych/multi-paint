import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import {
  WebSocketEvent,
  MessageEvent as MessageEventKind,
} from '../types/Event';
import type {
  Message,
  JoinRoomMessageData,
  JoinedRoomMessage,
} from '../types/Message';
import type User from '../types/User';
import type Room from '../types/Room';
import type RoomLocationState from '../types/RoomsLocationState';

const useWebSocketHandlers = (url: string): void => {
  const socketRef = useRef<WebSocket | null>(null);
  const userRef = useRef<User | null>(null);
  const roomRef = useRef<Room | null>(null);
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();

  const handleOpen = (socket: WebSocket) => (): void => {
    console.log('Connection established');

    handleSendMessage<MessageEventKind.JoinRoom, JoinRoomMessageData>(socket, {
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
      default:
        break;
    }
  };

  const handleError = (error: Event): void => {
    console.error(error);
  };

  const handleSendMessage = <T extends MessageEventKind, U>(
    socket: WebSocket,
    message: Message<T, U>,
  ): void => {
    socket.send(JSON.stringify(message));
  };

  const handleCleanup = (socket: WebSocket): void => {
    const userId = userRef.current?.id;
    const roomId = roomRef.current?.id;

    if (userId && roomId) {
      handleSendMessage<MessageEventKind.LeaveRoom, undefined>(socket, {
        event: MessageEventKind.LeaveRoom,
        data: undefined,
      });
    }

    if ([WebSocket.OPEN, WebSocket.CONNECTING].includes(socket.readyState)) {
      socket.close();
    }
    socket.removeEventListener(WebSocketEvent.Open, handleOpen(socket));
    socket.removeEventListener(WebSocketEvent.Close, handleClose);
    socket.removeEventListener(WebSocketEvent.Message, handleMessage);
    socket.removeEventListener(WebSocketEvent.Error, handleError);
  };

  const handleJoinedRoomMessage = (message: JoinedRoomMessage): void => {
    const { user, room } = message.data;
    userRef.current = user;
    roomRef.current = room;
  };

  useEffect(() => {
    const socket = new WebSocket(url);
    socket.addEventListener(WebSocketEvent.Open, handleOpen(socket));
    socket.addEventListener(WebSocketEvent.Close, handleClose);
    socket.addEventListener(WebSocketEvent.Message, handleMessage);
    socket.addEventListener(WebSocketEvent.Error, handleError);

    socketRef.current = socket;

    return () => {
      handleCleanup(socket);
    };
  }, []);
};

export default useWebSocketHandlers;
