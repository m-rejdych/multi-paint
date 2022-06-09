import { type FC, useRef } from 'react';
import { Box } from '@chakra-ui/react';

import useCanvas from '../hooks/useCanvas';

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCanvas(canvasRef);

  return (
    <Box borderRadius="md" overflow="hidden" cursor="grab">
      <canvas
        //         width={innerWidth - 128}
        //         height={innerHeight - 229}
        width={innerHeight - 229}
        height={innerHeight - 229}
        ref={canvasRef}
      />
    </Box>
  );
};

export default Canvas;
