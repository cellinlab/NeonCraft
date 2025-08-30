import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Text, Line, Rect, Group } from 'react-konva';
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
  const [showControls, setShowControls] = useState(false);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const { scene } = useSceneStore();

  // 自动进入全屏
  useEffect(() => {
    const enterFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.error('无法进入全屏模式:', err);
        }
      }
    };

    enterFullscreen();

    // 监听全屏退出事件
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // 如果退出了全屏，也退出展示模式
        onExit();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [onExit]);

  // 鼠标移动显示控制面板
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      
      // 清除之前的定时器
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      // 3秒后隐藏控制面板
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

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

  // 计算画布大小 - 填满整个屏幕
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 使用覆盖模式 - 确保填满整个屏幕
  const scaleX = screenSize.width / scene.width;
  const scaleY = screenSize.height / scene.height;
  const scale = Math.max(scaleX, scaleY); // 使用 max 而不是 min，确保填满

  const scaledWidth = scene.width * scale;
  const scaledHeight = scene.height * scale;
  const offsetX = (screenSize.width - scaledWidth) / 2;
  const offsetY = (screenSize.height - scaledHeight) / 2;

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
      className="fixed inset-0 bg-black"
      style={{
        filter: `brightness(${globalBrightness}) hue-rotate(${globalHue + scene.global.hueRotate}deg)`,
        cursor: 'none' // 隐藏鼠标光标
      }}
    >
      {/* 全屏画布 */}
      <Stage
        ref={stageRef}
        width={screenSize.width}
        height={screenSize.height}
        style={{
          backgroundColor: scene.background.color
        }}
      >
        <Layer ref={layerRef}>
          {/* 背景填充 */}
          <Rect
            width={screenSize.width}
            height={screenSize.height}
            fill={scene.background.color}
          />
          
          {/* 内容组 */}
          <Group
            x={offsetX}
            y={offsetY}
            scaleX={scale}
            scaleY={scale}
          >
            {scene.nodes.map((node) => {
              if (node.type === 'text') {
                return renderTextNode(node as TextNode);
              } else if (node.type === 'path') {
                return renderPathNode(node as PathNode);
              }
              return null;
            })}
          </Group>
        </Layer>
      </Stage>

      {/* 隐藏的控制面板 - 只在鼠标移动时显示 */}
      <div 
        className={`fixed top-4 right-4 bg-black bg-opacity-80 p-3 rounded-lg space-y-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ cursor: 'default' }}
      >
        <div className="text-white text-xs">
          <label className="block mb-1">亮度: {Math.round(globalBrightness * 100)}%</label>
          <input
            type="range"
            min="0.2"
            max="2"
            step="0.1"
            value={globalBrightness}
            onChange={(e) => setGlobalBrightness(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <div className="text-white text-xs">
          <label className="block mb-1">色相: {globalHue}°</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={globalHue}
            onChange={(e) => setGlobalHue(Number(e.target.value))}
            className="w-24"
          />
        </div>

        <button
          onClick={onExit}
          className="w-full px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
        >
          退出 (ESC)
        </button>
      </div>
    </div>
  );
};

export default Player;
