import { useEffect, useRef } from 'react';
import { useSceneStore } from '../store/scene';

export const useAutoSave = () => {
  const { scene, saveToLocal } = useSceneStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 设置新的定时器，500ms 后保存
    timeoutRef.current = setTimeout(() => {
      saveToLocal();
    }, 500);

    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scene, saveToLocal]);

  // 组件卸载时保存一次
  useEffect(() => {
    return () => {
      saveToLocal();
    };
  }, [saveToLocal]);
};
