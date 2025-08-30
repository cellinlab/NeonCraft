import { useSceneStore } from '../store/scene';
import type { Node } from '../types';
import { useState } from 'react';

const LayersPanel = () => {
  const { scene, select, bringForward, sendBackward, removeNode, reorderLayers } = useSceneStore();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      // 转换显示索引到实际数组索引（reverse的影响）
      const actualFromIndex = scene.nodes.length - 1 - draggedIndex;
      const actualToIndex = scene.nodes.length - 1 - dragOverIndex;
      reorderLayers(actualFromIndex, actualToIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const getNodeDisplayName = (node: Node): string => {
    if (node.type === 'text') {
      return `文字: ${node.text.slice(0, 10)}${node.text.length > 10 ? '...' : ''}`;
    } else {
      return `路径 #${node.id.slice(-4)}`;
    }
  };

  const getNodeIcon = (node: Node): string => {
    return node.type === 'text' ? 'T' : '✏';
  };

  return (
    <div className="h-full flex flex-col">
      {/* 图层面板标题 */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white text-sm font-medium">图层管理</h3>
        <p className="text-xs text-gray-400 mt-1">
          {scene.nodes.length} 个图层
        </p>
      </div>
      
      {/* 图层列表区域 */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {scene.nodes.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl text-gray-600 mb-2">📝</div>
            <p className="text-gray-500 text-sm">暂无图层</p>
            <p className="text-gray-600 text-xs mt-1">使用工具栏添加文字或绘制路径</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* 从上到下显示图层（数组顺序相反） */}
            {[...scene.nodes].reverse().map((node, index) => (
              <div
                key={node.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onDragLeave={handleDragLeave}
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${scene.selectedId === node.id
                    ? 'bg-neon-cyan bg-opacity-20 border border-neon-cyan shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600 border border-transparent'
                  }
                  ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
                  ${dragOverIndex === index && draggedIndex !== index ? 'border-neon-cyan border-dashed' : ''}
                `}
                onClick={() => select(node.id)}
              >
                {/* 拖拽手柄 */}
                <div className="text-gray-500 text-sm cursor-grab active:cursor-grabbing">
                  ⋮⋮
                </div>
                
                {/* 图层图标 */}
                <div
                  className={`
                    w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold
                    ${node.type === 'text' ? 'bg-blue-600' : 'bg-purple-600'}
                    shadow-md
                  `}
                  style={{ color: node.stroke }}
                >
                  {getNodeIcon(node)}
                </div>
                
                {/* 图层信息 */}
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm truncate font-medium">
                    {getNodeDisplayName(node)}
                  </div>
                  <div className="text-gray-400 text-xs mt-1">
                    层级 {scene.nodes.length - index} • {node.type === 'text' ? '文字' : '路径'}
                  </div>
                </div>
                
                {/* 操作按钮组 */}
                <div className="flex items-center gap-1">
                  {/* 可见性切换 */}
                  <button
                    className={`
                      w-6 h-6 text-sm rounded hover:bg-gray-600 transition-colors
                      ${(node.opacity || 1) > 0 ? 'text-white' : 'text-gray-500'}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      const newOpacity = (node.opacity || 1) > 0 ? 0 : 1;
                      useSceneStore.getState().updateNode(node.id, { opacity: newOpacity });
                    }}
                    title="切换显示/隐藏"
                  >
                    {(node.opacity || 1) > 0 ? '👁' : '👁‍🗨'}
                  </button>
                  
                  {/* 锁定按钮（占位） */}
                  <button
                    className="w-6 h-6 text-sm text-gray-500 rounded hover:bg-gray-600 transition-colors"
                    title="锁定图层（开发中）"
                  >
                    🔓
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* 图层操作面板 */}
      {scene.selectedId && (
        <div className="p-4 bg-gray-750 border-t border-gray-700">
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => bringForward(scene.selectedId!)}
                className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                title="上移图层"
              >
                <span>↑</span> 上移
              </button>
              <button
                onClick={() => sendBackward(scene.selectedId!)}
                className="flex-1 px-3 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                title="下移图层"
              >
                <span>↓</span> 下移
              </button>
            </div>
            
            <button
              onClick={() => removeNode(scene.selectedId!)}
              className="w-full px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>🗑</span> 删除图层
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
