import type { FC } from 'react';
import { Divider, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import CreateRoomModal from './CreateRoomModal';
import type RoomsLocationState from '../../../types/RoomsLocationState';

const RoomsOutlet: FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { state } = useLocation();

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" width="100%">
        <Button colorScheme="teal" size="lg" onClick={onOpen}>
          Create a room
        </Button>
        <Text fontSize="lg" fontWeight="bold">
          {(state as RoomsLocationState)?.username}
        </Text>
      </Flex>
      <Divider />
      <CreateRoomModal
        username={(state as RoomsLocationState)?.username ?? ''}
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};

export default RoomsOutlet;
