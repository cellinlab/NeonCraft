import { create } from 'zustand';
import type { Scene, Node, ID, TextNode, PathNode, Tool, DrawingState } from '../types';
import { presetScenes } from '../data/presets';

// 生成唯一ID
const generateId = (): string => Math.random().toString(36).substring(2, 9);

// 默认场景数据 - 使用 Cursor Hackathon Beijing 模板
const createDefaultScene = (): Scene => (presetScenes.find(s => s.id === 'cursor-hackathon') || {
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
      opacity: 1
    }
  ] as Node[]
});

interface SceneStore {
  scene: Scene;
  currentTool: Tool;
  drawingState: DrawingState;
  
  // 场景操作
  setScene: (patch: Partial<Scene>) => void;
  loadScene: (scene: Scene) => void;
  
  // 工具切换
  setTool: (tool: Tool) => void;
  
  // 节点操作
  addText: (init?: Partial<TextNode>) => void;
  select: (id?: ID) => void;
  updateNode: (id: ID, patch: Partial<Node>) => void;
  removeNode: (id: ID) => void;
  
  // 绘制操作
  startDraw: () => void;
  pushPoint: (x: number, y: number) => void;
  endDraw: () => void;
  
  // 图层操作
  bringForward: (id: ID) => void;
  sendBackward: (id: ID) => void;
  
  // 持久化
  saveToLocal: () => void;
  loadFromLocal: () => void;
}

export const useSceneStore = create<SceneStore>((set, get) => ({
  scene: createDefaultScene(),
  currentTool: 'select',
  drawingState: {
    isDrawing: false,
    currentPath: []
  },

  setScene: (patch) => set((state) => ({
    scene: { ...state.scene, ...patch }
  })),

  loadScene: (scene) => set({ scene }),

  setTool: (tool) => set({ currentTool: tool }),

  addText: (init: Partial<TextNode> = {}) => {
    const newText: TextNode = {
      id: generateId(),
      type: 'text',
      text: 'NEON',
      x: 300,
      y: 200,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      stroke: '#00F0FF',
      strokeWidth: 8,
      fill: '#001014',
      glow: { enabled: true, blur: 30, intensity: 0.8 },
      fontSize: 80,
      opacity: 1,
      fontFamily: 'Arial',
      ...init
    };

    set((state) => ({
      scene: {
        ...state.scene,
        nodes: [...state.scene.nodes, newText],
        selectedId: newText.id
      }
    }));
  },

  select: (id) => set((state) => ({
    scene: { ...state.scene, selectedId: id }
  })),

  updateNode: (id: ID, patch: Partial<Node>) => set((state) => ({
    scene: {
      ...state.scene,
      nodes: state.scene.nodes.map(node => 
        node.id === id ? { ...node, ...patch } as Node : node
      )
    }
  })),

  removeNode: (id) => set((state) => ({
    scene: {
      ...state.scene,
      nodes: state.scene.nodes.filter(node => node.id !== id),
      selectedId: state.scene.selectedId === id ? undefined : state.scene.selectedId
    }
  })),

  startDraw: () => set({
    drawingState: { isDrawing: true, currentPath: [] }
  }),

  pushPoint: (x, y) => set((state) => ({
    drawingState: {
      ...state.drawingState,
      currentPath: [...state.drawingState.currentPath, x, y]
    }
  })),

  endDraw: () => {
    const { drawingState, scene } = get();
    if (drawingState.currentPath.length > 4) {
      const newPath: PathNode = {
        id: generateId(),
        type: 'path',
        points: drawingState.currentPath,
        x: 0,
        y: 0,
        stroke: '#FF00FF',
        strokeWidth: 6,
        glow: { enabled: true, blur: 25, intensity: 0.7 },
        tension: 0.3,
        opacity: 1
      };

      set({
        scene: {
          ...scene,
          nodes: [...scene.nodes, newPath],
          selectedId: newPath.id
        },
        drawingState: { isDrawing: false, currentPath: [] }
      });
    } else {
      set({
        drawingState: { isDrawing: false, currentPath: [] }
      });
    }
  },

  bringForward: (id) => set((state) => {
    const nodes = [...state.scene.nodes];
    const index = nodes.findIndex(node => node.id === id);
    if (index < nodes.length - 1) {
      [nodes[index], nodes[index + 1]] = [nodes[index + 1], nodes[index]];
    }
    return {
      scene: { ...state.scene, nodes }
    };
  }),

  sendBackward: (id) => set((state) => {
    const nodes = [...state.scene.nodes];
    const index = nodes.findIndex(node => node.id === id);
    if (index > 0) {
      [nodes[index], nodes[index - 1]] = [nodes[index - 1], nodes[index]];
    }
    return {
      scene: { ...state.scene, nodes }
    };
  }),

  saveToLocal: () => {
    const { scene } = get();
    try {
      localStorage.setItem('neoncraft:scene', JSON.stringify(scene));
    } catch (error) {
      console.error('Failed to save scene:', error);
    }
  },

  loadFromLocal: () => {
    try {
      const saved = localStorage.getItem('neoncraft:scene');
      if (saved) {
        const scene = JSON.parse(saved) as Scene;
        set({ scene });
      }
    } catch (error) {
      console.error('Failed to load scene:', error);
    }
  }
}));
