// character.js - 角色形象/换肤
import { getState, updateState } from './state.js';
import { ANIMALS, ANIMAL_NAMES, PROFESSIONS, PROFESSION_NAMES } from './config.js';

export function setAnimal(animal) {
  const state = getState();
  if (state.unlockedAnimals.includes(animal)) {
    updateState('player.animal', animal);
    return true;
  }
  return false;
}

export function setProfession(profession) {
  const state = getState();
  if (state.unlockedProfessions.includes(profession)) {
    updateState('player.profession', profession);
    return true;
  }
  return false;
}

export function unlockAnimal(animal) {
  const state = getState();
  if (!state.unlockedAnimals.includes(animal)) {
    state.unlockedAnimals.push(animal);
  }
}

export function unlockProfession(profession) {
  const state = getState();
  if (!state.unlockedProfessions.includes(profession)) {
    state.unlockedProfessions.push(profession);
  }
}

export function addFragment(type, id) {
  const state = getState();
  const key = `${type}_${id}`;
  state.fragments[key] = (state.fragments[key] || 0) + 1;
  
  if (state.fragments[key] >= 10) {
    if (ANIMALS.includes(id)) {
      unlockAnimal(id);
      state.fragments[key] = 0;
      window.gameBus?.dispatchEvent(new CustomEvent('unlockAnimal', { detail: { animal: id } }));
      return { unlocked: true, type: 'animal', id };
    }
    if (PROFESSIONS.includes(id)) {
      unlockProfession(id);
      state.fragments[key] = 0;
      window.gameBus?.dispatchEvent(new CustomEvent('unlockProfession', { detail: { profession: id } }));
      return { unlocked: true, type: 'profession', id };
    }
  }
  return { unlocked: false };
}

export function rollFragmentDrop() {
  if (Math.random() < 0.05) {
    const type = Math.random() < 0.5 ? 'animal' : 'profession';
    const ids = type === 'animal' ? ANIMALS : PROFESSIONS;
    const id = ids[Math.floor(Math.random() * ids.length)];
    return addFragment(type, id);
  }
  return null;
}

export function getCharacterInfo() {
  const state = getState();
  return {
    animal: state.player.animal,
    animalName: ANIMAL_NAMES[state.player.animal],
    profession: state.player.profession,
    professionName: PROFESSION_NAMES[state.player.profession],
    unlockedAnimals: state.unlockedAnimals,
    unlockedProfessions: state.unlockedProfessions,
    allAnimals: ANIMALS,
    allProfessions: PROFESSIONS
  };
}

export function getCharacterEmoji(animal, profession) {
  const emojis = {
    dog: { warrior: '🐕⚔️', archer: '🐕🏹', mage: '🐕🔮', rogue: '🐕🗡️' },
    cat: { warrior: '🐱⚔️', archer: '🐱🏹', mage: '🐱🔮', rogue: '🐱🗡️' },
    rabbit: { warrior: '🐰⚔️', archer: '🐰🏹', mage: '🐰🔮', rogue: '🐰🗡️' },
    bird: { warrior: '🐦⚔️', archer: '🐦🏹', mage: '🐦🔮', rogue: '🐦🗡️' }
  };
  return emojis[animal]?.[profession] || '🧑‍🎤';
}
