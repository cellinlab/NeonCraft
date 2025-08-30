import { useEffect, useState } from 'react';
import { useSceneStore } from './store/scene';
import { useKeyboard } from './hooks/useKeyboard';
import { useAutoSave } from './hooks/useAutoSave';
import StageCanvas from './components/StageCanvas';
import Toolbar from './components/Toolbar';
import PropertiesPanel from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import PreviewWindow from './components/PreviewWindow';
import Player from './components/Player';

function App() {
  const { loadFromLocal } = useSceneStore();
  const [isPlayMode, setIsPlayMode] = useState(false);
  
  // 使用快捷键（只在编辑模式下）
  useKeyboard();
  
  // 使用自动保存
  useAutoSave();

  // 启动时加载数据
  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  // 展示模式
  if (isPlayMode) {
    return <Player onExit={() => setIsPlayMode(false)} />;
  }

  return (
    <div className="h-screen flex flex-col bg-neon-bg text-white">
      {/* 顶部栏 */}
      <header className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold neon-text text-neon-cyan">
            NeonCraft
          </h1>
          <span className="text-sm text-gray-400">霓光工坊</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            自动保存
          </div>
          
          <button 
            onClick={() => setIsPlayMode(true)}
            className="px-4 py-2 bg-neon-cyan text-black rounded font-medium hover:bg-opacity-80 transition-colors"
          >
            展示模式
          </button>
        </div>
      </header>

      {/* 横向工具栏 */}
      <Toolbar />

      {/* 主内容区 - 三栏布局 */}
      <div className="flex-1 flex min-h-0">
        {/* 左侧图层面板 - 固定宽度 */}
        <div className="w-80 flex-shrink-0 flex flex-col bg-gray-800 border-r border-gray-700 panel-shadow">
          <LayersPanel />
        </div>
        
        {/* 中央画布区域 - 弹性宽度 */}
        <div className="flex-1 flex items-center justify-center canvas-grid relative min-w-0">
          <StageCanvas />
        </div>
        
        {/* 右侧面板区域 - 固定宽度 */}
        <div className="w-96 flex-shrink-0 flex flex-col h-full">
          {/* 属性面板 - 可滚动区域 */}
          <div className="flex-1 min-h-0 overflow-hidden bg-gray-900 border-l border-gray-700 panel-shadow">
            <PropertiesPanel />
          </div>
          
          {/* 预览窗口 - 固定高度 */}
          <div className="h-56 flex-shrink-0 bg-gray-900 border-l border-t border-gray-700 panel-shadow">
            <div className="p-4 h-full">
              <PreviewWindow />
            </div>
          </div>
        </div>
      </div>

      {/* 底部状态栏 */}
      <footer className="bg-gray-900 border-t border-gray-700 px-6 py-2 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>就绪</span>
          <span>图层: {useSceneStore.getState().scene.nodes.length}</span>
          <span>当前工具: {
            useSceneStore.getState().currentTool === 'select' ? '选择' :
            useSceneStore.getState().currentTool === 'pan' ? '拖动' :
            useSceneStore.getState().currentTool === 'text' ? '文字' : '画笔'
          }</span>
        </div>
        <div>快捷键: V(选择) H(拖动) T(文字) D(画笔) Del(删除) Esc(取消选择) • 空格键临时拖动</div>
      </footer>
    </div>
  );
}

export default App;
