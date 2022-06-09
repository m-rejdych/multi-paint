import { useEffect, type RefObject } from 'react';

import CanvasManager from '../models/CanvasManager';

const SCALE_FACTOR = 0.01;
const BG_COLOR = '#FBFBFB';
const MAX_ZOOM = 10;
const MIN_ZOOM = 0.1;

const useCanvas = (canvasRef: RefObject<HTMLCanvasElement>): void => {
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvasManager = new CanvasManager(canvasRef.current, {
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
};

export default useCanvas;
