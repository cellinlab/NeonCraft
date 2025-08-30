import { useSceneStore } from '../store/scene';
import type { Tool } from '../types';
import { presetScenes } from '../data/presets';

const Toolbar = () => {
  const { currentTool, setTool, addText, loadScene } = useSceneStore();

  const tools: { id: Tool; label: string; icon: string; action?: () => void }[] = [
    {
      id: 'select',
      label: '选择',
      icon: '⚹'
    },
    {
      id: 'text',
      label: '文字',
      icon: 'T',
      action: () => {
        setTool('text');
        // 立即添加文字（也可以等点击画布）
        addText();
      }
    },
    {
      id: 'draw',
      label: '画笔',
      icon: '✏'
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
    <div className="bg-gray-900 border-r border-gray-700 p-4 flex flex-col gap-2">
      <h3 className="text-white text-sm font-medium mb-2">工具</h3>
      
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => handleToolClick(tool.id)}
          className={`
            w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
            transition-all duration-200 border-2
            ${currentTool === tool.id
              ? 'bg-neon-cyan text-black border-neon-cyan neon-glow'
              : 'bg-gray-800 text-white border-gray-600 hover:bg-gray-700 hover:border-gray-500'
            }
          `}
          title={tool.label}
        >
          {tool.icon}
        </button>
      ))}
      
      <div className="border-t border-gray-700 mt-4 pt-4">
        <h4 className="text-white text-xs font-medium mb-2">快捷操作</h4>
        
        <button
          onClick={() => addText()}
          className="w-full px-3 py-2 bg-gray-800 text-white text-sm rounded border border-gray-600 hover:bg-gray-700 transition-colors mb-2"
        >
          添加文字
        </button>
        
        <div className="space-y-2">
          <h5 className="text-white text-xs font-medium">预设模板</h5>
          {presetScenes.map((preset) => (
            <button
              key={preset.id}
              onClick={() => loadScene(preset)}
              className="w-full px-2 py-1 bg-gray-800 text-white text-xs rounded border border-gray-600 hover:bg-gray-700 transition-colors text-left"
              title={`加载模板: ${preset.name}`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
