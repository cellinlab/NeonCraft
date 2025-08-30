# NeonCraft（霓光工坊）—2小时黑客松MVP方案

## 0. 目标与范围（MVP）

**目标**：在 2 小时内交付一个可用的 Web 应用，支持：

* 创建并编辑「灯牌」；
* 灯牌由 **文字** 与 **自定义形状** 混合构成；
* 一键进入 **展示模式**（全屏播放）显示“霓虹灯”效果（可调色 & 亮度，基础闪烁/呼吸动效）。

**范围内**：

* 以浏览器端为主，单页 React 应用；
* 支持添加/编辑/删除文字与自由绘制形状；
* 每个元素可设置：颜色、亮度、线宽、发光（shadow/glow）、位置/旋转/缩放、层级；
* 本地存储（localStorage）保存一个灯牌模板；
* 展示模式（只读渲染 + 动效）。

**范围外（可做展望）**：

* 多灯牌管理、云端存储、协作、导出图片/视频、复杂粒子/体积光效果、硬件灯带联动。

---

## 1. 用户故事（MVP）

1. 我可以新建一个灯牌并命名；
2. 我可以添加一段文字，选择字体、颜色、亮度、线宽与发光强度，并拖拽定位；
3. 我可以用「画笔」在画布上勾勒形状（自由手绘），设置颜色、亮度、线宽与发光强度；
4. 我可以选择元素并做移动、缩放、旋转与删除；
5. 我可以保存当前灯牌（自动保存到 localStorage）；
6. 我可以点击「展示」进入全屏播放，看到霓虹灯的光晕与呼吸/闪烁动效；
7. 我可以在展示模式中调节整体亮度/色相（全局滤镜）。

---

## 2. 技术选型与理由

* **React + Vite**：极速开发与热更。
* **Konva + react-konva**（Canvas 2D）：

  * 较 Fabric 更轻，API 简洁，**shadowBlur / shadowColor** 原生支持，快速实现霓虹发光；
  * 适合自由绘制（自由线条 = `Konva.Line`，`points` 序列），性能够用；
* **TypeScript**：保证数据结构清晰稳定；
* **Zustand**（或 useReducer）：极简全局状态；
* **localStorage**：持久化当前灯牌；
* **CSS / Tailwind（可选）**：快速搭 UI；
* **Fullscreen API**：展示模式一键全屏。

> 备选：如果更熟悉 Fabric.js 也可直接换成 Fabric；如需更高特效/粒子，后续可迁移 PixiJS（WebGL）。

---

## 3. 功能模块划分

* **AppShell**：路由/布局（编辑页、展示页）。
* **Editor**：编辑器主界面（Stage 画布 + 工具栏 + 属性面板 + 图层面板）。
* **StageCanvas**（基于 `react-konva`）：渲染与交互拾取（选择/拖拽/缩放/旋转/绘制）。
* **Toolbar**：添加文字、切换到画笔、撤销/重做（可选）。
* **PropertiesPanel**：选中元素的样式与发光参数、全局设置（背景色、全局亮度/色相）。
* **LayersPanel**：简单的图层列表（上移/下移/删除）。
* **Player**：展示模式渲染（只读）+ 动效驱动（requestAnimationFrame）。
* **Store**：Zustand 状态 + 序列化（save/load）。

---

## 4. 数据结构（TypeScript）

