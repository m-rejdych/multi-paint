import type { FC } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Text } from '@chakra-ui/react';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import type RoomLocationState from '../../types/RoomsLocationState';

const Room: FC = () => {
  const { state } = useLocation();
  const { id } = useParams<{ id: string }>();

  useUsernameGuard(state as RoomLocationState);

  return <Text variant="h1" fontSize="2xl">Room {id}</Text>;
};

export default Room;
