'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2, Hand, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/detect');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white flex items-center justify-center p-8">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.08)_0%,transparent_60%)]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.06)_0%,transparent_60%)]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_60%)]" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <Link href="/" className="flex items-center justify-center gap-4 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl blur-lg opacity-50" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center shadow-xl">
              <Hand className="w-7 h-7 text-white" />
            </div>
          </div>
          <span className="text-3xl font-bold tracking-tight">Phantome</span>
        </Link>

        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/20 via-violet-600/20 to-fuchsia-600/20" />
          <div className="absolute inset-[1px] bg-[#0a0a0f]/95 rounded-[23px]" />
          <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-violet-500/10 rounded-full blur-[80px]" />
          
          <div className="relative p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-6">
                <Sparkles size={14} className="text-cyan-400" />
                <span>Welcome back</span>
              </div>
              <h1 className="text-3xl font-bold mb-3">Sign In</h1>
              <p className="text-white/40">Continue detecting gestures</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-3">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-3">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.05] transition-all duration-300"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-rose-400 text-sm text-center">{error}</p>
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full py-4 rounded-xl font-semibold text-lg overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: loading ? 1 : 1.01 }}
                whileTap={{ scale: loading ? 1 : 0.99 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </motion.button>
            </form>

            <p className="text-center text-white/40 mt-8">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