```ts
export type NeonColor = string; // 如 '#FF00FF'
export type ID = string;

export type BaseProps = {
  id: ID;
  type: 'text' | 'path';
  name?: string;
  x: number; // 位置
  y: number;
  rotation?: number; // 角度
  scaleX?: number;
  scaleY?: number;
  opacity?: number; // 0-1
  stroke: NeonColor; // 霓虹主色
  strokeWidth: number; // 线宽
  glow: {
    enabled: boolean;
    blur: number; // 阴影模糊半径
    intensity: number; // 0-1, 乘到 shadowOpacity
  };
};

export type TextNode = BaseProps & {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily?: string;
  // 霓虹风格通常以描边为主，可选填充
  fill?: NeonColor;
};

export type PathNode = BaseProps & {
  type: 'path';
  points: number[]; // [x1,y1,x2,y2,...]
  tension?: number; // 平滑曲线
  closed?: boolean; // 是否闭合
  fill?: NeonColor; // 可选内部填充
};

export type Node = TextNode | PathNode;

export type Scene = {
  id: ID;
  name: string;
  width: number;
  height: number;
  background: {
    color: string; // 画布背景（深色更显光晕）
  };
  global: {
    brightness: number; // 0-2 (1 为原始)
    hueRotate: number; // -180~180，全局色相偏移（展示模式可调）
    animation: 'none' | 'breathe' | 'flicker';
    animSpeed: number; // 0.2~2
  };
  nodes: Node[]; // 图层从下到上
  selectedId?: ID; // 选中元素
};
```

**持久化**：`localStorage.setItem('neoncraft:scene', JSON.stringify(scene))`

---

## 5. 霓虹渲染方案（Canvas / Konva）

* **核心表现**：以强描边 + 多层阴影模拟光晕。
* **Konva 配置**（每个节点）：

  * `stroke`, `strokeWidth`：主色与线宽；
  * `shadowColor = stroke`、`shadowBlur = glow.blur`；
  * `shadowOpacity = 0.6 * glow.intensity`（可在全局亮度叠加）；
  * 文字使用 `Konva.Text`（只描边时用 `stroke` + `strokeWidth`；若需内发光可叠加一个同色 `fill`）。
* **更强光晕（可选）**：

  * 复制同一图元 1–2 层，增大 `shadowBlur`、降低不透明度；
  * 或在 `Layer` 上使用自定义滤镜（Konva Filter / Canvas 多次绘制）。
* **全局亮度/色相**：展示模式在 `requestAnimationFrame` 中对 `Layer.cache()` 后应用自定义滤镜或通过 CSS Canvas 将画布作为纹理再做 `filter: brightness()/hue-rotate()`（简单可靠）。

---

## 6. 交互与编辑流程

* **选择**：点击命中拾取；`Shift` 多选（MVP 允许单选即可）。
* **拖拽/缩放/旋转**：使用 `Konva.Transformer` 绑定所选节点。
* **添加文字**：工具栏点击「T」，在画布点一下创建，默认文本“NEON”；属性面板编辑内容与样式。
* **绘制形状（自由笔）**：点击「笔刷」进入绘制模式，`onMouseDown` 开始记录点，`onMouseMove` push 坐标，`onMouseUp` 生成 `PathNode`（可用 `tension` 平滑）。
* **图层顺序**：图层面板上下移动或「置顶/置底」。
* **保存/载入**：编辑时自动 `debounce(500ms)` 持久化；进入应用时尝试从 localStorage 载入。

---

## 7. 展示模式（Player）

* **进入方式**：点击「展示」按钮 → 切换只读路由 `/play`；
* **渲染**：只读 `Scene`；锁定交互；启用全屏 `document.documentElement.requestFullscreen()`；
* **动效实现**（`requestAnimationFrame`）：

  * **breathe（呼吸）**：`t = (sin(time * speed)+1)/2`，映射到 `global.brightness`（0.8\~1.2）或 `shadowOpacity`；
  * **flicker（闪烁）**：使用伪随机 `noise(time)` 对 `shadowOpacity` 做小幅抖动（如 0.5–0.9）；
* **全局滤镜**：用 CSS `filter: brightness() hue-rotate()` 包裹 Canvas 容器，实时响应滑杆。

---

## 8. 组件结构（示意）

