// save.js - localStorage 存档
import { getState, setState } from './state.js';

const SAVE_KEY = 'maze_hunter_save';
let autoSaveInterval = null;

export function saveGame() {
  const state = getState();
  state.lastSave = Date.now();
  
  const saveData = {
    version: 1,
    timestamp: Date.now(),
    state: JSON.parse(JSON.stringify(state))
  };
  
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    window.gameBus?.dispatchEvent(new CustomEvent('gameSaved', { detail: saveData }));
    return true;
  } catch (e) {
    console.error('Save failed:', e);
    return false;
  }
}

export function loadGame() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    
    const saveData = JSON.parse(data);
    if (saveData && saveData.state) {
      setState(saveData.state);
      checkWorldBossReset();
      window.gameBus?.dispatchEvent(new CustomEvent('gameLoaded', { detail: saveData }));
      return saveData.state;
    }
  } catch (e) {
    console.error('Load failed:', e);
  }
  return null;
}

export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
  window.gameBus?.dispatchEvent(new CustomEvent('saveDeleted'));
}

export function startAutoSave(intervalMs = 10000) {
  stopAutoSave();
  autoSaveInterval = setInterval(() => {
    saveGame();
  }, intervalMs);
}

export function stopAutoSave() {
  if (autoSaveInterval) {
    clearInterval(autoSaveInterval);
    autoSaveInterval = null;
  }
}

function checkWorldBossReset() {
  const state = getState();
  const now = Date.now();
  const lastReset = state.worldBossLastReset || now;
  
  const lastResetDate = new Date(lastReset);
  const nowDate = new Date(now);
  
  if (lastResetDate.toDateString() !== nowDate.toDateString()) {
    state.worldBossChallengeCount = 0;
    state.worldBossLastReset = now;
    state.worldBossActive = [];
  }
}

export function getSaveInfo() {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    const saveData = JSON.parse(data);
    return {
      timestamp: saveData.timestamp,
      date: new Date(saveData.timestamp).toLocaleString('zh-CN'),
      stage: saveData.state?.currentStage,
      kills: saveData.state?.monstersKilled
    };
  } catch {
    return null;
  }
}
