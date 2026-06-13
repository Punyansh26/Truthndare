import { motion } from 'framer-motion';
import { difficultyConfig } from '../../data/categories';
import { useReducedMotion } from 'framer-motion';

export default function QuestionCard({ question, type, onDone, onSkip, onReroll, canSkip, canReroll, playerColor }) {
  const shouldReduceMotion = useReducedMotion();

  if (!question) return null;

  const diff = difficultyConfig[question.difficulty] || difficultyConfig.mild;

  return (
    <div className="perspective-1000 w-full max-w-sm mx-auto">
      <motion.div
        className="relative w-full"
        initial={shouldReduceMotion ? { opacity: 0 } : { rotateY: 180, opacity: 0 }}
        animate={shouldReduceMotion ? { opacity: 1 } : { rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring', damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div
          className="rounded-2xl p-6 border relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #12121E 0%, #1A1A2E 100%)',
            borderColor: playerColor + '40',
            boxShadow: `0 0 30px ${playerColor}20, 0 4px 20px rgba(0,0,0,0.5)`,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Animated neon border */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: `conic-gradient(from var(--angle, 0deg), ${playerColor}00, ${playerColor}60, ${playerColor}00, ${playerColor}60, ${playerColor}00)`,
              padding: '2px',
              mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
              maskComposite: 'xor',
              WebkitMaskComposite: 'xor',
              animation: 'rotate-border 3s linear infinite',
            }}
          />

          {/* Header: Type + Category + Difficulty */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold font-display uppercase tracking-wider"
                style={{
                  background: type === 'truth' ? '#9D00FF30' : '#FF2D7830',
                  color: type === 'truth' ? '#9D00FF' : '#FF2D78',
                  border: `1px solid ${type === 'truth' ? '#9D00FF50' : '#FF2D7850'}`,
                }}
              >
                {type === 'truth' ? '💬 Truth' : '🔥 Dare'}
              </span>
              <span className="text-textMuted text-xs font-body capitalize">
                {question.category}
              </span>
            </div>

            {/* Difficulty stars */}
            <div className="flex items-center gap-1">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="text-sm"
                  style={{
                    opacity: i < diff.stars ? 1 : 0.2,
                    filter: i < diff.stars ? `drop-shadow(0 0 4px ${diff.color})` : 'none',
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          {/* Difficulty badge */}
          <div className="mb-3">
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: diff.color + '20',
                color: diff.color,
                border: `1px solid ${diff.color}40`,
                boxShadow: `0 0 8px ${diff.color}20`,
              }}
            >
              {diff.emoji} {diff.label}
            </span>
          </div>

          {/* Question text */}
          <p className="font-body text-textPrimary text-lg leading-relaxed mb-6 min-h-[4rem]">
            {question.text}
          </p>

          {/* Action buttons */}
          <div className="flex gap-2 flex-wrap">
            <motion.button
              onClick={onDone}
              className="flex-1 py-3 px-4 rounded-xl font-display font-bold text-sm cursor-pointer min-h-[48px]"
              style={{
                background: 'linear-gradient(135deg, #00FF8820, #00FF8840)',
                border: '2px solid #00FF88',
                color: '#00FF88',
                boxShadow: '0 0 15px #00FF8830',
              }}
              whileHover={{ scale: 1.03, boxShadow: '0 0 25px #00FF8850' }}
              whileTap={{ scale: 0.95 }}
            >
              ✅ Done
            </motion.button>

            <motion.button
              onClick={onSkip}
              disabled={!canSkip}
              className={`flex-1 py-3 px-4 rounded-xl font-display font-bold text-sm min-h-[48px] ${canSkip ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
              style={{
                background: 'linear-gradient(135deg, #FF2D7820, #FF2D7840)',
                border: '2px solid #FF2D78',
                color: '#FF2D78',
                boxShadow: canSkip ? '0 0 15px #FF2D7830' : 'none',
              }}
              whileHover={canSkip ? { scale: 1.03 } : {}}
              whileTap={canSkip ? { scale: 0.95 } : {}}
            >
              ⏭️ Skip
            </motion.button>

            <motion.button
              onClick={onReroll}
              disabled={!canReroll}
              className={`py-3 px-4 rounded-xl font-display font-bold text-sm min-h-[48px] ${canReroll ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
              style={{
                background: 'linear-gradient(135deg, #FFD70020, #FFD70040)',
                border: '2px solid #FFD700',
                color: '#FFD700',
                boxShadow: canReroll ? '0 0 15px #FFD70030' : 'none',
              }}
              whileHover={canReroll ? { scale: 1.03 } : {}}
              whileTap={canReroll ? { scale: 0.95 } : {}}
            >
              🔄
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
