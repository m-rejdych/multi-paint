import { type FC, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Text } from '@chakra-ui/react';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import type RoomLocationState from '../../types/RoomsLocationState';

const Room: FC = () => {
  const { state } = useLocation();

  useEffect(() => {
    const socket = new WebSocket(process.env.WS_URL as string);

    const handleOpenConnection = (): void => {
      console.log('wowee connection!');
    };

    socket.addEventListener('open', handleOpenConnection);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
      socket.removeEventListener('open', handleOpenConnection);
    };
  }, []);

  useUsernameGuard(state as RoomLocationState);

  return (
    <Text variant="h1" fontSize="2xl">
      Room {(state as RoomLocationState)?.roomName}
    </Text>
  );
};

export default Room;
