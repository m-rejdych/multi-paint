import Room from './Room';

export default class State {
  rooms: Record<string, Room>;

  constructor() {
    this.rooms = {};
  }

  addRoom(): void {
    const room = new Room();
    this.rooms[room.id] = room;
  }
}
