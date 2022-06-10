import Position from './Position';
import type CanvasSettings from '../types/CanvasSettings';
import type CanvasState from '../types/CanvasState';
import type { MessageHandler } from '../../../types/Message';
import { MessageEvent } from '../../../types/Event';

export default class CanvasManager {
  private state: CanvasState = {
    isDragging: false,
    cursorPosition: new Position(0, 0),
    scale: 1,
  };
  private readonly ctx: CanvasRenderingContext2D;
  private drawHandle = 0;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly messageHandler: MessageHandler,
    private readonly settings: CanvasSettings,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not initialize canvas context.');
    }

    this.ctx = ctx;
  }

  private drawBackground(): void {
    const {
      ctx,
      settings: { BG_COLOR },
      canvas,
    } = this;

    ctx.save();
    ctx.resetTransform();
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // Mock object for now
  private drawObjects(): void {
    const { ctx, canvas } = this;

    ctx.fillStyle = '#000000';
    ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 50);
  }

  calculateCanvasCursorPosition(x: number, y: number): Position {
    return new Position(x - this.canvas.offsetLeft, y - this.canvas.offsetTop);
  }

  draw(): void {
    this.drawBackground();
    this.drawObjects();
    this.drawHandle = requestAnimationFrame(this.draw.bind(this));
  }

  stopDraw(): void {
    if (this.drawHandle) {
      cancelAnimationFrame(this.drawHandle);
    }
  }

  private handleZoom(e: WheelEvent): void {
    e.preventDefault();

    const {
      settings: { SCALE_FACTOR, MAX_ZOOM, MIN_ZOOM },
      state,
      ctx,
      canvas,
    } = this;

    const currentScale = 1 + (e.deltaY > 0 ? SCALE_FACTOR : -SCALE_FACTOR);

    if (
      (currentScale > 1 && state.scale < MAX_ZOOM) ||
      (currentScale < 1 && state.scale > MIN_ZOOM)
    ) {
      state.scale =
        currentScale > 1
          ? Math.min(MAX_ZOOM, state.scale * currentScale)
          : Math.max(MIN_ZOOM, state.scale * currentScale);

      const pointData = new Position(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop,
      );
      const point = new DOMPoint(pointData.x, pointData.y);

      const tr = ctx.getTransform();
      tr.translateSelf(point.x, point.y);
      tr.scaleSelf(currentScale, currentScale);
      tr.translateSelf(-point.x, -point.y);
      ctx.setTransform(tr);
      point.matrixTransform(tr);
    }
  }

  private handleMoveStart(e: MouseEvent): void {
    e.preventDefault();

    const { state } = this;

    state.isDragging = true;

    const { x, y } = this.calculateCanvasCursorPosition(e.clientX, e.clientY);
    state.cursorPosition.x = x;
    state.cursorPosition.y = y;
  }

  private handleMove(e: MouseEvent): void {
    const { x, y } = this.calculateCanvasCursorPosition(e.clientX, e.clientY);

    this.messageHandler<MessageEvent.MoveCursor, Position>({
      event: MessageEvent.MoveCursor,
      data: new Position(x, y),
    });

    if (!this.state.isDragging) return;

    const { state, ctx } = this;

    const offsetLeft = x - state.cursorPosition.x;
    const offsetTop = y - state.cursorPosition.y;

    const tr = ctx.getTransform();
    tr.translateSelf(offsetLeft, offsetTop);
    ctx.setTransform(tr);

    state.cursorPosition.x = x;
    state.cursorPosition.y = y;
  }

  private handleMoveEnd(): void {
    const { state } = this;

    state.isDragging = false;
    state.cursorPosition.x = 0;
    state.cursorPosition.x = 0;
  }

  registerHandlers(): void {
    const { canvas } = this;

    canvas.addEventListener('wheel', this.handleZoom.bind(this));
    canvas.addEventListener('mousedown', this.handleMoveStart.bind(this));
    canvas.addEventListener('mousemove', this.handleMove.bind(this));
    canvas.addEventListener('mouseup', this.handleMoveEnd.bind(this));
    canvas.addEventListener('mouseleave', this.handleMoveEnd.bind(this));
  }

  unregisterHandlers(): void {
    const { canvas } = this;

    canvas.removeEventListener('wheel', this.handleZoom.bind(this));
    canvas.removeEventListener('mousedown', this.handleMoveStart.bind(this));
    canvas.removeEventListener('mousemove', this.handleMove.bind(this));
    canvas.removeEventListener('mouseup', this.handleMoveEnd.bind(this));
    canvas.removeEventListener('mouseleave', this.handleMoveEnd.bind(this));
  }
}
