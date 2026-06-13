import { EMOJI_OPTIONS } from '../../constants/gameConfig';
import { motion } from 'framer-motion';

export default function AvatarPicker({ selected, onSelect }) {
  return (
    <div className="grid grid-cols-5 gap-2 p-2 max-h-48 overflow-y-auto custom-scrollbar">
      {EMOJI_OPTIONS.map((emoji) => (
        <motion.button
          key={emoji}
          type="button"
          onClick={() => onSelect(emoji)}
          className={`
            w-12 h-12 flex items-center justify-center text-2xl rounded-xl cursor-pointer
            transition-colors min-w-[48px] min-h-[48px]
            ${selected === emoji
              ? 'bg-neonPurple/30 border-2 border-neonPurple shadow-lg shadow-neonPurple/30'
              : 'bg-white/5 border border-white/10 hover:bg-white/10'}
          `}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Select ${emoji} avatar`}
        >
          {emoji}
        </motion.button>
      ))}
    </div>
  );
}
