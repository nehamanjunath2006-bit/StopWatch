export const formatTime = (milliseconds: number) => {
  const totalMs = Math.max(0, Math.round(milliseconds));
  const ms = totalMs % 1000;
  const totalSeconds = Math.floor(totalMs / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  const padded = (value: number, digits = 2) => String(value).padStart(digits, '0');
  return {
    hours: padded(hours, 2),
    minutes: padded(minutes, 2),
    seconds: padded(seconds, 2),
    milliseconds: String(Math.floor(ms / 10)).padStart(2, '0')
  };
};

export const buildCsv = (title: string, laps: { label: string; lapMs: number; totalMs: number }[]) => {
  const header = ['Lap', 'Lap Time', 'Total Time'];
  const rows = laps.map((lap) => [lap.label, formatDisplay(lap.lapMs), formatDisplay(lap.totalMs)]);
  return [header, ...rows].map((row) => row.join(',')).join('\n');
};

export const formatDisplay = (milliseconds: number) => {
  const time = formatTime(milliseconds);
  return `${time.hours}:${time.minutes}:${time.seconds}.${time.milliseconds}`;
};

export const accentMap = {
  emerald: 'from-emerald-400 via-teal-400 to-cyan-400',
  cyan: 'from-cyan-400 via-sky-400 to-indigo-500',
  violet: 'from-violet-400 via-fuchsia-500 to-pink-500',
  amber: 'from-amber-400 via-orange-400 to-rose-500'
} as const;

export const accentGradients = {
  emerald: 'linear-gradient(135deg, #4ade80 0%, #14b8a6 50%, #06b6d4 100%)',
  cyan: 'linear-gradient(135deg, #06b6d4 0%, #0ea5e9 50%, #6366f1 100%)',
  violet: 'linear-gradient(135deg, #c084fc 0%, #ec4899 50%, #f43f5e 100%)',
  amber: 'linear-gradient(135deg, #fbbf24 0%, #fb923c 50%, #f87171 100%)'
} as const;

export const accentColors = {
  emerald: { text: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' },
  cyan: { text: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.3)' },
  violet: { text: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', border: 'rgba(167, 139, 250, 0.3)' },
  amber: { text: '#fcd34d', bg: 'rgba(252, 211, 77, 0.1)', border: 'rgba(252, 211, 77, 0.3)' }
} as const;
