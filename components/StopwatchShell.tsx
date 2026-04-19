'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Share2, Sparkles, SunMedium, Moon, Pause, Play, RotateCcw, Flag, Maximize2, Download, Sparkle } from 'lucide-react';
import { useStopwatchStore } from '@/lib/store';
import { playStartSound, playPauseSound, playLapSound, playResetSound, triggerStartVibration, triggerPauseVibration, triggerLapVibration, triggerResetVibration } from '@/lib/audio';
import StopwatchDisplay from '@/components/StopwatchDisplay';
import StopwatchControls from '@/components/StopwatchControls';
import LapHistory from '@/components/LapHistory';
import StatsPanel from '@/components/StatsPanel';
import ThemeControls from '@/components/ThemeControls';
import { formatDisplay, accentMap, accentGradients, accentColors } from '@/lib/utils';

const accentOptions = [
  { id: 'emerald', label: 'Aqua' },
  { id: 'cyan', label: 'Marine' },
  { id: 'violet', label: 'Velvet' },
  { id: 'amber', label: 'Sunset' }
] as const;

export default function StopwatchShell() {
  const tabs = useStopwatchStore((state) => state.tabs);
  const selectedTabId = useStopwatchStore((state) => state.selectedTabId);
  const selectTab = useStopwatchStore((state) => state.selectTab);
  const createTab = useStopwatchStore((state) => state.createTab);
  const removeTab = useStopwatchStore((state) => state.removeTab);
  const start = useStopwatchStore((state) => state.start);
  const pause = useStopwatchStore((state) => state.pause);
  const reset = useStopwatchStore((state) => state.reset);
  const lap = useStopwatchStore((state) => state.lap);
  const tick = useStopwatchStore((state) => state.tick);
  const theme = useStopwatchStore((state) => state.theme);
  const toggleTheme = useStopwatchStore((state) => state.toggleTheme);
  const soundEnabled = useStopwatchStore((state) => state.soundEnabled);
  const vibrationEnabled = useStopwatchStore((state) => state.vibrationEnabled);
  const toggleSound = useStopwatchStore((state) => state.toggleSound);
  const toggleVibration = useStopwatchStore((state) => state.toggleVibration);
  const changeAccent = useStopwatchStore((state) => state.changeAccent);

  const activeTab = tabs.find((tab) => tab.id === selectedTabId) ?? tabs[0];
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rafRef = useRef<number | null>(null);

  const mainAccent = accentMap[activeTab.accent];

  // Apply theme on mount and whenever it changes
  useEffect(() => {
    const applyTheme = () => {
      if (theme === 'dark') {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
    };
    
    applyTheme();
  }, [theme]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      tick(activeTab.id, timestamp);
      rafRef.current = requestAnimationFrame(animate);
    };

    if (activeTab.running) {
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [activeTab.running, activeTab.id, tick]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'BUTTON'].includes((event.target as Element).tagName)) return;
      if (event.code === 'Space') {
        event.preventDefault();
        if (activeTab.running) {
          pause(activeTab.id);
          if (soundEnabled) playPauseSound();
          if (vibrationEnabled) triggerPauseVibration();
        } else {
          start(activeTab.id);
          if (soundEnabled) playStartSound();
          if (vibrationEnabled) triggerStartVibration();
        }
      }
      if (event.key.toLowerCase() === 'r') {
        reset(activeTab.id);
        if (soundEnabled) playResetSound();
        if (vibrationEnabled) triggerResetVibration();
      }
      if (event.key.toLowerCase() === 'l') {
        lap(activeTab.id);
        if (soundEnabled) playLapSound();
        if (vibrationEnabled) triggerLapVibration();
      }
    };
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [activeTab, pause, start, reset, lap, soundEnabled, vibrationEnabled]);

  const currentTimeText = formatDisplay(activeTab.elapsedMs);

  const exportCsv = () => {
    const rows = activeTab.laps
      .slice()
      .reverse()
      .map((lap) => ({ label: lap.label, lapMs: lap.lapMs, totalMs: lap.totalMs }));
    const csvContent = ['Lap,Lap Time,Total Time', ...rows.map((row) => `${row.label},${formatDisplay(row.lapMs)},${formatDisplay(row.totalMs)}`)].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${activeTab.title.replace(/\s+/g, '_').toLowerCase()}_laps.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const shareResult = async () => {
    const shareBody = `${activeTab.title} - ${currentTimeText} with ${activeTab.laps.length} laps.`;
    if (navigator.share) {
      await navigator.share({ title: activeTab.title, text: shareBody });
      return;
    }
    await navigator.clipboard.writeText(shareBody);
    alert('Result copied to clipboard');
  };

  const toggleFullscreen = async () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const accentSelector = useMemo(
    () => (
      <div className="grid grid-cols-4 gap-3">
        {accentOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => changeAccent(option.id)}
            className={`rounded-2xl border px-3 py-2 text-sm font-medium transition shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${
              activeTab.accent === option.id
                ? 'border-white/20 bg-white/10 text-white'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    ),
    [activeTab.accent, changeAccent]
  );

  return (
    <section className="mx-auto max-w-7xl space-y-8">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <p className="inline-flex rounded-full bg-slate-900/70 px-4 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300 ring-1 ring-white/10">
              Multi-tab stopwatch
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Precision timing, lap tracking, and premium motion.
            </h2>
            <p className="max-w-2xl text-slate-300 sm:text-lg">
              Use multiple timers independently, save your session locally, and switch themes while tracking every split with millisecond fidelity.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:w-72">
            <ThemeControls />
            <button
              type="button"
              onClick={createTab}
              className="inline-flex items-center justify-center gap-2 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
            >
              <Plus size={16} />
              New timer
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.7fr_0.3fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: accentGradients[activeTab.accent] }}
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Active timer</p>
                  <p className="text-base font-semibold text-white">{activeTab.title}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => selectTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      tab.id === activeTab.id
                        ? 'bg-slate-100/10 text-white shadow-sm shadow-sky-500/10'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {tab.title}
                  </button>
                ))}
                {tabs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTab(activeTab.id)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-500/10"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="mt-8 rounded-[2rem] border border-white/10 bg-slate-900/75 p-8 shadow-xl shadow-slate-950/20">
              <StopwatchDisplay timeMs={activeTab.elapsedMs} accent={activeTab.accent} />
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <StopwatchControls
                  running={activeTab.running}
                  onStart={() => {
                    start(activeTab.id);
                    if (soundEnabled) playStartSound();
                    if (vibrationEnabled) triggerStartVibration();
                  }}
                  onPause={() => {
                    pause(activeTab.id);
                    if (soundEnabled) playPauseSound();
                    if (vibrationEnabled) triggerPauseVibration();
                  }}
                  onReset={() => {
                    reset(activeTab.id);
                    if (soundEnabled) playResetSound();
                    if (vibrationEnabled) triggerResetVibration();
                  }}
                  onLap={() => {
                    lap(activeTab.id);
                    if (soundEnabled) playLapSound();
                    if (vibrationEnabled) triggerLapVibration();
                  }}
                />
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                >
                  <Maximize2 size={18} className="inline-block" />
                  <span className="ml-2">{isFullscreen ? 'Exit full' : 'Fullscreen'}</span>
                </button>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={exportCsv}
                  className="rounded-3xl bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-700/90"
                >
                  <Download size={16} className="inline-block" />
                  <span className="ml-2">Export laps</span>
                </button>
                <button
                  type="button"
                  onClick={shareResult}
                  className="rounded-3xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:brightness-110"
                >
                  <Share2 size={16} className="inline-block" />
                  <span className="ml-2">Share result</span>
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl"
            >
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Lap history</p>
                  <h3 className="text-2xl font-semibold text-white">Split details</h3>
                </div>
                <p className="text-sm text-slate-300">{activeTab.laps.length} recorded laps</p>
              </div>
              <LapHistory laps={activeTab.laps} accent={activeTab.accent} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Performance stats</p>
                <h3 className="text-2xl font-semibold text-white">Your session insights</h3>
              </div>
              <Sparkles className="h-8 w-8 text-cyan-300" />
            </div>
            <StatsPanel laps={activeTab.laps} accent={activeTab.accent} />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Accent theme</p>
                <h3 className="text-2xl font-semibold text-white">Custom styling</h3>
              </div>
              <Sparkle className="h-8 w-8 text-amber-300" />
            </div>
            {accentSelector}
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Quick controls</p>
                <h3 className="text-2xl font-semibold text-white">Feedback settings</h3>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              <button
                type="button"
                onClick={toggleSound}
                className={`rounded-3xl px-4 py-4 text-left text-sm font-semibold transition ${
                  soundEnabled ? 'bg-emerald-500/15 text-emerald-200' : 'bg-white/5 text-slate-300'
                }`}
              >
                Sound feedback
                <span className="block text-xs font-normal text-slate-400">{soundEnabled ? 'Enabled' : 'Disabled'}</span>
              </button>
              <button
                type="button"
                onClick={toggleVibration}
                className={`rounded-3xl px-4 py-4 text-left text-sm font-semibold transition ${
                  vibrationEnabled ? 'bg-amber-500/15 text-amber-200' : 'bg-white/5 text-slate-300'
                }`}
              >
                Vibration / haptics
                <span className="block text-xs font-normal text-slate-400">{vibrationEnabled ? 'Enabled' : 'Disabled'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
