import { useCallback, useRef, useEffect } from 'react';

const AudioContext = window.AudioContext || window.webkitAudioContext;

export function useSound(enabled = true) {
  const ctxRef = useRef(null);

  const getCtx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const playTone = useCallback((frequency, duration, type = 'sine', volume = 0.15) => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch { /* ignore audio errors */ }
  }, [enabled, getCtx]);

  const playSpinStart = useCallback(() => {
    if (!enabled) return;
    // Rising pitch tone
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    } catch {}
  }, [enabled, getCtx]);

  const playSpinStop = useCallback(() => {
    if (!enabled) return;
    // Satisfying thunk
    playTone(150, 0.15, 'square', 0.2);
    setTimeout(() => playTone(200, 0.1, 'square', 0.15), 100);
    setTimeout(() => playTone(300, 0.2, 'sine', 0.1), 200);
  }, [enabled, playTone]);

  const playTruthSelect = useCallback(() => {
    if (!enabled) return;
    // Mysterious chime
    playTone(523, 0.3, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.3, 'sine', 0.1), 150);
    setTimeout(() => playTone(784, 0.4, 'sine', 0.08), 300);
  }, [enabled, playTone]);

  const playDareSelect = useCallback(() => {
    if (!enabled) return;
    // Dramatic sting
    playTone(200, 0.2, 'sawtooth', 0.12);
    setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.15), 150);
    setTimeout(() => playTone(100, 0.4, 'square', 0.1), 300);
  }, [enabled, playTone]);

  const playDone = useCallback(() => {
    if (!enabled) return;
    // Victory jingle (3 ascending notes)
    playTone(523, 0.2, 'sine', 0.12);
    setTimeout(() => playTone(659, 0.2, 'sine', 0.12), 150);
    setTimeout(() => playTone(784, 0.4, 'sine', 0.15), 300);
  }, [enabled, playTone]);

  const playSkip = useCallback(() => {
    if (!enabled) return;
    // Descending sad trombone
    playTone(400, 0.2, 'sawtooth', 0.1);
    setTimeout(() => playTone(350, 0.2, 'sawtooth', 0.08), 200);
    setTimeout(() => playTone(250, 0.4, 'sawtooth', 0.06), 400);
  }, [enabled, playTone]);

  const playTimerTick = useCallback(() => {
    if (!enabled) return;
    playTone(800, 0.05, 'square', 0.06);
  }, [enabled, playTone]);

  const playBuzzer = useCallback(() => {
    if (!enabled) return;
    playTone(150, 0.5, 'square', 0.2);
  }, [enabled, playTone]);

  const playClick = useCallback(() => {
    if (!enabled) return;
    playTone(600, 0.05, 'sine', 0.08);
  }, [enabled, playTone]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (ctxRef.current && ctxRef.current.state !== 'closed') {
        ctxRef.current.close();
      }
    };
  }, []);

  return {
    playSpinStart,
    playSpinStop,
    playTruthSelect,
    playDareSelect,
    playDone,
    playSkip,
    playTimerTick,
    playBuzzer,
    playClick,
  };
}
