# 斗地主游戏

一个基于React + Vite + TailwindCSS的两人斗地主纸牌游戏。

## 🎮 游戏特性

- **两人对战**：玩家 vs 电脑AI
- **完整规则**：发牌、叫地主/抢地主、出牌（支持多种牌型）、胜负判定
- **智能AI**：电脑会自动叫地主和出牌
- **美观界面**：响应式设计，支持各种屏幕尺寸
- **一键部署**：支持Vercel、Netlify等平台

## 🃏 支持的牌型

- 单张、对子、三个
- 三带一、三带一对
- 顺子（5张+连续单牌）
- 连对（3对+连续对子）
- 飞机、飞机带单牌、飞机带对子
- 四带二（炸弹带牌）
- 炸弹、四炸弹
- 火箭（大小王）

## 🚀 快速开始

### 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

### 在线部署

#### Vercel

```bash
# 安装Vercel CLI
npm i -g vercel

# 部署
vercel
```

#### Netlify

```bash
# 安装Netlify CLI
npm i -g netlify-cli

# 部署
netlify deploy --prod --dir=dist
```

#### GitHub Pages

```bash
# 构建
npm run build

# 上传dist文件夹到gh-pages分支
```

## 📁 项目结构

```
doudizhu-game/
├── src/
│   ├── components/      # React组件
│   │   ├── PokerCard.jsx      # 扑克牌组件
│   │   ├── PlayerHand.jsx    # 玩家手牌
│   │   ├── ComputerHand.jsx  # 电脑手牌
│   │   ├── GameBoard.jsx     # 游戏主面板
│   │   ├── ActionButtons.jsx # 出牌/不出按钮
│   │   ├── BidButtons.jsx    # 叫分按钮
│   │   ├── GameInfo.jsx      # 游戏信息
│   │   └── ...
│   ├── logic/           # 游戏规则
│   │   ├── cards.js           # 扑克牌数据
│   │   └── gameRules.js       # 出牌规则
│   ├── ai/              # AI算法
│   │   └── ai.js              # AI决策
│   ├── hooks/           # React hooks
│   │   └── useGame.js         # 游戏状态管理
│   ├── App.jsx          # 主组件
│   └── index.css        # 样式
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 游戏规则

1. **发牌**：每人17张，剩3张底牌
2. **叫地主**：玩家和电脑轮流叫分（1-3分），最高分或3分直接成为地主
3. **出牌**：地主先出，之后每轮由上轮出牌者先出
4. **压制**：后出牌者必须出相同牌型且更大的牌，或者不出
5. **胜负**：谁先出完所有手牌谁获胜
6. **计分**：底分×倍数（炸弹×2，火箭×2）

## 🛠️ 技术栈

- **前端框架**：React 18
- **构建工具**：Vite 5
- **样式**：TailwindCSS 3
- **部署**：Vercel/Netlify兼容

## 📝 说明

这是一个简化版的斗地主游戏，支持两人对战。AI会根据自己的手牌情况决定是否叫地主，以及如何出牌。

**提示**：确保你的浏览器支持ES6+和CSS3特性。

## 📄 许可证

MIT License
