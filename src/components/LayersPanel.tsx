import { useSceneStore } from '../store/scene';
import type { Node } from '../types';

const LayersPanel = () => {
  const { scene, select, bringForward, sendBackward, removeNode } = useSceneStore();

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
    <div className="bg-gray-800 p-4 w-64 border-t border-gray-700">
      <h3 className="text-white text-sm font-medium mb-3">图层</h3>
      
      {scene.nodes.length === 0 ? (
        <p className="text-gray-500 text-xs">暂无图层</p>
      ) : (
        <div className="space-y-1">
          {/* 从上到下显示图层（数组顺序相反） */}
          {[...scene.nodes].reverse().map((node) => (
            <div
              key={node.id}
              className={`
                flex items-center gap-2 p-2 rounded cursor-pointer text-sm
                ${scene.selectedId === node.id
                  ? 'bg-neon-cyan bg-opacity-20 border border-neon-cyan'
                  : 'bg-gray-700 hover:bg-gray-600'
                }
              `}
              onClick={() => select(node.id)}
            >
              {/* 图层图标 */}
              <div
                className={`
                  w-6 h-6 rounded flex items-center justify-center text-xs font-bold
                  ${node.type === 'text' ? 'bg-blue-600' : 'bg-purple-600'}
                `}
                style={{ color: node.stroke }}
              >
                {getNodeIcon(node)}
              </div>
              
              {/* 图层名称 */}
              <span className="flex-1 text-white text-xs truncate">
                {getNodeDisplayName(node)}
              </span>
              
              {/* 可见性切换 */}
              <button
                className={`
                  w-5 h-5 text-xs
                  ${(node.opacity || 1) > 0 ? 'text-white' : 'text-gray-500'}
                `}
                onClick={(e) => {
                  e.stopPropagation();
                  // 切换可见性（简化版）
                  const newOpacity = (node.opacity || 1) > 0 ? 0 : 1;
                  // 这里需要 updateNode 函数
                  useSceneStore.getState().updateNode(node.id, { opacity: newOpacity });
                }}
              >
                👁
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* 图层操作按钮 */}
      {scene.selectedId && (
        <div className="mt-4 pt-3 border-t border-gray-700 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => bringForward(scene.selectedId!)}
              className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
              title="上移图层"
            >
              ↑
            </button>
            <button
              onClick={() => sendBackward(scene.selectedId!)}
              className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-600"
              title="下移图层"
            >
              ↓
            </button>
          </div>
          
          <button
            onClick={() => removeNode(scene.selectedId!)}
            className="w-full px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            删除图层
          </button>
        </div>
      )}
    </div>
  );
};

export default LayersPanel;
