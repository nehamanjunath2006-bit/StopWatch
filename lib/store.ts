'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type StopwatchTab = {
  id: string;
  title: string;
  elapsedMs: number;
  running: boolean;
  lastTimestamp: number;
  laps: LapRecord[];
  accent: Accent;
};

export type LapRecord = {
  id: string;
  label: string;
  lapMs: number;
  totalMs: number;
  timestamp: number;
};

export type Accent = 'emerald' | 'cyan' | 'violet' | 'amber';

type StopwatchState = {
  tabs: StopwatchTab[];
  selectedTabId: string;
  theme: 'dark' | 'light';
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  createTab: () => void;
  removeTab: (id: string) => void;
  selectTab: (id: string) => void;
  start: (id: string) => void;
  pause: (id: string) => void;
  reset: (id: string) => void;
  lap: (id: string) => void;
  tick: (id: string, now: number) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
  changeAccent: (accent: Accent) => void;
};

const DEFAULT_ACCENT: Accent = 'emerald';

const createDefaultTab = (index: number): StopwatchTab => ({
  id: `tab-${Date.now()}-${index}`,
  title: `Stopwatch ${index + 1}`,
  elapsedMs: 0,
  running: false,
  lastTimestamp: 0,
  laps: [],
  accent: DEFAULT_ACCENT
});

const getTabIndex = (tabs: StopwatchTab[], id: string) => tabs.findIndex((tab) => tab.id === id);

const initialTab = createDefaultTab(0);

export const useStopwatchStore = create<StopwatchState>()(
  persist<StopwatchState>(
    (set, get) => ({
      tabs: [initialTab],
      selectedTabId: initialTab.id,
      theme: 'dark',
      soundEnabled: true,
      vibrationEnabled: false,
      createTab: () => {
        set((state) => {
          const nextIndex = state.tabs.length;
          const newTab = createDefaultTab(nextIndex);
          return {
            tabs: [...state.tabs, newTab],
            selectedTabId: newTab.id
          };
        });
      },
      removeTab: (id) => {
        set((state) => {
          if (state.tabs.length <= 1) return state;
          const remaining = state.tabs.filter((tab) => tab.id !== id);
          const newSelected = remaining[0].id;
          return {
            tabs: remaining,
            selectedTabId: state.selectedTabId === id ? newSelected : state.selectedTabId
          };
        });
      },
      selectTab: (id) => {
        set((state) => ({ selectedTabId: id }));
      },
      start: (id) => {
        const now = performance.now();
        set((state) => {
          const index = getTabIndex(state.tabs, id);
          if (index === -1) return state;
          const tab = state.tabs[index];
          if (tab.running) return state;
          const updated = { ...tab, running: true, lastTimestamp: now };
          const tabs = [...state.tabs];
          tabs[index] = updated;
          return { tabs };
        });
      },
      pause: (id) => {
        const now = performance.now();
        set((state) => {
          const index = getTabIndex(state.tabs, id);
          if (index === -1) return state;
          const tab = state.tabs[index];
          if (!tab.running) return state;
          const delta = now - tab.lastTimestamp;
          const updated = {
            ...tab,
            running: false,
            elapsedMs: tab.elapsedMs + delta,
            lastTimestamp: now
          };
          const tabs = [...state.tabs];
          tabs[index] = updated;
          return { tabs };
        });
      },
      reset: (id) => {
        set((state) => {
          const index = getTabIndex(state.tabs, id);
          if (index === -1) return state;
          const updated = { ...state.tabs[index], running: false, elapsedMs: 0, laps: [], lastTimestamp: 0 };
          const tabs = [...state.tabs];
          tabs[index] = updated;
          return { tabs };
        });
      },
      lap: (id) => {
        const now = performance.now();
        set((state) => {
          const index = getTabIndex(state.tabs, id);
          if (index === -1) return state;
          const tab = state.tabs[index];
          const total = tab.running ? tab.elapsedMs + (now - tab.lastTimestamp) : tab.elapsedMs;
          if (total <= 0) return state;
          const lastTotal = tab.laps.length ? tab.laps[0].totalMs : 0;
          const newLap: LapRecord = {
            id: `lap-${Date.now()}-${tab.laps.length}`,
            label: `Lap ${tab.laps.length + 1}`,
            lapMs: total - lastTotal,
            totalMs: total,
            timestamp: Date.now()
          };
          const updated = { ...tab, laps: [newLap, ...tab.laps] };
          const tabs = [...state.tabs];
          tabs[index] = updated;
          return { tabs };
        });
      },
      tick: (id, now) => {
        set((state) => {
          const index = getTabIndex(state.tabs, id);
          if (index === -1) return state;
          const tab = state.tabs[index];
          if (!tab.running) return state;
          const delta = now - tab.lastTimestamp;
          const updated = {
            ...tab,
            elapsedMs: tab.elapsedMs + delta,
            lastTimestamp: now
          };
          const tabs = [...state.tabs];
          tabs[index] = updated;
          return { tabs };
        });
      },
      toggleTheme: () => {
        set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' }));
      },
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
      toggleVibration: () => {
        set((state) => ({ vibrationEnabled: !state.vibrationEnabled }));
      },
      changeAccent: (accent) => {
        set((state) => {
          const tabs = state.tabs.map((tab) =>
            tab.id === state.selectedTabId ? { ...tab, accent } : tab
          );
          return { tabs };
        });
      }
    }),
    {
      name: 'stopwatch-modern-storage',
      version: 1,
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? window.localStorage : null)),
      partialize: (state) => ({
        tabs: state.tabs,
        selectedTabId: state.selectedTabId,
        theme: state.theme,
        soundEnabled: state.soundEnabled,
        vibrationEnabled: state.vibrationEnabled
      })
    }
  )
);
