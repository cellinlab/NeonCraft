import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Line } from 'react-konva';
import Konva from 'konva';
import { useSceneStore } from '../store/scene';
import type { TextNode, PathNode } from '../types';

interface PlayerProps {
  onExit: () => void;
}

const Player = ({ onExit }: PlayerProps) => {
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const [globalBrightness, setGlobalBrightness] = useState(1);
  const [globalHue, setGlobalHue] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { scene } = useSceneStore();

  // 全屏功能
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        console.error('无法进入全屏模式:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (err) {
        console.error('无法退出全屏模式:', err);
      }
    }
  };

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // 动画效果
  useEffect(() => {
    if (scene.global.animation === 'none') return;

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const speed = scene.global.animSpeed;

      if (scene.global.animation === 'breathe') {
        // 呼吸效果：亮度在 0.7-1.3 之间波动
        const breath = Math.sin(elapsed * speed) * 0.3 + 1;
        setGlobalBrightness(breath * scene.global.brightness);
      } else if (scene.global.animation === 'flicker') {
        // 闪烁效果：随机抖动
        const flicker = 0.8 + Math.random() * 0.4;
        setGlobalBrightness(flicker * scene.global.brightness);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [scene.global.animation, scene.global.animSpeed, scene.global.brightness]);

  // ESC 键退出
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // 计算画布大小
  const containerSize = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  const scaleX = containerSize.width / scene.width;
  const scaleY = containerSize.height / scene.height;
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = scene.width * scale;
  const scaledHeight = scene.height * scale;
  const offsetX = (containerSize.width - scaledWidth) / 2;
  const offsetY = (containerSize.height - scaledHeight) / 2;

  // 渲染文字节点
  const renderTextNode = (node: TextNode) => {
    const brightness = globalBrightness;
    const opacity = (node.opacity || 1) * brightness;
    
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
        opacity={Math.min(1, opacity)}
        rotation={node.rotation || 0}
        scaleX={node.scaleX || 1}
        scaleY={node.scaleY || 1}
        shadowColor={node.glow.enabled ? node.stroke : undefined}
        shadowBlur={node.glow.enabled ? node.glow.blur * brightness : 0}
        shadowOpacity={node.glow.enabled ? node.glow.intensity * brightness : 0}
      />
    );
  };

  // 渲染路径节点
  const renderPathNode = (node: PathNode) => {
    const brightness = globalBrightness;
    const opacity = (node.opacity || 1) * brightness;
    
    return (
      <Line
        key={node.id}
        points={node.points}
        x={node.x}
        y={node.y}
        stroke={node.stroke}
        strokeWidth={node.strokeWidth}
        opacity={Math.min(1, opacity)}
        rotation={node.rotation || 0}
        scaleX={node.scaleX || 1}
        scaleY={node.scaleY || 1}
        tension={node.tension || 0}
        closed={node.closed || false}
        fill={node.fill}
        shadowColor={node.glow.enabled ? node.stroke : undefined}
        shadowBlur={node.glow.enabled ? node.glow.blur * brightness : 0}
        shadowOpacity={node.glow.enabled ? node.glow.intensity * brightness : 0}
        lineCap="round"
        lineJoin="round"
      />
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black flex items-center justify-center"
      style={{
        filter: `brightness(${globalBrightness}) hue-rotate(${globalHue + scene.global.hueRotate}deg)`
      }}
    >
      {/* 画布 */}
      <div
        style={{
          width: scaledWidth,
          height: scaledHeight,
          position: 'relative'
        }}
      >
        <Stage
          ref={stageRef}
          width={scene.width}
          height={scene.height}
          scale={{ x: scale, y: scale }}
          style={{
            backgroundColor: scene.background.color
          }}
        >
          <Layer ref={layerRef}>
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
      </div>

      {/* 控制面板 */}
      <div className="fixed top-4 right-4 bg-black bg-opacity-70 p-4 rounded-lg space-y-3">
        <div className="text-white text-sm">
          <label className="block mb-1">整体亮度: {Math.round(globalBrightness * 100)}%</label>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={globalBrightness}
            onChange={(e) => setGlobalBrightness(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="text-white text-sm">
          <label className="block mb-1">色相偏移: {globalHue}°</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={globalHue}
            onChange={(e) => setGlobalHue(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
          >
            {isFullscreen ? '退出全屏' : '全屏'}
          </button>
          
          <button
            onClick={onExit}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            退出
          </button>
        </div>
      </div>

      {/* 提示文字 */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-70 px-4 py-2 rounded">
        按 ESC 键退出展示模式
      </div>
    </div>
  );
};

export default Player;
