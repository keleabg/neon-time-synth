import { Settings2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PomodoroSettings } from '../hooks/usePomodoro';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onUpdate: (settings: Partial<PomodoroSettings>) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onUpdate }: SettingsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl z-[70]"
          >
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Settings2 className="text-cyan-400" />
                <h2 className="text-xl font-bold text-white">System Config</h2>
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white">
                <X />
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-white/60">Work Duration</Label>
                  <span className="text-cyan-400 font-mono">{settings.work}m</span>
                </div>
                <Slider
                  value={[settings.work]}
                  onValueChange={(v) => onUpdate({ work: v[0] })}
                  max={60}
                  min={1}
                  step={1}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-white/60">Short Break</Label>
                  <span className="text-pink-400 font-mono">{settings.short}m</span>
                </div>
                <Slider
                  value={[settings.short]}
                  onValueChange={(v) => onUpdate({ short: v[0] })}
                  max={15}
                  min={1}
                  step={1}
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label className="text-white/60">Long Break</Label>
                  <span className="text-purple-400 font-mono">{settings.long}m</span>
                </div>
                <Slider
                  value={[settings.long]}
                  onValueChange={(v) => onUpdate({ long: v[0] })}
                  max={30}
                  min={1}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="space-y-0.5">
                  <Label className="text-white">Auto-start Sessions</Label>
                  <p className="text-xs text-white/40">Automatically begin next timer</p>
                </div>
                <Switch
                  checked={settings.autoStart}
                  onCheckedChange={(checked) => onUpdate({ autoStart: checked })}
                />
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-cyan-400 transition-colors uppercase tracking-widest text-sm"
            >
              Apply Changes
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}