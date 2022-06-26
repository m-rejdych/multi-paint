import type Position from '../models/Position';
import type Color from './Color';

export default interface Cursor {
  position: Position;
  color: Color;
}
