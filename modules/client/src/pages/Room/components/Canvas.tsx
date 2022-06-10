import type { FC } from 'react';
import { Box } from '@chakra-ui/react';

import useCanvas from '../hooks/useCanvas';
import type { MessageHandler } from '../../../types/Message';

interface Props {
  onSocketMessage: MessageHandler;
}

const Canvas: FC<Props> = ({ onSocketMessage }) => {
  const canvasRef = useCanvas(onSocketMessage);

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
