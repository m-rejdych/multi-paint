import type { FC } from 'react';
import { Box } from '@chakra-ui/react';

import useCanvas from '../hooks/useCanvas';
import useWebSocketHandlers from '../../../hooks/useWebSocketHandlers';

const Canvas: FC = () => {
  const { handleSendMessage } = useWebSocketHandlers(
    process.env.WS_URL as string,
  );

  const canvasRef = useCanvas(handleSendMessage);

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
