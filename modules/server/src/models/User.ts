import makeid from '../util/makeid';
import Cursor from './Cursor';
import Color from '../types/Color';
import Position from '../models/Position';

export default class User {
  readonly id = makeid(5);
  private cursor = new Cursor(new Position(0, 0), Color.Red);

  constructor(public readonly username: string) {}

  moveCursor(position: Position): void {
    this.cursor.position = position;
  }
}
