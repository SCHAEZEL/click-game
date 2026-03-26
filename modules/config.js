// config.js - 游戏配置常量
export const QUALITY_COLORS = {
  green: '#4ade80',
  blue: '#60a5fa',
  purple: '#a855f7',
  orange: '#f97316',
  red: '#ef4444'
};

export const QUALITY_NAMES = {
  green: '优秀',
  blue: '精良',
  purple: '史诗',
  orange: '传说',
  red: '神话'
};

export const MONSTER_TYPES = {
  NORMAL: 'normal',
  ELITE: 'elite',
  BOSS: 'boss',
  WORLD_BOSS: 'worldBoss'
};

export const MONSTER_CONFIG = {
  [MONSTER_TYPES.NORMAL]: { hpMultiplier: 1, dropMultiplier: 1, color: '#9ca3af', border: 'none' },
  [MONSTER_TYPES.ELITE]: { hpMultiplier: 5, dropMultiplier: 3, color: '#fbbf24', border: '2px solid #fbbf24' },
  [MONSTER_TYPES.BOSS]: { hpMultiplier: 20, dropMultiplier: 10, color: '#ef4444', scale: 1.5 },
  [MONSTER_TYPES.WORLD_BOSS]: { hpMultiplier: 100, dropMultiplier: 50, color: '#a855f7', pulse: true }
};

export const DROP_RATES = {
  green: 0.60,
  blue: 0.25,
  purple: 0.13,
  orange: 0.015,
  red: 0.005
};

export const EQUIPMENT_SLOTS = [
  'weapon', 'helmet', 'chest', 'legs', 'gloves',
  'ring1', 'ring2', 'earring1', 'earring2', 'headwear'
];

export const EQUIPMENT_NAMES = {
  weapon: '武器',
  helmet: '头盔',
  chest: '胸甲',
  legs: '护腿',
  gloves: '手套',
  ring1: '戒指',
  ring2: '戒指',
  earring1: '耳环',
  earring2: '耳环',
  headwear: '头饰'
};

export const ANIMALS = ['dog', 'cat', 'rabbit', 'bird'];
export const ANIMAL_NAMES = { dog: '狗', cat: '猫', rabbit: '兔子', bird: '鸟' };

export const PROFESSIONS = ['warrior', 'archer', 'mage', 'rogue'];
export const PROFESSION_NAMES = { warrior: '剑士', archer: '弓手', mage: '法师', rogue: '盗贼' };

export const SET_BONUSES = {
  warrior: {
    berserker: { name: '狂暴光环', stats: { atk: 50 }, count: 4 },
    guardian: { name: '守护光环', stats: { def: 30 }, count: 4 },
    destroyer: { name: '毁灭光环', stats: { crit: 20 }, count: 4 }
  },
  archer: {
    windshot: { name: '疾风光环', stats: { atk: 40, spd: 10 }, count: 4 },
    forest: { name: '森林光环', stats: { def: 25 }, count: 4 },
    eagle: { name: '苍鹰光环', stats: { crit: 25 }, count: 4 }
  },
  mage: {
    arcane: { name: '奥术光环', stats: { atk: 60 }, count: 4 },
    ice: { name: '冰霜光环', stats: { def: 20, spd: 15 }, count: 4 },
    inferno: { name: '烈焰光环', stats: { crit: 30 }, count: 4 }
  },
  rogue: {
    shadow: { name: '暗影光环', stats: { atk: 45, spd: 15 }, count: 4 },
    phantom: { name: '幻影光环', stats: { def: 15, crit: 20 }, count: 4 },
    death: { name: '死神光环', stats: { crit: 35 }, count: 4 }
  }
};

export const WORLD_BOSS_REFRESH_HOURS = [8, 20]; // 北京时间

export const STATS_PER_LEVEL = {
  hp: 10,
  atk: 2,
  def: 1
};
