import { useState, useEffect, useCallback, useRef } from 'react';

export type PomodoroMode = 'work' | 'short' | 'long';

export interface PomodoroSettings {
  work: number;
  short: number;
  long: number;
  autoStart: boolean;
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  work: 25,
  short: 5,
  long: 15,
  autoStart: false,
};

export function usePomodoro(initialSettings: PomodoroSettings = DEFAULT_SETTINGS) {
  const [settings, setSettings] = useState<PomodoroSettings>(initialSettings);
  const [mode, setMode] = useState<PomodoroMode>('work');
  const [timeLeft, setTimeLeft] = useState(settings.work * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(settings[mode] * 60);
  }, [mode, settings]);

  const toggleTimer = () => setIsActive(!isActive);

  const switchMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(settings[newMode] * 60);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Handle session completion
      if (mode === 'work') {
        const newSessions = sessionsCompleted + 1;
        setSessionsCompleted(newSessions);
        if (newSessions % 4 === 0) {
          switchMode('long');
        } else {
          switchMode('short');
        }
      } else {
        switchMode('work');
      }

      if (settings.autoStart) {
        setIsActive(true);
      }
      
      // Play notification sound (optional, but handled in component)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, mode, settings.autoStart, sessionsCompleted]);

  // Update timeLeft if settings change and timer is reset
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(settings[mode] * 60);
    }
  }, [settings, mode, isActive]);

  const updateSettings = (newSettings: Partial<PomodoroSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    timeLeft,
    formatTime,
    isActive,
    mode,
    sessionsCompleted,
    toggleTimer,
    resetTimer,
    switchMode,
    settings,
    updateSettings,
    progress: (timeLeft / (settings[mode] * 60)) * 100,
  };
}