import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { VStack } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import type RoomsLocationState from '../../types/RoomsLocationState';

const Rooms: FC = () => {
  const { state } = useLocation();

  useUsernameGuard(state as RoomsLocationState);

  return (
    <>
      <VStack spacing={4} alignItems="flex-start">
        <Outlet />
      </VStack>
    </>
  );
};

export default Rooms;
