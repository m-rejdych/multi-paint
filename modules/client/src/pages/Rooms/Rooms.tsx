import type { FC } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  VStack,
  Flex,
  Text,
  Button,
  Divider,
  useDisclosure,
} from '@chakra-ui/react';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import CreateRoomModal from './components/CreateRoomModal';
import type RoomsLocationState from '../../types/RoomsLocationState';

const Rooms: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { state, pathname } = useLocation();
  const navigate = useNavigate();

  useUsernameGuard(state as RoomsLocationState);

  const handleExit = (): void => {
    navigate('/rooms', { state });
  };

  const renderButton = (): JSX.Element | null => {
    if (pathname === '/rooms') {
      return (
        <Button colorScheme="teal" size="lg" onClick={onOpen}>
          Create a room
        </Button>
      );
    }

    if (/^\/rooms\/[A-Za-z0-9]+$/.test(pathname)) {
      return (
        <Button
          colorScheme="red"
          size="lg"
          variant="solid"
          onClick={handleExit}
        >
          Exit
        </Button>
      );
    }

    return null;
  };

  return (
    <VStack spacing={4} alignItems="flex-start">
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        {renderButton()}
        <Text fontSize="xl" fontWeight="bold">
          {(state as RoomsLocationState)?.username}
        </Text>
      </Flex>
      <Divider />
      <CreateRoomModal
        username={(state as RoomsLocationState)?.username ?? ''}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Outlet />
    </VStack>
  );
};

export default Rooms;
