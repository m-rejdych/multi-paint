import type Position from '../models/Position';

enum CursorColor {
  Red = '#FF0000',
  Green = '#00FF000',
  Blue = '#0000FF',
}

export default interface Cursor {
  position: Position;
  color: CursorColor;
}
