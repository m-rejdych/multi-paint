import { type FC, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Text, VStack, HStack, Flex } from '@chakra-ui/react';

import useUsernameGuard from '../../hooks/useUsernameGuard';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import ColorPicker from './components/ColorPicker';
import TOOLS from './constants/tools';
import type RoomLocationState from '../../types/RoomsLocationState';
import { ToolType } from '../../types/Tool';

const Room: FC = () => {
  const [tool, setTool] = useState(ToolType.Pan);
  const [drawColor, setDrawColor] = useState<`#${string}`>('#FF0000');
  const { state } = useLocation();

  useUsernameGuard(state as RoomLocationState);

  const handleChangeDrawColor = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setDrawColor(e.target.value as `#${string}`);
  };

  return (
    <VStack spacing={4} height="100%" alignSelf="stretch">
      <Flex
        justifyContent="space-between"
        alignSelf="stretch"
        alignItems="center"
      >
        <Text variant="h1" fontSize="2xl" alignSelf="baseline">
          Room {(state as RoomLocationState)?.roomName}
        </Text>
        <HStack spacing={8}>
          <Toolbar selectedTool={tool} onSelectTool={setTool} tools={TOOLS} />
          <ColorPicker
            color={drawColor}
            onChangeColor={handleChangeDrawColor}
          />
        </HStack>
      </Flex>
      <Flex flexGrow={1} justifyContent="center" alignItems="center">
        <Canvas tool={tool} drawColor={drawColor} />
      </Flex>
    </VStack>
  );
};

export default Room;
