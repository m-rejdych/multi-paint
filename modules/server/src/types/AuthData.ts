import User from '../models/User';
import Room from '../models/Room';

export default interface AuthData {
  user: User;
  room: Room;
}
