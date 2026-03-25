import React from 'react';
import { TrainingMetrics } from '@/lib/neural-network';

interface Props {
  history: TrainingMetrics[];
}

const MetricsChart: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="w-full h-40 flex items-center justify-center text-muted-foreground font-mono text-sm">
        Press Train to begin...
      </div>
    );
  }

  const w = 340;
  const h = 130;
  const pad = { top: 20, right: 10, bottom: 25, left: 40 };
  const plotW = w - pad.left - pad.right;
  const plotH = h - pad.top - pad.bottom;

  const maxLoss = Math.max(...history.map(h => h.loss), 0.1);
  const epochs = history.length;

  const lossPath = history.map((m, i) => {
    const x = pad.left + (i / (epochs - 1 || 1)) * plotW;
    const y = pad.top + (1 - m.loss / maxLoss) * plotH;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const accPath = history.map((m, i) => {
    const x = pad.left + (i / (epochs - 1 || 1)) * plotW;
    const y = pad.top + (1 - m.accuracy) * plotH;
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const lastMetrics = history[history.length - 1];

  return (
    <div>
      <div className="flex gap-4 mb-2 font-mono text-xs">
        <span className="neon-text">Loss: {lastMetrics.loss.toFixed(4)}</span>
        <span className="neon-text-secondary">Acc: {(lastMetrics.accuracy * 100).toFixed(1)}%</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map(t => (
          <g key={t}>
            <line
              x1={pad.left} y1={pad.top + t * plotH}
              x2={pad.left + plotW} y2={pad.top + t * plotH}
              stroke="hsl(225, 20%, 16%)" strokeWidth={0.5}
            />
            <text
              x={pad.left - 5} y={pad.top + t * plotH + 3}
              textAnchor="end" fill="hsl(215, 20%, 45%)"
              fontSize={8} fontFamily="JetBrains Mono"
            >
              {((1 - t) * maxLoss).toFixed(2)}
            </text>
          </g>
        ))}

        {/* Loss line */}
        <path d={lossPath} fill="none" stroke="hsl(185, 100%, 50%)" strokeWidth={1.5} opacity={0.9} />
        
        {/* Accuracy line */}
        <path d={accPath} fill="none" stroke="hsl(320, 100%, 60%)" strokeWidth={1.5} opacity={0.9} />

        {/* Epoch label */}
        <text
          x={pad.left + plotW / 2} y={h - 3}
          textAnchor="middle" fill="hsl(215, 20%, 45%)"
          fontSize={8} fontFamily="JetBrains Mono"
        >
          Epoch {epochs}
        </text>

        {/* Legend */}
        <line x1={pad.left} y1={7} x2={pad.left + 15} y2={7} stroke="hsl(185, 100%, 50%)" strokeWidth={1.5} />
        <text x={pad.left + 20} y={10} fill="hsl(215, 20%, 65%)" fontSize={8} fontFamily="JetBrains Mono">Loss</text>
        <line x1={pad.left + 60} y1={7} x2={pad.left + 75} y2={7} stroke="hsl(320, 100%, 60%)" strokeWidth={1.5} />
        <text x={pad.left + 80} y={10} fill="hsl(215, 20%, 65%)" fontSize={8} fontFamily="JetBrains Mono">Accuracy</text>
      </svg>
    </div>
  );
};

export default MetricsChart;
