# 迷宫猎手 - Dungeon Clicker 🐕⚔️

> 迷宫饭风格的放置点击游戏，扮演勇敢的猎手在地下城中冒险

🎮 **开发中** — 敬请期待

## 技术栈

- **前端**: 原生 HTML5 + CSS3 + JavaScript（ES Modules）
- **桌面框架**: Tauri 2（Rust + WebView2）
- **无外部依赖**，单文件可运行

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
├── src/                    # 前端源码
│   ├── index.html          # 主页面
│   ├── style.css           # 样式
│   └── modules/            # 游戏模块
│       ├── config.js       # 配置常量
│       ├── state.js        # 状态管理
│       ├── click.js        # 点击引擎
│       ├── map.js          # 地图关卡
│       ├── monster.js       # 怪物系统
│       ├── equipment.js     # 装备掉落
│       ├── character.js     # 角色换肤
│       ├── save.js         # 存档
│       └── ui.js           # 界面动画
├── src-tauri/              # Tauri 后端
│   ├── src/main.rs         # Rust 入口
│   ├── tauri.conf.json     # Tauri 配置
│   └── Cargo.toml          # Rust 依赖
└── .github/workflows/      # CI/CD
```

## License

MIT
