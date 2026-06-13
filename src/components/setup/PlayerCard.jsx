import { motion } from 'framer-motion';
import ScoreChip from '../ui/ScoreChip';

export default function PlayerCard({ player, index, onRemove, isDragging }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={`
        flex items-center gap-3 p-3 rounded-xl border
        ${isDragging ? 'bg-surfaceHover/80 border-neonPurple/50' : 'bg-surface border-white/10'}
        group transition-colors
      `}
      style={{
        boxShadow: isDragging ? `0 0 20px ${player.color}30` : 'none',
      }}
    >
      {/* Drag handle */}
      <div className="text-textMuted cursor-grab active:cursor-grabbing select-none text-lg">
        ⠿
      </div>

      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
        style={{
          background: `${player.color}20`,
          border: `2px solid ${player.color}`,
          boxShadow: `0 0 12px ${player.color}30`,
        }}
      >
        {player.emoji}
      </div>

      {/* Name */}
      <span className="font-body text-textPrimary font-medium flex-1 truncate">
        {player.name}
      </span>

      {/* Color indicator */}
      <div
        className="w-3 h-3 rounded-full flex-shrink-0"
        style={{ backgroundColor: player.color, boxShadow: `0 0 8px ${player.color}` }}
      />

      {/* Remove button */}
      <motion.button
        onClick={() => onRemove(player.id)}
        className="text-textMuted hover:text-neonPink transition-colors opacity-0 group-hover:opacity-100 min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.8 }}
        aria-label={`Remove ${player.name}`}
      >
        ✕
      </motion.button>
    </motion.div>
  );
}
