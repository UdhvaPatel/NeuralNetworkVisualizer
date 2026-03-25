import React, { useRef, useEffect } from 'react';

interface Props {
  grid: number[][];
  points: number[][];
  labels: number[];
  range?: number;
}

const DecisionBoundary: React.FC<Props> = ({ grid, points, labels, range = 1.2 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = canvas.width;
    const h = canvas.height;
    const res = grid.length;

    // Draw heatmap
    const cellW = w / res;
    const cellH = h / res;
    for (let i = 0; i < res; i++) {
      for (let j = 0; j < res; j++) {
        const v = grid[i][j];
        // Cyan (class 0) to Magenta (class 1)
        const r = Math.round(v * 230 + (1 - v) * 0);
        const g = Math.round(v * 50 + (1 - v) * 210);
        const b = Math.round(v * 180 + (1 - v) * 230);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.7)`;
        ctx.fillRect(j * cellW, i * cellH, cellW + 1, cellH + 1);
      }
    }

    // Draw grid lines subtly
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 8; i++) {
      const pos = (i / 8) * w;
      ctx.beginPath(); ctx.moveTo(pos, 0); ctx.lineTo(pos, h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, pos); ctx.lineTo(w, pos); ctx.stroke();
    }

    // Draw points
    for (let i = 0; i < points.length; i++) {
      const px = ((points[i][0] + range) / (2 * range)) * w;
      const py = ((points[i][1] + range) / (2 * range)) * h;

      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      
      if (labels[i] === 0) {
        ctx.fillStyle = '#00e5ff';
        ctx.shadowColor = '#00e5ff';
      } else {
        ctx.fillStyle = '#e040fb';
        ctx.shadowColor = '#e040fb';
      }
      ctx.shadowBlur = 6;
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;
      ctx.stroke();
    }
  }, [grid, points, labels, range]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      className="w-full aspect-square rounded-lg border border-border"
    />
  );
};

export default DecisionBoundary;
