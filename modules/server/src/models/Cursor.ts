import type Position from './Position';
import type CursorColor from '../types/CursorColor';

export default class Cursor {
  constructor(public position: Position, public readonly color: CursorColor) {}
}
