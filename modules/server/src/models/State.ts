import { RequestHandler } from 'express';

import Room from './Room';

export default class State {
  private _rooms: Record<string, Room> = {};
  readonly middleware: RequestHandler = (req, _, next) => {
    req.state = this;
    next();
  };

  getRoom(roomId: string): Room | undefined {
    return this._rooms[roomId];
  }

  addRoom(roomName: string): Room {
    const room = new Room(roomName, () => {
      this.deleteRoom(room.id);
    });
    this._rooms[room.id] = room;

    return room;
  }

  deleteRoom(id: string): void {
    delete this._rooms[id];
  }

  get rooms(): Record<string, Room> {
    return this._rooms;
  }
}
