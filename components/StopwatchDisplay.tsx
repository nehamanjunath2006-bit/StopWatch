'use client';

import { motion } from 'framer-motion';
import { formatTime, accentColors } from '@/lib/utils';

type StopwatchDisplayProps = {
  timeMs: number;
  accent: 'emerald' | 'cyan' | 'violet' | 'amber';
};

export default function StopwatchDisplay({ timeMs, accent }: StopwatchDisplayProps) {
  const time = formatTime(timeMs);
  const accentColor = accentColors[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="rounded-[2rem] bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-slate-900/80 p-8 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
    >
      <div className="flex flex-wrap items-end gap-4 tracking-[0.02em]">
        <span className="text-6xl font-semibold tracking-tight sm:text-7xl md:text-8xl" style={{ color: accentColor.text }}>
          {time.hours}:{time.minutes}:{time.seconds}
        </span>
        <span className="text-3xl font-semibold text-slate-400 sm:text-4xl">.{time.milliseconds}</span>
      </div>
      <p className="mt-4 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
        Drift-free timing is managed with high-precision performance API updates and a fluid digital display optimized for workouts, meetings, or presentations.
      </p>
    </motion.div>
  );
}
