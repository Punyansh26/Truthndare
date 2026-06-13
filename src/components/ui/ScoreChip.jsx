export default function ScoreChip({ score, color = '#FFD700' }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-mono text-xs font-bold"
      style={{
        background: `${color}20`,
        border: `1px solid ${color}50`,
        color,
        textShadow: `0 0 8px ${color}60`,
      }}
    >
      ⚡ {score}
    </span>
  );
}
