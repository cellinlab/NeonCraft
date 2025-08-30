import { useEffect } from 'react';
import { useSceneStore } from '../store/scene';

export const useKeyboard = () => {
  const { setTool, removeNode, scene, addText } = useSceneStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 防止在输入框中触发快捷键
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'v':
          e.preventDefault();
          setTool('select');
          break;
        case 'h':
          e.preventDefault();
          setTool('pan');
          break;
        case 't':
          e.preventDefault();
          setTool('text');
          addText();
          break;
        case 'd':
          e.preventDefault();
          setTool('draw');
          break;
        case 'delete':
        case 'backspace':
          e.preventDefault();
          if (scene.selectedId) {
            removeNode(scene.selectedId);
          }
          break;
        case 'escape':
          e.preventDefault();
          useSceneStore.getState().select(undefined);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTool, removeNode, scene.selectedId, addText]);
};
