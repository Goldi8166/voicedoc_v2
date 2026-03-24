'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mic, MessageSquare, MapPin, Shield, Globe, ArrowRight, Heart, Activity, Users } from 'lucide-react'

const stats = [
  { value: '600M+', label: 'Rural Indians lack doctor access', icon: Users },
  { value: '1:11,000', label: 'Doctor-to-patient ratio in rural areas', icon: Activity },
  { value: '4–6hrs', label: 'Average travel time to specialist', icon: MapPin },
]

const features = [
  {
    icon: Mic,
    title: 'Voice First',
    desc: 'Speak your symptoms naturally. No typing needed — designed for all literacy levels.',
    color: 'from-green-500/20 to-green-600/5',
    border: 'border-green-500/20',
  },
  {
    icon: Globe,
    title: 'Hindi & English',
    desc: 'Full bilingual support. Ask in Hindi, Hinglish, or English — we understand all.',
    color: 'from-yellow-500/20 to-yellow-600/5',
    border: 'border-yellow-500/20',
  },
  {
    icon: Activity,
    title: 'AI Triage',
    desc: 'Instant severity assessment: Green (home care), Yellow (see doctor), Red (emergency).',
    color: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-500/20',
  },
  {
    icon: MapPin,
    title: 'Find Clinics',
    desc: 'Nearest PHCs, CHCs, and hospitals on a live map. Know exactly where to go.',
    color: 'from-purple-500/20 to-purple-600/5',
    border: 'border-purple-500/20',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'Zero data stored on servers. Your health information stays on your device.',
    color: 'from-red-500/20 to-red-600/5',
    border: 'border-red-500/20',
  },
  {
    icon: Heart,
    title: 'Not a Replacement',
    desc: 'VoiceDoc guides you to care — it never replaces a real doctor. Always consult a professional.',
    color: 'from-pink-500/20 to-pink-600/5',
    border: 'border-pink-500/20',
  },
]

const severityExamples = [
  { color: '#22c55e', label: 'GREEN', title: 'Home Care', example: 'Common cold, mild headache, small cut' },
  { color: '#eab308', label: 'YELLOW', title: 'See Doctor Soon', example: 'Fever >101°F, persistent pain, swelling' },
  { color: '#ef4444', label: 'RED', title: 'Emergency Now', example: 'Chest pain, difficulty breathing, unconscious' },
]

export default function Home() {
  return (
    <main className="min-h-screen" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-green-500/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
            <Activity className="w-4 h-4 text-green-400" />
          </div>
          <span className="text-white font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
            Voice<span className="text-green-400">Doc</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/about" className="text-sm text-green-300/70 hover:text-green-300 transition-colors">
            About
          </Link>
          <Link href="/dashboard" className="text-sm text-green-300/70 hover:text-green-300 transition-colors">
            Dashboard
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25"
          >
            Start <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative">
        {/* Decorative ring */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-green-500/5 pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full border border-green-500/8 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Health Triage · Hindi & English
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Healthcare guidance
            <br />
            <span className="text-green-400">in your language,</span>
            <br />
            <span className="text-white/60">on your phone.</span>
          </h1>

          <p className="text-lg md:text-xl text-green-200/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Describe your symptoms by voice or text. Get instant AI triage, home care tips,
            and directions to the nearest clinic — no internet knowledge required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/chat"
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-lg transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30 hover:-translate-y-0.5"
            >
              <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Start Triage Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-2 px-8 py-4 rounded-xl glass border border-green-500/20 text-green-300 font-medium text-lg hover:border-green-500/40 transition-all duration-200"
            >
              <Heart className="w-4 h-4" />
              Learn More
            </Link>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="glass rounded-xl p-5 border border-green-500/10">
              <div className="text-3xl font-bold text-green-400 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
                {stat.value}
              </div>
              <div className="text-xs text-green-200/50 leading-relaxed">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Severity Guide */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              3-Level Triage System
            </h2>
            <p className="text-green-200/50 text-sm">Instant, clear guidance based on your symptoms</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {severityExamples.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-xl p-5 border"
                style={{ borderColor: `${s.color}30` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: s.color, boxShadow: `0 0 10px ${s.color}60` }}
                  />
                  <span className="text-xs font-bold tracking-widest" style={{ color: s.color }}>
                    {s.label}
                  </span>
                </div>
                <div className="text-white font-semibold mb-1">{s.title}</div>
                <div className="text-green-200/40 text-xs leading-relaxed">{s.example}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Built for real people
            </h2>
            <p className="text-green-200/50">Not just tech for tech's sake — every feature has a purpose.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass rounded-xl p-5 border ${f.border} bg-gradient-to-br ${f.color} hover:border-opacity-50 transition-all duration-300 group`}
              >
                <div className="w-9 h-9 rounded-lg glass border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon className="w-4 h-4 text-green-300" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm">{f.title}</h3>
                <p className="text-green-200/50 text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass rounded-2xl p-12 border border-green-500/20"
        >
          <div className="text-4xl mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to get started?
          </h2>
          <p className="text-green-200/60 mb-8 text-sm leading-relaxed">
            Describe your symptoms now. Free, instant, and private.
            <br />
            <strong className="text-green-400">Not a medical diagnosis</strong> — always consult a real doctor.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/30"
          >
            <Mic className="w-5 h-5" />
            Talk to VoiceDoc
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-green-500/10 text-center">
        <p className="text-green-200/30 text-xs">
          VoiceDoc is not a medical device. Always consult a qualified healthcare professional for medical advice.
          <br />
          Built for <strong className="text-green-400">GenAI Devs Hackathon 2026</strong> · Social Good: Healthcare Accessibility
        </p>
      </footer>
    </main>
  )
}
