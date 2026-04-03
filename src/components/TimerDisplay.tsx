import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Briefcase, Zap } from 'lucide-react';
import { PomodoroMode } from '../hooks/usePomodoro';

interface TimerDisplayProps {
  timeLeft: number;
  formatTime: (s: number) => string;
  isActive: boolean;
  mode: PomodoroMode;
  progress: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: PomodoroMode) => void;
}

export function TimerDisplay({
  formatTime,
  timeLeft,
  isActive,
  mode,
  progress,
  toggleTimer,
  resetTimer,
  switchMode,
}: TimerDisplayProps) {
  const modeColors = {
    work: 'text-cyan-400 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]',
    short: 'text-pink-400 border-pink-400 shadow-[0_0_15px_rgba(244,114,182,0.5)]',
    long: 'text-purple-400 border-purple-400 shadow-[0_0_15px_rgba(192,132,252,0.5)]',
  };

  const modeIcons = {
    work: <Briefcase className="w-5 h-5" />,
    short: <Coffee className="w-5 h-5" />,
    long: <Zap className="w-5 h-5" />,
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Mode Switcher */}
      <div className="flex gap-2 p-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
        {(['work', 'short', 'long'] as PomodoroMode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              mode === m
                ? 'bg-white/20 text-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Timer Circle */}
      <div className="relative flex items-center justify-center">
        <svg className="w-64 h-64 md:w-80 md:h-80 -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            className="text-white/5"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="6"
            strokeDasharray="100 100"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 0.5, ease: 'linear' }}
            className={`${modeColors[mode]} transition-colors duration-500`}
            style={{
              strokeDashoffset: `${progress}%`,
              strokeDasharray: '283%',
              strokeLinecap: 'round',
            }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-2 mb-2 ${modeColors[mode]} bg-transparent border-none shadow-none`}
          >
            {modeIcons[mode]}
            <span className="uppercase tracking-widest text-xs font-bold">{mode} Session</span>
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            {formatTime(timeLeft)}
          </h1>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          <RotateCcw className="w-6 h-6" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,255,255,0.4)" }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className={`w-20 h-20 flex items-center justify-center rounded-full ${
            isActive ? 'bg-white/10 text-white' : 'bg-white text-black'
          } transition-all duration-300`}
        >
          {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 ml-1 fill-current" />}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
        >
          {/* Placeholder for future skipping? */}
          <div className="w-6 h-6 flex items-center justify-center text-xs">{/* cycle count could go here */}</div>
        </motion.button>
      </div>
    </div>
  );
}