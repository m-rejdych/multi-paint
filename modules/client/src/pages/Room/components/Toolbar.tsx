import type { FC } from 'react';
import { HStack, IconButton, Tooltip } from '@chakra-ui/react';

import type { Tool, ToolType } from '../types/Tool';

interface Props {
  onSelectTool: (tool: ToolType) => void;
  selectedTool: ToolType;
  tools: Tool[];
}

const Toolbar: FC<Props> = ({ onSelectTool, selectedTool, tools }) => (
  <HStack spacing={4}>
    {tools.map(({ id, Icon, type, tooltip }) => (
      <Tooltip key={id} label={tooltip}>
        <IconButton
          aria-label={id}
          icon={<Icon />}
          isActive={selectedTool === type}
          onClick={() => onSelectTool(type)}
        />
      </Tooltip>
    ))}
  </HStack>
);

export default Toolbar;
