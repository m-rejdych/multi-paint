import Position from '../models/Position';

export default interface CanvasState {
  isDragging: boolean;
  cursorPosition: Position;
  scale: number;
}
