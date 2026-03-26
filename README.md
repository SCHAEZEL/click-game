# 迷宫猎手 - Dungeon Clicker 🐕⚔️

> 迷宫饭风格的放置点击游戏，扮演勇敢的猎手在地下城中冒险

## 🎮 在线版（免安装）

**线上地址**: https://schaezel.github.io/click-game/

直接浏览器打开，无需下载安装。

## 💻 桌面版

下载 exe 文件到本地，双击即可运行（完全离线可用）：

Releases: https://github.com/SCHAEZEL/click-game/releases/tag/v0.1.0

## 更新日志

### v1.0（2026-03-26）
**完整版发布**

核心功能：
- ⚔️ 点击驱动战斗，支持鼠标点击和键盘任意键触发
- 🗺️ 地图推进系统，21节点路径（20小怪+1BOSS）
- 👹 四种怪物类型：
  - 小怪：HP×1，均匀分布
  - 精英怪：HP×5，每20小怪随机刷新1只
  - 普通BOSS：HP×20，关卡终点固定出现
  - 世界BOSS：HP×100，每日08:00/20:00(北京时间)各刷新2只
- 📦 装备掉落系统：绿(60%)/蓝(25%)/紫(13%)/橙(1.5%)/红(0.5%)
- 🎒 背包系统：100格容量
- ⚡ 9个装备部位：武器/头盔/胸甲/护腿/手套/戒指×2/耳环×2
- ✨ 职业套装系统：4职业×3套，凑齐4件触发光环
- 🐾 角色换肤：4种动物×4种职业，碎片解锁
- 🌍 世界BOSS挑战系统
- 💾 localStorage 自动存档（每30秒）
- 📖 怪物图鉴弹窗
- 🎨 完整迷宫饭暖黄卡通风格 UI

## 技术栈

- 纯 HTML5 + CSS3 + JavaScript（单文件，无外部依赖）
- 构建工具：Vite
- 桌面框架：Tauri 2（Rust + WebView2）
- GitHub Actions 自动构建

## 项目结构

```
click-game/
├── index.html          # 🌐 单文件完整版（GitHub Pages 部署）
├── docs/               # 📄 GitHub Pages 部署目录
├── desktop/            # 💻 Tauri 桌面应用源码
│   └── src-tauri/
├── modules/           # 🔧 游戏模块（开发时使用）
├── test.html          # 🧪 测试版
└── .github/workflows/ # ⚙️ CI/CD
```

## 开发

```bash
npm install
npm run dev        # 开发模式（Vite 热更新）
npm run build:web  # 构建 Web 版本
npm run build      # 构建 Tauri 桌面应用
```

## License

MIT
