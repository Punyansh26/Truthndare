import { useCallback, useRef } from 'react';
import { useGame } from '../context/GameContext';

export function useGameState() {
  const { state, dispatch } = useGame();

  const addPlayer = useCallback((name, emoji) => {
    dispatch({ type: 'ADD_PLAYER', payload: { name, emoji } });
  }, [dispatch]);

  const removePlayer = useCallback((id) => {
    dispatch({ type: 'REMOVE_PLAYER', payload: id });
  }, [dispatch]);

  const reorderPlayers = useCallback((players) => {
    dispatch({ type: 'REORDER_PLAYERS', payload: players });
  }, [dispatch]);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, [dispatch]);

  const selectPlayer = useCallback((playerIndex, isWildcard = false, wildcardQuestion = null) => {
    dispatch({ type: 'SELECT_PLAYER', payload: { playerIndex, isWildcard, wildcardQuestion } });
  }, [dispatch]);

  const selectCategory = useCallback((type) => {
    dispatch({ type: 'SELECT_CATEGORY', payload: type });
  }, [dispatch]);

  const dealQuestion = useCallback((question) => {
    dispatch({ type: 'DEAL_QUESTION', payload: question });
  }, [dispatch]);

  const completeTurn = useCallback(() => {
    dispatch({ type: 'COMPLETE_TURN' });
  }, [dispatch]);

  const skipTurn = useCallback(() => {
    dispatch({ type: 'SKIP_TURN' });
  }, [dispatch]);

  const rerollQuestion = useCallback(() => {
    dispatch({ type: 'REROLL_QUESTION' });
  }, [dispatch]);

  const updateSettings = useCallback((settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, [dispatch]);

  const toggleSettings = useCallback(() => {
    dispatch({ type: 'TOGGLE_SETTINGS' });
  }, [dispatch]);

  const addCustomQuestion = useCallback((q) => {
    dispatch({ type: 'ADD_CUSTOM_QUESTION', payload: q });
  }, [dispatch]);

  const endGame = useCallback(() => {
    dispatch({ type: 'END_GAME' });
  }, [dispatch]);

  const playAgain = useCallback(() => {
    dispatch({ type: 'PLAY_AGAIN' });
  }, [dispatch]);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, [dispatch]);

  const startHotSeat = useCallback(() => {
    dispatch({ type: 'START_HOT_SEAT' });
  }, [dispatch]);

  const nextTurn = useCallback(() => {
    dispatch({ type: 'SPIN_WHEEL' });
  }, [dispatch]);

  return {
    state,
    addPlayer,
    removePlayer,
    reorderPlayers,
    startGame,
    selectPlayer,
    selectCategory,
    dealQuestion,
    completeTurn,
    skipTurn,
    rerollQuestion,
    updateSettings,
    toggleSettings,
    addCustomQuestion,
    endGame,
    playAgain,
    resetGame,
    startHotSeat,
    nextTurn,
  };
}
