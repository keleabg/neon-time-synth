import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../services/supabaseClient';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success('Successfully logged in!');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        if (error) throw error;
        toast.success('Check your email for the confirmation link!');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-160px)] px-6 relative z-20">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border-l-cyan-500/30 border-r-pink-500/30"
      >
        <div className="text-center mb-8">
          <motion.div 
             className="inline-flex items-center justify-center p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 mb-4"
             animate={{ scale: [1, 1.05, 1], boxShadow: ["0 0 0px rgba(6,182,212,0)", "0 0 15px rgba(6,182,212,0.3)", "0 0 0px rgba(6,182,212,0)"] }}
             transition={{ duration: 3, repeat: Infinity }}
          >
            <Sparkles className="text-cyan-400" size={24} />
          </motion.div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-white/40 text-sm mt-2 font-medium tracking-wide uppercase">
            {isLogin ? 'Access your focus interface' : 'Begin your cyberpunk focus journey'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div
                key="username-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1.5"
              >
                <label className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] uppercase ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="cyber_pioneer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 outline-none transition-all duration-300"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1.5">
            <label className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] uppercase ml-1">Email Protocol</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-cyan-400 transition-colors" size={18} />
              <input
                type="email"
                placeholder="user@neuralink.net"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] text-pink-400 font-bold tracking-[0.2em] uppercase ml-1">Access Code</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-pink-400 transition-colors" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/20 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-pink-600 hover:from-cyan-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(6,182,212,0.3)] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group mt-6"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span className="uppercase tracking-widest">{isLogin ? 'Initialize System' : 'Establish Connection'}</span>
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-white/40 hover:text-white transition-colors uppercase tracking-widest font-bold flex items-center justify-center gap-2 mx-auto"
          >
            <span className="w-8 h-px bg-white/10"></span>
            {isLogin ? "Need credentials?" : "Already registered?"}
            <span className="text-cyan-400">{isLogin ? 'Sign Up' : 'Login'}</span>
            <span className="w-8 h-px bg-white/10"></span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}