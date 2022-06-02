import type { FC } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Divider,
  Button,
  VStack,
  Flex,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import CreateRoomModal from './components/CreateRoomModal';

interface LocationState {
  username: string;
}

const Rooms: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { state } = useLocation();

  useUsernameGuard(state as LocationState | null);

  return (
    <>
      <VStack spacing={4} alignItems="flex-start">
        <Flex justifyContent="space-between" alignItems="center" width="100%">
          <Button colorScheme="teal" size="lg" onClick={onOpen}>
            Create a room
          </Button>
          <Text fontSize="lg" fontWeight="bold">
            {(state as LocationState).username}
          </Text>
        </Flex>
        <Divider />
      </VStack>
      <CreateRoomModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Rooms;
