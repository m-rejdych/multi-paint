import { type FC, useState } from 'react';
import { Box } from '@chakra-ui/react';

import type Color from '../../../types/Color';
import useCanvas from '../hooks/useCanvas';
import { ToolType } from '../../../types/Tool';

interface Props {
  tool: ToolType;
  drawColor: Color | `#${string}`;
}

const Canvas: FC<Props> = ({ tool, drawColor }) => {
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useCanvas(tool, drawColor);

  const getCursor = (): string => {
    switch (tool)  {
      case ToolType.Brush:
      return `default`;
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
        width={innerWidth}
        height={innerHeight - 186}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        ref={canvasRef}
      />
    </Box>
  );
};

export default Canvas;
