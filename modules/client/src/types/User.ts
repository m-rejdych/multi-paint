import type Cursor from './Cursor';

export default interface User {
  id: string;
  cursor: Cursor;
}
