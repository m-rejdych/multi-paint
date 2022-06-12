import type Position from '../../../models/Position';
import type User from '../../../types/User';

export default interface CanvasState {
  isDragging: boolean;
  cursorPosition: Position;
  scale: number;
  translate: Position;
  users: Record<string, User>;
}

export type SetStateFn = <T extends keyof CanvasState>(
  field: T,
  value: CanvasState[T] | ((prev: CanvasState[T]) => CanvasState[T]),
) => void;
