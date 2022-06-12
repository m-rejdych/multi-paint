import type Cursor from './Cursor';

export default interface User {
  id: string;
  username: string;
  cursor: Cursor;
}
