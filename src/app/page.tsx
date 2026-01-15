'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';
import { Camera, Activity, BarChart3, ArrowRight, Shield, Zap, Hand, Video, Brain, Sparkles, ChevronDown, Cpu, Layers, Globe } from 'lucide-react';

const features = [
  {
    icon: <Camera className="w-7 h-7" />,
    title: 'Real-Time Detection',
    description: 'Instant gesture recognition with MediaPipe AI technology for seamless human-computer interaction.',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: <Activity className="w-7 h-7" />,
    title: 'Multiple Gestures',
    description: 'Support for thumbs up, victory, open palm, and many more hand gestures with high accuracy.',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    icon: <BarChart3 className="w-7 h-7" />,
    title: 'Analytics Dashboard',
    description: 'Track gesture history and analyze confidence scores in real-time with detailed insights.',
    gradient: 'from-emerald-400 to-teal-500',
  },
];

const moreFeatures = [
  {
    icon: <Video className="w-6 h-6" />,
    title: 'Video Upload',
    description: 'Analyze pre-recorded videos frame by frame with precision.',
    gradient: 'from-rose-400 to-pink-500',
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Privacy First',
    description: 'All processing happens locally in your browser. Zero data sent.',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: '20+ FPS Speed',
    description: 'Lightning-fast detection performance for real-time applications.',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: '21 Landmarks',
    description: 'Precise hand tracking with advanced neural network models.',
    gradient: 'from-violet-400 to-purple-500',
  },
];

const gestures = [
  { emoji: '👋', name: 'Open Palm' },
  { emoji: '✊', name: 'Fist' },
  { emoji: '✌️', name: 'Peace' },
  { emoji: '👉', name: 'Pointing' },
  { emoji: '👍', name: 'Thumbs Up' },
  { emoji: '👎', name: 'Thumbs Down' },
  { emoji: '🤏', name: 'Pinch' },
  { emoji: '👌', name: 'OK Sign' },
];

const stats = [
  { value: '8+', label: 'GESTURES SUPPORTED', gradient: 'from-cyan-400 to-blue-500' },
  { value: '21', label: 'HAND LANDMARKS', gradient: 'from-violet-400 to-purple-500' },
  { value: '20+', label: 'FPS DETECTION', gradient: 'from-emerald-400 to-teal-500' },
  { value: '100%', label: 'BROWSER BASED', gradient: 'from-amber-400 to-orange-500' },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050508] text-white font-sans antialiased">
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

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/80 backdrop-blur-2xl border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-12 h-12 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center shadow-xl">
                <Hand className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold tracking-tight">Phantome</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/login" className="px-5 py-2.5 text-[15px] font-medium text-white/60 hover:text-white transition-colors">
              Login
            </Link>
            <Link
              href="/signup"
              className="relative group px-6 py-3 text-[15px] font-semibold rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 transition-all group-hover:scale-105" />
              <span className="relative">Sign Up</span>
            </Link>
          </div>
        </div>
      </nav>

      <motion.section 
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-8"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="max-w-5xl mx-auto text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-10 backdrop-blur-sm">
              <Sparkles size={16} className="text-cyan-400" />
              <span>Powered by MediaPipe & Next.js 15</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.05] mb-8">
              <span className="block text-white/90">Advanced Hand Gesture</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Recognition
              </span>
            </h1>
            
            <p className="text-xl text-white/40 max-w-2xl mx-auto mb-14 leading-relaxed">
              Experience the future of human-computer interaction with real-time gesture detection powered by MediaPipe AI
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
              <Link href="/signup">
                <motion.button
                  className="group relative px-10 py-5 rounded-2xl font-semibold text-lg overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-violet-500 to-fuchsia-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-3">
                    Get Started
                    <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
              <Link href="#features">
                <motion.button
                  className="px-10 py-5 rounded-2xl font-semibold text-lg border-2 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-400 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-8 h-8 text-white/20" />
        </motion.div>
      </motion.section>

      <section id="features" className="relative z-10 min-h-screen flex items-center py-32 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-6">
              <Cpu size={14} className="text-violet-400" />
              <span>Core Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">Why Choose </span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Phantome?</span>
            </h2>
            <p className="text-xl text-white/40 max-w-xl mx-auto">
              Professional-grade gesture recognition with cutting-edge AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                <div className="relative h-full p-10 bg-white/[0.02] border border-white/[0.06] rounded-3xl backdrop-blur-sm group-hover:border-white/[0.12] group-hover:bg-white/[0.04] transition-all duration-500">
                  <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br ${feature.gradient} rounded-2xl text-white mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-white/40 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-screen flex items-center py-32 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-6">
              <Hand size={14} className="text-cyan-400" />
              <span>Gesture Library</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">Supported </span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Gestures</span>
            </h2>
            <p className="text-xl text-white/40 max-w-xl mx-auto">
              Detect 8 different hand gestures with exceptional accuracy
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {gestures.map((gesture, i) => (
              <motion.div
                key={gesture.name}
                className="group relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative p-8 bg-white/[0.02] border border-white/[0.06] rounded-3xl text-center hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all duration-300 group-hover:scale-[1.02]">
                  <span className="text-6xl mb-5 block group-hover:scale-110 transition-transform duration-300">{gesture.emoji}</span>
                  <span className="text-white/60 font-semibold text-lg group-hover:text-white transition-colors">{gesture.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-4`}>
                  {stat.value}
                </div>
                <div className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-screen flex items-center py-32 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-6">
              <Layers size={14} className="text-emerald-400" />
              <span>Additional Capabilities</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">More </span>
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Features</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moreFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                <div className="relative h-full p-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300">
                  <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${feature.gradient} rounded-xl text-white mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/40 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-[80vh] flex items-center py-32 px-8">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            className="relative overflow-hidden rounded-[40px]"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 via-violet-600/30 to-fuchsia-600/30" />
            <div className="absolute inset-[2px] bg-[#050508]/95 rounded-[38px]" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/15 rounded-full blur-[120px]" />
            
            <div className="relative p-16 sm:p-20 lg:p-24 text-center">
              <motion.div
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-3xl text-5xl mb-10 shadow-2xl shadow-cyan-500/30"
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                🚀
              </motion.div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/50 mb-12 max-w-lg mx-auto leading-relaxed">
                Create a free account and start detecting hand gestures in seconds. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/signup">
                  <motion.button
                    className="group relative px-12 py-5 rounded-2xl font-semibold text-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute inset-0 bg-white" />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-100 to-violet-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative text-[#050508] flex items-center gap-3 font-bold">
                      Create Free Account
                      <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.04] py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center">
              <Hand className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white/80">Phantome</span>
          </div>
          <p className="text-white/30 text-sm">
            © 2024 Phantome. Built with Next.js, TypeScript & MediaPipe.
          </p>
        </div>
      </footer>
    </div>
  );
}
