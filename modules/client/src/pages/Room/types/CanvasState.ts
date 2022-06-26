import type Position from '../../../models/Position';
import type User from '../../../types/User';
import type { ToolType } from '../../../types/Tool';
import type Line from '../../../models/Line';

export default interface CanvasState {
  isDragging: boolean;
  cursorPosition: Position;
  scale: number;
  translate: Position;
  users: Record<string, User>;
  tool: ToolType;
  lines: Line[];
}

export type SetStateFn = <T extends keyof CanvasState>(
  field: T,
  value: CanvasState[T] | ((prev: CanvasState[T]) => CanvasState[T]),
) => void;
