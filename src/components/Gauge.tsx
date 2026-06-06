import './Gauge.css';

export function Gauge({ score }: { score: number }) {
  const getColor = (s: number) => {
    if (s >= 75) return '#22c55e';
    if (s >= 50) return '#f59e0b';
    return '#ef4444';
  };
  const color = getColor(score);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="threat-index-gauge">
      <svg viewBox="0 0 44 44" className="threat-index-ring">
        <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
        <circle
          cx="22"
          cy="22"
          r="18"
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 22 22)"
        />
      </svg>
      <span className="threat-index-value" style={{ color }}>{score}%</span>
    </div>
  );
}