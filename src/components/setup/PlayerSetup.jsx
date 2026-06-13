import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../../hooks/useGameState';
import { GAME_CONFIG, EMOJI_OPTIONS } from '../../constants/gameConfig';
import { loadPlayers } from '../../utils/storage';
import AvatarPicker from './AvatarPicker';
import PlayerCard from './PlayerCard';
import NeonButton from '../ui/NeonButton';
import Modal from '../ui/Modal';

export default function PlayerSetup() {
  const { state, addPlayer, removePlayer, reorderPlayers, startGame } = useGameState();
  const { players } = state;

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState(EMOJI_OPTIONS[0]);
  const [error, setError] = useState('');
  const [showResume, setShowResume] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);

  // Check for saved players on mount
  useEffect(() => {
    const saved = loadPlayers();
    if (saved && saved.length >= 2 && players.length === 0) {
      setShowResume(true);
    }
  }, []);

  const handleAddPlayer = (e) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Enter a name');
      return;
    }
    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Name already taken!');
      return;
    }
    if (players.length >= GAME_CONFIG.MAX_PLAYERS) {
      setError(`Max ${GAME_CONFIG.MAX_PLAYERS} players!`);
      return;
    }

    addPlayer(trimmed, emoji);
    setName('');
    setError('');
    // Cycle to next unused emoji
    const usedEmojis = [...players.map(p => p.emoji), emoji];
    const nextEmoji = EMOJI_OPTIONS.find(e => !usedEmojis.includes(e)) || EMOJI_OPTIONS[0];
    setEmoji(nextEmoji);
  };

  const handleResume = () => {
    const saved = loadPlayers();
    if (saved) {
      // Use the dispatch to set players directly
      saved.forEach(p => {
        if (!players.some(existing => existing.name === p.name)) {
          addPlayer(p.name, p.emoji);
        }
      });
    }
    setShowResume(false);
  };

  const canStart = players.length >= GAME_CONFIG.MIN_PLAYERS;

  // Simple drag reorder with touchmove
  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...players];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    reorderPlayers(reordered);
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 w-full max-w-md mx-auto px-4 py-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Header */}
      <div className="text-center">
        <motion.h1
          className="font-display text-4xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-neonPink via-neonPurple to-neonCyan"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 5, repeat: Infinity }}
          style={{ backgroundSize: '200% 200%' }}
        >
          Truth or Dare
        </motion.h1>
        <p className="font-body text-textMuted mt-2">Add players to get started</p>
      </div>

      {/* Add Player Form */}
      <form onSubmit={handleAddPlayer} className="w-full space-y-3">
        <div className="flex gap-2">
          <input
            id="player-name-input"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(''); }}
            placeholder="Enter player name..."
            maxLength={20}
            className="flex-1 bg-surface border border-white/10 rounded-xl px-4 py-3 text-textPrimary font-body placeholder-textMuted focus:outline-none focus:border-neonPurple/50 focus:ring-1 focus:ring-neonPurple/30 transition-colors min-h-[48px]"
            autoComplete="off"
          />
          <NeonButton
            type="submit"
            color="#9D00FF"
            disabled={players.length >= GAME_CONFIG.MAX_PLAYERS}
            id="add-player-btn"
          >
            +
          </NeonButton>
        </div>

        {error && (
          <motion.p
            className="text-neonPink text-sm font-body"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}

        {/* Avatar Picker */}
        <div className="bg-surface/50 rounded-xl border border-white/5 p-3">
          <p className="text-textMuted text-xs font-body mb-2">Pick your avatar</p>
          <AvatarPicker selected={emoji} onSelect={setEmoji} />
        </div>
      </form>

      {/* Player Count */}
      <div className="w-full flex items-center justify-between">
        <span className="text-textMuted font-body text-sm">
          {players.length} / {GAME_CONFIG.MAX_PLAYERS} players
        </span>
        {!canStart && players.length > 0 && (
          <span className="text-neonGold text-xs font-body">
            Need {GAME_CONFIG.MIN_PLAYERS - players.length} more
          </span>
        )}
      </div>

      {/* Player List */}
      <div className="w-full space-y-2">
        <AnimatePresence mode="popLayout">
          {players.map((player, index) => (
            <div
              key={player.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <PlayerCard
                player={player}
                index={index}
                onRemove={removePlayer}
                isDragging={dragIndex === index}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>

      {/* Start Button */}
      <NeonButton
        onClick={startGame}
        color="#00F5FF"
        size="lg"
        disabled={!canStart}
        className="w-full"
        id="start-game-btn"
      >
        {canStart ? '🎉 Start Game!' : `Add ${GAME_CONFIG.MIN_PLAYERS - players.length} more players`}
      </NeonButton>

      {/* Resume Modal */}
      <Modal
        isOpen={showResume}
        onClose={() => setShowResume(false)}
        title="Welcome Back! 👋"
      >
        <p className="text-textMuted font-body mb-4">
          Looks like you had a game going. Want to continue with the same players?
        </p>
        <div className="flex gap-3">
          <NeonButton onClick={handleResume} color="#00F5FF" className="flex-1">
            Continue
          </NeonButton>
          <NeonButton onClick={() => setShowResume(false)} color="#FF2D78" className="flex-1">
            New Game
          </NeonButton>
        </div>
      </Modal>
    </motion.div>
  );
}
