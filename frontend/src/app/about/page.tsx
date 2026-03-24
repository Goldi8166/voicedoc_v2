'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Activity, Globe, Shield, Code2, Users } from 'lucide-react'

const team = [
  { name: 'Panshul', role: 'Full Stack & AI Developer', stack: 'Next.js · Flask · Claude API' },
]

const techStack = [
  { name: 'Next.js 15', desc: 'React framework for the frontend', color: '#ffffff' },
  { name: 'Flask (Python)', desc: 'Backend API and AI orchestration', color: '#22c55e' },
  { name: 'Groq (LLaMA 3.3)', desc: 'Core AI triage engine — fast & free', color: '#d97706'  },
  { name: 'Framer Motion', desc: 'Fluid UI animations', color: '#a855f7' },
  { name: 'Tailwind CSS', desc: 'Utility-first styling', color: '#38bdf8' },
  { name: 'OpenStreetMap', desc: 'Free, open maps for clinic finding', color: '#f97316' },
]

const impact = [
  { icon: Users, value: '600M+', label: 'Rural Indians without specialist access' },
  { icon: Globe, value: '2B+', label: 'People globally with limited healthcare' },
  { icon: Activity, value: '40%', label: 'Estimated unnecessary hospital visits' },
  { icon: Heart, value: '< 30s', label: 'Average triage time with VoiceDoc' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen px-4 py-8" style={{ fontFamily: 'var(--font-body)' }}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-400/60 hover:text-green-400 text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Hero */}
          <div className="glass rounded-2xl p-8 border border-green-500/20 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                  About Voice<span className="text-green-400">Doc</span>
                </h1>
                <p className="text-green-400/50 text-sm">AI Health Triage Assistant</p>
              </div>
            </div>
            <p className="text-green-200/70 leading-relaxed">
              VoiceDoc is an AI-powered health triage assistant built for rural communities in India and across the Global South.
              It helps people with limited healthcare access understand their symptoms, assess urgency, and find the nearest
              medical facility — in Hindi or English, by voice or text, on any smartphone.
            </p>
          </div>

          {/* The Problem */}
          <div className="glass rounded-2xl p-6 border border-green-500/20 mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-red-400">⚠</span> The Problem
            </h2>
            <p className="text-green-200/70 text-sm leading-relaxed mb-4">
              In rural India, there is <strong className="text-white">1 doctor for every 11,000 patients</strong> — 
              eleven times worse than WHO recommendations. When someone falls ill, they face an impossible choice:
              make a 4–6 hour journey to a clinic (often for something manageable at home), or self-medicate
              dangerously with no information.
            </p>
            <p className="text-green-200/70 text-sm leading-relaxed">
              This isn't just India's problem. Over <strong className="text-white">2 billion people globally</strong> face
              similar barriers. VoiceDoc is built for India first — as a replicable blueprint for any underserved community.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
              {impact.map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <item.icon className="w-4 h-4 text-green-400 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-400" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.value}
                  </div>
                  <div className="text-xs text-green-200/40 leading-tight mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* The Solution */}
          <div className="glass rounded-2xl p-6 border border-green-500/20 mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <span className="text-green-400">✓</span> The Solution
            </h2>
            <p className="text-green-200/70 text-sm leading-relaxed">
              VoiceDoc gives people an AI-powered first opinion in seconds. Users describe symptoms by voice or text
              in Hindi or English. Claude AI assesses severity and responds with:
            </p>
            <ul className="mt-3 space-y-2">
              {[
                '🟢 GREEN: Home care advice for minor symptoms',
                '🟡 YELLOW: Clear instructions to see a doctor soon',
                '🔴 RED: Emergency alert with immediate ambulance call button',
                '🗺️ MAP: Nearest PHC, CHC, or hospital with phone numbers',
              ].map((item, i) => (
                <li key={i} className="text-sm text-green-200/60 flex gap-2 items-start">
                  <span className="flex-shrink-0">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="glass rounded-2xl p-6 border border-green-500/20 mb-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <Code2 className="w-4 h-4 text-green-400" /> AI Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {techStack.map((tech, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-green-500/5 border border-green-500/10">
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: tech.color }} />
                  <div>
                    <div className="text-sm font-semibold text-white">{tech.name}</div>
                    <div className="text-xs text-green-200/40">{tech.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="glass rounded-2xl p-6 border border-yellow-500/20 mb-6">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
              <Shield className="w-4 h-4 text-yellow-400" /> Important Disclaimer
            </h2>
            <p className="text-yellow-200/60 text-sm leading-relaxed">
              VoiceDoc is <strong className="text-yellow-300">not a medical device</strong> and does not provide medical diagnoses.
              It is an AI assistant designed to help people make informed decisions about seeking care.
              Always consult a qualified healthcare professional for proper medical advice, diagnosis, and treatment.
              In emergencies, call <strong className="text-red-400">102</strong> immediately.
            </p>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-green-500/30"
            >
              Try VoiceDoc Now
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
