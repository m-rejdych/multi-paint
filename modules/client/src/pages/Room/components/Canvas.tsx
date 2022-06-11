import type { FC } from 'react';
import { Box } from '@chakra-ui/react';

import useCanvas from '../hooks/useCanvas';

const Canvas: FC = () => {

  const canvasRef = useCanvas();

  return (
    <Box borderRadius="md" overflow="hidden" cursor="grab">
      <canvas
        width={innerHeight - 229}
        height={innerHeight - 229}
        ref={canvasRef}
      />
    </Box>
  );
};

export default Canvas;
