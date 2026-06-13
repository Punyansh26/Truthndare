import truths from '../data/truths';
import dares from '../data/dares';

/**
 * Get a random question that hasn't been used yet,
 * filtered by type (truth/dare), difficulty mode, and used IDs.
 */
export function getRandomQuestion(type, mode, usedIds, customQuestions = []) {
  const pool = type === 'truth' ? [...truths] : [...dares];

  // Add custom questions
  const customOfType = customQuestions.filter(q =>
    type === 'truth' ? q.id.startsWith('CT') : q.id.startsWith('CD')
  );
  pool.push(...customOfType);

  // Filter by allowed difficulties based on mode
  const allowedDifficulties = getAllowedDifficulties(mode);
  const filtered = pool.filter(
    q => allowedDifficulties.includes(q.difficulty) && !usedIds.has(q.id)
  );

  if (filtered.length === 0) {
    // If all used, reset and pick from full pool
    const resetFiltered = pool.filter(q => allowedDifficulties.includes(q.difficulty));
    if (resetFiltered.length === 0) return null;
    return resetFiltered[Math.floor(Math.random() * resetFiltered.length)];
  }

  return filtered[Math.floor(Math.random() * filtered.length)];
}

function getAllowedDifficulties(mode) {
  switch (mode) {
    case 'mild': return ['mild'];
    case 'spicy': return ['mild', 'spicy'];
    case 'wild': return ['mild', 'spicy', 'wild'];
    default: return ['mild', 'spicy'];
  }
}

/**
 * Check for wildcard (5% chance)
 */
export function rollWildcard() {
  return Math.random() < 0.05;
}

/**
 * Shuffle array (Fisher-Yates)
 */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Pick a random item from array
 */
export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
