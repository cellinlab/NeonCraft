import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Line, Transformer } from 'react-konva';
import Konva from 'konva';
import { useSceneStore } from '../store/scene';
import type { Node, TextNode, PathNode } from '../types';

const StageCanvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const {
    scene,
    currentTool,
    drawingState,
    select,
    updateNode,
    startDraw,
    pushPoint,
    endDraw
  } = useSceneStore();

  // 处理舞台点击
  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) return;

    const pos = stage.getPointerPosition();
    if (!pos) return;

    if (currentTool === 'text') {
      // 添加文字模式
      useSceneStore.getState().addText({ x: pos.x, y: pos.y });
    } else if (currentTool === 'select') {
      // 选择模式 - 点击空白处取消选择
      if (e.target === stage) {
        select(undefined);
      }
    }
  };

  // 处理鼠标按下（开始绘制）
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (currentTool !== 'draw') return;
    
    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;

    startDraw();
    pushPoint(pos.x, pos.y);
  };

  // 处理鼠标移动（绘制中）
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (currentTool !== 'draw' || !drawingState.isDrawing) return;

    const stage = e.target.getStage();
    if (!stage) return;
    
    const pos = stage.getPointerPosition();
    if (!pos) return;

    pushPoint(pos.x, pos.y);
  };

  // 处理鼠标抬起（结束绘制）
  const handleMouseUp = () => {
    if (currentTool === 'draw' && drawingState.isDrawing) {
      endDraw();
    }
    setIsDragging(false);
  };

  // 处理画布拖动
  const handleStageDragStart = () => {
    if (currentTool === 'select') {
      setIsDragging(true);
    }
  };

  const handleStageDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    if (currentTool === 'select') {
      setStagePos({ x: e.target.x(), y: e.target.y() });
      setIsDragging(false);
    }
  };

  // 更新 Transformer
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;

    const transformer = transformerRef.current;
    const stage = stageRef.current;

    if (scene.selectedId) {
      const selectedNode = stage.findOne(`#${scene.selectedId}`);
      if (selectedNode) {
        transformer.nodes([selectedNode]);
        transformer.getLayer()?.batchDraw();
      }
    } else {
      transformer.nodes([]);
    }
  }, [scene.selectedId]);

  // 渲染文字节点
  const renderTextNode = (node: TextNode) => {
    return (
      <Text
        key={node.id}
        id={node.id}
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
        shadowBlur={node.glow.enabled ? node.glow.blur : 0}
        shadowOpacity={node.glow.enabled ? node.glow.intensity : 0}
        draggable={currentTool === 'select'}
        onClick={() => {
          if (currentTool === 'select') {
            select(node.id);
          }
        }}
        onDragEnd={(e) => {
          updateNode(node.id, {
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();
          const rotation = e.target.rotation();
          
          // 重置 scale 并更新 fontSize
          e.target.scaleX(1);
          e.target.scaleY(1);
          
          updateNode(node.id, {
            fontSize: Math.max(5, node.fontSize * Math.abs(scaleX)),
            rotation,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
      />
    );
  };

  // 渲染路径节点
  const renderPathNode = (node: PathNode) => {
    return (
      <Line
        key={node.id}
        id={node.id}
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
        shadowBlur={node.glow.enabled ? node.glow.blur : 0}
        shadowOpacity={node.glow.enabled ? node.glow.intensity : 0}
        lineCap="round"
        lineJoin="round"
        draggable={currentTool === 'select'}
        onClick={() => {
          if (currentTool === 'select') {
            select(node.id);
          }
        }}
        onDragEnd={(e) => {
          updateNode(node.id, {
            x: e.target.x(),
            y: e.target.y()
          });
        }}
        onTransformEnd={(e) => {
          const scaleX = e.target.scaleX();
          const scaleY = e.target.scaleY();
          const rotation = e.target.rotation();
          
          updateNode(node.id, {
            scaleX,
            scaleY,
            rotation,
            x: e.target.x(),
            y: e.target.y()
          });
        }}
      />
    );
  };

  // 计算画布缩放以适应容器
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageScale, setStageScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      const scaleX = containerWidth / scene.width;
      const scaleY = containerHeight / scene.height;
      const scale = Math.min(scaleX, scaleY, 1); // 不放大，只缩小
      
      setStageScale(scale);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [scene.width, scene.height]);

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-neon-bg overflow-hidden flex items-center justify-center"
    >
      <Stage
        ref={stageRef}
        width={scene.width}
        height={scene.height}
        scale={{ x: stageScale, y: stageScale }}
        x={stagePos.x}
        y={stagePos.y}
        draggable={currentTool === 'select'}
        style={{
          backgroundColor: scene.background.color,
          cursor: currentTool === 'draw' ? 'crosshair' : 
                  currentTool === 'select' && isDragging ? 'grabbing' :
                  currentTool === 'select' ? 'grab' : 'default',
          border: '1px solid #374151'
        }}
        onClick={handleStageClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={handleStageDragStart}
        onDragEnd={handleStageDragEnd}
      >
        <Layer>
          {/* 渲染所有节点 */}
          {scene.nodes.map((node) => {
            if (node.type === 'text') {
              return renderTextNode(node as TextNode);
            } else if (node.type === 'path') {
              return renderPathNode(node as PathNode);
            }
            return null;
          })}
          
          {/* 当前绘制路径 */}
          {drawingState.isDrawing && drawingState.currentPath.length > 2 && (
            <Line
              points={drawingState.currentPath}
              stroke="#FF00FF"
              strokeWidth={6}
              shadowColor="#FF00FF"
              shadowBlur={25}
              shadowOpacity={0.7}
              lineCap="round"
              lineJoin="round"
              tension={0.3}
            />
          )}
          
          {/* Transformer */}
          <Transformer
            ref={transformerRef}
            borderEnabled={true}
            borderStroke="#00F0FF"
            borderStrokeWidth={2}
            anchorStroke="#00F0FF"
            anchorSize={8}
            enabledAnchors={[
              'top-left',
              'top-right', 
              'bottom-left',
              'bottom-right'
            ]}
          />
        </Layer>
      </Stage>
    </div>
  );
};

export default StageCanvas;
