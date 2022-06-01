import type { FC } from 'react';
import { useLocation } from 'react-router-dom';

import useUsernameGuard from '../../hooks/useUsernameGuard';

interface LocationState {
  username: string;
}

const Rooms: FC = () => {
  const { state } = useLocation();

  useUsernameGuard(state as LocationState | null);

  return <div>{(state as LocationState | null)?.username}</div>;
};

export default Rooms;
