import { useSceneStore } from '../store/scene';
import type { TextNode, PathNode } from '../types';
import { colorPresets } from '../data/presets';

const PropertiesPanel = () => {
  const { scene, updateNode, removeNode } = useSceneStore();
  
  const selectedNode = scene.nodes.find(node => node.id === scene.selectedId);

  if (!selectedNode) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white text-sm font-medium">属性面板</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="text-4xl text-gray-600 mb-2">🎨</div>
            <p className="text-gray-500 text-sm">请选择一个元素</p>
            <p className="text-gray-600 text-xs mt-1">在画布或图层面板中选择要编辑的元素</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateNode(selectedNode.id, { [property]: value });
  };

  const handleGlowChange = (property: string, value: any) => {
    updateNode(selectedNode.id, {
      glow: { ...selectedNode.glow, [property]: value }
    });
  };

  const presetColors = colorPresets.map(preset => preset.color);

  return (
    <div className="h-full flex flex-col">
      {/* 标题栏 - 固定不滚动 */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white text-sm font-medium">属性面板</h3>
        <p className="text-xs text-gray-400 mt-1">
          {selectedNode.type === 'text' ? '文字元素' : '路径元素'} #{selectedNode.id.slice(-4)}
        </p>
      </div>
      
      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="p-4">
          {/* 基础属性 */}
          <div className="space-y-4">
        <div>
          <label className="text-white text-xs font-medium block mb-2">
            颜色 ({selectedNode.type === 'text' ? '描边' : '线条'})
          </label>
          <div className="flex gap-2 mb-2">
            {presetColors.map((color) => (
              <button
                key={color}
                onClick={() => handlePropertyChange('stroke', color)}
                className={`w-8 h-8 rounded border-2 ${
                  selectedNode.stroke === color ? 'border-white' : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <input
            type="color"
            value={selectedNode.stroke}
            onChange={(e) => handlePropertyChange('stroke', e.target.value)}
            className="w-full h-10 rounded border border-gray-600"
          />
        </div>

        <div>
          <label className="text-white text-xs font-medium block mb-2">
            线宽: {selectedNode.strokeWidth}px
          </label>
          <input
            type="range"
            min="1"
            max="40"
            value={selectedNode.strokeWidth}
            onChange={(e) => handlePropertyChange('strokeWidth', Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-white text-xs font-medium block mb-2">
            透明度: {Math.round((selectedNode.opacity || 1) * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={selectedNode.opacity || 1}
            onChange={(e) => handlePropertyChange('opacity', Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* 发光效果 */}
      <div className="mt-6 space-y-4">
        <h4 className="text-white text-sm font-medium">发光效果</h4>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedNode.glow.enabled}
            onChange={(e) => handleGlowChange('enabled', e.target.checked)}
            className="w-4 h-4"
          />
          <label className="text-white text-xs">启用发光</label>
        </div>

        {selectedNode.glow.enabled && (
          <>
            <div>
              <label className="text-white text-xs font-medium block mb-2">
                模糊半径: {selectedNode.glow.blur}px
              </label>
              <input
                type="range"
                min="5"
                max="60"
                value={selectedNode.glow.blur}
                onChange={(e) => handleGlowChange('blur', Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-white text-xs font-medium block mb-2">
                发光强度: {Math.round(selectedNode.glow.intensity * 100)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={selectedNode.glow.intensity}
                onChange={(e) => handleGlowChange('intensity', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
      </div>

      {/* 文字特定属性 */}
      {selectedNode.type === 'text' && (
        <div className="mt-6 space-y-4">
          <h4 className="text-white text-sm font-medium">文字属性</h4>
          
          <div>
            <label className="text-white text-xs font-medium block mb-2">文字内容</label>
            <input
              type="text"
              value={(selectedNode as TextNode).text}
              onChange={(e) => handlePropertyChange('text', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded"
            />
          </div>

          <div>
            <label className="text-white text-xs font-medium block mb-2">
              字体大小: {(selectedNode as TextNode).fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="200"
              value={(selectedNode as TextNode).fontSize}
              onChange={(e) => handlePropertyChange('fontSize', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-white text-xs font-medium block mb-2">字体</label>
            <select
              value={(selectedNode as TextNode).fontFamily || 'Arial'}
              onChange={(e) => handlePropertyChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded"
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Impact">Impact</option>
            </select>
          </div>

          <div>
            <label className="text-white text-xs font-medium block mb-2">填充色</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={(selectedNode as TextNode).fill || '#000000'}
                onChange={(e) => handlePropertyChange('fill', e.target.value)}
                className="flex-1 h-10 rounded border border-gray-600"
              />
              <button
                onClick={() => handlePropertyChange('fill', undefined)}
                className="px-3 py-2 bg-gray-700 text-white text-xs rounded border border-gray-600 hover:bg-gray-600"
              >
                无填充
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 路径特定属性 */}
      {selectedNode.type === 'path' && (
        <div className="mt-6 space-y-4">
          <h4 className="text-white text-sm font-medium">路径属性</h4>
          
          <div>
            <label className="text-white text-xs font-medium block mb-2">
              平滑度: {Math.round(((selectedNode as PathNode).tension || 0) * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={(selectedNode as PathNode).tension || 0}
              onChange={(e) => handlePropertyChange('tension', Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={(selectedNode as PathNode).closed || false}
              onChange={(e) => handlePropertyChange('closed', e.target.checked)}
              className="w-4 h-4"
            />
            <label className="text-white text-xs">闭合路径</label>
          </div>
        </div>
      )}

        {/* 操作按钮 */}
        <div className="mt-8 pt-4 border-t border-gray-700">
          <button
            onClick={() => removeNode(selectedNode.id)}
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            删除元素
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
