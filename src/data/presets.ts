import type { Scene } from '../types';

export const presetScenes: Scene[] = [
  {
    id: 'demo-1',
    name: 'NeonCraft Demo',
    width: 1280,
    height: 720,
    background: { color: '#0B0F1A' },
    global: { 
      brightness: 1, 
      hueRotate: 0, 
      animation: 'breathe', 
      animSpeed: 0.6 
    },
    nodes: [
      {
        id: 't1',
        type: 'text',
        text: 'NEON',
        x: 460, 
        y: 260, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#00F0FF', 
        strokeWidth: 10, 
        fill: '#001014',
        glow: { enabled: true, blur: 40, intensity: 0.9 },
        fontSize: 120, 
        opacity: 1,
        fontFamily: 'Arial'
      },
      {
        id: 't2',
        type: 'text',
        text: 'CRAFT',
        x: 460, 
        y: 400, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FF00FF', 
        strokeWidth: 8, 
        fill: '#140010',
        glow: { enabled: true, blur: 35, intensity: 0.8 },
        fontSize: 100, 
        opacity: 1,
        fontFamily: 'Arial'
      }
    ]
  },
  
  {
    id: 'neon-bar',
    name: '霓虹酒吧',
    width: 1280,
    height: 720,
    background: { color: '#050808' },
    global: { 
      brightness: 1.2, 
      hueRotate: 0, 
      animation: 'flicker', 
      animSpeed: 1.2 
    },
    nodes: [
      {
        id: 'bar1',
        type: 'text',
        text: 'OPEN',
        x: 200, 
        y: 200, 
        rotation: -5, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#00FF00', 
        strokeWidth: 12, 
        glow: { enabled: true, blur: 45, intensity: 1.0 },
        fontSize: 80, 
        opacity: 1,
        fontFamily: 'Impact'
      },
      {
        id: 'bar2',
        type: 'text',
        text: 'BAR',
        x: 500, 
        y: 350, 
        rotation: 3, 
        scaleX: 1.2, 
        scaleY: 1,
        stroke: '#FF4000', 
        strokeWidth: 15, 
        glow: { enabled: true, blur: 50, intensity: 0.9 },
        fontSize: 150, 
        opacity: 1,
        fontFamily: 'Impact'
      },
      {
        id: 'bar3',
        type: 'text',
        text: '24/7',
        x: 900, 
        y: 280, 
        rotation: 0, 
        scaleX: 0.8, 
        scaleY: 1,
        stroke: '#FFFF00', 
        strokeWidth: 8, 
        glow: { enabled: true, blur: 30, intensity: 0.7 },
        fontSize: 60, 
        opacity: 1,
        fontFamily: 'Arial'
      }
    ]
  },

  {
    id: 'love-sign',
    name: '爱心告白',
    width: 1280,
    height: 720,
    background: { color: '#0A0512' },
    global: { 
      brightness: 1, 
      hueRotate: 10, 
      animation: 'breathe', 
      animSpeed: 0.8 
    },
    nodes: [
      {
        id: 'love1',
        type: 'text',
        text: '❤',
        x: 200, 
        y: 250, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FF0080', 
        strokeWidth: 6, 
        fill: '#FF0080',
        glow: { enabled: true, blur: 35, intensity: 0.8 },
        fontSize: 100, 
        opacity: 1,
        fontFamily: 'Arial'
      },
      {
        id: 'love2',
        type: 'text',
        text: 'LOVE',
        x: 350, 
        y: 280, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FF00FF', 
        strokeWidth: 10, 
        glow: { enabled: true, blur: 40, intensity: 0.9 },
        fontSize: 120, 
        opacity: 1,
        fontFamily: 'Arial'
      },
      {
        id: 'love3',
        type: 'text',
        text: 'YOU',
        x: 650, 
        y: 320, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#8000FF', 
        strokeWidth: 8, 
        glow: { enabled: true, blur: 35, intensity: 0.8 },
        fontSize: 100, 
        opacity: 1,
        fontFamily: 'Arial'
      },
      {
        id: 'love4',
        type: 'text',
        text: '❤',
        x: 900, 
        y: 250, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FF0080', 
        strokeWidth: 6, 
        fill: '#FF0080',
        glow: { enabled: true, blur: 35, intensity: 0.8 },
        fontSize: 100, 
        opacity: 1,
        fontFamily: 'Arial'
      }
    ]
  }
];

export const colorPresets = [
  { name: '电光蓝', color: '#00F0FF' },
  { name: '霓虹粉', color: '#FF00FF' },
  { name: '激光绿', color: '#00FF00' },
  { name: '警告黄', color: '#FFFF00' },
  { name: '神秘紫', color: '#8000FF' },
  { name: '火焰橙', color: '#FF4000' },
  { name: '樱花粉', color: '#FF0080' },
  { name: '薄荷绿', color: '#80FF00' },
  { name: '天空蓝', color: '#0080FF' },
  { name: '玫瑰红', color: '#FF0040' }
];
