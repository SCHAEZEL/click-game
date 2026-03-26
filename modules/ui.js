// ui.js - 弹窗/动画/特效
import { QUALITY_COLORS, QUALITY_NAMES, MONSTER_CONFIG } from './config.js';
import { getState } from './state.js';
import { getCharacterEmoji, getCharacterInfo, setAnimal, setProfession } from './character.js';
import { getEquipmentStats, equipItem } from './equipment.js';
import { getAttackInfo } from './click.js';

let uiElements = {};

export function initUI() {
  uiElements = {
    gameArea: document.getElementById('game-area'),
    stageProgress: document.getElementById('stage-progress'),
    stageText: document.getElementById('stage-text'),
    monsterCount: document.getElementById('monster-count'),
    characterArea: document.getElementById('character-area'),
    characterEmoji: document.getElementById('character-emoji'),
    statsArea: document.getElementById('stats-area'),
    clickCount: document.getElementById('click-count'),
    damageDisplay: document.getElementById('damage-display'),
    worldBossTimer: document.getElementById('world-boss-timer'),
    equipmentSlots: document.getElementById('equipment-slots'),
    inventoryGrid: document.getElementById('inventory-grid'),
    monsterDisplay: document.getElementById('monster-display'),
    mapPath: document.getElementById('map-path')
  };
}

export function updateStageUI(progress) {
  const stageProgress = document.getElementById('stage-progress');
  const progressText = document.getElementById('progress-text');
  
  if (stageProgress) {
    stageProgress.style.width = `${(progress.mapSteps / progress.totalNodes) * 100}%`;
  }
  if (progressText) {
    progressText.textContent = `${Math.floor((progress.mapSteps / progress.totalNodes) * 100)}%`;
  }
  if (uiElements.stageText) {
    uiElements.stageText.textContent = `第${progress.stage}关`;
  }
  if (uiElements.monsterCount) {
    uiElements.monsterCount.textContent = `怪物: ${progress.monstersInStage}/${progress.totalMonsters}`;
  }
}

export function updateCharacterUI() {
  const info = getCharacterInfo();
  const emoji = getCharacterEmoji(info.animal, info.profession);
  
  if (uiElements.characterEmoji) {
    uiElements.characterEmoji.textContent = emoji;
  }
  
  if (uiElements.characterArea) {
    const profBadge = document.createElement('span');
    profBadge.className = 'prof-badge';
    profBadge.textContent = info.professionName;
    uiElements.characterArea.querySelector('.prof-name')?.remove();
    uiElements.characterArea.appendChild(profBadge);
  }
}

export function updateStatsUI() {
  const state = getState();
  const stats = getEquipmentStats();
  
  if (uiElements.clickCount) {
    uiElements.clickCount.textContent = `点击: ${state.totalClicks.toLocaleString()}`;
  }
  
  const clickCountEl = document.getElementById('click-count');
  const totalDamageEl = document.getElementById('total-damage');
  const killCountEl = document.getElementById('kill-count');
  
  if (clickCountEl) clickCountEl.textContent = state.totalClicks.toLocaleString();
  if (totalDamageEl) totalDamageEl.textContent = state.totalDamage.toLocaleString();
  if (killCountEl) killCountEl.textContent = state.monstersKilled.toLocaleString();
  
  if (uiElements.damageDisplay) {
    const attackInfo = getAttackInfo();
    uiElements.damageDisplay.innerHTML = `
      <div>攻击力: ${attackInfo.baseAtk}</div>
      <div>暴击率: ${attackInfo.critRate}%</div>
      <div>攻速: ${attackInfo.spd}x</div>
    `;
  }
}

export function updateMonsterUI(monster) {
  if (!uiElements.monsterDisplay || !monster) return;
  
  const config = MONSTER_CONFIG[monster.type];
  const scale = config.scale || 1;
  const border = config.border || 'none';
  const color = config.color;
  
  uiElements.monsterDisplay.innerHTML = `
    <div class="monster ${monster.type}" style="transform: scale(${scale}); border: ${border};">
      <div class="monster-name" style="color: ${color}">${monster.name}</div>
      <div class="monster-hp-bar">
        <div class="monster-hp-fill" style="width: ${(monster.hp / monster.maxHp) * 100}%"></div>
      </div>
      <div class="monster-hp-text">${monster.hp} / ${monster.maxHp}</div>
      <div class="monster-level">Lv.${monster.level}</div>
    </div>
  `;
  
  if (config.pulse) {
    uiElements.monsterDisplay.querySelector('.monster').classList.add('pulse-purple');
  }
}

