import type Cursor from './Cursor';
import type Line from '../models/Line';

export default interface User {
  id: string;
  username: string;
  cursor: Cursor;
  lines: Line[];
}
