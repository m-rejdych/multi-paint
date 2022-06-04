import makeid from '../util/makeid';

export default class User {
  id = makeid(5);

  constructor(public username: string, public roomId: string) {}
}
