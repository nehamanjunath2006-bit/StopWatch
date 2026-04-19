'use client';

import { formatDisplay, accentColors } from '@/lib/utils';

type StatsPanelProps = {
  laps: {
    id: string;
    label: string;
    lapMs: number;
    totalMs: number;
    timestamp: number;
  }[];
  accent: 'emerald' | 'cyan' | 'violet' | 'amber';
};

export default function StatsPanel({ laps, accent }: StatsPanelProps) {
  const accentColor = accentColors[accent];
  const totalLaps = laps.length;
  const fastest = laps.reduce((best, lap) => (lap.lapMs < best ? lap.lapMs : best), Number.POSITIVE_INFINITY);
  const slowest = laps.reduce((worst, lap) => (lap.lapMs > worst ? lap.lapMs : worst), 0);
  const average = totalLaps ? Math.round(laps.reduce((sum, lap) => sum + lap.lapMs, 0) / totalLaps) : 0;

  const statCards = [
    { label: 'Fastest lap', value: totalLaps ? formatDisplay(fastest) : '--' },
    { label: 'Slowest lap', value: totalLaps ? formatDisplay(slowest) : '--' },
    { label: 'Average lap', value: totalLaps ? formatDisplay(average) : '--' },
    { label: 'Total laps', value: String(totalLaps) }
  ];

  return (
    <div className="grid gap-3">
      {statCards.map((stat) => (
        <div key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5 shadow-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
          <p className="mt-2 text-xl font-semibold" style={{ color: accentColor.text }}>{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
