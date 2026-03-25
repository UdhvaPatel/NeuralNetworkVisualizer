import React from 'react';

interface Props {
  layerSizes: number[];
  activationFn: string;
  isTraining?: boolean;
}

const NetworkVisualizer: React.FC<Props> = ({ layerSizes, activationFn, isTraining = false }) => {
  const width = 360;
  const height = 280;
  const padding = 40;
  const layerCount = layerSizes.length;
  const maxNeurons = Math.max(...layerSizes);
  const layerSpacing = (width - padding * 2) / (layerCount - 1);

  const getNodePos = (layerIdx: number, nodeIdx: number, count: number) => {
    const x = padding + layerIdx * layerSpacing;
    const verticalSpacing = Math.min(40, (height - padding * 2) / (count - 1 || 1));
    const totalH = (count - 1) * verticalSpacing;
    const y = height / 2 - totalH / 2 + nodeIdx * verticalSpacing;
    return { x, y };
  };

  const layerLabels = layerSizes.map((_, i) => {
    if (i === 0) return 'Input';
    if (i === layerSizes.length - 1) return 'Output';
    return `Hidden ${i}`;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ maxHeight: 280 }}>
      {/* Connections */}
      {layerSizes.map((_, li) => {
        if (li === layerSizes.length - 1) return null;
        const nextSize = layerSizes[li + 1];
        return Array.from({ length: layerSizes[li] }).map((_, ni) => {
          const from = getNodePos(li, ni, layerSizes[li]);
          return Array.from({ length: nextSize }).map((_, nj) => {
            const to = getNodePos(li + 1, nj, nextSize);
            return (
              <line
                key={`${li}-${ni}-${nj}`}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="hsl(185 100% 50% / 0.2)"
                strokeWidth={1}
                className={`network-connection ${isTraining ? 'network-connection-active' : ''}`}
              />
            );
          });
        });
      })}

      {/* Nodes */}
      {layerSizes.map((count, li) =>
        Array.from({ length: count }).map((_, ni) => {
          const pos = getNodePos(li, ni, count);
          const isInput = li === 0;
          const isOutput = li === layerSizes.length - 1;
          const color = isInput ? 'hsl(185, 100%, 50%)' : isOutput ? 'hsl(320, 100%, 60%)' : 'hsl(265, 100%, 65%)';
          return (
            <g key={`node-${li}-${ni}`}>
              <circle
                cx={pos.x} cy={pos.y} r={isOutput ? 10 : 8}
                fill={color}
                fillOpacity={0.2}
                stroke={color}
                strokeWidth={1.5}
              />
              <circle
                cx={pos.x} cy={pos.y} r={3}
                fill={color}
              />
            </g>
          );
        })
      )}

      {/* Layer labels */}
      {layerSizes.map((count, li) => {
        const pos = getNodePos(li, 0, count);
        return (
          <text
            key={`label-${li}`}
            x={pos.x}
            y={height - 8}
            textAnchor="middle"
            fill="hsl(215, 20%, 55%)"
            fontSize={9}
            fontFamily="JetBrains Mono, monospace"
          >
            {layerLabels[li]}
          </text>
        );
      })}

      {/* Activation label */}
      <text
        x={width / 2}
        y={14}
        textAnchor="middle"
        fill="hsl(185, 100%, 50%)"
        fontSize={10}
        fontFamily="JetBrains Mono, monospace"
        opacity={0.7}
      >
        f(x) = {activationFn}
      </text>
    </svg>
  );
};

export default NetworkVisualizer;
