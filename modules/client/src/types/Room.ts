import type User from './User';

export default interface Room {
  id: string;
  name: string;
  users: Record<string, User>;
}