```
src/
  App.tsx                // 路由：/edit, /play
  store/scene.ts         // Zustand：scene + actions
  components/
    Editor/
      Editor.tsx
      StageCanvas.tsx
      Toolbar.tsx
      PropertiesPanel.tsx
      LayersPanel.tsx
    Player/Player.tsx
```

---

## 9. Zustand 状态与动作（片段）

```ts
export const useSceneStore = create<{
  scene: Scene;
  setScene: (p: Partial<Scene>) => void;
  addText: (init?: Partial<TextNode>) => void;
  startDraw: () => void; // 进入绘制模式
  pushPoint: (x: number, y: number) => void; // 绘制中
  endDraw: () => void; // 结束绘制并生成 PathNode
  select: (id?: ID) => void;
  updateNode: (id: ID, patch: Partial<Node>) => void;
  removeNode: (id: ID) => void;
  bringForward: (id: ID) => void;
  sendBackward: (id: ID) => void;
}>()
```

---

## 10. UI 草图（MVP）

* 顶栏：项目名、保存状态（自动）、按钮：新建、展示。
* 左侧工具栏：选择、文字、画笔。
* 右侧属性面板：颜色、亮度（影响 shadowOpacity/全局 brightness）、线宽、发光模糊、字体/字号、对齐、删除。
* 下方图层条（简化版）。

---

## 11. 2 小时落地计划

**T+0\~15min**：搭 Vite + React + TS + Tailwind（可选）+ react-konva + zustand；起 `Scene` 类型与 store；Stage 空白画布；

**T+15\~45min**：实现添加文字（默认样式）、选择与 `Konva.Transformer`、属性面板（颜色/线宽/发光/字号/文本）；

**T+45\~75min**：自由绘制 Path（记录 points → Konva.Line），样式同上；图层数组渲染；

**T+75\~90min**：自动保存/加载 localStorage；

**T+90\~105min**：展示模式路由与全屏；全局亮度/色相与呼吸动效；

**T+105\~120min**：打磨：默认背景、示例灯牌、简单 Logo、演示脚本；若有余量加闪烁动效与快捷键。

---

## 12. 质量与性能要点

* 背景建议深色（#0B0F1A），对比更强；
* 适度限制 `shadowBlur` 与 `strokeWidth`（如 2\~40）防止过度开销；
* 编辑态避免每帧重绘：仅在拖拽/变更时重渲染；
* 展示态统一在 Layer/Stage 上做缓存与滤镜，减少节点级更新；
* 移动端：禁用多选，增大命中区域（`hitStrokeWidth`）。

---

## 13. 可选加分点（若时间允许）

* 导出 PNG（`stage.toDataURL()`）；
* 预置模板与配色；
* 音频输入驱动亮度（Web Audio API）；
* 快捷键：Del 删除，Cmd/Ctrl+D 复制，Cmd/Ctrl+S 手动保存。

---

## 14. Demo 数据（默认场景）

```json
{
  "id": "demo-1",
  "name": "NeonCraft Demo",
  "width": 1280,
  "height": 720,
  "background": { "color": "#0B0F1A" },
  "global": { "brightness": 1, "hueRotate": 0, "animation": "breathe", "animSpeed": 0.6 },
  "nodes": [
    {
      "id": "t1",
      "type": "text",
      "text": "NEON",
      "x": 460, "y": 260, "rotation": 0, "scaleX": 1, "scaleY": 1,
      "stroke": "#00F0FF", "strokeWidth": 10, "fill": "#001014",
      "glow": { "enabled": true, "blur": 40, "intensity": 0.9 },
      "fontSize": 120, "opacity": 1
    }
  ]
}
```

---

## 15. 展示话术（10 秒版）

> 这是 **NeonCraft**，一个在浏览器里自由绘制与播放“数字霓虹灯”的工具。两分钟就能做出你的专属灯牌：文字 + 手绘形状，颜色亮度随心调，一键全屏展示、带呼吸/闪烁发光。适合直播与视频背景，让每一束光都成为你的签名。
