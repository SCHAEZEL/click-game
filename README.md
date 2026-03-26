# 迷宫猎手 - Dungeon Clicker 🐕⚔️

> 迷宫饭风格的放置点击游戏，扮演勇敢的猎手在地下城中冒险

## 🎮 在线版（免安装）

**线上地址**: https://SCHAEZEL.github.io/click-game/

直接浏览器打开，无需下载安装。

## 💻 桌面版（离线可用）

下载 exe 文件到本地，双击即可运行（完全离线可用）：

| 平台 | 状态 |
|------|------|
| Windows | ✅ Build by GitHub Actions |
| macOS | 🔜 Coming soon |
| Linux | 🔜 Coming soon |

Releases: https://github.com/SCHAEZEL/click-game/releases

## 运行方式

### 开发模式
```bash
npm install
npm run dev
```

### 构建桌面应用
```bash
npm install
npm run build
```
exe 文件输出到：`src-tauri/target/release/click-game.exe`

## 游戏特性

- 🐕 **角色系统**: 4种动物（猫/狗/兔子/鸟）× 4种职业（弓手/剑士/法师/盗贼）
- ⚔️ **装备系统**: 5种品质 × 9个部位 × 职业套装光环
- 👹 **怪物图鉴**: 小怪/精英怪/BOSS/世界BOSS
- 🌍 **世界BOSS**: 每日 08:00 / 20:00 刷新
- 💾 **自动存档**: localStorage 持久化

## 项目结构

```
click-game/
├── frontend/                   # 🌐 Web 前端（GitHub Pages 部署）
│   ├── index.html
│   ├── style.css
│   └── modules/
│       ├── config.js
│       ├── state.js
│       ├── click.js
│       ├── map.js
│       ├── monster.js
│       ├── equipment.js
│       ├── character.js
│       ├── save.js
│       └── ui.js
├── src-tauri/                 # 💻 Tauri 桌面应用
│   ├── src/main.rs
│   ├── tauri.conf.json
│   └── Cargo.toml
└── .github/workflows/
    └── deploy.yml             # 同时部署 Pages + 构建桌面 App
```

## License

MIT
