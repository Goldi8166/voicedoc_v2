'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Activity, TrendingUp, Calendar, Clock,
  CheckCircle, AlertTriangle, AlertCircle, Pill,
  BarChart2, Heart, Trash2, MessageSquare
} from 'lucide-react'

interface ConsultationRecord {
  id: string
  timestamp: string
  userMessage: string
  severity: 'green' | 'yellow' | 'red'
  severity_label: string
  message: string
  language: string
}

const severityConfig = {
  green: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', icon: CheckCircle, label: 'Home Care' },
  yellow: { color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)', icon: AlertTriangle, label: 'See Doctor' },
  red: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', icon: AlertCircle, label: 'Emergency' },
}

export default function DashboardPage() {
  const [records, setRecords] = useState<ConsultationRecord[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview')

  useEffect(() => {
    const saved = localStorage.getItem('voicedoc_history')
    if (saved) {
      try { setRecords(JSON.parse(saved)) } catch {}
    }
  }, [])

  const clearHistory = () => {
    localStorage.removeItem('voicedoc_history')
    setRecords([])
  }

  // Stats
  const total = records.length
  const greenCount = records.filter(r => r.severity === 'green').length
  const yellowCount = records.filter(r => r.severity === 'yellow').length
  const redCount = records.filter(r => r.severity === 'red').length
  const recentRecords = [...records].reverse().slice(0, 10)

  // Last 7 days chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toDateString()
    const dayRecords = records.filter(r => new Date(r.timestamp).toDateString() === dateStr)
    return {
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      green: dayRecords.filter(r => r.severity === 'green').length,
      yellow: dayRecords.filter(r => r.severity === 'yellow').length,
      red: dayRecords.filter(r => r.severity === 'red').length,
      total: dayRecords.length,
    }
  })

  const maxDay = Math.max(...last7Days.map(d => d.total), 1)

  return (
    <main className="min-h-screen" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header className="glass border-b border-green-500/10 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-green-400" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <BarChart2 className="w-3.5 h-3.5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Health <span className="text-green-400">Dashboard</span>
              </div>
              <div className="text-xs text-green-400/50">Your consultation history</div>
            </div>
          </div>
        </div>
        <Link href="/chat"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition-colors"
        >
          <MessageSquare className="w-3 h-3" /> New Consultation
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {total === 0 ? (
          /* Empty State */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 border border-green-500/20 text-center"
          >
            <div className="text-5xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              No consultations yet
            </h2>
            <p className="text-green-200/50 text-sm mb-6">
              Your health consultation history will appear here after your first chat.
            </p>
            <Link href="/chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-medium transition-colors"
            >
              <Activity className="w-4 h-4" /> Start First Consultation
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
              {[
                { label: 'Total', value: total, color: '#22c55e', icon: Activity },
                { label: 'Home Care', value: greenCount, color: '#22c55e', icon: CheckCircle },
                { label: 'See Doctor', value: yellowCount, color: '#eab308', icon: AlertTriangle },
                { label: 'Emergency', value: redCount, color: '#ef4444', icon: AlertCircle },
              ].map((stat, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-xl p-4 border"
                  style={{ borderColor: `${stat.color}20` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                    <span className="text-2xl font-bold" style={{ color: stat.color, fontFamily: 'var(--font-display)' }}>
                      {stat.value}
                    </span>
                  </div>
                  <div className="text-xs text-green-200/50">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Severity Distribution */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-5 border border-green-500/15"
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-green-400" /> Severity Distribution
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Home Care (Green)', count: greenCount, color: '#22c55e' },
                  { label: 'See Doctor (Yellow)', count: yellowCount, color: '#eab308' },
                  { label: 'Emergency (Red)', count: redCount, color: '#ef4444' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: item.color }}>{item.label}</span>
                      <span className="text-green-400/50">{total > 0 ? Math.round((item.count / total) * 100) : 0}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${total > 0 ? (item.count / total) * 100 : 0}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 7 Day Chart */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-5 border border-green-500/15"
            >
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> Last 7 Days Activity
              </h3>
              <div className="flex items-end gap-2 h-28">
                {last7Days.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '80px' }}>
                      {day.red > 0 && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: `${(day.red / maxDay) * 80}px` }}
                          transition={{ duration: 0.6, delay: i * 0.05 }}
                          className="w-full rounded-sm"
                          style={{ backgroundColor: '#ef4444', minHeight: day.red > 0 ? '4px' : '0' }}
                        />
                      )}
                      {day.yellow > 0 && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: `${(day.yellow / maxDay) * 80}px` }}
                          transition={{ duration: 0.6, delay: i * 0.05 + 0.1 }}
                          className="w-full rounded-sm"
                          style={{ backgroundColor: '#eab308', minHeight: day.yellow > 0 ? '4px' : '0' }}
                        />
                      )}
                      {day.green > 0 && (
                        <motion.div
                          initial={{ height: 0 }} animate={{ height: `${(day.green / maxDay) * 80}px` }}
                          transition={{ duration: 0.6, delay: i * 0.05 + 0.2 }}
                          className="w-full rounded-sm"
                          style={{ backgroundColor: '#22c55e', minHeight: day.green > 0 ? '4px' : '0' }}
                        />
                      )}
                      {day.total === 0 && (
                        <div className="w-full rounded-sm bg-white/5" style={{ height: '4px' }} />
                      )}
                    </div>
                    <span className="text-xs text-green-400/40">{day.day}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-3 justify-center">
                {[{ color: '#22c55e', label: 'Home' }, { color: '#eab308', label: 'Doctor' }, { color: '#ef4444', label: 'Emergency' }].map((l, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-green-400/40">{l.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent History */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="glass rounded-2xl border border-green-500/15 overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-green-500/10">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-400" /> Recent Consultations
                </h3>
                <button onClick={clearHistory}
                  className="flex items-center gap-1 text-xs text-red-400/50 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>

              <div className="divide-y divide-green-500/5">
                {recentRecords.length === 0 ? (
                  <div className="px-5 py-6 text-center text-green-400/40 text-xs">No recent records</div>
                ) : (
                  recentRecords.map((record, i) => {
                    const s = severityConfig[record.severity]
                    const SevIcon = s.icon
                    return (
                      <motion.div key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="px-5 py-3 hover:bg-white/2 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: s.bg, border: `1px solid ${s.border}` }}
                          >
                            <SevIcon className="w-3.5 h-3.5" style={{ color: s.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-xs font-semibold" style={{ color: s.color }}>{record.severity_label}</span>
                              <span className="text-xs text-green-400/30">
                                {new Date(record.timestamp).toLocaleDateString('en', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-green-200/70 truncate">{record.userMessage}</p>
                          </div>
                        </div>
                      </motion.div>
                    )
                  })
                )}
              </div>
            </motion.div>

            {/* Health tip */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="glass rounded-2xl p-5 border border-green-500/15 flex items-start gap-3"
            >
              <div className="text-2xl">💡</div>
              <div>
                <div className="text-xs font-semibold text-green-400 mb-1">Health Insight</div>
                <p className="text-xs text-green-200/60 leading-relaxed">
                  {redCount > 0
                    ? `You had ${redCount} emergency consultation${redCount > 1 ? 's' : ''}. Please follow up with a doctor and keep emergency contacts ready.`
                    : yellowCount > 2
                    ? `You had ${yellowCount} consultations requiring medical attention. Consider scheduling a routine checkup.`
                    : `Great! Most of your consultations were manageable at home. Keep monitoring your health regularly.`
                  }
                </p>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </main>
  )
}
