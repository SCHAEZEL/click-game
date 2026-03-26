// state.js - 游戏状态单例
const initialState = {
  // 玩家属性
  player: {
    name: '冒险者',
    animal: 'dog',
    profession: 'warrior',
    level: 1,
    exp: 0,
    hp: 100,
    maxHp: 100,
    atk: 10,
    def: 5,
    crit: 5,
    spd: 1
  },

  // 已解锁形象
  unlockedAnimals: ['dog'],
  unlockedProfessions: ['warrior'],

  // 进度
  currentStage: 1,
  mapSteps: 0,
  monstersKilled: 0,
  stageMonstersKilled: 0,
  totalClicks: 0,
  totalDamage: 0,
  stageCompleted: 0,
  totalPlayTime: 0,

  // 背包
  inventory: [],
  maxInventorySize: 100,

  // 装备栏（已穿戴）
  equipped: {
    weapon: null,
    helmet: null,
    chest: null,
    legs: null,
    gloves: null,
    ring1: null,
    ring2: null,
    earring1: null,
    earring2: null,
    headwear: null
  },

  // 形象碎片
  fragments: {},

  // 世界BOSS
  worldBossChallengeCount: 0,
  worldBossLastReset: Date.now(),
  worldBossActive: [],

  // 套装效果激活记录
  setBonusActivated: {},

  // 存档时间
  lastSave: Date.now()
};

let G = JSON.parse(JSON.stringify(initialState));

export function getState() {
  return G;
}

export function setState(newState) {
  G = { ...G, ...newState };
  window.gameBus?.dispatchEvent(new CustomEvent('stateUpdate', { detail: G }));
}

export function updateState(path, value) {
  const keys = path.split('.');
  let current = G;
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  window.gameBus?.dispatchEvent(new CustomEvent('stateUpdate', { detail: G }));
}

export function resetState() {
  G = JSON.parse(JSON.stringify(initialState));
}
