import type { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import type RoomLocationState from '../../types/RoomsLocationState';

const Room: FC = () => {
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();

  useUsernameGuard(state as RoomLocationState);

  return <div>Room {id}</div>;
};

export default Room;
