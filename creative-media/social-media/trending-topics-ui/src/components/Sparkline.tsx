interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  /** Label the first and last point with their values and the days they fall on. */
  labelled?: boolean;
  className?: string;
}

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n));

export default function Sparkline({ values, width = 120, height = 32, labelled = false, className = '' }: SparklineProps) {
  const padX = labelled ? 34 : 2;
  const padY = labelled ? 18 : 3;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => padX + (i / (values.length - 1)) * (width - padX * 2);
  const y = (v: number) => padY + (1 - (v - min) / span) * (height - padY * 2);
  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(values.length - 1).toFixed(1)},${height - padY} L${x(0).toFixed(1)},${height - padY} Z`;
  const last = values.length - 1;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={`w-full ${className}`}
      style={{ maxWidth: width }}
      role="img"
      aria-label={`Trend over ${values.length} days, from ${values[0].toLocaleString()} to ${values[last].toLocaleString()}`}
    >
      <path d={area} className="fill-blue-500/15" />
      <path d={line} className="fill-none stroke-blue-600 dark:stroke-blue-400" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last)} cy={y(values[last])} r={2.6} className="fill-blue-600 dark:fill-blue-400" />
      {labelled && (
        <g className="fill-gray-500 dark:fill-gray-400" fontSize={9}>
          <text x={x(0)} y={y(values[0]) - 6} textAnchor="start">{compact(values[0])}</text>
          <text x={x(last)} y={y(values[last]) - 6} textAnchor="end">{compact(values[last])}</text>
          <text x={x(0)} y={height - 3} textAnchor="start">14 days ago</text>
          <text x={x(last)} y={height - 3} textAnchor="end">today</text>
        </g>
      )}
    </svg>
  );
}
