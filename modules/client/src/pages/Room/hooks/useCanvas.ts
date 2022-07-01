import { useEffect, useRef, type RefObject } from 'react';

import useWebSocketHandlers from '../../../hooks/useWebSocketHandlers';
import CanvasManager from '../models/CanvasManager';
import type Color from '../../../types/Color';
import type { SetStateFn } from '../types/CanvasState';
import type { ToolType } from '../../../types/Tool';

const SCALE_FACTOR = 0.02;
const BG_COLOR = '#FBFBFB';
const TEXT_COLOR = '#000000';
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.1;

const useCanvas = (
  tool: ToolType,
  drawColor: Color | `#${string}`,
): RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasSetStateFn = useRef<SetStateFn>(() => {});

  const { handleSendMessage } = useWebSocketHandlers(
    process.env.WS_URL as string,
    canvasSetStateFn,
  );

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasManager = new CanvasManager(
      canvasRef.current,
      handleSendMessage,
      {
        scaleFactor: SCALE_FACTOR,
        maxZoom: MAX_ZOOM,
        minZoom: MIN_ZOOM,
        bgColor: BG_COLOR,
        textColor: TEXT_COLOR,
      },
    );

    canvasSetStateFn.current = canvasManager.setState;

    canvasManager.draw();
    canvasManager.registerHandlers();

    return () => {
      canvasManager.stopDraw();
      canvasManager.unregisterHandlers();
    };
  }, []);

  useEffect(() => {
    canvasSetStateFn.current?.('tool', tool);
  }, [tool]);

  useEffect(() => {
    canvasSetStateFn.current?.('drawColor', drawColor);
  }, [drawColor]);

  return canvasRef;
};

export default useCanvas;
