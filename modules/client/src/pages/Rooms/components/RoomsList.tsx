import { type FC, useEffect, useState } from 'react';
import { Spinner, Text, List, ListItem, Flex } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';

import { getRooms } from '../../../services/rooms';
import type Room from '../../../types/Room';
import type RoomsLocationState from '../../../types/RoomsLocationState';

const RoomsList: FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async (): Promise<void> => {
      setLoading(true);

      try {
        const response = await getRooms();
        setRooms(response.data);
        setError('');
        setLoading(false);
      } catch (error: any) {
        setError(error.response.data.message);
        setLoading(false);
      }
    };

    loadRooms();
  }, []);

  const handleClick = (roomId: string, roomName: string): void => {
    navigate(`/rooms/${roomId}`, {
      state: { ...((state as RoomsLocationState) ?? {}), roomName },
    });
  };

  if (error) {
    return (
      <Text variant="h1" fontSize="2xl" color="red.500">
        {error}
      </Text>
    );
  }

  return loading ? (
    <Flex
      width="100%"
      height="40vh"
      alignItems="center"
      justifyContent="center"
    >
      <Spinner size="lg" />
    </Flex>
  ) : (
    <>
      <Text variant="h1" fontSize="2xl">
        Rooms
      </Text>
      <List width="100%">
        {rooms.map(({ id, name, users }) => (
          <ListItem
            key={id}
            px={8}
            py={4}
            bgColor="gray.900"
            opacity="0.6"
            borderRadius="md"
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            onClick={() => handleClick(id, name)}
            _hover={{ bgColor: 'gray.700' }}
            _notLast={{ mb: 4 }}
          >
            <Text>{name}</Text>
            <Text>Active users: {Object.keys(users).length}</Text>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default RoomsList;
