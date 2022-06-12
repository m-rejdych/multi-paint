import Position from '../../../models/Position';
import type CanvasSettings from '../types/CanvasSettings';
import CanvasState, { SetStateFn } from '../types/CanvasState';
import type { MessageHandler } from '../../../types/Message';
import { MessageEvent } from '../../../types/Event';

export default class CanvasManager {
  private state: CanvasState = {
    isDragging: false,
    cursorPosition: new Position(0, 0),
    scale: 1,
    translate: new Position(0, 0),
    users: {},
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
      settings: { bgColor },
      canvas,
    } = this;

    ctx.save();
    ctx.resetTransform();
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  // Mock object for now
  private drawObjects(): void {
    const { ctx, canvas } = this;

    ctx.fillStyle = '#000000';
    ctx.fillRect(canvas.width / 2 - 25, canvas.height / 2 - 25, 50, 50);
  }

  private drawCursors(): void {
    const { ctx, canvas } = this;

    Object.values(this.state.users).forEach(
      ({
        cursor: {
          color,
          position: { x, y },
        },
        username,
      }) => {
        const originX = x + canvas.width / 2;
        const originY = y + canvas.width / 2;

        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(originX + 15, originY + 5);
        ctx.lineTo(originX + 5, originY + 15);
        ctx.lineTo(originX, originY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = this.settings.textColor;
        const { width } = ctx.measureText(username);
        ctx.strokeText(username, x - width / 2, y - 5);
      },
    );
  }

  calculateCanvasOriginCursorPosition(x: number, y: number): Position {
    const { canvas } = this;
    return new Position(
      x - canvas.offsetLeft - canvas.width / 2,
      y - canvas.offsetTop - canvas.width / 2,
    );
  }

  draw(): void {
    this.drawBackground();
    this.drawObjects();
    this.drawCursors();
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
      settings: { scaleFactor, maxZoom, minZoom },
      state,
      ctx,
      canvas,
    } = this;

    const currentScale = 1 + (e.deltaY > 0 ? scaleFactor : -scaleFactor);

    if (
      (currentScale > 1 && state.scale < maxZoom) ||
      (currentScale < 1 && state.scale > minZoom)
    ) {
      this.setState(
        'scale',
        currentScale > 1
          ? Math.min(maxZoom, state.scale * currentScale)
          : Math.max(minZoom, state.scale * currentScale),
      );

      const pointData = new Position(
        e.clientX - canvas.offsetLeft,
        e.clientY - canvas.offsetTop,
      );
      const point = new DOMPoint(pointData.x, pointData.y);

      const tr = ctx.getTransform();
      point.matrixTransform(tr);

      tr.translateSelf(point.x, point.y);
      tr.scaleSelf(currentScale, currentScale);
      tr.translateSelf(-point.x, -point.y);
      ctx.setTransform(tr);
    }
  }

  private handleMoveStart(e: MouseEvent): void {
    e.preventDefault();

    this.setState('isDragging', true);

    const { x, y } = this.calculateCanvasOriginCursorPosition(
      e.clientX,
      e.clientY,
    );
    this.setState('cursorPosition', new Position(x, y));
  }

  private handleMove(e: MouseEvent): void {
    const { x, y } = this.calculateCanvasOriginCursorPosition(
      e.clientX,
      e.clientY,
    );
    const { state, ctx } = this;

    if (this.state.isDragging) {
      const offsetLeft = (x - state.cursorPosition.x) / state.scale;
      const offsetTop = (y - state.cursorPosition.y) / state.scale;

      this.setState(
        'translate',
        (prev) => new Position(prev.x - offsetLeft, prev.y - offsetTop),
      );

      const tr = ctx.getTransform();
      tr.translateSelf(offsetLeft, offsetTop);
      ctx.setTransform(tr);

      this.setState('cursorPosition', new Position(x, y));
    }

    this.messageHandler<MessageEvent.MoveCursor, Position>({
      event: MessageEvent.MoveCursor,
      data: new Position(
        (x + state.translate.x * state.scale) / state.scale,
        (y + state.translate.y * state.scale) / state.scale,
      ),
    });
  }

  private handleMoveEnd(): void {
    this.setState('isDragging', false);
    this.setState('cursorPosition', new Position(0, 0));
  }

  setState: SetStateFn = (field, value) => {
    this.state[field] =
      typeof value === 'function' ? value(this.state[field]) : value;
  };

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
