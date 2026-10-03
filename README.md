# 🖥️ lixiaoshuai-git.github.io

个人主页 & 前端学习作品集 —— 深色科技风，GitHub Pages 部署。

**在线访问 → https://lixiaoshuai-git.github.io**

---

## 📋 这是什么

这是 Alan（苑泽宇）的个人站点，同时承载两个角色：

1. **个人主页（`index.html`）** —— 深色科技风的单页作品集。极光渐变背景、玻璃拟态卡片、滚动入场动画，一页讲清关于我、技能栈、在线作品、学习日志与联系方式。
2. **前端学习作品集（`day1~7` + `knowledge.html`）** —— 循序渐进的 HTML/CSS 学习实践记录，每天一个独立页面。

主站与知识图谱页是纯静态 HTML/CSS/JS，clone 下来双击就能跑；测评系统是独立的 Vue 3 + Vite 工程，构建产物已提交。

---

## 🗺️ 站点结构

```
lixiaoshuai-git.github.io/
├── index.html                  # 主站：深色科技风单页作品集（零依赖）
├── knowledge.html              # 子项目：心理健康知识图谱（D3.js）
├── data_analysis/              # 子项目：心理健康预警监测平台（ECharts）
│   ├── index.html
│   └── proxy-server.js         # 本地调试用的 CORS 代理（对接内网接口）
├── psych-assessment/           # 子项目：学生心理健康测评系统（Vue 3 + Vite）
│   ├── index.html              # Vite 源码入口，仅 `npm run dev` 使用
│   ├── src/                    # 源码
│   └── dist/                   # 构建产物，Pages 实际部署目录（故意提交）
├── day1&2.html … day7.html     # Day 1-7 学习日志
├── day6.css                    # Day 6 配套样式
├── *.png / *.jpg               # 站点图片资源（校徽、项目图标、配图等）
└── .gitignore
```

---

## ✨ 主站（index.html）设计

深色科技风 + 玻璃拟态，单文件实现，零依赖。

**视觉**

- 极光渐变光晕背景 + 淡网格 + 边缘暗角，纯 CSS 绘制
- 玻璃拟态卡片：毛玻璃、渐变描边、悬停时卡片内光斑跟随鼠标
- Indigo → Cyan 渐变主色，Inter + JetBrains Mono 字体

**交互**

- 顶部吸附导航，滚动时自动高亮当前区块
- 滚动入场动画（IntersectionObserver 分级延迟）
- Hero 中的 `status.json` 卡片保留终端基因，底部打字机输出 `build first, talk later`
- 移动端收起为玻璃下拉菜单，支持 Esc 关闭、点击外部关闭
- 全站响应式，并适配 `prefers-reduced-motion`

**内容区块**

| 区块 | 说明 |
|---|---|
| Hero | 姓名 / 学校 / 方向 + 3·20·5·7 数字概览 + `status.json` 卡片 |
| 关于我（01） | 自我介绍与「学校 / 定位 / 平台 / 状态」信息卡 |
| 技能栈（02） | 20 个技能模块，分为前端 / 后端 / 数据 / AI / 工具链 5 组 |
| 作品与实验（03） | 3 个可直接打开的在线作品 + 3 个在研项目 |
| 学习日志（04） | Day 1–7 时间线，逐日链接到对应笔记页面 |
| 联系（05） | GitHub、主页与合作方向 |

---

## 🧩 子项目说明

### 学生心理健康测评系统 `psych-assessment/`

Vue 3 + Vite。开发与发布：

```bash
cd psych-assessment
npm install
npm run dev      # 本地开发
npm run build    # 构建，产物在 dist/
```

GitHub Pages 实际访问的是 **`/psych-assessment/dist/`**（首页「开始测评」按钮指向这里）。

> ⚠️ `psych-assessment/index.html` 是 Vite 的源码入口（引用 `/src/main.js`），
> 在 Pages 上这个路径会 404，所以直接打开 `/psych-assessment/` 是空白页。

### 心理健康预警监测平台 `data_analysis/`

纯静态页面 + ECharts，数据来自内网接口 `/api/ierp/kapi/...`。
公网访问只能看到空数据，本地调试时用代理脚本把接口转发出来：

```bash
cd data_analysis
TARGET_API=http://<你的后端地址> node proxy-server.js   # Windows: $env:TARGET_API="..."; node proxy-server.js
```

### 心理健康知识图谱 `knowledge.html`

D3.js 力导向图，支持搜索、手动增删节点，以及「上传文档 AI 解析」。
该功能调用智谱 `glm-4-flash`，**API Key 需要使用者自己在弹窗里填写**，
只保存在本机 `localStorage`，不写入源码、不上传服务器。

> 🔐 这个仓库是公开的：**任何密钥都不要写进代码再提交**。
> 一旦提交，即使后来删掉，它依然留在 git 历史里，只能在平台侧吊销。

---

## 📚 学习日志内容

| 天数 | 主题 |
|---|---|
| Day 1 & 2 | HTML5 定义、发展目标、新特性、语义化标签、W3C 标准历程 |
| Day 3 | 超链接、图片、视频嵌入、有序/无序列表综合练习 |
| Day 4 | 账号密码输入框、表单基本元素 |
| Day 5 | 下拉选择、文本域、单选按钮与 label 的关联写法 |
| Day 6 | BUTTON 按钮类型、CSS 引入方式与类选择器 |
| Day 7 | 颜色写法、文本与字体属性、盒模型与 font 简写 |

---

## 🚀 本地运行

```bash
git clone https://github.com/lixiaoshuai-git/lixiaoshuai-git.github.io.git
cd lixiaoshuai-git.github.io

# 直接用浏览器打开主站
start index.html        # Windows
open index.html         # macOS
```

无需任何依赖或构建步骤。子项目另有各自的运行方式，见上一节。

---

## 🛠️ 技术栈

- **主站 / 知识图谱**：原生 HTML / CSS / JavaScript（无框架、无构建步骤）
- **测评系统**：Vue 3 + Vite（产物提交到 `psych-assessment/dist/`）
- **预警平台**：ECharts + 原生 JS，配套 Node 代理脚本
- **字体**：Inter + JetBrains Mono（Google Fonts，含系统中文字体兜底）
- **部署**：GitHub Pages（push 即发布，无需 CI）

---

## 📝 维护约定

- 提交信息统一用 `feat: / fix: / docs: / chore:` 前缀，写清楚改了什么
- 不提交 `node_modules/`、`.bak` 备份、明文密钥（见 `.gitignore`）
- `psych-assessment/dist/` 是唯一例外：它是 Pages 的部署目录，必须提交
- 旧版本一律用 `git log` / `git show` 找回，不要复制成 `.bak` 留在仓库里

---

## 🤝 联系

- GitHub: [@lixiaoshuai-git](https://github.com/lixiaoshuai-git)
- 主页: [lixiaoshuai-git.github.io](https://lixiaoshuai-git.github.io)

Open to: 技术合作 · 开源贡献 · 有趣的项目

---

⭐ 如果这个项目对你有帮助，欢迎给个 Star 支持！
