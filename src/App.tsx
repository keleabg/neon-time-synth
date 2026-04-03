import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerDisplay } from './components/TimerDisplay';
import { LofiPlayer } from './components/LofiPlayer';
import { SettingsModal } from './components/SettingsModal';
import { Auth } from './components/Auth';
import { usePomodoro, DEFAULT_SETTINGS } from './hooks/usePomodoro';
import { useAuth } from './hooks/useAuth';
import { Settings, Maximize2, Minimize2, Image as ImageIcon, LogOut, User as UserIcon } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import './custom-styles.css';

const BACKGROUNDS = [
  { id: 'cyber', url: 'https://storage.googleapis.com/dala-staging-public-data-storage/generated-images/ebd0a917-ae73-4a97-b182-43c9f50203ed/cyberpunk-bg-d1b019d2-1775201740471.webp', name: 'Cyber City' },
  { id: 'lofi', url: 'https://storage.googleapis.com/dala-staging-public-data-storage/generated-images/ebd0a917-ae73-4a97-b182-43c9f50203ed/lofi-room-bg-5f50e370-1775201740462.webp', name: 'Cozy Room' },
];

function App() {
  const { user, isLoading: isAuthLoading, signOut } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [bgIndex, setBgIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  
  // Load settings from local storage if available
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('pomo_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const pomo = usePomodoro(settings);

  // Persistence
  useEffect(() => {
    localStorage.setItem('pomo_settings', JSON.stringify(pomo.settings));
  }, [pomo.settings]);

  // Notifications
  useEffect(() => {
    if (pomo.timeLeft === 0) {
      toast.success(`${pomo.mode.toUpperCase()} session finished!`, {
        description: pomo.mode === 'work' ? 'Time for a break.' : 'Back to focus mode!',
        duration: 5000,
      });
      
      // Simple beep sound using Web Audio API
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.1);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
        console.error('Audio beep failed', e);
      }
    }
  }, [pomo.timeLeft, pomo.mode]);

  useEffect(() => {
    // Inject font link
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  const nextBg = () => {
    setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    toast.info(`Background changed to ${BACKGROUNDS[(bgIndex + 1) % BACKGROUNDS.length].name}`);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-cyan-500 font-bold tracking-widest text-xs uppercase">Syncing Neural Interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#08090a] overflow-hidden selection:bg-cyan-500/30 font-['Rajdhani',_sans-serif]">
      <Toaster position="top-center" theme="dark" closeButton />
      
      {/* Background Image with Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={BACKGROUNDS[bgIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-0"
        >
          <img
            src={BACKGROUNDS[bgIndex].url}
            alt="background"
            className="w-full h-full object-cover filter brightness-[0.3] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
          
          {/* Cyberpunk Scanlines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
        </motion.div>
      </AnimatePresence>

      {/* Header / Nav */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <div className="w-6 h-6 border-2 border-white rounded-sm animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter text-white uppercase">NeoPomo</h1>
            <p className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] -mt-1 uppercase">Interface v2.0.4</p>
          </div>
        </motion.div>

        <div className="flex items-center gap-2">
          {user && (
            <>
              <motion.div 
                className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white/60 mr-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <UserIcon size={14} className="text-cyan-400" />
                <span className="text-xs font-bold tracking-tight">{user.user_metadata.username || user.email}</span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={nextBg}
                className="p-3 rounded-xl text-white/60 hover:text-white transition-colors bg-white/5 border border-white/10"
              >
                <ImageIcon size={20} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullScreen}
                className="p-3 rounded-xl text-white/60 hover:text-white transition-colors bg-white/5 border border-white/10"
              >
                {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSettingsOpen(true)}
                className="p-3 rounded-xl text-white/60 hover:text-white transition-colors bg-white/5 border border-white/10"
              >
                <Settings size={20} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}
                whileTap={{ scale: 0.9 }}
                onClick={signOut}
                className="p-3 rounded-xl text-white/60 hover:text-white transition-colors bg-white/5 border border-white/10"
              >
                <LogOut size={20} />
              </motion.button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-6">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full"
            >
              <Auth />
            </motion.div>
          ) : (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <TimerDisplay
                timeLeft={pomo.timeLeft}
                formatTime={pomo.formatTime}
                isActive={pomo.isActive}
                mode={pomo.mode}
                progress={pomo.progress}
                toggleTimer={pomo.toggleTimer}
                resetTimer={pomo.resetTimer}
                switchMode={pomo.switchMode}
              />

              <div className="mt-12 flex gap-4">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Sessions</span>
                    <div className="flex gap-1">
                       {[1, 2, 3, 4].map(i => (
                          <div 
                            key={i} 
                            className={`w-3 h-1 rounded-full ${i <= (pomo.sessionsCompleted % 4 || (pomo.sessionsCompleted > 0 ? 4 : 0)) ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,1)]' : 'bg-white/10'}`} 
                          />
                       ))}
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Lofi Player */}
      {user && <LofiPlayer />}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={pomo.settings}
        onUpdate={pomo.updateSettings}
      />

      {/* Visual Accents */}
      <div className="fixed top-1/2 left-0 -translate-y-1/2 w-1 h-32 bg-cyan-500/20 blur-sm" />
      <div className="fixed top-1/2 right-0 -translate-y-1/2 w-1 h-32 bg-pink-500/20 blur-sm" />
    </div>
  );
}

export default App;