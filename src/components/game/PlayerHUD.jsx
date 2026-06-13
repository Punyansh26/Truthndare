import { motion } from 'framer-motion';
import ScoreChip from '../ui/ScoreChip';

export default function PlayerHUD({ players, currentPlayerIndex }) {
  return (
    <div className="flex gap-2 flex-wrap justify-center px-2">
      {players.map((player, index) => {
        const isCurrent = index === currentPlayerIndex;
        return (
          <motion.div
            key={player.id}
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full border
              ${isCurrent ? 'border-opacity-100' : 'border-opacity-30 opacity-60'}
              transition-all duration-300
            `}
            style={{
              borderColor: player.color,
              background: isCurrent ? `${player.color}15` : 'transparent',
              boxShadow: isCurrent ? `0 0 15px ${player.color}30` : 'none',
            }}
            animate={isCurrent ? {
              boxShadow: [
                `0 0 15px ${player.color}30`,
                `0 0 25px ${player.color}50`,
                `0 0 15px ${player.color}30`,
              ],
            } : {}}
            transition={isCurrent ? { duration: 2, repeat: Infinity } : {}}
          >
            <span className="text-lg">{player.emoji}</span>
            <span className="font-body text-sm text-textPrimary hidden sm:inline">
              {player.name}
            </span>
            <ScoreChip score={player.score} color={player.color} />
          </motion.div>
        );
      })}
    </div>
  );
}
