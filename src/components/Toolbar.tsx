import { useState, useEffect } from 'react';
import { useSceneStore } from '../store/scene';
import type { Tool } from '../types';
import { presetScenes } from '../data/presets';

const Toolbar = () => {
  const { currentTool, setTool, addText, loadScene } = useSceneStore();
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.template-dropdown')) {
        setShowTemplateMenu(false);
      }
    };

    if (showTemplateMenu) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTemplateMenu]);

  const tools: { id: Tool; label: string; icon: string; description: string; action?: () => void }[] = [
    {
      id: 'select',
      label: '选择',
      icon: '↖',
      description: '选择和移动元素 (快捷键: V)'
    },
    {
      id: 'pan',
      label: '拖动',
      icon: '✋',
      description: '拖动画布视图 (快捷键: H 或 空格键)'
    },
    {
      id: 'text',
      label: '文字',
      icon: 'T',
      description: '添加霓虹文字 (快捷键: T)',
      action: () => {
        setTool('text');
        // 立即添加文字（也可以等点击画布）
        addText();
      }
    },
    {
      id: 'draw',
      label: '画笔',
      icon: '✏',
      description: '自由绘制路径 (快捷键: D)'
    }
  ];

  const handleToolClick = (tool: Tool) => {
    const toolData = tools.find(t => t.id === tool);
    if (toolData?.action) {
      toolData.action();
    } else {
      setTool(tool);
    }
  };

  return (
    <div className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex items-center gap-4">
      <h3 className="text-white text-sm font-medium">工具:</h3>
      
      <div className="flex gap-2">
        {tools.map((tool) => (
        <div key={tool.id} className="relative group">
          <button
            onClick={() => handleToolClick(tool.id)}
            className={`
              w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
              transition-all duration-200 border-2 relative
              ${currentTool === tool.id
                ? 'bg-neon-cyan text-black border-neon-cyan neon-glow'
                : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500 hover:neon-glow'
              }
            `}
          >
            {tool.icon}
          </button>
          
                      {/* Hover提示 */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              <div className="font-medium">{tool.label}</div>
              <div className="text-gray-300 text-xs mt-1">{tool.description}</div>
              {/* 小箭头 */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black border-t-opacity-90"></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-l border-gray-700 pl-4 flex items-center gap-3">
        <button
          onClick={() => addText()}
          className="px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-600 hover:bg-gray-700 transition-colors"
        >
          添加文字
        </button>
        
        <div className="relative template-dropdown">
          <button 
            className="px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-600 hover:bg-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setShowTemplateMenu(!showTemplateMenu);
            }}
          >
            模板 ▼
          </button>
          
          {showTemplateMenu && (
            <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50 min-w-48">
              {presetScenes.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    loadScene(preset);
                    setShowTemplateMenu(false);
                  }}
                  className="block w-full px-3 py-2 text-white text-xs text-left hover:bg-gray-700 first:rounded-t-lg last:rounded-b-lg"
                  title={`加载模板: ${preset.name}`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
