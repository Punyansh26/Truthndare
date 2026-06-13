import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { GAME_CONFIG, MODES } from '../../constants/gameConfig';
import NeonButton from '../ui/NeonButton';
import Modal from '../ui/Modal';

export default function SettingsPanel({ isOpen, onClose }) {
  const { state, updateSettings, addCustomQuestion } = useGameState();
  const { settings } = state;

  const [showWildConfirm, setShowWildConfirm] = useState(false);
  const [customText, setCustomText] = useState('');
  const [customType, setCustomType] = useState('truth');

  const handleModeChange = (mode) => {
    if (mode === MODES.WILD) {
      setShowWildConfirm(true);
    } else {
      updateSettings({ mode });
    }
  };

  const confirmWild = () => {
    updateSettings({ mode: MODES.WILD });
    setShowWildConfirm(false);
  };

  const handleAddCustom = () => {
    const trimmed = customText.trim();
    if (!trimmed) return;
    const id = `C${customType === 'truth' ? 'T' : 'D'}${Date.now()}`;
    addCustomQuestion({
      id,
      text: trimmed,
      category: 'custom',
      difficulty: settings.mode,
      tags: ['custom'],
    });
    setCustomText('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚙️ Settings">
      <div className="space-y-5">
        {/* Mode */}
        <div>
          <label className="font-body text-sm text-textMuted block mb-2">Game Mode</label>
          <div className="flex gap-2">
            {[
              { key: MODES.MILD, label: '🟢 Mild', color: '#00FF88' },
              { key: MODES.SPICY, label: '🟡 Spicy', color: '#FFD700' },
              { key: MODES.WILD, label: '🔴 Wild', color: '#FF2D78' },
            ].map(m => (
              <button
                key={m.key}
                onClick={() => handleModeChange(m.key)}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-display cursor-pointer transition-all min-h-[48px] ${
                  settings.mode === m.key
                    ? 'border-2'
                    : 'border border-white/10 opacity-60'
                }`}
                style={{
                  borderColor: settings.mode === m.key ? m.color : undefined,
                  background: settings.mode === m.key ? `${m.color}15` : 'transparent',
                  color: m.color,
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timer */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-body text-sm text-textMuted">Timer</label>
            <button
              onClick={() => updateSettings({ timerEnabled: !settings.timerEnabled })}
              className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                settings.timerEnabled ? 'bg-neonCyan' : 'bg-white/10'
              }`}
            >
              <motion.div
                className="w-5 h-5 bg-white rounded-full shadow"
                animate={{ x: settings.timerEnabled ? 26 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          {settings.timerEnabled && (
            <div className="flex gap-2">
              {GAME_CONFIG.TIMER_OPTIONS.map(t => (
                <button
                  key={t}
                  onClick={() => updateSettings({ timerDuration: t })}
                  className={`flex-1 py-2 rounded-lg text-sm font-mono cursor-pointer min-h-[44px] ${
                    settings.timerDuration === t
                      ? 'bg-neonCyan/20 border border-neonCyan text-neonCyan'
                      : 'bg-white/5 border border-white/10 text-textMuted'
                  }`}
                >
                  {t}s
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Skip limit */}
        <div>
          <label className="font-body text-sm text-textMuted block mb-2">
            Skip Limit: <span className="text-neonGold font-bold">{settings.skipLimit}</span>
          </label>
          <input
            type="range"
            min="0"
            max="5"
            value={settings.skipLimit}
            onChange={(e) => updateSettings({ skipLimit: parseInt(e.target.value) })}
            className="w-full accent-neonPurple"
          />
          <div className="flex justify-between text-xs text-textMuted mt-1">
            <span>0</span>
            <span>5</span>
          </div>
        </div>

        {/* Sound */}
        <div className="flex items-center justify-between">
          <label className="font-body text-sm text-textMuted">Sound FX</label>
          <button
            onClick={() => updateSettings({ soundOn: !settings.soundOn })}
            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.soundOn ? 'bg-neonPurple' : 'bg-white/10'
            }`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: settings.soundOn ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Hot Seat Mode */}
        <div className="flex items-center justify-between">
          <label className="font-body text-sm text-textMuted">🔥 Hot Seat Mode</label>
          <button
            onClick={() => updateSettings({ hotSeatMode: !settings.hotSeatMode })}
            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.hotSeatMode ? 'bg-neonPink' : 'bg-white/10'
            }`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: settings.hotSeatMode ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Drinking Mode */}
        <div className="flex items-center justify-between">
          <label className="font-body text-sm text-textMuted">🍻 Drinking Mode</label>
          <button
            onClick={() => updateSettings({ drinkingMode: !settings.drinkingMode })}
            className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
              settings.drinkingMode ? 'bg-neonGold' : 'bg-white/10'
            }`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow"
              animate={{ x: settings.drinkingMode ? 26 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

        {/* Custom Questions */}
        <div>
          <label className="font-body text-sm text-textMuted block mb-2">Add Custom Question</label>
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setCustomType('truth')}
              className={`px-3 py-1 rounded-lg text-sm font-display cursor-pointer ${
                customType === 'truth'
                  ? 'bg-neonPurple/20 border border-neonPurple text-neonPurple'
                  : 'bg-white/5 border border-white/10 text-textMuted'
              }`}
            >
              Truth
            </button>
            <button
              onClick={() => setCustomType('dare')}
              className={`px-3 py-1 rounded-lg text-sm font-display cursor-pointer ${
                customType === 'dare'
                  ? 'bg-neonPink/20 border border-neonPink text-neonPink'
                  : 'bg-white/5 border border-white/10 text-textMuted'
              }`}
            >
              Dare
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Enter your question..."
              className="flex-1 bg-bg border border-white/10 rounded-lg px-3 py-2 text-textPrimary text-sm font-body placeholder-textMuted focus:outline-none focus:border-neonPurple/50"
            />
            <NeonButton onClick={handleAddCustom} color="#00FF88" size="sm">
              +
            </NeonButton>
          </div>
          {state.customQuestions.length > 0 && (
            <p className="text-textMuted text-xs mt-2">
              {state.customQuestions.length} custom question{state.customQuestions.length !== 1 ? 's' : ''} added
            </p>
          )}
        </div>
      </div>

      {/* Wild mode confirmation */}
      <Modal
        isOpen={showWildConfirm}
        onClose={() => setShowWildConfirm(false)}
        title="🔴 Enable Wild Mode?"
      >
        <p className="text-textMuted font-body mb-4">
          Wild mode includes some pretty intense questions and dares. Make sure everyone's comfortable with this!
        </p>
        <div className="flex gap-3">
          <NeonButton onClick={confirmWild} color="#FF2D78" className="flex-1">
            🔥 Let's Go!
          </NeonButton>
          <NeonButton onClick={() => setShowWildConfirm(false)} color="#6B6B8A" className="flex-1">
            Cancel
          </NeonButton>
        </div>
      </Modal>
    </Modal>
  );
}
