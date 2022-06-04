import makeid from '../util/makeid';

import type User from './User';

export default class Room {
  id = makeid(5);
  users: User[] = [];

  constructor(public name: string) {}

  addUser(user: User) {
    this.users.push(user);
  }
}
