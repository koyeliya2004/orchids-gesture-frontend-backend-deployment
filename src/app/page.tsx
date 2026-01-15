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
    title: 'Analytics',
    description: 'Real-time analytics, per-user gesture breakdown, and exportable reports.',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    icon: <Globe className="w-7 h-7" />,
    title: 'API & SDK',
    description: 'Integrate gesture events into your apps with a lightweight Web SDK and REST API.',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'Privacy First',
    description: 'All processing can run locally in the browser — no video leaves the user unless configured.',
    gradient: 'from-rose-400 to-pink-500',
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
    icon: <Zap className="w-6 h-6" />,
    title: 'Edge / Offline Mode',
    description: 'Run models on-device with no network needed for privacy and low-latency.',
    gradient: 'from-cyan-400 to-blue-500',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: 'Custom Gesture Training',
    description: 'Teach the system new gestures using a simple labeled examples workflow.',
    gradient: 'from-violet-400 to-purple-500',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Export & Integrations',
    description: 'Export gesture logs to CSV, connect via webhooks, or push events to your analytics.',
    gradient: 'from-emerald-400 to-teal-500',
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
    <div ref={containerRef} className="min-h-screen text-white font-sans antialiased text-center">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.35)_0%,rgba(139,92,246,0.25)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.32)_0%,rgba(168,85,247,0.22)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[900px] h-[900px] bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.32)_0%,rgba(14,165,233,0.22)_40%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(236,72,153,0.25)_0%,transparent_60%)] blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.28)_0%,transparent_60%)] blur-2xl" />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050508]/60 backdrop-blur-2xl border-b border-white/[0.08]">
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
            <Link href="/detect" className="relative group px-6 py-3 text-[15px] font-semibold rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-violet-500 transition-all group-hover:scale-105" />
              <span className="relative">Get Started</span>
            </Link>
          </div>
        </div>
      </nav>

      <motion.section 
        className="relative z-10 min-h-screen flex items-center justify-center px-8 hero-background"
        style={{ y: heroY, opacity: heroOpacity }}
      >
        <div className="hero-content-wrapper w-full flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-5xl w-full mx-auto text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-10 backdrop-blur-sm text-center">
              <Sparkles size={16} className="text-cyan-400" />
              <span>Powered by MediaPipe & Next.js 15</span>
            </div>
            
            <h1 className="text-6xl sm:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.02] mb-6 text-center">
              <span className="block text-white">Advanced Hand Gesture</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Recognition
              </span>
            </h1>

            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed text-center">
              Experience the future of human-computer interaction with real-time gesture detection powered by MediaPipe AI. Runs in-browser for privacy, low-latency, and easy integration.
            </p>

            <div className="max-w-4xl mx-auto text-white/90 mb-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-base font-bold text-white mb-3">Use Cases</div>
                <ul className="text-sm space-y-2 text-white/80 text-center">
                  <li>Contactless UI controls</li>
                  <li>Hands-free navigation</li>
                  <li>Interactive exhibits</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white mb-3">Integrations</div>
                <ul className="text-sm space-y-2 text-white/80 text-center">
                  <li>Web SDK & REST API</li>
                  <li>CSV / JSON Exports</li>
                  <li>Webhooks Pipelines</li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-base font-bold text-white mb-3">Security & Privacy</div>
                <ul className="text-sm space-y-2 text-white/80 text-center">
                  <li>Local Processing</li>
                  <li>Opt-in Analytics</li>
                  <li>GDPR-Friendly</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
              <Link href="/detect">
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
      </div>

        <motion.div 
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/40" />
        </motion.div>
      </motion.section>
      {/* scanline overlay for hero */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="scanline" />
      </div>

      <section id="features" className="relative z-10 min-h-screen flex items-center py-32 px-8">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            className="text-center mb-24"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-6 text-center">
              <Cpu size={14} className="text-violet-400" />
              <span>Core Features</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">Why Choose </span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Phantome?</span>
            </h2>
            <p className="text-xl text-white/40 max-w-xl mx-auto text-center">
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
                <div className="relative h-full p-10 bg-white/[0.03] border border-white/[0.08] rounded-3xl backdrop-blur-sm group-hover:border-white/[0.15] group-hover:bg-white/[0.06] transition-all duration-500 flex flex-col items-center text-center">
                  <div className={`w-20 h-20 flex items-center justify-center bg-gradient-to-br ${feature.gradient} rounded-2xl text-white mb-8 shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-white/70 text-lg leading-relaxed text-center">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="analytics" className="relative z-10 py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-12 flex flex-col items-center text-center gap-10 shadow-xl backdrop-blur-md">
            <div className="max-w-3xl">
              <h3 className="text-3xl font-bold text-white mb-4">Analytics Overview</h3>
              <p className="text-white/70 text-lg mb-10 text-center">Quick insights into gesture usage, accuracy, and per-user trends. Export CSVs or open the full analytics dashboard for deeper analysis.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
                <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                  <div className="text-sm text-white/60 mb-1 text-center">Total Events</div>
                  <div className="text-3xl font-black text-cyan-400">12,482</div>
                </div>
                <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                  <div className="text-sm text-white/60 mb-1 text-center">Avg Confidence</div>
                  <div className="text-3xl font-black text-violet-400">92%</div>
                </div>
                <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                  <div className="text-sm text-white/60 mb-1 text-center">Active Users</div>
                  <div className="text-3xl font-black text-emerald-400">1,238</div>
                </div>
                <div className="p-6 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                  <div className="text-sm text-white/60 mb-1 text-center">Realtime FPS</div>
                  <div className="text-3xl font-black text-amber-400">24</div>
                </div>
              </div>

              <div className="flex justify-center gap-5">
                <Link href="/detect" className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-violet-500 rounded-xl font-bold hover:scale-105 transition-transform">Open Detector</Link>
                <Link href="/api/analytics" className="px-8 py-3 border-2 border-white/20 rounded-xl text-white font-bold hover:bg-white/10 transition-all">View Dashboard</Link>
              </div>
            </div>
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full text-white/50 text-sm font-medium mb-6 text-center">
              <Hand size={14} className="text-cyan-400" />
              <span>Gesture Library</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="text-white">Supported </span>
              <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">Gestures</span>
            </h2>
            <p className="text-xl text-white/40 max-w-xl mx-auto text-center">
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
                <div className="text-white/40 text-sm uppercase tracking-[0.2em] font-medium text-center">{stat.label}</div>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-full text-white/60 text-sm font-semibold mb-6 shadow-sm text-center">
                <Layers size={14} className="text-emerald-300" />
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
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-25 transition-opacity duration-500`} />
                <div className="relative h-full p-8 bg-white/[0.04] border border-white/[0.1] rounded-2xl hover:border-white/[0.2] hover:bg-white/[0.08] transition-all duration-300 shadow-md flex flex-col items-center text-center">
                  <div className={`w-16 h-16 flex items-center justify-center bg-gradient-to-br ${feature.gradient} rounded-xl text-white mb-6 shadow-xl group-hover:scale-105 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed text-center">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 min-h-[80vh] flex items-center py-32 px-8">
        <div className="max-w-5xl mx-auto w-full">
          <motion.div
            className="relative overflow-hidden rounded-[40px] shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/40 via-violet-600/40 to-fuchsia-600/40" />
            <div className="absolute inset-[2px] bg-white/[0.05] backdrop-blur-3xl rounded-[38px]" />
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/25 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/25 rounded-full blur-[120px]" />
            
            <div className="relative p-16 sm:p-20 lg:p-24 text-center">
              <div
                className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-cyan-400 to-violet-400 rounded-3xl text-5xl mb-8 shadow-2xl"
                aria-hidden
              >
                🚀
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-12 max-w-lg mx-auto leading-relaxed font-medium text-center">
                Create a free account and start detecting hand gestures in seconds. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/detect">
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

      <section id="about" className="relative z-10 py-20 px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">About Phantome</h2>
          <p className="text-white/90 max-w-3xl mx-auto mb-12 text-lg leading-relaxed text-center">Phantome is a lightweight, privacy-first hand gesture recognition platform that runs directly in the browser. It uses MediaPipe models to detect hand landmarks and translates them into actionable gesture events for UI control, accessibility flows, and interactive installations.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-8 bg-white/[0.04] border border-white/[0.1] rounded-2xl shadow-lg backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-3">Privacy-first</h3>
              <p className="text-white/70 text-base text-center">Processing runs locally by default; no camera data leaves the device unless explicitly uploaded.</p>
            </div>
            <div className="p-8 bg-white/[0.04] border border-white/[0.1] rounded-2xl shadow-lg backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-3">Integrations</h3>
              <p className="text-white/70 text-base text-center">Simple Web SDK & REST APIs to stream gesture events into your apps or analytics pipelines.</p>
            </div>
            <div className="p-8 bg-white/[0.04] border border-white/[0.1] rounded-2xl shadow-lg backdrop-blur-sm">
              <h3 className="text-white font-bold text-xl mb-3">Realtime</h3>
              <p className="text-white/70 text-base text-center">Low-latency detection (20+ FPS) with on-device inference for smooth interactions.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.08] py-16 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
              <Hand className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">Phantome</span>
          </div>
          <p className="text-white/60 text-sm font-medium text-center">
            © 2026 Phantome. Built with Next.js 15, TypeScript & MediaPipe AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
