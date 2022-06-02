import { type FC, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Button,
  Input,
} from '@chakra-ui/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateRoomModal: FC<Props> = ({ isOpen, onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [touched, setTouched] = useState(false);

  const isInvalid = touched && !roomName;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!touched) setTouched(true);
    setRoomName(e.target.value);
  };

  const handleBlur = (): void => {
    if (!touched) setTouched(true);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create room</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            colorScheme="teal"
            placeholder={isInvalid ? 'Room name can not be empty' : 'Room name'}
            _placeholder={isInvalid ? { color: 'red.500' } : undefined}
            isInvalid={isInvalid}
            value={roomName}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" disabled={!touched || isInvalid}>
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateRoomModal;
