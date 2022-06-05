import { RequestHandler } from 'express';

import Room from './Room';

export default class State {
  rooms: Record<string, Room> = {};
  readonly middleware: RequestHandler = (req, _, next) => {
    req.state = this;
    next();
  };

  addRoom(roomName: string): Room {
    const room = new Room(roomName, () => {
      this.deleteRoom(room.id);
    });
    this.rooms[room.id] = room;

    return room;
  }

  deleteRoom(id: string): void {
    delete this.rooms[id];
  }
}
