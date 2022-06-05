import makeid from '../util/makeid';

import type User from './User';

export default class Room {
  id = makeid(5);
  users: User[] = [];
  private cleanup: () => void;

  constructor(public name: string, cleanup: () => void) {
    this.cleanup = cleanup;

    this.runCleanupTimeout(10000);
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  deleteUser(id: string): void {
    this.users = this.users.filter(({ id: userId }) => id !== userId);

    if (!this.users.length) {
      this.runCleanupTimeout(10000);
    }
  }

  private runCleanupTimeout(ms: number): void {
    setTimeout(() => {
      if (!this.users.length) {
        this.cleanup();
      }
    }, ms);
  }
}
