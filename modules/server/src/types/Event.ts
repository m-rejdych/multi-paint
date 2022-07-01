export enum WebSocketServerEvent {
  Connection = 'connection',
  Close = 'close',
  Error = 'error',
  Headers = 'headers',
  Listening = 'listening',
}

export enum WebSocketEvent {
  Open = 'open',
  Close = 'close',
  Ping = 'ping',
  Pong = 'pong',
  Error = 'error',
  Upgrade = 'upgrade',
  Message = 'message',
  UnexpectedResponse = 'unexpected-response',
}

export enum MessageEvent {
  JoinRoom,
  JoinedRoom,
  LeaveRoom,
  MoveCursor,
  UpdateCursor,
  AddUser,
  DeleteUser,
  AddLine,
  AddedLine,
  AddLinePoint,
  AddedLinePoint,
  Error,
}
