# 🖥️ lixiaoshuai-git.github.io

个人主页 & 前端学习作品集 —— 终端风格，GitHub Pages 部署。

**在线访问 → https://lixiaoshuai-git.github.io**

---

## 📋 这是什么

这是 Alan（苑泽宇）的个人站点，同时承载两个角色：

1. **个人主页（`index.html`）** —— 一台"赛博终端"。CRT 扫描线、打字机命令、磷光绿高亮，用 `whoami` / `ls` / `cat` 的方式展示关于我、技能栈、项目与联系方式。
2. **前端学习作品集（`day1~7` + `knowledge.html`）** —— 循序渐进的 HTML/CSS 学习实践记录，每天一个独立页面。

整站无框架、无构建步骤，纯静态 HTML/CSS/JS， clone 下来双击就能跑。

---

## 🗺️ 站点结构

```
lixiaoshuai-git.github.io/
├── index.html            # 主站：终端风个人主页
├── knowledge.html        # 前端知识汇总页
├── psych-assessment/     # 子项目：心理健康智能问答平台
├── data_analysis/        # 子项目：数据分析实践
├── day1&2.html           # Day 1-2: HTML5 基础概念与特性
├── day3.html             # Day 3: 常用元素（链接/图片/视频/列表）
├── day4.html             # Day 4: 表单元素与布局
├── day5.html             # Day 5: 进阶内容
├── day6.html / day6.css  # Day 6: 进阶内容
├── day7.html             # Day 7: 综合实践
└── 资源文件               # 图片等静态资源
```

---

## ✨ 主站（index.html）设计

终端模拟器风格，单文件实现，零依赖。

**视觉**

- Matrix 磷光绿 `#00FF41` 主色 + 青/紫/黄 语法高亮辅助色
- CRT 扫描线 + 边缘暗角 + 随机闪烁，模拟老式显示器
- JetBrains Mono 等宽字体，ASCII 艺术字横幅

**交互**

- 四个 Tab 切换：`~/about` `~/skills` `~/projects` `~/contact`
- 每次切换触发**打字机效果**逐字输出命令
- 键盘快捷键 `1` `2` `3` `4` 快速切换 Tab
- 背景上浮绿色粒子

**内容区块**

| 区块 | 说明 |
|---|---|
| Hero 终端 | whoami + status.json，一眼看清我是谁、在做什么 |
| 站点导航 `ls -la ~/site/` | 6 张卡片：2 个子项目、知识库、7 天学习日志、GitHub、联系 |
| 状态栏页脚 | uptime 天数 · exit 0 · always building |

---

## 📚 学习日志内容

| 天数 | 主题 |
|---|---|
| Day 1 & 2 | HTML5 定义、发展目标、新特性、语义化标签、W3C 标准历程 |
| Day 3 | 超链接、图片、视频嵌入、有序/无序列表综合练习 |
| Day 4 | 账号密码输入框、表单基本元素、表单布局与交互优化 |
| Day 5-7 | CSS 样式美化、响应式基础、综合页面开发、知识体系整合 |

---

## 🚀 本地运行

```bash
git clone https://github.com/lixiaoshuai-git/lixiaoshuai-git.github.io.git
cd lixiaoshuai-git.github.io

# 直接用浏览器打开主站
start index.html        # Windows
open index.html         # macOS
```

无需任何依赖或构建步骤。

---

## 🛠️ 技术栈

- **主站**：原生 HTML / CSS / JavaScript（无框架）
- **字体**：JetBrains Mono（Google Fonts）
- **部署**：GitHub Pages（push 即发布）

---

## 🤝 联系

- GitHub: [@lixiaoshuai-git](https://github.com/lixiaoshuai-git)
- 主页: [lixiaoshuai-git.github.io](https://lixiaoshuai-git.github.io)

Open to: 技术合作 · 开源贡献 · 有趣的项目

---

⭐ 如果这个项目对你有帮助，欢迎给个 Star 支持！
