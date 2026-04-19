'use client';

import { motion } from 'framer-motion';
import { formatDisplay, accentColors } from '@/lib/utils';

type LapHistoryProps = {
  laps: {
    id: string;
    label: string;
    lapMs: number;
    totalMs: number;
    timestamp: number;
  }[];
  accent: 'emerald' | 'cyan' | 'violet' | 'amber';
};

export default function LapHistory({ laps, accent }: LapHistoryProps) {
  const accentColor = accentColors[accent];

  if (!laps.length) {
    return (
      <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-12 text-center text-slate-400">
        <p className="text-lg font-semibold text-white">No laps yet</p>
        <p className="mt-2 text-sm text-slate-400">Press start and capture your first split to build a running lap history.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {laps.map((lap, index) => (
        <motion.div
          key={lap.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="rounded-[1.75rem] border bg-slate-900/80 p-4 text-sm text-slate-200 shadow-sm"
          style={{ borderColor: accentColor.border }}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-white">{lap.label}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Split {laps.length - index}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-semibold text-white">{formatDisplay(lap.lapMs)}</p>
              <p className="text-xs text-slate-500">Total {formatDisplay(lap.totalMs)}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
