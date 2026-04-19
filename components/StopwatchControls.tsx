'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Pause, Play, RotateCcw, Flag } from 'lucide-react';

type StopwatchControlsProps = {
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onLap: () => void;
};

export default function StopwatchControls({ running, onStart, onPause, onReset, onLap }: StopwatchControlsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <AnimatePresence mode="wait">
        {running ? (
          <motion.button
            key="pause"
            type="button"
            onClick={onPause}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-400/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
          >
            <Pause size={18} /> Pause
          </motion.button>
        ) : (
          <motion.button
            key="start"
            type="button"
            onClick={onStart}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/20 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
          >
            <Play size={18} /> {running ? 'Resume' : 'Start'}
          </motion.button>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onLap}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        <Flag size={18} /> Lap
      </button>
      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/15 transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300"
      >
        <RotateCcw size={18} /> Reset
      </button>
    </div>
  );
}
