// click.js - 点击驱动引擎
import { getState, updateState } from './state.js';
import { getCurrentMonster, damageMonster } from './monster.js';
import { advanceMap, getStageProgress } from './map.js';
import { killMonster } from './map.js';
import { rollDropQuality, generateEquipment, addToInventory } from './equipment.js';
import { getEquipmentStats } from './equipment.js';

export function handleClick() {
  const state = getState();
  updateState('totalClicks', state.totalClicks + 1);
  
  const monster = getCurrentMonster();
  if (monster) {
    const damage = calculateDamage();
    const killed = damageMonster(damage);
    
    if (killed) {
      const result = killMonster();
      const drop = rollDrop(killed);
      return { damage, killed: true, monster: killed, drop, result };
    }
    return { damage, killed: false };
  }
  
  advanceMap();
  const progress = getStageProgress();
  window.gameBus?.dispatchEvent(new CustomEvent('mapUpdated', { detail: { steps: progress.mapSteps } }));
  return { damage: 0, killed: false };
}

export function calculateDamage() {
  const state = getState();
  const stats = getEquipmentStats();
  
  const baseAtk = state.player.atk + stats.atkBonus;
  const critRate = (state.player.crit + stats.crit) / 100;
  const isCrit = Math.random() < critRate;
  
  let damage = baseAtk * state.player.spd * (1 + stats.spd / 100);
  
  if (isCrit) {
    damage *= 2;
  }
  
  return Math.floor(damage);
}

function rollDrop(monster) {
  const config = monster.config;
  const quality = rollDropQuality(monster.level);
  
  let adjustedQuality = quality;
  
  if (config.dropMultiplier >= 3) {
    const roll = Math.random();
    if (roll < 0.1) adjustedQuality = 'purple';
    else if (roll < 0.3) adjustedQuality = 'blue';
  }
  
  if (config.dropMultiplier >= 10) {
    const roll = Math.random();
    if (roll < 0.15) adjustedQuality = 'orange';
    else if (roll < 0.4) adjustedQuality = 'purple';
    else if (roll < 0.7) adjustedQuality = 'blue';
  }
  
  if (config.dropMultiplier >= 50) {
    adjustedQuality = Math.random() < 0.7 ? 'purple' : 'orange';
  }
  
  const equipment = generateEquipment(adjustedQuality, monster.level);
  const added = addToInventory(equipment);
  
  return added ? equipment : null;
}

export function getAttackInfo() {
  const state = getState();
  const stats = getEquipmentStats();
  const baseAtk = state.player.atk + stats.atkBonus;
  const critRate = (state.player.crit + stats.crit) / 100;
  const spd = state.player.spd * (1 + stats.spd / 100);
  
  return {
    baseAtk,
    critRate: Math.min(critRate * 100, 100).toFixed(1),
    spd: spd.toFixed(2),
    damage: Math.floor(baseAtk * spd)
  };
}
