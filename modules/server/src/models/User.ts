import makeid from '../util/makeid';
import Cursor from './Cursor';
import Color from '../types/Color';
import Position from '../models/Position';
import Line from '../models/Line';

export default class User {
  readonly id = makeid(5);
  private cursor = new Cursor(new Position(0, 0), Color.Red);
  private lines: Line[] = [];

  constructor(public readonly username: string) {}

  moveCursor(position: Position): void {
    this.cursor.position = position;
  }

  addLine(line: Line): void {
    this.lines.push(line);
  }

  addLinePoint(point: Position): void {
    if (!this.lines.length) return;

    this.lines[this.lines.length - 1].addPoint(point);
  }
}
