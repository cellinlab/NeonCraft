import type { Scene } from '../types';

export const presetScenes: Scene[] = [
  {
    id: 'cursor-hackathon',
    name: 'Cursor Hackathon Beijing',
    width: 1280,
    height: 720,
    background: { color: '#000511' },
    global: { 
      brightness: 1.1, 
      hueRotate: 0, 
      animation: 'breathe', 
      animSpeed: 0.8 
    },
    nodes: [
      {
        id: 'cursor1',
        type: 'text',
        text: 'CURSOR',
        x: 320, 
        y: 180, 
        rotation: -2, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#00F0FF', 
        strokeWidth: 12, 
        glow: { enabled: true, blur: 45, intensity: 1.0 },
        fontSize: 100, 
        opacity: 1,
        fontFamily: 'Impact'
      },
      {
        id: 'hackathon1',
        type: 'text',
        text: 'HACKATHON',
        x: 250, 
        y: 300, 
        rotation: 1, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#8000FF', 
        strokeWidth: 10, 
        glow: { enabled: true, blur: 40, intensity: 0.9 },
        fontSize: 85, 
        opacity: 1,
        fontFamily: 'Impact'
      },
      {
        id: 'beijing1',
        type: 'text',
        text: 'BEIJING',
        x: 380, 
        y: 420, 
        rotation: -1, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FF0080', 
        strokeWidth: 8, 
        glow: { enabled: true, blur: 35, intensity: 0.8 },
        fontSize: 70, 
        opacity: 1,
        fontFamily: 'Impact'
      },
      {
        id: 'year1',
        type: 'text',
        text: '2024',
        x: 950, 
        y: 220, 
        rotation: 5, 
        scaleX: 0.8, 
        scaleY: 1,
        stroke: '#FFFF00', 
        strokeWidth: 6, 
        glow: { enabled: true, blur: 25, intensity: 0.7 },
        fontSize: 48, 
        opacity: 1,
        fontFamily: 'Arial'
      },
      {
        id: 'ai1',
        type: 'text',
        text: '🤖',
        x: 150, 
        y: 320, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#00FF00', 
        strokeWidth: 4, 
        fill: '#00FF00',
        glow: { enabled: true, blur: 30, intensity: 0.8 },
        fontSize: 60, 
        opacity: 1,
        fontFamily: 'Arial'
      },
      {
        id: 'code1',
        type: 'text',
        text: '</>', 
        x: 950, 
        y: 350, 
        rotation: -3, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FF4000', 
        strokeWidth: 8, 
        glow: { enabled: true, blur: 35, intensity: 0.9 },
        fontSize: 65, 
        opacity: 1,
        fontFamily: 'Courier New'
      }
    ]
  },
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
    id: 'k86juek',
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
        x: 470, 
        y: 210, 
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
        id: '5w24ddl',
        type: 'text',
        text: 'CRAFT',
        x: 461.00077164401495, 
        y: 371.20389664401404, 
        rotation: 0, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FF4000', 
        strokeWidth: 14, 
        fill: '#001014',
        glow: { enabled: true, blur: 41, intensity: 0.9 },
        fontSize: 169, 
        opacity: 1,
        fontFamily: 'Times New Roman'
      },
      {
        id: '2wzu5bk',
        type: 'text',
        text: '🚀',
        x: 888.6468247455095, 
        y: 221.26376914580072, 
        rotation: 1.8307878604507841, 
        scaleX: 1, 
        scaleY: 1,
        stroke: '#FFFF00', 
        strokeWidth: 8, 
        fill: '#001014',
        glow: { enabled: true, blur: 30, intensity: 0.8 },
        fontSize: 95.14017496600371, 
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
