import Room from './Room';

export default class State {
  rooms: Record<string, Room> = {};

  addRoom(roomName: string): Room {
    const room = new Room(roomName);
    this.rooms[room.id] = room;

    return room;
  }
}
