import makeid from '../util/makeid';

import type User from './User';

export default class Room {
  readonly id = makeid(5);
  users: Record<string, User> = {};

  constructor(public name: string, private readonly cleanup: () => void) {
    this.runCleanupTimeout(10000);
  }

  addUser(user: User): void {
    this.users[user.id] = user;
  }

  deleteUser(id: string): void {
    delete this.users[id];

    if (!Object.keys(this.users).length) {
      this.runCleanupTimeout(10000);
    }
  }

  private runCleanupTimeout(ms: number): void {
    setTimeout(() => {
      if (!Object.keys(this.users).length) {
        this.cleanup();
      }
    }, ms);
  }
}
