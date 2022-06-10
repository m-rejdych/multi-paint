import makeid from '../util/makeid';

import User from './User';

export default class Room {
  readonly id = makeid(5);
  private users: Record<string, User> = {};

  constructor(public name: string, private readonly _cleanup: () => void) {
    this.runCleanupTimeout(10000);
  }

  getUser(userId: string): User | undefined {
    return this.users[userId];
  }

  addUser(username: string): User {
    const user = new User(username);
    this.users[user.id] = user;

    return user;
  }

  deleteUser(id: string): void {
    delete this.users[id];

    if (!Object.keys(this.users).length) {
      this.runCleanupTimeout(10000);
    }
  }

  isJoined(id: string): boolean {
    return id in this.users;
  }

  private runCleanupTimeout(ms: number): void {
    setTimeout(() => {
      if (!Object.keys(this.users).length) {
        this._cleanup();
      }
    }, ms);
  }
}
