import type Position from '../../../models/Position';
import type Cursor from '../../../types/Cursor';

export default interface CanvasState {
  isDragging: boolean;
  cursorPosition: Position;
  scale: number;
  cursors: Record<string, Cursor>;
}

export type SetStateFn = <T extends keyof CanvasState>(
  field: T,
  value: CanvasState[T] | ((prev: CanvasState[T]) => CanvasState[T]),
) => void;
