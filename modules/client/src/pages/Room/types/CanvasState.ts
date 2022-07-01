import type Position from '../../../models/Position';
import type User from '../../../types/User';
import type Line from '../../../models/Line';
import type Color from '../../../types/Color';
import type { ToolType } from '../../../types/Tool';

export default interface CanvasState {
  isDragging: boolean;
  cursorPosition: Position;
  scale: number;
  translate: Position;
  users: Record<string, User>;
  tool: ToolType;
  drawColor: Color | `#${string}`;
  lines: Line[];
}

export type SetStateFn = <T extends keyof CanvasState>(
  field: T,
  value: CanvasState[T] | ((prev: CanvasState[T]) => CanvasState[T]),
) => void;
