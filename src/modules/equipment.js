// equipment.js - 装备池/掉落/套装
import { DROP_RATES, QUALITY_COLORS, QUALITY_NAMES, EQUIPMENT_SLOTS, EQUIPMENT_NAMES, SET_BONUSES } from './config.js';
import { getState } from './state.js';

const QUALITY_KEYS = ['green', 'blue', 'purple', 'orange', 'red'];

export function rollDropQuality(level = 1) {
  const state = getState();
  const levelBonus = (level - 1) * 0.01;
  
  let roll = Math.random();
  let cumulative = 0;
  
  for (let i = 0; i < QUALITY_KEYS.length; i++) {
    const quality = QUALITY_KEYS[i];
    let rate = DROP_RATES[quality];
    
    if (i >= 2) {
      rate += levelBonus;
    }
    
    cumulative += rate;
    if (roll < cumulative) {
      return quality;
    }
  }
  return 'green';
}

export function generateEquipment(quality, monsterLevel = 1) {
  const slot = EQUIPMENT_SLOTS[Math.floor(Math.random() * EQUIPMENT_SLOTS.length)];
  
  const baseStats = {
    atk: Math.floor((5 + monsterLevel * 2) * (quality === 'green' ? 1 : quality === 'blue' ? 1.3 : quality === 'purple' ? 1.8 : quality === 'orange' ? 2.5 : 3.5)),
    def: Math.floor((3 + monsterLevel * 1) * (quality === 'green' ? 1 : quality === 'blue' ? 1.3 : quality === 'purple' ? 1.8 : quality === 'orange' ? 2.5 : 3.5)),
    hp: Math.floor((10 + monsterLevel * 5) * (quality === 'green' ? 1 : quality === 'blue' ? 1.3 : quality === 'purple' ? 1.8 : quality === 'orange' ? 2.5 : 3.5)),
    crit: Math.floor((1 + monsterLevel * 0.5) * (quality === 'green' ? 1 : quality === 'blue' ? 1.2 : quality === 'purple' ? 1.5 : quality === 'orange' ? 2 : 2.5)),
    spd: Math.floor((0.5 + monsterLevel * 0.2) * 10) / 10
  };

  return {
    id: Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    slot,
    slotName: EQUIPMENT_NAMES[slot],
    quality,
    color: QUALITY_COLORS[quality],
    name: QUALITY_NAMES[quality] + EQUIPMENT_NAMES[slot],
    level: monsterLevel,
    stats: baseStats,
    profession: Math.random() < 0.3 ? ['warrior', 'archer', 'mage', 'rogue'][Math.floor(Math.random() * 4)] : null,
    set: Math.random() < 0.2 ? getRandomSet() : null
  };
}

function getRandomSet() {
  const professions = ['warrior', 'archer', 'mage', 'rogue'];
  const prof = professions[Math.floor(Math.random() * professions.length)];
  const sets = Object.keys(SET_BONUSES[prof]);
  return {
    profession: prof,
    name: sets[Math.floor(Math.random() * sets.length)]
  };
}

export function addToInventory(equipment) {
  const state = getState();
  if (state.inventory.length >= state.maxInventorySize) {
    return false;
  }
  state.inventory.push(equipment);
  return true;
}

export function equipItem(equipment) {
  const state = getState();
  const slot = equipment.slot;
  
  if (state.equipped[slot]) {
    state.inventory.push(state.equipped[slot]);
  }
  
  state.equipped[slot] = equipment;
  
  const idx = state.inventory.findIndex(e => e.id === equipment.id);
  if (idx !== -1) {
    state.inventory.splice(idx, 1);
  }
  
  checkSetBonus();
  return true;
}

export function unequipItem(slot) {
  const state = getState();
  if (!state.equipped[slot]) return null;
  
  const item = state.equipped[slot];
  if (state.inventory.length >= state.maxInventorySize) return null;
  
  state.inventory.push(item);
  state.equipped[slot] = null;
  return item;
}

export function checkSetBonus() {
  const state = getState();
  const prof = state.player.profession;
  const profSets = SET_BONUSES[prof];
  if (!profSets) return;

  const equippedBySet = {};
  
  for (const slot of EQUIPMENT_SLOTS) {
    const item = state.equipped[slot];
    if (item && item.set && item.set.profession === prof) {
      const setName = item.set.name;
      if (!equippedBySet[setName]) {
        equippedBySet[setName] = [];
      }
      equippedBySet[setName].push(item);
    }
  }

  const activated = [];
  for (const [setName, items] of Object.entries(equippedBySet)) {
    const setDef = profSets[setName];
    if (items.length >= setDef.count && !state.setBonusActivated[setName]) {
      state.setBonusActivated[setName] = true;
      activated.push({ name: setDef.name, stats: setDef.stats });
    }
  }
  
  return activated;
}

export function getEquipmentStats() {
  const state = getState();
  let stats = { atk: 0, def: 0, hp: 0, crit: 0, spd: 0, atkBonus: 0, defBonus: 0 };
  
  for (const slot of EQUIPMENT_SLOTS) {
    const item = state.equipped[slot];
    if (item && item.stats) {
      for (const [k, v] of Object.entries(item.stats)) {
        if (k === 'atk') stats.atkBonus += v;
        else if (k === 'def') stats.defBonus += v;
        else stats[k] = (stats[k] || 0) + v;
      }
    }
  }
  
  for (const setName of Object.keys(state.setBonusActivated)) {
    const prof = state.player.profession;
    const setDef = SET_BONUSES[prof]?.[setName];
    if (setDef) {
      for (const [k, v] of Object.entries(setDef.stats)) {
        if (k === 'atk') stats.atkBonus += v;
        else if (k === 'def') stats.defBonus += v;
        else stats[k] = (stats[k] || 0) + v;
      }
    }
  }
  
  return stats;
}
