import { type FC, useState } from 'react';
import { Box } from '@chakra-ui/react';

import useCanvas from '../hooks/useCanvas';
import Brush from '../../../images/brush.png';
import { ToolType } from '../types/Tool';

interface Props {
  tool: ToolType;
}

const Canvas: FC<Props> = ({ tool }) => {
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useCanvas(tool);

  const getCursor = (): string => {
    switch (tool)  {
      case ToolType.Brush:
      return `url(${Brush}), auto`;
      case ToolType.Pan:
      default:
      return isDragging ? 'grabbing' : 'grab';
    }
  }

  return (
    <Box
      borderRadius="md"
      overflow="hidden"
      cursor={getCursor()}
    >
      <canvas
        width={innerHeight - 229}
        height={innerHeight - 229}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        ref={canvasRef}
      />
    </Box>
  );
};

export default Canvas;
