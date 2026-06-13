import { STORAGE_KEYS } from '../constants/gameConfig';

/**
 * Safe JSON parse with fallback
 */
function safeParse(json, fallback = null) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Get item from localStorage
 */
export function getStoredItem(key) {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return safeParse(item);
  } catch {
    return null;
  }
}

/**
 * Set item in localStorage
 */
export function setStoredItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn('Failed to save to localStorage:', key);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStoredItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn('Failed to remove from localStorage:', key);
  }
}

/**
 * Save players to storage
 */
export function savePlayers(players) {
  setStoredItem(STORAGE_KEYS.PLAYERS, players);
}

/**
 * Load players from storage
 */
export function loadPlayers() {
  return getStoredItem(STORAGE_KEYS.PLAYERS) || [];
}

/**
 * Save settings to storage
 */
export function saveSettings(settings) {
  setStoredItem(STORAGE_KEYS.SETTINGS, settings);
}

/**
 * Load settings from storage
 */
export function loadSettings() {
  return getStoredItem(STORAGE_KEYS.SETTINGS);
}

/**
 * Save custom questions
 */
export function saveCustomQuestions(questions) {
  setStoredItem(STORAGE_KEYS.CUSTOM_QUESTIONS, questions);
}

/**
 * Load custom questions
 */
export function loadCustomQuestions() {
  return getStoredItem(STORAGE_KEYS.CUSTOM_QUESTIONS) || [];
}

/**
 * Save game state for resume
 */
export function saveGameState(state) {
  // Convert Set to Array for serialization
  const serializable = {
    ...state,
    usedQuestionIds: [...(state.usedQuestionIds || [])],
  };
  setStoredItem(STORAGE_KEYS.GAME_STATE, serializable);
}

/**
 * Load game state
 */
export function loadGameState() {
  const state = getStoredItem(STORAGE_KEYS.GAME_STATE);
  if (state) {
    state.usedQuestionIds = new Set(state.usedQuestionIds || []);
  }
  return state;
}

/**
 * Clear game state (on game end)
 */
export function clearGameState() {
  removeStoredItem(STORAGE_KEYS.GAME_STATE);
}
