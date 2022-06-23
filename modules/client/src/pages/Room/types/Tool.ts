import type { FC } from 'react';

export enum ToolType {
  Pan,
  Brush,
}

export interface Tool {
  id: string;
  type: ToolType,
  tooltip: string;
  Icon: FC,
}
