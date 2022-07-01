import type Position from './Position';
import type Color from '../types/Color';

export default class Line {
  readonly points: Position[] = [];

  constructor(
    public readonly color: Color,
    public readonly size: number,
    points?: Position[],
  ) {
    if (points) {
      this.points = points;
    }
  }

  addPoint(position: Position): void {
    this.points.push(position);
  }
}
