# Design Document

## Overview

基于 Fidelity International 颜色方案重新设计 LangChain PPT 演示系统。设计将采用现代化的卡片布局、优化的代码显示区域，以及响应式设计原则，确保在各种设备上都有出色的视觉效果和用户体验。

## Architecture

### 颜色系统设计

基于提供的 Fidelity 颜色方案，建立完整的设计系统：

**主色调 (Primary Palette)**
- Primary Blue: `#006193` - 主要品牌色，用于标题、按钮、重要元素
- Primary Red: `#B72F2A` - 强调色，用于警告、重要提示
- White: `#FFFFFF` - 背景色、文本反色

**辅助色调 (Secondary Palette)**
- Teal-600: `#0D9C9C` - 用于技术相关内容
- Green-600: `#4AA00F` - 用于成功状态、正面信息
- Yellow-600: `#EDAE00` - 用于警告、注意事项
- Orange-600: `#EA6A18` - 用于活跃状态、交互元素
- Purple-600: `#841B8F` - 用于代码、技术细节
- Warm-Grey-600: `#857D76` - 用于次要文本、边框

**灰度系统**
- Grey-25 到 Grey-900: 用于文本层次、背景变化、边框等

### 布局系统设计

**网格系统**
- 采用 Flexbox 布局确保灵活性
- 左侧固定宽度主题区域 (320px)
- 右侧自适应内容区域
- 响应式断点：1200px, 768px, 480px

**卡片系统**
- 使用卡片容器组织内容
- 统一的圆角 (8px) 和阴影效果
- 清晰的内容分组和视觉层次

## Components and Interfaces

### 1. 颜色变量系统

```css
:root {
  /* Primary Palette */
  --primary-blue: #006193;
  --primary-red: #B72F2A;
  --white: #FFFFFF;
  
  /* Secondary Palette */
  --teal-600: #0D9C9C;
  --green-600: #4AA00F;
  --yellow-600: #EDAE00;
  --orange-600: #EA6A18;
  --purple-600: #841B8F;
  --warm-grey-600: #857D76;
  
  /* Grey Scale */
  --grey-25: #F7F7F8;
  --grey-50: #F3F3C1;
  --grey-100: #D3D3E1;
  --grey-200: #B9BDC4;
  --grey-300: #999D46;
  --grey-400: #747C89;
  --grey-500: #515A68;
  --grey-600: #414956;
  --grey-700: #313740;
  --grey-800: #202428;
  --grey-900: #101215;
}
```

### 2. 代码显示组件

**代码容器设计**
- 深色主题背景 (`--grey-800`)
- 语法高亮使用 Fidelity 颜色
- 行号显示（可选）
- 复制按钮功能
- 水平滚动条样式优化

**输出区域设计**
- 浅色背景区分代码和输出
- 使用 `--grey-50` 作为背景
- 等宽字体显示
- 清晰的边框分隔

### 3. 主题标识系统

每个幻灯片使用不同颜色的主题标识：
- 蓝色系：基础概念 (`--primary-blue`)
- 橙色系：架构设计 (`--orange-600`)
- 黄色系：应用场景 (`--yellow-600`)
- 绿色系：实践演示 (`--green-600`)
- 紫色系：高级功能 (`--purple-600`)
- 青色系：工具使用 (`--teal-600`)

### 4. 卡片组件系统

**内容卡片**
```css
.content-card {
  background: var(--white);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 20px;
}
```

**代码卡片**
```css
.code-card {
  background: var(--grey-800);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}
```

## Data Models

### 幻灯片数据结构

```javascript
const slideThemes = {
  1: { color: 'primary-blue', type: 'cover' },
  2: { color: 'primary-blue', type: 'content' },
  3: { color: 'orange-600', type: 'content' },
  4: { color: 'yellow-600', type: 'content' },
  5: { color: 'green-600', type: 'demo' },
  // ... 其他幻灯片配置
}
```

### 颜色主题映射

```javascript
const colorMapping = {
  'primary-blue': '#006193',
  'orange-600': '#EA6A18',
  'yellow-600': '#EDAE00',
  'green-600': '#4AA00F',
  'purple-600': '#841B8F',
  'teal-600': '#0D9C9C'
}
```

## Error Handling

### 响应式适配

- 当屏幕宽度 < 768px 时，切换为单列布局
- 当内容溢出时，提供优雅的滚动体验
- 图片和 SVG 自适应缩放

### 浏览器兼容性

- 使用 CSS 自定义属性 (CSS Variables)
- Flexbox 布局确保现代浏览器支持
- 渐进增强的动画效果

## Testing Strategy

### 视觉回归测试

1. **颜色一致性测试**
   - 验证所有颜色使用符合 Fidelity 规范
   - 检查对比度满足可访问性要求

2. **布局响应式测试**
   - 测试不同屏幕尺寸下的布局
   - 验证内容不会溢出或重叠

3. **交互功能测试**
   - 测试幻灯片切换动画
   - 验证键盘和触摸导航
   - 检查代码区域滚动功能

### 性能测试

1. **加载性能**
   - 优化 CSS 文件大小
   - 确保动画流畅 (60fps)

2. **内存使用**
   - 避免内存泄漏
   - 优化大量 DOM 元素的处理

## Implementation Notes

### CSS 架构

采用 BEM 命名规范和组件化 CSS：
```css
.slide__content-card {}
.slide__content-card--highlighted {}
.code-block {}
.code-block__header {}
.code-block__content {}
```

### 动画设计

使用 CSS transitions 和 transforms：
- 幻灯片切换：`transform: translateX()` + `opacity`
- 悬停效果：`transform: scale()` + `box-shadow`
- 加载动画：`opacity` + `transform: translateY()`

### 可访问性考虑

- 确保颜色对比度符合 WCAG 2.1 AA 标准
- 提供键盘导航支持
- 添加适当的 ARIA 标签
- 支持屏幕阅读器