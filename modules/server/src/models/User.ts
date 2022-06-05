import makeid from '../util/makeid';

export default class User {
  readonly id = makeid(5);

  constructor(public readonly username: string) {}
}
