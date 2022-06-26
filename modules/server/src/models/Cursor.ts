import type Position from './Position';
import type Color from '../types/Color';

export default class Cursor {
  constructor(public position: Position, public readonly color: Color) {}
}
