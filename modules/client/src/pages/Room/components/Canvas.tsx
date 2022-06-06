import { type FC, useRef, useEffect } from 'react';
import { Box } from '@chakra-ui/react';

const Canvas: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const init = (): void => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = '#FBFBFB';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    init();
  }, []);

  return (
    <Box borderRadius="md" overflow="hidden">
      <canvas
        width={innerWidth - 128}
        height={innerHeight - 229}
        ref={canvasRef}
      />
    </Box>
  );
};

export default Canvas;
