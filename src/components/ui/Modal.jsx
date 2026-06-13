import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-surface border border-white/10 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative"
              style={{
                boxShadow: '0 0 40px rgba(157, 0, 255, 0.2), 0 0 80px rgba(255, 45, 120, 0.1)',
              }}
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              {title && (
                <h2 className="font-display text-xl text-textPrimary mb-4">{title}</h2>
              )}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-textMuted hover:text-textPrimary transition-colors text-xl cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
