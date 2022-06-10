import { useEffect, useRef, type RefObject } from 'react';

import CanvasManager from '../models/CanvasManager';
import type { MessageHandler } from '../../../types/Message';

const SCALE_FACTOR = 0.01;
const BG_COLOR = '#FBFBFB';
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.1;

const useCanvas = (
  messageHandler: MessageHandler,
): RefObject<HTMLCanvasElement> => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasManager = new CanvasManager(canvasRef.current, messageHandler, {
      SCALE_FACTOR,
      MAX_ZOOM,
      MIN_ZOOM,
      BG_COLOR,
    });

    canvasManager.draw();
    canvasManager.registerHandlers();

    return () => {
      canvasManager.unregisterHandlers();
      canvasManager.stopDraw();
    };
  }, []);

  return canvasRef;
};

export default useCanvas;
