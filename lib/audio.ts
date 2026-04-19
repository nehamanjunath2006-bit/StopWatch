// Web Audio API for generating beeps and sounds
export const audioContext = typeof window !== 'undefined' ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

export const playBeep = (frequency: number = 800, duration: number = 100, volume: number = 0.3) => {
  if (!audioContext) return;

  try {
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration / 1000);

    oscillator.start(now);
    oscillator.stop(now + duration / 1000);
  } catch (e) {
    console.error('Audio playback error:', e);
  }
};

export const playStartSound = () => {
  playBeep(600, 80, 0.2);
};

export const playPauseSound = () => {
  playBeep(700, 60, 0.2);
};

export const playLapSound = () => {
  playBeep(900, 40, 0.2);
  setTimeout(() => playBeep(900, 40, 0.2), 60);
};

export const playResetSound = () => {
  playBeep(500, 150, 0.15);
};

// Haptic / Vibration API
export const triggerVibration = (pattern: number | number[] = 100) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

export const triggerStartVibration = () => {
  triggerVibration(50);
};

export const triggerPauseVibration = () => {
  triggerVibration(30);
};

export const triggerLapVibration = () => {
  triggerVibration([50, 50, 50]);
};

export const triggerResetVibration = () => {
  triggerVibration([100, 50, 100]);
};
