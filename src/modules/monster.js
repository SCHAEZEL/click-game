// monster.js - 怪物生成/刷新
import { MONSTER_TYPES, MONSTER_CONFIG } from './config.js';
import { getState } from './state.js';

let currentMonster = null;

export function generateMonster(type = MONSTER_TYPES.NORMAL, level = 1) {
  const config = MONSTER_CONFIG[type];
  const baseHp = 50 + level * 20;
  const hp = Math.floor(baseHp * config.hpMultiplier);
  
  return {
    id: Date.now() + '_' + Math.random().toString(36).substr(2, 5),
    type,
    level,
    hp,
    maxHp: hp,
    name: getMonsterName(type),
    config
  };
}

function getMonsterName(type) {
  const names = {
    [MONSTER_TYPES.NORMAL]: ['哥布林', '史莱姆', '蝙蝠', '骷髅', '狼崽'],
    [MONSTER_TYPES.ELITE]: ['精英哥布林', '精英史莱姆', '精英骷髅'],
    [MONSTER_TYPES.BOSS]: ['关卡BOSS'],
    [MONSTER_TYPES.WORLD_BOSS]: ['世界BOSS']
  };
  const list = names[type] || names[MONSTER_TYPES.NORMAL];
  return list[Math.floor(Math.random() * list.length)];
}

export function spawnMonster() {
  const state = getState();
  const stage = state.currentStage;
  
  let type = MONSTER_TYPES.NORMAL;
  let isBoss = false;
  
  if (state.mapSteps > 0 && state.mapSteps % 20 === 0) {
    type = MONSTER_TYPES.BOSS;
    isBoss = true;
  } else if (state.stageMonstersKilled > 0 && state.stageMonstersKilled % 20 === 0 && Math.random() < 0.5) {
    type = MONSTER_TYPES.ELITE;
  }
  
  const level = stage;
  currentMonster = generateMonster(type, level);
  currentMonster.isBoss = isBoss;
  
  window.gameBus?.dispatchEvent(new CustomEvent('monsterSpawn', { detail: currentMonster }));
  return currentMonster;
}

export function getCurrentMonster() {
  return currentMonster;
}

export function damageMonster(damage) {
  if (!currentMonster) return null;
  
  currentMonster.hp -= damage;
  
  if (currentMonster.hp <= 0) {
    currentMonster.hp = 0;
    const killed = currentMonster;
    currentMonster = null;
    window.gameBus?.dispatchEvent(new CustomEvent('monsterKilled', { detail: killed }));
    return killed;
  }
  
  window.gameBus?.dispatchEvent(new CustomEvent('monsterDamaged', { detail: { monster: currentMonster, damage } }));
  return null;
}

export function spawnWorldBoss() {
  const state = getState();
  const level = Math.max(1, state.currentStage);
  
  return [
    generateMonster(MONSTER_TYPES.WORLD_BOSS, level * 5),
    generateMonster(MONSTER_TYPES.WORLD_BOSS, level * 5)
  ];
}

export function resetWorldBoss() {
  currentMonster = null;
}