export function showDropAnimation(equipment) {
  const dropOverlay = document.createElement('div');
  dropOverlay.className = 'drop-animation';
  dropOverlay.style.borderColor = equipment.color;
  dropOverlay.innerHTML = `
    <div class="drop-item" style="border-color: ${equipment.color}; box-shadow: 0 0 20px ${equipment.color};">
      <div class="drop-quality" style="color: ${equipment.color}">${QUALITY_NAMES[equipment.quality]}</div>
      <div class="drop-name">${equipment.name}</div>
      <div class="drop-slot">${equipment.slotName}</div>
    </div>
  `;
  
  document.body.appendChild(dropOverlay);
  
  setTimeout(() => {
    dropOverlay.classList.add('show');
  }, 50);
  
  setTimeout(() => {
    dropOverlay.classList.remove('show');
    setTimeout(() => dropOverlay.remove(), 300);
  }, 2000);
}

export function showSetBonusAnimation(setInfo) {
  const overlay = document.createElement('div');
  overlay.className = 'set-bonus-animation';
  overlay.innerHTML = `
    <div class="set-bonus-content">
      <div class="set-bonus-title">套装激活!</div>
      <div class="set-bonus-name">${setInfo.name}</div>
      <div class="set-bonus-stats">
        ${Object.entries(setInfo.stats).map(([k, v]) => `<div>${k}: +${v}</div>`).join('')}
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  setTimeout(() => overlay.classList.add('show'), 50);
  setTimeout(() => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 500);
  }, 3000);
}

export function showDamageNumber(damage, isCrit = false) {
  const display = document.createElement('div');
  display.className = `damage-number ${isCrit ? 'crit' : ''}`;
  display.textContent = damage;
  display.style.left = `${300 + Math.random() * 100}px`;
  display.style.top = `${200 + Math.random() * 50}px`;
  
  document.body.appendChild(display);
  setTimeout(() => display.remove(), 800);
}

export function updateWorldBossTimer(nextRefresh) {
  if (!uiElements.worldBossTimer) return;
  
  const update = () => {
    const now = Date.now();
    const diff = nextRefresh - now;
    
    if (diff <= 0) {
      uiElements.worldBossTimer.textContent = '世界BOSS已刷新!';
      return;
    }
    
    const hours = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    
    uiElements.worldBossTimer.textContent = `世界BOSS: ${hours}h ${mins}m ${secs}s`;
  };
  
  update();
  setInterval(update, 1000);
}

export function showEquipmentDetail(equipment) {
  closeAllModals();
  
  const modal = document.createElement('div');
  modal.className = 'modal equipment-modal';
  modal.innerHTML = `
    <div class="modal-content" style="border-color: ${equipment.color}">
      <button class="modal-close">&times;</button>
      <div class="equip-header" style="color: ${equipment.color}">${equipment.name}</div>
      <div class="equip-quality">${QUALITY_NAMES[equipment.quality]}</div>
      <div class="equip-slot">部位: ${equipment.slotName}</div>
      <div class="equip-level">等级: ${equipment.level}</div>
      <div class="equip-stats">
        ${Object.entries(equipment.stats).map(([k, v]) => `<div>${k}: ${v}</div>`).join('')}
      </div>
      ${equipment.set ? `<div class="equip-set">套装: ${equipment.set.name}</div>` : ''}
      <div class="equip-actions">
        <button class="btn-equip">穿戴</button>
        <button class="btn-close">关闭</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.querySelector('.btn-equip')?.addEventListener('click', () => {
    equipItem(equipment);
    closeAllModals();
    window.gameBus?.dispatchEvent(new CustomEvent('equipmentChanged'));
  });
  modal.querySelector('.btn-close, .modal-close').addEventListener('click', closeAllModals);
  setTimeout(() => modal.classList.add('show'), 50);
}

