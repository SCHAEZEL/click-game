// map.js - 地图/关卡系统
import { getState, setState, updateState } from './state.js';
import { spawnMonster } from './monster.js';

const STAGE_MONSTERS = 20;
const TOTAL_NODES = 21;

export function getStageProgress() {
  const state = getState();
  const monstersInStage = state.stageMonstersKilled % STAGE_MONSTERS;
  const nodesProgress = Math.floor((state.mapSteps % TOTAL_NODES) / TOTAL_NODES * 100);
  return {
    stage: state.currentStage,
    monstersKilled: state.stageMonstersKilled,
    monstersInStage,
    totalMonsters: STAGE_MONSTERS,
    mapSteps: state.mapSteps % TOTAL_NODES,
    totalNodes: TOTAL_NODES,
    progress: nodesProgress
  };
}

export function advanceMap() {
  const state = getState();
  const newSteps = state.mapSteps + 1;
  const currentStage = state.currentStage;
  
  updateState('mapSteps', newSteps);
  
  if (newSteps % 20 === 0) {
    const monster = spawnMonster();
    window.gameBus?.dispatchEvent(new CustomEvent('mapAdvance', { 
      detail: { steps: newSteps, monster, isBoss: newSteps % (STAGE_MONSTERS * 20) === 0 && newSteps > 0 } 
    }));
    return monster;
  }
  
  window.gameBus?.dispatchEvent(new CustomEvent('mapAdvance', { detail: { steps: newSteps } }));
  return null;
}

export function completeStage() {
  const state = getState();
  const newStage = state.currentStage + 1;
  const newStageKills = state.stageMonstersKilled + 1;
  
  updateState('currentStage', newStage);
  updateState('stageMonstersKilled', newStageKills);
  updateState('stageCompleted', state.stageCompleted + 1);
  
  window.gameBus?.dispatchEvent(new CustomEvent('stageComplete', { 
    detail: { oldStage: state.currentStage, newStage } 
  }));
  
  return newStage;
}

export function killMonster() {
  const state = getState();
  const newKillCount = state.monstersKilled + 1;
  const newStageKills = state.stageMonstersKilled + 1;
  
  updateState('monstersKilled', newKillCount);
  updateState('stageMonstersKilled', newStageKills);
  
  if (newStageKills > 0 && newStageKills % (STAGE_MONSTERS + 1) === 0) {
    completeStage();
  }
  
  return { totalKills: newKillCount, stageKills: newStageKills };
}

export function resetMap() {
  updateState('mapSteps', 0);
  updateState('stageMonstersKilled', 0);
}
