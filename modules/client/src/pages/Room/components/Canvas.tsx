import { type FC, useState } from 'react';
import { Box } from '@chakra-ui/react';

import useCanvas from '../hooks/useCanvas';

const Canvas: FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useCanvas();

  return (
    <Box
      borderRadius="md"
      overflow="hidden"
      cursor={isDragging ? 'grabbing' : 'grab'}
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
