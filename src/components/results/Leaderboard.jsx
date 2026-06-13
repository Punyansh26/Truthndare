import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { getRankedPlayers, calculateMVPs, getCompletionRate } from '../../utils/scoring';
import NeonButton from '../ui/NeonButton';

const RANK_MEDALS = ['👑', '🥈', '🥉'];

export default function Leaderboard() {
  const { state, playAgain, resetGame } = useGameState();
  const { players } = state;

  const ranked = useMemo(() => getRankedPlayers(players), [players]);
  const mvps = useMemo(() => calculateMVPs(players), [players]);
  const maxScore = useMemo(() => Math.max(...players.map(p => p.score), 1), [players]);

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 py-6 min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.h1
          className="font-display text-4xl text-transparent bg-clip-text bg-gradient-to-r from-neonGold via-neonPink to-neonPurple"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
        >
          🏆 Game Over!
        </motion.h1>
      </div>

      {/* Winner spotlight */}
      {ranked[0] && (
        <motion.div
          className="text-center p-6 rounded-2xl border w-full"
          style={{
            background: `linear-gradient(145deg, ${ranked[0].color}10, ${ranked[0].color}20)`,
            borderColor: `${ranked[0].color}40`,
            boxShadow: `0 0 40px ${ranked[0].color}20`,
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          <motion.div
            className="text-6xl mb-2"
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {ranked[0].emoji}
          </motion.div>
          <h2 className="font-display text-2xl text-textPrimary">{ranked[0].name}</h2>
          <p className="font-mono text-neonGold text-3xl font-bold mt-1">{ranked[0].score} pts</p>
          <p className="text-textMuted text-sm font-body mt-1">👑 Champion</p>
        </motion.div>
      )}

      {/* Rankings */}
      <div className="w-full space-y-2">
        {ranked.map((player, index) => (
          <motion.div
            key={player.id}
            className="flex items-center gap-3 p-3 rounded-xl border bg-surface/50 border-white/5"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1, type: 'spring', damping: 20 }}
          >
            {/* Rank */}
            <span className="text-2xl w-8 text-center">
              {index < 3 ? RANK_MEDALS[index] : `#${index + 1}`}
            </span>

            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: `${player.color}20`,
                border: `2px solid ${player.color}`,
              }}
            >
              {player.emoji}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-body text-textPrimary font-medium truncate">{player.name}</p>
              <div className="flex gap-3 text-xs text-textMuted font-body">
                <span>💬 {player.stats.truthsCompleted}</span>
                <span>🔥 {player.stats.daresCompleted}</span>
                <span>⏭️ {player.stats.skipsUsed}</span>
                <span>{getCompletionRate(player)}% ✅</span>
              </div>
            </div>

            {/* Score */}
            <span className="font-mono font-bold text-lg" style={{ color: player.color }}>
              {player.score}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Score bar chart */}
      <div className="w-full p-4 rounded-xl bg-surface/50 border border-white/5">
        <h3 className="font-display text-sm text-textMuted mb-3">Score Breakdown</h3>
        <div className="space-y-2">
          {ranked.map((player, index) => (
            <div key={player.id} className="flex items-center gap-2">
              <span className="text-sm w-8">{player.emoji}</span>
              <div className="flex-1 bg-white/5 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${player.color}80, ${player.color})`,
                    boxShadow: `0 0 8px ${player.color}40`,
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max((player.score / maxScore) * 100, 2)}%` }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <span className="font-mono text-xs text-textMuted w-10 text-right">{player.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* MVP Awards */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2">
        {mvps.mostDaring && (
          <motion.div
            className="p-3 rounded-xl text-center bg-neonPink/5 border border-neonPink/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <p className="text-2xl">🔥</p>
            <p className="font-display text-xs text-neonPink">Most Daring</p>
            <p className="font-body text-sm text-textPrimary">
              {players.find(p => p.id === mvps.mostDaring)?.name}
            </p>
          </motion.div>
        )}
        {mvps.mostHonest && (
          <motion.div
            className="p-3 rounded-xl text-center bg-neonPurple/5 border border-neonPurple/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            <p className="text-2xl">💬</p>
            <p className="font-display text-xs text-neonPurple">Most Honest</p>
            <p className="font-body text-sm text-textPrimary">
              {players.find(p => p.id === mvps.mostHonest)?.name}
            </p>
          </motion.div>
        )}
        {mvps.biggestSkipper && (
          <motion.div
            className="p-3 rounded-xl text-center bg-neonGold/5 border border-neonGold/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <p className="text-2xl">😅</p>
            <p className="font-display text-xs text-neonGold">Biggest Skipper</p>
            <p className="font-body text-sm text-textPrimary">
              {players.find(p => p.id === mvps.biggestSkipper)?.name}
            </p>
          </motion.div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full">
        <NeonButton onClick={playAgain} color="#00F5FF" className="flex-1" id="play-again-btn">
          🔄 Play Again
        </NeonButton>
        <NeonButton onClick={resetGame} color="#FF2D78" className="flex-1" id="new-game-btn">
          🆕 New Game
        </NeonButton>
      </div>
    </motion.div>
  );
}
