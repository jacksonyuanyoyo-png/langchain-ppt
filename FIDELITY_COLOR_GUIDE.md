# Fidelity International 颜色设计系统实施指南

## 📋 项目概述

本项目已完全遵循 [Fidelity官方设计系统](https://design.fil.com/brand-identity/colours/) 重新设计颜色搭配，确保品牌一致性和无障碍访问标准。

## 🎨 核心品牌色彩

### 主品牌色 (Primary Brand Colors)
```css
--primary-blue: #006193;     /* Fidelity Blue - 主导识别色 */
--primary-red: #B72F2A;      /* Fidelity Red - 强调对比色 */
--white: #FFFFFF;            /* White - 50%以上留白 */
```

### 次要调色板 (Secondary Palette)
```css
--grey-600: #414956;         /* Grey-600 */
--blue-600: #006193;         /* Blue-600 (同主品牌蓝) */
--teal-600: #0D9C9C;         /* Teal-600 */
--green-600: #4AA00F;        /* Green-600 */
--yellow-600: #EDAE00;       /* Yellow-600 */
--orange-600: #EA6A18;       /* Orange-600 */
--purple-600: #841B8F;       /* Purple-600 */
--warm-grey-600: #857D76;    /* Warm Grey-600 */
```

## 🛠️ 语义化颜色映射

### 文本颜色
```css
--text-primary: var(--grey-800);        /* 主要文本 */
--text-secondary: var(--grey-600);      /* 次要文本 */
--text-muted: var(--grey-400);          /* 弱化文本 */
--text-inverse: var(--white);           /* 反色文本 */
```

### 背景颜色
```css
--background-primary: var(--white);     /* 主背景 */
--background-secondary: var(--grey-25); /* 次背景 */
--background-tertiary: var(--grey-50);  /* 三级背景 */
--background-brand: var(--primary-blue);/* 品牌背景 */
```

### 边框颜色
```css
--border-light: var(--grey-200);        /* 浅边框 */
--border-medium: var(--grey-300);       /* 中等边框 */
--border-strong: var(--grey-600);       /* 强边框 */
--border-brand: var(--primary-blue);    /* 品牌边框 */
```

## 🎯 特殊用途色彩

### 按钮颜色 (仅使用绿色和蓝色)
```css
--button-primary-bg: var(--primary-blue);
--button-primary-hover: var(--blue-800);
--button-secondary-bg: var(--green-600);
--button-secondary-hover: var(--green-800);
```

### 链接颜色 (仅使用蓝色系)
```css
--link-color: var(--primary-blue);
--link-hover: var(--blue-800);
--link-visited: var(--purple-600);
```

### 消息传达色彩
```css
--error-red: #E31D16;        /* 错误红(非品牌红) */
--warning-orange: #EA6A18;   /* 警告橙 */
--info-blue: #026FAD;        /* 信息蓝 */
--success-green: #4AA00F;    /* 成功绿 */
```

### 图表色彩 (考虑色盲友好性)
按推荐顺序使用：
1. `var(--blue-600)` - 蓝色
2. `var(--orange-600)` - 橙色
3. `var(--yellow-600)` - 黄色 (线图跳过)
4. `var(--green-600)` - 绿色
5. `var(--purple-600)` - 紫色
6. `var(--teal-600)` - 青色

## ✅ 无障碍访问标准

### 对比度要求 (WCAG AA)
- 常规文本：最小对比度 4.5:1
- 大文本（24px或18px粗体以上）：最小对比度 3:1
- 视觉元素：最小对比度 3:1

### 颜色标记说明
所有色值都标记了 'AA' 以指示可接受的对比度：
- **白色 'AA'**：可用作白色文本的背景
- **深色 'AA'**：可用作黑色或grey-800文本的背景

### 设计原则
- ❌ **避免仅依赖颜色传达信息**
- ✅ **使用图标、标签或符号补充颜色**
- ✅ **考虑色盲用户体验**
- ✅ **提供充足的留白空间（50%以上）**

## 🎨 品牌增强样式类

### 边框效果
```css
.fidelity-accent-border     /* 蓝色强调边框 */
```

### 渐变背景
```css
.fidelity-gradient-bg       /* 品牌渐变背景 */
```

### 投影效果
```css
.fidelity-shadow           /* 品牌特有投影 */
```

### 按钮样式
```css
.fidelity-btn-primary      /* 主要按钮 */
.fidelity-btn-secondary    /* 次要按钮 */
```

### 文本强调
```css
.fidelity-text-accent      /* 品牌蓝色文本 */
.fidelity-text-success     /* 成功绿色文本 */
.fidelity-text-warning     /* 警告黄色文本 */
.fidelity-text-error       /* 错误红色文本 */
```

## 📐 设计系统规范

### 色彩应用比例
- **主导色 (Fidelity Blue)**：占据60-70%的视觉权重
- **强调色 (Fidelity Red)**：小比例使用，通常<10%
- **辅助色彩**：剩余20-30%，适量点缀

### 禁用规则
- ❌ **不使用Fidelity Red表达负面含义**
- ❌ **不在按钮/链接中使用蓝绿以外的颜色**
- ❌ **不在可点击图标中使用非蓝色**
- ❌ **不单独使用颜色传达重要信息**

## 🌍 地区适配考虑

### 涨跌色彩 (Gain/Loss)
- **北美/中欧**：涨红跌绿
- **亚太地区**：涨绿跌红
- 项目已预设变量支持地区切换

### 皮肤色彩 (插图用)
提供暖/中/冷三个色调的皮肤色彩变量，支持多元化插图创作。

## 🔧 技术实现

### 向后兼容
保留了旧变量名映射，确保现有代码无缝迁移：
```css
--fidelity-blue: var(--primary-blue);
--theme-blue: var(--primary-blue);
/* 等等... */
```

### 响应式支持
- 高对比度模式适配
- 减少动画偏好支持
- 完整的移动端响应式设计

## 📝 内容风格指南合规性

根据 [Fidelity内容风格指南](https://design.fil.com/brand-identity/content-style-guide/#glossary-link-b) 的要求，项目已实施以下改进：

### 文本和用词规范
- ✅ **避免使用&符号**：在正文中使用完整的"and"
- ✅ **正确的术语使用**：使用"Select"而不是"Click"作为操作动词
- ✅ **一致的大小写规范**：遵循指南的大小写标准

### 列表格式规范
- ✅ **项目符号列表**：使用`.fidelity-bulleted-list`类
- ✅ **数字列表**：使用`.fidelity-numbered-list`类
- ✅ **引用格式**：使用单引号格式的`.fidelity-quote`类

### 无障碍访问增强
- ✅ **Alt文本描述**：为所有图像提供详细的替代文本
- ✅ **ARIA标签**：为交互元素添加适当的aria-label
- ✅ **键盘导航**：支持完整的键盘操作
- ✅ **屏幕阅读器支持**：使用aria-live和aria-current属性

### 导航增强
- ✅ **语义化导航**：使用role="navigation"
- ✅ **状态指示**：使用aria-current="page"指示当前页面
- ✅ **键盘支持**：Enter和Space键支持导航点操作

### 时间和日期格式
- ✅ **24小时制**：使用`.fidelity-timestamp`类支持标准时间格式
- ✅ **数字格式**：使用font-variant-numeric: tabular-nums

## 🎯 Pullout组件实施

根据 [Fidelity Pullout组件规范](https://design.fil.com/components/pullout/#code) 实施了三种变体：

### 组件类型
- **`.fidelity-pullout-standard`**：标准pullout，带垂直彩色条
- **`.fidelity-pullout-banner`**：Banner变体，更突出的蓝色背景
- **`.fidelity-pullout-subtle`**：微妙变体，使用灰色系

### 设计规范合规性
- ✅ **颜色规范**：使用推荐的Teal-600垂直条，避免深色
- ✅ **对比度检查**：所有组合通过WCAG AA标准
- ✅ **响应式设计**：支持小屏幕和大屏幕断点
- ✅ **交互状态**：hover和focus状态明确可见

### 无障碍访问增强
- ✅ **语义角色**：使用role="region"标识重点区域
- ✅ **ARIA标签**：提供描述性的aria-label
- ✅ **键盘导航**：tabindex="0"支持焦点访问
- ✅ **视觉指示**：focus状态有清晰的轮廓线

### 应用场景
- **Banner类型**：用于最重要的核心信息突出显示
- **Standard类型**：用于关键优势和重要说明
- **Subtle类型**：用于补充信息和温和提示

## 🃏 Standard Card组件实施

根据 [Fidelity Standard Card组件规范](https://design.fil.com/components/standard-card/#usage) 实施了完整的卡片系统：

### 组件结构
- **`.fidelity-standard-card`**：标准卡片容器
- **`.fidelity-card-icon`**：48px图标区域，使用品牌渐变
- **`.fidelity-card-category`**：分类标签，可点击导航
- **`.fidelity-card-title`**：标题（最多65字符或3行）
- **`.fidelity-card-body`**：正文（最多75字符或3行）
- **`.fidelity-card-actions`**：按钮操作区域

### 设计规范合规性
- ✅ **字符限制**：标题65字符，正文75字符，严格遵循规范
- ✅ **网格布局**：12列网格系统，大屏幕2-3列，小屏幕1列
- ✅ **视觉一致性**：同组卡片高度一致，元素基线对齐
- ✅ **层次清晰**：通过布局明确指示信息层次

### 无障碍访问增强
- ✅ **语义标记**：使用role="article"标识卡片内容
- ✅ **键盘导航**：Enter/Space键支持卡片激活
- ✅ **焦点管理**：focus-within和tabindex支持
- ✅ **屏幕阅读器**：适当的ARIA标签和描述

### 交互功能
- ✅ **卡片导航**：点击或键盘激活可跳转到相关幻灯片
- ✅ **视觉反馈**：hover状态和focus指示清晰
- ✅ **导航提示**：跳转成功后显示确认反馈
- ✅ **响应式设计**：所有断点的最佳显示效果

### 应用实例
- **演示卡片**：4个LangChain用例展示，支持直接跳转到对应演示
- **统计卡片**：项目数据展示，结构化信息呈现
- **网格布局**：2列网格在大屏幕，1列堆叠在移动端

## 📚 参考资源

- [Fidelity官方设计系统](https://design.fil.com/brand-identity/colours/)
- [Fidelity内容风格指南](https://design.fil.com/brand-identity/content-style-guide/#glossary-link-b)
- [Fidelity Pullout组件规范](https://design.fil.com/components/pullout/#code)
- [Fidelity Standard Card组件规范](https://design.fil.com/components/standard-card/#usage)
- [WCAG 2.1 无障碍指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [色盲友好设计指南](https://www.color-blindness.com/coblis-color-blindness-simulator/)

---

**更新日期**: 2024年9月15日  
**版本**: 1.3  
**合规性**: ✅ 完全符合Fidelity International品牌指南、内容风格指南、Pullout组件规范和Standard Card组件规范
