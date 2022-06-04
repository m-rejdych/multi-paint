const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' as const;

export default class Room {
  id: string;

  constructor() {
    this.id = Room.makeid(5);
  }

  private static makeid(length: number): string {
    let result = '';

    for (let i = 0; i < length; i++) {
      result += CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    return result;
  }
}
