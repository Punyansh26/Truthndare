import { motion, AnimatePresence } from 'framer-motion';

export default function TurnBanner({ player, isWildcard }) {
  if (!player && !isWildcard) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={player?.id || 'wildcard'}
        className="text-center py-3"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
      >
        {isWildcard ? (
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-neonPink/20 via-neonPurple/20 to-neonCyan/20 border border-neonGold/50"
            animate={{
              boxShadow: [
                '0 0 20px #FFD70030',
                '0 0 40px #FFD70060',
                '0 0 20px #FFD70030',
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-2xl">🃏</span>
            <span className="font-display text-xl text-neonGold">WILDCARD!</span>
            <span className="text-2xl">🃏</span>
          </motion.div>
        ) : (
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
            style={{
              background: `${player.color}15`,
              border: `2px solid ${player.color}40`,
              boxShadow: `0 0 20px ${player.color}20`,
            }}
          >
            <motion.span
              className="text-3xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: 2 }}
            >
              {player.emoji}
            </motion.span>
            <div>
              <p className="font-display text-xl text-textPrimary">{player.name}'s Turn!</p>
              <p className="text-textMuted text-xs font-body">Choose wisely...</p>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
