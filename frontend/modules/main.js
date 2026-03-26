// main.js - 入口，初始化游戏
import { initUI, updateStageUI, updateCharacterUI, updateStatsUI, updateMonsterUI, showDropAnimation, showSetBonusAnimation, showDamageNumber, updateWorldBossTimer, updateInventoryUI, updateEquipmentSlotsUI, showSkinModal, showMonsterGuide, initMapUI, updateMapUI } from './ui.js';
import { handleClick } from './click.js';
import { getCurrentMonster, spawnMonster } from './monster.js';
import { getStageProgress } from './map.js';
import { loadGame, saveGame, startAutoSave } from './save.js';
import { WORLD_BOSS_REFRESH_HOURS } from './config.js';
import { checkSetBonus, getEquipmentStats } from './equipment.js';

window.gameBus = new EventTarget();

let gameLoop = null;
let isPaused = false;

export function initGame() {
  loadGame();
  
  initUI();
  initMapUI();
  setupEventListeners();
  setupGameBusListeners();
  
  const progress = getStageProgress();
  updateStageUI(progress);
  updateCharacterUI();
  updateStatsUI();
  updateEquipmentSlotsUI();
  updateMapUI(progress.mapSteps);
  
  const monster = getCurrentMonster();
  if (monster) {
    updateMonsterUI(monster);
  } else {
    spawnMonster();
  }
  
  updateWorldBossTimer(calcNextWorldBoss());
  
  startAutoSave(10000);
  
  startGameLoop();
  
  console.log('迷宫猎手初始化完成!');
}

function setupEventListeners() {
  const gameArea = document.getElementById('game-area');
  
  gameArea?.addEventListener('click', (e) => {
    if (isPaused) return;
    
    const result = handleClick();
    updateStatsUI();
    
    if (result.damage > 0) {
      showDamageNumber(result.damage, false);
      const monster = getCurrentMonster();
      if (monster) updateMonsterUI(monster);
    }
    
    if (result.killed && result.drop) {
      showDropAnimation(result.drop);
      updateInventoryUI();
    }
    
    const progress = getStageProgress();
    updateStageUI(progress);
    updateMapUI(progress.mapSteps);
  });
  
  document.addEventListener('keydown', (e) => {
    if (isPaused || e.repeat) return;
    
    const result = handleClick();
    updateStatsUI();
    
    if (result.damage > 0) {
      showDamageNumber(result.damage, false);
      const monster = getCurrentMonster();
      if (monster) updateMonsterUI(monster);
    }
    
    if (result.killed && result.drop) {
      showDropAnimation(result.drop);
      updateInventoryUI();
    }
    
    const progress = getStageProgress();
    updateStageUI(progress);
    updateMapUI(progress.mapSteps);
  });
  
  document.getElementById('btn-skin')?.addEventListener('click', () => {
    showSkinModal();
  });
  
  document.getElementById('btn-guide')?.addEventListener('click', () => {
    showMonsterGuide();
  });
}

function setupGameBusListeners() {
  window.gameBus.addEventListener('monsterSpawn', (e) => {
    updateMonsterUI(e.detail);
  });
  
  window.gameBus.addEventListener('monsterKilled', (e) => {
    updateMonsterUI(null);
    spawnMonster();
  });
  
  window.gameBus.addEventListener('mapUpdated', (e) => {
    updateMapUI(e.detail.steps);
  });
  
  window.gameBus.addEventListener('stageComplete', (e) => {
    console.log(`通关第${e.detail.oldStage}关! 进入第${e.detail.newStage}关`);
  });
  
  window.gameBus.addEventListener('equipmentChanged', () => {
    updateEquipmentSlotsUI();
    updateStatsUI();
  });
  
  window.gameBus.addEventListener('setBonusActivated', (e) => {
    e.detail.forEach(set => showSetBonusAnimation(set));
  });
}

function startGameLoop() {
  gameLoop = setInterval(() => {
    if (isPaused) return;
    
    const progress = getStageProgress();
    updateStageUI(progress);
  }, 500);
}

function calcNextWorldBoss() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  for (const hour of WORLD_BOSS_REFRESH_HOURS) {
    const refresh = new Date(today.getTime() + hour * 3600000);
    if (refresh > now) return refresh.getTime();
  }
  
  const tomorrow = new Date(today.getTime() + 24 * 3600000);
  return tomorrow.getTime() + WORLD_BOSS_REFRESH_HOURS[0] * 3600000;
}

export function pauseGame() {
  isPaused = true;
}

export function resumeGame() {
  isPaused = false;
}

export function destroyGame() {
  if (gameLoop) {
    clearInterval(gameLoop);
    gameLoop = null;
  }
  saveGame();
}

window.addEventListener('beforeunload', () => {
  destroyGame();
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}
