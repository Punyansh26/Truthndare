import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { useSpinWheel } from '../../hooks/useSpinWheel';
import { useTimer } from '../../hooks/useTimer';
import { useSound } from '../../hooks/useSound';
import { useConfetti } from '../../hooks/useConfetti';
import { getRandomQuestion, rollWildcard } from '../../utils/randomizer';
import { PHASES, GAME_CONFIG } from '../../constants/gameConfig';
import SpinWheel from './SpinWheel';
import QuestionCard from './QuestionCard';
import PlayerHUD from './PlayerHUD';
import TurnBanner from './TurnBanner';
import TimerRing from './TimerRing';
import NeonButton from '../ui/NeonButton';

// Group dare for wildcard
const WILDCARD_DARE = {
  id: 'WILDCARD',
  text: "GROUP DARE! Everyone must do this: Stand up, do a synchronized silly dance for 15 seconds. No sitting down allowed! 💃🕺",
  category: 'wild',
  difficulty: 'wild',
  tags: ['group'],
};

export default function GameBoard() {
  const {
    state, selectPlayer, selectCategory, dealQuestion,
    completeTurn, skipTurn, rerollQuestion, endGame, toggleSettings, startHotSeat, nextTurn,
  } = useGameState();

  const {
    players, currentPlayerIndex, currentQuestion, currentType,
    phase, settings, usedQuestionIds, customQuestions, rerollsUsed,
    hotSeatRemaining, isWildcard, round,
  } = state;

  const currentPlayer = currentPlayerIndex !== null ? players[currentPlayerIndex] : null;
  const sound = useSound(settings.soundOn);
  const confetti = useConfetti();
  const { isSpinning, rotation, spin, reset: resetWheel } = useSpinWheel(players.length);

  // Timer
  const handleTimerEnd = useCallback(() => {
    sound.playBuzzer();
  }, [sound]);

  const timer = useTimer(settings.timerDuration, handleTimerEnd);

  // Handle spin
  const handleSpin = async () => {
    if (isSpinning) return;
    sound.playSpinStart();

    // Check for wildcard
    const isWild = rollWildcard();

    const idx = await spin();
    if (idx !== null) {
      sound.playSpinStop();
      setTimeout(() => {
        selectPlayer(idx, isWild, isWild ? WILDCARD_DARE : null);
        if (isWild) {
          // Auto-deal the wildcard question
          dealQuestion(WILDCARD_DARE);
          if (settings.timerEnabled) timer.start();
        }
      }, 500);
    }
  };

  // Handle truth/dare selection
  const handleSelectType = (type) => {
    if (type === 'truth') sound.playTruthSelect();
    else sound.playDareSelect();

    selectCategory(type);
  };

  // Deal question when type is selected
  useEffect(() => {
    if (phase === PHASES.QUESTION && currentType && !currentQuestion && !isWildcard) {
      const q = getRandomQuestion(currentType, settings.mode, usedQuestionIds, customQuestions);
      if (q) {
        dealQuestion(q);
        if (settings.timerEnabled) timer.start();
      }
    }
  }, [phase, currentType, currentQuestion, isWildcard]);

  // Handle reroll — need to deal new question
  useEffect(() => {
    if (phase === PHASES.QUESTION && currentType && !currentQuestion && !isWildcard) {
      const q = getRandomQuestion(currentType, settings.mode, usedQuestionIds, customQuestions);
      if (q) {
        dealQuestion(q);
        if (settings.timerEnabled) timer.reset(), timer.start();
      }
    }
  }, [currentQuestion]);

  // Handle done
  const handleDone = () => {
    sound.playDone();
    timer.stop();
    confetti.fire(currentPlayer ? [currentPlayer.color, '#FFD700', '#00FF88'] : undefined);
    completeTurn();
  };

  // Handle skip
  const handleSkip = () => {
    if (!currentPlayer || currentPlayer.skipsRemaining <= 0) return;
    sound.playSkip();
    timer.stop();
    skipTurn();
  };

  // Handle reroll
  const handleReroll = () => {
    const pid = currentPlayer?.id;
    if (!pid || (rerollsUsed[pid] || 0) <= 0) return;
    sound.playClick();
    timer.stop();
    rerollQuestion();
  };

  // After result phase, auto-move back to spinning
  const handleNextTurn = () => {
    resetWheel();
    nextTurn();
    sound.playClick();
  };

  // Timer tick sound
  useEffect(() => {
    if (timer.isRunning && timer.timeLeft <= 10 && timer.timeLeft > 0) {
      sound.playTimerTick();
    }
  }, [timer.timeLeft, timer.isRunning]);

  const canSkip = currentPlayer && currentPlayer.skipsRemaining > 0;
  const canReroll = currentPlayer && (rerollsUsed[currentPlayer.id] || 0) > 0;

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-lg mx-auto px-4 py-4 min-h-screen">
      {/* Top bar */}
      <div className="w-full flex items-center justify-between">
        <span className="font-mono text-textMuted text-sm">Round {round + 1}</span>
        <div className="flex items-center gap-2">
          {hotSeatRemaining > 0 && (
            <span className="text-neonPink font-display text-sm animate-pulse">
              🔥 Hot Seat: {hotSeatRemaining} left
            </span>
          )}
          <button
            onClick={toggleSettings}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-white/10 text-textMuted hover:text-textPrimary hover:border-neonPurple/50 transition-colors cursor-pointer"
            aria-label="Settings"
          >
            ⚙️
          </button>
          <button
            onClick={endGame}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-white/10 text-textMuted hover:text-neonPink hover:border-neonPink/50 transition-colors cursor-pointer"
            aria-label="End game"
          >
            🏁
          </button>
        </div>
      </div>

      {/* Player HUD */}
      <PlayerHUD players={players} currentPlayerIndex={currentPlayerIndex} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full py-4">
        <AnimatePresence mode="wait">
          {/* SPINNING — Show wheel with SPIN button */}
          {phase === PHASES.SPINNING && (
            <motion.div
              key="spinning"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <SpinWheel
                players={players}
                rotation={rotation}
                isSpinning={isSpinning}
              />

              <NeonButton
                onClick={handleSpin}
                color="#FFD700"
                size="xl"
                disabled={isSpinning}
                id="spin-btn"
                className="animate-bounce-slow"
              >
                {isSpinning ? '🎰 Spinning...' : '🎡 SPIN!'}
              </NeonButton>
            </motion.div>
          )}

          {/* RESULT — Show wheel with score + Next Turn */}
          {phase === PHASES.RESULT && (
            <motion.div
              key="result"
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <SpinWheel
                players={players}
                rotation={rotation}
                isSpinning={false}
              />

              <div className="flex flex-col items-center gap-3">
                <motion.p
                  className="font-display text-lg text-neonGold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                >
                  {currentPlayer?.emoji} {currentPlayer?.name} scored!
                </motion.p>
                <NeonButton onClick={handleNextTurn} color="#00F5FF" size="lg" id="next-turn-btn">
                  Next Turn →
                </NeonButton>
                {settings.hotSeatMode && hotSeatRemaining === 0 && (
                  <NeonButton
                    onClick={() => startHotSeat()}
                    color="#FF2D78"
                    size="sm"
                  >
                    🔥 Hot Seat Mode
                  </NeonButton>
                )}
              </div>
            </motion.div>
          )}

          {/* CHOOSING — Truth or Dare buttons */}
          {phase === PHASES.CHOOSING && currentPlayer && (
            <motion.div
              key="choosing"
              className="flex flex-col items-center gap-6 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <TurnBanner player={currentPlayer} isWildcard={false} />

              <div className="flex gap-4 w-full max-w-xs">
                <motion.button
                  onClick={() => handleSelectType('truth')}
                  className="flex-1 py-8 rounded-2xl font-display text-2xl cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, #9D00FF15, #9D00FF30)',
                    border: '2px solid #9D00FF60',
                    color: '#9D00FF',
                    boxShadow: '0 0 25px #9D00FF20',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px #9D00FF40' }}
                  whileTap={{ scale: 0.92 }}
                  id="truth-btn"
                >
                  <div className="text-4xl mb-2">💬</div>
                  Truth
                </motion.button>

                <motion.button
                  onClick={() => handleSelectType('dare')}
                  className="flex-1 py-8 rounded-2xl font-display text-2xl cursor-pointer"
                  style={{
                    background: 'linear-gradient(145deg, #FF2D7815, #FF2D7830)',
                    border: '2px solid #FF2D7860',
                    color: '#FF2D78',
                    boxShadow: '0 0 25px #FF2D7820',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 0 40px #FF2D7840' }}
                  whileTap={{ scale: 0.92 }}
                  id="dare-btn"
                >
                  <div className="text-4xl mb-2">🔥</div>
                  Dare
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* QUESTION — Show the question card */}
          {phase === PHASES.QUESTION && currentQuestion && (
            <motion.div
              key="question"
              className="flex flex-col items-center gap-4 w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <TurnBanner player={currentPlayer} isWildcard={isWildcard} />

              {/* Timer */}
              {settings.timerEnabled && (
                <TimerRing
                  timeLeft={timer.timeLeft}
                  duration={settings.timerDuration}
                  isRunning={timer.isRunning}
                  playerColor={currentPlayer?.color}
                />
              )}

              <QuestionCard
                question={currentQuestion}
                type={currentType}
                onDone={handleDone}
                onSkip={handleSkip}
                onReroll={handleReroll}
                canSkip={canSkip}
                canReroll={canReroll}
                playerColor={currentPlayer?.color || '#9D00FF'}
              />

              {/* Skip/reroll info */}
              <div className="flex gap-4 text-xs font-body text-textMuted">
                <span>Skips: {currentPlayer?.skipsRemaining || 0}</span>
                <span>Rerolls: {rerollsUsed[currentPlayer?.id] || 0}</span>
              </div>

              {settings.drinkingMode && (
                <motion.div
                  className="text-center p-2 rounded-lg bg-neonPink/10 border border-neonPink/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <span className="text-neonPink font-display text-sm">
                    🍻 Drinking modifier: Take a sip!
                  </span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
