export enum WebSocketEvent {
  Open = 'open',
  Close = 'close',
  Error = 'error',
  Message = 'message',
}

export enum MessageEvent {
  JoinRoom,
  JoinedRoom,
  LeaveRoom,
  MoveCursor,
  UpdateCursor,
  AddUser,
  DeleteUser,
  Error,
}
