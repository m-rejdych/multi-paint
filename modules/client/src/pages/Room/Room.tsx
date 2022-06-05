import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Text } from '@chakra-ui/react';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import type RoomLocationState from '../../types/RoomsLocationState';

const Room: FC = () => {
  const { state } = useLocation();

  useUsernameGuard(state as RoomLocationState);

  return (
    <Text variant="h1" fontSize="2xl">
      Room {(state as RoomLocationState)?.roomName}
    </Text>
  );
};

export default Room;
