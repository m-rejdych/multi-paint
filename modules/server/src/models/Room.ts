import makeid from '../util/makeid';

import User from './User';

export default class Room {
  readonly id = makeid(5);
  private _users: Record<string, User> = {};

  constructor(public name: string, private readonly _cleanup: () => void) {
    this._runCleanupTimeout(10000);
  }

  getUser(userId: string): User | undefined {
    return this._users[userId];
  }

  addUser(username: string): void {
    const user = new User(username);
    this._users[user.id] = user;
  }

  deleteUser(id: string): void {
    delete this._users[id];

    if (!Object.keys(this._users).length) {
      this._runCleanupTimeout(10000);
    }
  }

  private _runCleanupTimeout(ms: number): void {
    setTimeout(() => {
      if (!Object.keys(this._users).length) {
        this._cleanup();
      }
    }, ms);
  }
}
