export type NeonColor = string; // 如 '#FF00FF'
export type ID = string;

export type BaseProps = {
  id: ID;
  type: 'text' | 'path';
  name?: string;
  x: number; // 位置
  y: number;
  rotation?: number; // 角度
  scaleX?: number;
  scaleY?: number;
  opacity?: number; // 0-1
  stroke: NeonColor; // 霓虹主色
  strokeWidth: number; // 线宽
  glow: {
    enabled: boolean;
    blur: number; // 阴影模糊半径
    intensity: number; // 0-1, 乘到 shadowOpacity
  };
};

export type TextNode = BaseProps & {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily?: string;
  // 霓虹风格通常以描边为主，可选填充
  fill?: NeonColor;
};

export type PathNode = BaseProps & {
  type: 'path';
  points: number[]; // [x1,y1,x2,y2,...]
  tension?: number; // 平滑曲线
  closed?: boolean; // 是否闭合
  fill?: NeonColor; // 可选内部填充
};

export type Node = TextNode | PathNode;

export type Scene = {
  id: ID;
  name: string;
  width: number;
  height: number;
  background: {
    color: string; // 画布背景（深色更显光晕）
  };
  global: {
    brightness: number; // 0-2 (1 为原始)
    hueRotate: number; // -180~180，全局色相偏移（展示模式可调）
    animation: 'none' | 'breathe' | 'flicker';
    animSpeed: number; // 0.2~2
  };
  nodes: Node[]; // 图层从下到上
  selectedId?: ID; // 选中元素
};

export type Tool = 'select' | 'text' | 'draw';

// 临时绘制状态
export type DrawingState = {
  isDrawing: boolean;
  currentPath: number[]; // 当前正在绘制的路径点
};
