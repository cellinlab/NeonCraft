import { useRef } from 'react';
import { Stage, Layer, Text, Line } from 'react-konva';
import { useSceneStore } from '../store/scene';
import type { TextNode, PathNode } from '../types';

const PreviewWindow = () => {
  const stageRef = useRef(null);
  const { scene } = useSceneStore();

  // 预览窗口尺寸
  const previewWidth = 240;
  const previewHeight = 135; // 16:9 比例

  // 计算缩放比例
  const scaleX = previewWidth / scene.width;
  const scaleY = previewHeight / scene.height;
  const scale = Math.min(scaleX, scaleY);

  // 渲染文字节点
  const renderTextNode = (node: TextNode) => {
    return (
      <Text
        key={node.id}
        text={node.text}
        x={node.x}
        y={node.y}
        fontSize={node.fontSize}
        fontFamily={node.fontFamily || 'Arial'}
        fill={node.fill}
        stroke={node.stroke}
        strokeWidth={node.strokeWidth}
        opacity={node.opacity || 1}
        rotation={node.rotation || 0}
        scaleX={node.scaleX || 1}
        scaleY={node.scaleY || 1}
        shadowColor={node.glow.enabled ? node.stroke : undefined}
        shadowBlur={node.glow.enabled ? node.glow.blur * 0.5 : 0} // 预览时减小发光效果
        shadowOpacity={node.glow.enabled ? node.glow.intensity * 0.7 : 0}
      />
    );
  };

  // 渲染路径节点
  const renderPathNode = (node: PathNode) => {
    return (
      <Line
        key={node.id}
        points={node.points}
        x={node.x}
        y={node.y}
        stroke={node.stroke}
        strokeWidth={node.strokeWidth}
        opacity={node.opacity || 1}
        rotation={node.rotation || 0}
        scaleX={node.scaleX || 1}
        scaleY={node.scaleY || 1}
        tension={node.tension || 0}
        closed={node.closed || false}
        fill={node.fill}
        shadowColor={node.glow.enabled ? node.stroke : undefined}
        shadowBlur={node.glow.enabled ? node.glow.blur * 0.5 : 0}
        shadowOpacity={node.glow.enabled ? node.glow.intensity * 0.7 : 0}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  return (
    <div className="bg-gray-800 border border-gray-600 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-white text-xs font-medium">预览</h4>
        <span className="text-gray-400 text-xs">实时效果</span>
      </div>
      
      <div 
        className="relative bg-black rounded border border-gray-600 overflow-hidden"
        style={{ width: previewWidth, height: previewHeight }}
      >
        <Stage
          ref={stageRef}
          width={scene.width}
          height={scene.height}
          scale={{ x: scale, y: scale }}
          style={{
            backgroundColor: scene.background.color,
            width: previewWidth,
            height: previewHeight
          }}
        >
          <Layer>
            {scene.nodes.map((node) => {
              if (node.type === 'text') {
                return renderTextNode(node as TextNode);
              } else if (node.type === 'path') {
                return renderPathNode(node as PathNode);
              }
              return null;
            })}
          </Layer>
        </Stage>
        
        {/* 预览标识 */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          预览
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-400 text-center">
        {scene.nodes.length} 个图层 • {scene.width}×{scene.height}
      </div>
    </div>
  );
};

export default PreviewWindow;
