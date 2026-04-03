import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, SkipBack, SkipForward, Volume2, VolumeX, ListMusic, Play, Pause } from 'lucide-react';
import { Slider } from './ui/slider';

const TRACKS = [
  { id: 1, name: 'Midnight Neon', artist: 'Lofi Cyber', url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808f3030e.mp3' },
  { id: 2, name: 'Rainy Alley', artist: 'Synth Soul', url: 'https://cdn.pixabay.com/audio/2023/10/05/audio_2484f23e7f.mp3' },
  { id: 3, name: 'Glitch in Time', artist: 'Void Walker', url: 'https://cdn.pixabay.com/audio/2022/01/21/audio_3108343882.mp3' },
];

export function LofiPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play failed", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
  }, [currentTrackIndex]);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={nextTrack}
        loop={false}
      />
      
      <div className="flex items-center gap-4">
        <div className="relative group">
          <motion.div 
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-pink-500 p-0.5"
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
              <Music className="w-6 h-6 text-white" />
            </div>
          </motion.div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse" />
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-white font-bold truncate text-sm">{currentTrack.name}</h3>
          <p className="text-white/40 text-xs truncate">{currentTrack.artist}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={prevTrack} className="text-white/60 hover:text-white transition-colors">
            <SkipBack size={20} />
          </button>
          <button 
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
          </button>
          <button onClick={nextTrack} className="text-white/60 hover:text-white transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white transition-colors">
          {isMuted || volume[0] === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <Slider
          value={volume}
          onValueChange={setVolume}
          max={100}
          step={1}
          className="flex-1"
        />
        <button 
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-2 rounded-lg transition-colors ${showPlaylist ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        >
          <ListMusic size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4 pt-4 border-t border-white/10"
          >
            <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
              {TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => {
                    setCurrentTrackIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs flex justify-between items-center group transition-colors ${
                    idx === currentTrackIndex ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white/80'
                  }`}
                >
                  <span>{track.name}</span>
                  {idx === currentTrackIndex && isPlaying && (
                     <div className="flex gap-0.5 items-end h-3">
                        {[1, 2, 3].map(i => (
                          <motion.div
                            key={i}
                            animate={{ height: ['40%', '100%', '40%'] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                            className="w-0.5 bg-cyan-400"
                          />
                        ))}
                     </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}