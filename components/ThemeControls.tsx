'use client';

import { Moon, SunMedium, Volume2, Zap } from 'lucide-react';
import { useStopwatchStore } from '@/lib/store';

export default function ThemeControls() {
  const theme = useStopwatchStore((state) => state.theme);
  const toggleTheme = useStopwatchStore((state) => state.toggleTheme);
  const soundEnabled = useStopwatchStore((state) => state.soundEnabled);
  const vibrationEnabled = useStopwatchStore((state) => state.vibrationEnabled);
  const toggleSound = useStopwatchStore((state) => state.toggleSound);
  const toggleVibration = useStopwatchStore((state) => state.toggleVibration);

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={toggleTheme}
        className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        <div className="flex items-center gap-3">
          {theme === 'dark' ? <Moon size={20} /> : <SunMedium size={20} />}
          <div>
            <div>{theme === 'dark' ? 'Dark mode' : 'Light mode'}</div>
            <p className="text-xs text-slate-400">Toggle the interface ambience.</p>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={toggleSound}
        className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        <div className="flex items-center gap-3">
          <Volume2 size={20} />
          <div>
            <div>{soundEnabled ? 'Sound enabled' : 'Sound muted'}</div>
            <p className="text-xs text-slate-400">Get audio feedback on actions.</p>
          </div>
        </div>
      </button>
      <button
        type="button"
        onClick={toggleVibration}
        className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-semibold text-slate-100 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
      >
        <div className="flex items-center gap-3">
          <Zap size={20} />
          <div>
            <div>{vibrationEnabled ? 'Haptics enabled' : 'Haptics disabled'}</div>
            <p className="text-xs text-slate-400">Get tactile feedback on supported devices.</p>
          </div>
        </div>
      </button>
    </div>
  );
}