export function showSkinModal() {
  closeAllModals();
  const info = getCharacterInfo();
  
  const modal = document.createElement('div');
  modal.className = 'modal skin-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="skin-title">换肤</div>
      <div class="skin-section">
        <div class="skin-section-title">动物</div>
        <div class="skin-options animal-options">
          ${info.allAnimals.map(a => `
            <div class="skin-option ${info.unlockedAnimals.includes(a) ? 'unlocked' : 'locked'}" data-animal="${a}">
              <div class="skin-emoji">${getSkinEmoji(a, info.profession)}</div>
              <div class="skin-name">${a === info.animal ? '✓ ' : ''}${a}</div>
              ${!info.unlockedAnimals.includes(a) ? '<div class="skin-locked">🔒</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
      <div class="skin-section">
        <div class="skin-section-title">职业</div>
        <div class="skin-options profession-options">
          ${info.allProfessions.map(p => `
            <div class="skin-option ${info.unlockedProfessions.includes(p) ? 'unlocked' : 'locked'}" data-profession="${p}">
              <div class="skin-emoji">${getSkinEmoji(info.animal, p)}</div>
              <div class="skin-name">${p === info.profession ? '✓ ' : ''}${p}</div>
              ${!info.unlockedProfessions.includes(p) ? '<div class="skin-locked">🔒</div>' : ''}
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelectorAll('.skin-option.unlocked').forEach(el => {
    el.addEventListener('click', () => {
      if (el.dataset.animal) {
        setAnimal(el.dataset.animal);
      }
      if (el.dataset.profession) {
        setProfession(el.dataset.profession);
      }
      updateCharacterUI();
      closeAllModals();
    });
  });
  
  modal.querySelector('.modal-close').addEventListener('click', closeAllModals);
  setTimeout(() => modal.classList.add('show'), 50);
}

function getSkinEmoji(animal, profession) {
  return getCharacterEmoji(animal, profession);
}

export function showMonsterGuide() {
  closeAllModals();
  
  const modal = document.createElement('div');
  modal.className = 'modal guide-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <div class="guide-title">怪物图鉴</div>
      <div class="guide-list">
        <div class="guide-item">
          <div class="guide-name" style="color: #9ca3af">小怪</div>
          <div>每节点100%刷新</div>
          <div>HP倍率: ×1</div>
          <div>掉率倍率: ×1</div>
        </div>
        <div class="guide-item">
          <div class="guide-name" style="color: #fbbf24">精英怪</div>
          <div>每20小怪随机1只</div>
          <div>HP倍率: ×5</div>
          <div>掉率倍率: ×3</div>
        </div>
        <div class="guide-item">
          <div class="guide-name" style="color: #ef4444">普通BOSS</div>
          <div>关卡终点</div>
          <div>HP倍率: ×20</div>
          <div>掉率倍率: ×10</div>
        </div>
        <div class="guide-item">
          <div class="guide-name" style="color: #a855f7">世界BOSS</div>
          <div>每日08:00/20:00刷新</div>
          <div>HP倍率: ×100</div>
          <div>掉率倍率: ×50 (保底紫装)</div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.querySelector('.modal-close').addEventListener('click', closeAllModals);
  setTimeout(() => modal.classList.add('show'), 50);
}

export function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.classList.remove('show');
    setTimeout(() => m.remove(), 300);
  });
}

export function updateInventoryUI() {
  const state = getState();
  if (!uiElements.inventoryGrid) return;
  
  uiElements.inventoryGrid.innerHTML = state.inventory.map(item => `
    <div class="inventory-slot" data-id="${item.id}" style="border-color: ${item.color}">
      <div class="inv-quality" style="background: ${item.color}"></div>
      <div class="inv-name">${item.name}</div>
    </div>
  `).join('');
  
  uiElements.inventoryGrid.querySelectorAll('.inventory-slot').forEach(slot => {
    slot.addEventListener('click', () => {
      const id = slot.dataset.id;
      const item = state.inventory.find(i => i.id === id);
      if (item) showEquipmentDetail(item);
    });
  });
  
  const invCount = document.getElementById('inventory-count');
  if (invCount) {
    invCount.textContent = `${state.inventory.length}/${state.maxInventorySize}`;
  }
}

export function initMapUI() {
  const mapPath = document.getElementById('map-path');
  if (!mapPath) return;
  
  let html = '';
  for (let i = 0; i < 21; i++) {
    html += `<div class="map-node" data-index="${i}"></div>`;
    if (i < 20) html += `<div class="map-line"></div>`;
  }
  mapPath.innerHTML = html;
}

export function updateMapUI(steps) {
  const nodes = document.querySelectorAll('.map-node');
  nodes.forEach((node, i) => {
    node.classList.remove('active', 'visited', 'boss');
    if (i < steps) {
      node.classList.add('visited');
    } else if (i === steps) {
      node.classList.add('active');
    }
    if (i === 20) {
      node.classList.add('boss');
    }
  });
}
  const state = getState();
  if (!uiElements.equipmentSlots) return;
  
  const slots = ['weapon', 'helmet', 'chest', 'legs', 'gloves', 'ring1', 'ring2', 'earring1', 'earring2', 'headwear'];
  
  uiElements.equipmentSlots.innerHTML = slots.map(slot => {
    const item = state.equipped[slot];
    return `
      <div class="equip-slot" data-slot="${slot}" style="${item ? `border-color: ${item.color}` : ''}">
        ${item ? `<div class="slot-item" style="color: ${item.color}">${item.slotName}</div>` : `<div class="slot-empty">${slot}</div>`}
      </div>
    `;
  }).join('');
}
