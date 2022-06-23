import { PanToolAlt, Brush } from '@mui/icons-material';

import { type Tool, ToolType } from '../types/Tool';

const TOOLS: Tool[] = [
  {
    id: 'pan-tool',
    type: ToolType.Pan,
    tooltip: 'Pan tool',
    Icon: PanToolAlt,
  },
  {
    id: 'brush-tool',
    type: ToolType.Brush,
    tooltip: 'Brush',
    Icon: Brush,
  },
];

export default TOOLS;
