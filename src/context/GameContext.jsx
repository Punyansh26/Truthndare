import { createContext, useContext, useReducer, useEffect } from 'react';
import { GAME_CONFIG, PLAYER_COLORS, SCREENS, PHASES, MODES } from '../constants/gameConfig';
import { savePlayers, saveSettings, saveCustomQuestions, saveGameState, clearGameState, loadPlayers, loadSettings, loadCustomQuestions } from '../utils/storage';

const GameContext = createContext(null);

const defaultSettings = {
  mode: MODES.SPICY,
  timerEnabled: false,
  timerDuration: GAME_CONFIG.DEFAULT_TIMER,
  skipLimit: GAME_CONFIG.DEFAULT_SKIP_LIMIT,
  soundOn: true,
  hotSeatMode: false,
  drinkingMode: false,
};

function createInitialState() {
  const savedSettings = loadSettings();
  const savedCustom = loadCustomQuestions();

  return {
    screen: SCREENS.SETUP,
    players: [],
    settings: savedSettings || { ...defaultSettings },
    currentPlayerIndex: null,
    currentQuestion: null,
    currentType: null, // 'truth' or 'dare'
    phase: PHASES.SPINNING,
    round: 0,
    usedQuestionIds: new Set(),
    customQuestions: savedCustom,
    questionHistory: [],
    hotSeatRemaining: 0,
    isWildcard: false,
    settingsOpen: false,
    rerollsUsed: {},
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_PLAYER': {
      if (state.players.length >= GAME_CONFIG.MAX_PLAYERS) return state;
      const colorIndex = state.players.length % PLAYER_COLORS.length;
      const newPlayer = {
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: action.payload.name,
        emoji: action.payload.emoji,
        color: PLAYER_COLORS[colorIndex],
        score: 0,
        skipsRemaining: state.settings.skipLimit,
        stats: {
          truthsCompleted: 0,
          daresCompleted: 0,
          skipsUsed: 0,
        },
      };
      const newPlayers = [...state.players, newPlayer];
      return { ...state, players: newPlayers };
    }

    case 'REMOVE_PLAYER': {
      const filtered = state.players.filter(p => p.id !== action.payload);
      // Reassign colors
      const recolored = filtered.map((p, i) => ({
        ...p,
        color: PLAYER_COLORS[i % PLAYER_COLORS.length],
      }));
      return { ...state, players: recolored };
    }

    case 'REORDER_PLAYERS': {
      return { ...state, players: action.payload };
    }

    case 'SET_PLAYERS': {
      return { ...state, players: action.payload };
    }

    case 'START_GAME': {
      // Initialize skips for all players
      const playersWithSkips = state.players.map(p => ({
        ...p,
        score: 0,
        skipsRemaining: state.settings.skipLimit,
        stats: { truthsCompleted: 0, daresCompleted: 0, skipsUsed: 0 },
      }));
      const rerolls = {};
      playersWithSkips.forEach(p => { rerolls[p.id] = GAME_CONFIG.REROLL_TOKENS; });
      return {
        ...state,
        screen: SCREENS.GAME,
        players: playersWithSkips,
        phase: PHASES.SPINNING,
        round: 0,
        currentPlayerIndex: null,
        currentQuestion: null,
        usedQuestionIds: new Set(),
        questionHistory: [],
        rerollsUsed: rerolls,
      };
    }

    case 'SPIN_WHEEL': {
      return {
        ...state,
        phase: PHASES.SPINNING,
        currentQuestion: null,
        currentType: null,
        isWildcard: false,
      };
    }

    case 'SELECT_PLAYER': {
      return {
        ...state,
        currentPlayerIndex: action.payload.playerIndex,
        isWildcard: action.payload.isWildcard || false,
        phase: action.payload.isWildcard ? PHASES.QUESTION : PHASES.CHOOSING,
        currentQuestion: action.payload.isWildcard ? action.payload.wildcardQuestion : null,
        currentType: action.payload.isWildcard ? 'dare' : null,
      };
    }

    case 'SELECT_CATEGORY': {
      return {
        ...state,
        currentType: action.payload, // 'truth' or 'dare'
        phase: PHASES.QUESTION,
      };
    }

    case 'DEAL_QUESTION': {
      const newUsed = new Set(state.usedQuestionIds);
      newUsed.add(action.payload.id);
      return {
        ...state,
        currentQuestion: action.payload,
        usedQuestionIds: newUsed,
      };
    }

    case 'COMPLETE_TURN': {
      const updatedPlayers = state.players.map((p, i) => {
        if (i !== state.currentPlayerIndex) return p;
        return {
          ...p,
          score: p.score + GAME_CONFIG.POINTS.DONE,
          stats: {
            ...p.stats,
            truthsCompleted: p.stats.truthsCompleted + (state.currentType === 'truth' ? 1 : 0),
            daresCompleted: p.stats.daresCompleted + (state.currentType === 'dare' ? 1 : 0),
          },
        };
      });
      const historyEntry = {
        player: state.players[state.currentPlayerIndex],
        question: state.currentQuestion,
        type: state.currentType,
        action: 'done',
        round: state.round,
      };

      // Check for hot seat
      if (state.hotSeatRemaining > 1) {
        return {
          ...state,
          players: updatedPlayers,
          phase: PHASES.CHOOSING,
          currentQuestion: null,
          currentType: null,
          hotSeatRemaining: state.hotSeatRemaining - 1,
          questionHistory: [...state.questionHistory, historyEntry],
        };
      }

      return {
        ...state,
        players: updatedPlayers,
        phase: PHASES.RESULT,
        round: state.round + 1,
        hotSeatRemaining: 0,
        questionHistory: [...state.questionHistory, historyEntry],
      };
    }

    case 'SKIP_TURN': {
      const skipPlayers = state.players.map((p, i) => {
        if (i !== state.currentPlayerIndex) return p;
        return {
          ...p,
          score: p.score + GAME_CONFIG.POINTS.SKIP,
          skipsRemaining: p.skipsRemaining - 1,
          stats: {
            ...p.stats,
            skipsUsed: p.stats.skipsUsed + 1,
          },
        };
      });
      const skipHistory = {
        player: state.players[state.currentPlayerIndex],
        question: state.currentQuestion,
        type: state.currentType,
        action: 'skip',
        round: state.round,
      };

      if (state.hotSeatRemaining > 1) {
        return {
          ...state,
          players: skipPlayers,
          phase: PHASES.CHOOSING,
          currentQuestion: null,
          currentType: null,
          hotSeatRemaining: state.hotSeatRemaining - 1,
          questionHistory: [...state.questionHistory, skipHistory],
        };
      }

      return {
        ...state,
        players: skipPlayers,
        phase: PHASES.RESULT,
        round: state.round + 1,
        hotSeatRemaining: 0,
        questionHistory: [...state.questionHistory, skipHistory],
      };
    }

    case 'REROLL_QUESTION': {
      const pid = state.players[state.currentPlayerIndex]?.id;
      const remaining = (state.rerollsUsed[pid] || 0);
      if (remaining <= 0) return state;
      return {
        ...state,
        rerollsUsed: { ...state.rerollsUsed, [pid]: remaining - 1 },
        currentQuestion: null, // will trigger a re-deal
      };
    }

    case 'START_HOT_SEAT': {
      return {
        ...state,
        hotSeatRemaining: GAME_CONFIG.HOT_SEAT_COUNT,
      };
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = { ...state.settings, ...action.payload };
      return { ...state, settings: newSettings };
    }

    case 'TOGGLE_SETTINGS': {
      return { ...state, settingsOpen: !state.settingsOpen };
    }

    case 'ADD_CUSTOM_QUESTION': {
      const q = action.payload;
      return {
        ...state,
        customQuestions: [...state.customQuestions, q],
      };
    }

    case 'END_GAME': {
      return {
        ...state,
        screen: SCREENS.RESULTS,
        phase: PHASES.RESULT,
      };
    }

    case 'PLAY_AGAIN': {
      // Keep players, reset scores
      const resetPlayers = state.players.map(p => ({
        ...p,
        score: 0,
        skipsRemaining: state.settings.skipLimit,
        stats: { truthsCompleted: 0, daresCompleted: 0, skipsUsed: 0 },
      }));
      const rerolls = {};
      resetPlayers.forEach(p => { rerolls[p.id] = GAME_CONFIG.REROLL_TOKENS; });
      return {
        ...state,
        screen: SCREENS.GAME,
        players: resetPlayers,
        phase: PHASES.SPINNING,
        round: 0,
        currentPlayerIndex: null,
        currentQuestion: null,
        usedQuestionIds: new Set(),
        questionHistory: [],
        rerollsUsed: rerolls,
        hotSeatRemaining: 0,
      };
    }

    case 'RESET_GAME': {
      clearGameState();
      return createInitialState();
    }

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, null, createInitialState);

  // Persist on changes
  useEffect(() => {
    if (state.players.length > 0) {
      savePlayers(state.players);
    }
  }, [state.players]);

  useEffect(() => {
    saveSettings(state.settings);
  }, [state.settings]);

  useEffect(() => {
    saveCustomQuestions(state.customQuestions);
  }, [state.customQuestions]);

  useEffect(() => {
    if (state.screen === SCREENS.GAME) {
      saveGameState(state);
    }
  }, [state.screen, state.phase, state.round, state.currentPlayerIndex]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default GameContext;
