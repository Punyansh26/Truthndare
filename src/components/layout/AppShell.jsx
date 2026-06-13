import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { SCREENS } from '../../constants/gameConfig';
import PlayerSetup from '../setup/PlayerSetup';
import GameBoard from '../game/GameBoard';
import Leaderboard from '../results/Leaderboard';
import SettingsPanel from '../settings/SettingsPanel';

export default function AppShell() {
  const { state, toggleSettings } = useGameState();
  const { screen, settingsOpen, questionHistory } = state;
  const [showHistory, setShowHistory] = useState(false);

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="min-h-screen bg-bg text-textPrimary relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neonPurple/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neonPink/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neonCyan/3 rounded-full blur-[100px]" />
      </div>

      {/* Main content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {screen === SCREENS.SETUP && (
            <motion.div
              key="setup"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <PlayerSetup />
            </motion.div>
          )}
          {screen === SCREENS.GAME && (
            <motion.div
              key="game"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <GameBoard />
            </motion.div>
          )}
          {screen === SCREENS.RESULTS && (
            <motion.div
              key="results"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <Leaderboard />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Settings Panel */}
      <SettingsPanel isOpen={settingsOpen} onClose={toggleSettings} />

      {/* Question History Drawer */}
      <AnimatePresence>
        {showHistory && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
            />
            <motion.div
              className="fixed right-0 top-0 h-full w-80 max-w-full bg-surface border-l border-white/10 z-50 p-4 overflow-y-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg text-textPrimary">📜 History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-textMuted hover:text-textPrimary cursor-pointer"
                >
                  ✕
                </button>
              </div>
              {questionHistory.length === 0 ? (
                <p className="text-textMuted font-body text-sm">No questions yet!</p>
              ) : (
                <div className="space-y-3">
                  {[...questionHistory].reverse().map((entry, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-bg/50 border border-white/5"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span>{entry.player?.emoji}</span>
                        <span className="font-body text-sm text-textPrimary">{entry.player?.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          entry.action === 'done'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {entry.action === 'done' ? '✅' : '⏭️'}
                        </span>
                      </div>
                      <p className="text-textMuted text-xs font-body">{entry.question?.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* History FAB (only in game) */}
      {screen === SCREENS.GAME && (
        <motion.button
          className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-xl shadow-lg z-30 cursor-pointer"
          style={{ boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowHistory(true)}
          aria-label="Question history"
        >
          📜
        </motion.button>
      )}
    </div>
  );
}
