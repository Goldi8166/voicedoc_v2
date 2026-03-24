'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic, MicOff, Send, ArrowLeft, MapPin, RotateCcw,
  AlertTriangle, CheckCircle, AlertCircle, Activity,
  ChevronDown, ChevronUp, Phone, Star, Clock, Navigation,
  Camera, Pill, ShieldAlert, Baby, Heart, Volume2, VolumeX, MessageCircle
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  triage?: TriageResult
  medicine?: MedicineResult
  imagePreview?: string
  timestamp: Date
}

interface TriageResult {
  message: string
  severity: 'green' | 'yellow' | 'red'
  severity_label: string
  severity_reason: string
  advice: string[]
  warning_signs: string[]
  should_ask: string | null
  emergency_number: string
}

interface MedicineResult {
  identified: boolean
  name?: string
  category?: string
  uses?: string
  dosage?: string
  duration?: string
  side_effects?: string[]
  warnings?: string[]
  food_interactions?: string
  safe_for_children?: boolean
  safe_for_pregnant?: boolean
  prescription_required?: boolean
  storage?: string
  message?: string
}

interface Clinic {
  id: number
  name: string
  type: string
  distance: string
  phone: string
  hours: string
  lat: number
  lon: number
  emergency: boolean
  rating: any
  address: string
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || ''

const severityConfig = {
  green: {
    color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)',
    icon: CheckCircle, label: 'Home Care', glow: '0 0 30px rgba(34,197,94,0.2)',
  },
  yellow: {
    color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)',
    icon: AlertTriangle, label: 'See Doctor Soon', glow: '0 0 30px rgba(234,179,8,0.2)',
  },
  red: {
    color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)',
    icon: AlertCircle, label: 'Emergency Now', glow: '0 0 30px rgba(239,68,68,0.2)',
  },
}

const quickSymptoms = [
  'I have a fever and body aches',
  'मुझे सिरदर्द और उल्टी हो रही है',
  'Chest pain and difficulty breathing',
  'ਮੈਨੂੰ ਬੁਖਾਰ ਹੈ',
  'আমার পেটে ব্যথা',
]

const languages = [
  { code: 'en', label: '🇬🇧 English', short: 'EN' },
  { code: 'hi', label: '🇮🇳 Hindi', short: 'हि' },
  { code: 'pa', label: '🇮🇳 Punjabi', short: 'ਪੰ' },
  { code: 'bn', label: '🇮🇳 Bengali', short: 'বাং' },
  { code: 'ta', label: '🇮🇳 Tamil', short: 'தமி' },
  { code: 'te', label: '🇮🇳 Telugu', short: 'తె' },
  { code: 'mr', label: '🇮🇳 Marathi', short: 'म' },
  { code: 'gu', label: '🇮🇳 Gujarati', short: 'ગુ' },
]

const placeholders: any = {
  en: 'Describe symptoms or scan medicine...',
  hi: 'लक्षण बताएं या दवाई स्कैन करें...',
  pa: 'ਆਪਣੇ ਲੱਛਣ ਦੱਸੋ...',
  bn: 'উপসর্গ বলুন...',
  ta: 'அறிகுறிகளை சொல்லுங்கள்...',
  te: 'లక్షణాలు చెప్పండి...',
  mr: 'लक्षणे सांगा...',
  gu: 'લક્ષણો જણાવો...',
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [lastSeverity, setLastSeverity] = useState<'green' | 'yellow' | 'red' | null>(null)
  const [expandedAdvice, setExpandedAdvice] = useState<string | null>(null)
  const [language, setLanguage] = useState('en')
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [userLocation, setUserLocation] = useState({ lat: 28.6139, lon: 77.2090 })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [isScanningMedicine, setIsScanningMedicine] = useState(false)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [sosNumber, setSosNumber] = useState<string>('')
  const [showSosSetup, setShowSosSetup] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  const speakText = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return
    if (speakingId === msgId) {
      window.speechSynthesis.cancel()
      setSpeakingId(null)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    const lm: any = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN', gu: 'gu-IN' }
    utterance.lang = lm[language] || 'en-IN'
    utterance.rate = 0.9
    utterance.onend = () => setSpeakingId(null)
    utterance.onerror = () => setSpeakingId(null)
    setSpeakingId(msgId)
    window.speechSynthesis.speak(utterance)
  }

  const sendSOS = () => {
    const message = `🚨 EMERGENCY ALERT from VoiceDoc!\n\nMujhe turant madad chahiye. Meri location:\nhttps://maps.google.com/?q=${userLocation.lat},${userLocation.lon}\n\nPlease call 102 ya mujhse contact karo!`
    if (sosNumber) {
      window.open(`https://wa.me/${sosNumber}?text=${encodeURIComponent(message)}`, '_blank')
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
    }
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        () => {}
      )
    }
  }, [])

  useEffect(() => {
    setMessages([{
      id: '0', role: 'assistant', content: '',
      triage: {
        message: "Hello! I'm VoiceDoc 👋\n\nI can help you with:\n🩺 Health symptom triage\n💊 Medicine Scanner — photo se medicine ki puri info paao\n\nType symptoms ya camera icon se medicine scan karo!",
        severity: 'green', severity_label: 'Ready to Help',
        severity_reason: 'Describe symptoms or scan medicine',
        advice: ['Symptoms clearly describe karo', 'Medicine scan ke liye camera icon dabao', '8 Indian languages supported'],
        warning_signs: [], should_ask: null, emergency_number: '102 (Ambulance India)'
      },
      timestamp: new Date()
    }])
  }, [])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setImagePreview(result)
      setImageBase64(result.split(',')[1])
    }
    reader.readAsDataURL(file)
  }

  const scanMedicine = async () => {
    if (!imageBase64) return
    setIsScanningMedicine(true)

    const userMsg: Message = {
      id: Date.now().toString(), role: 'user',
      content: '💊 Medicine scan kiya',
      imagePreview: imagePreview || undefined,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMsg])
    setImagePreview(null)
    setImageBase64(null)

    try {
      const response = await fetch(`${BACKEND_URL}/api/medicine-scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, language })
      })
      if (!response.ok) throw new Error('Scan failed')
      const data: MedicineResult = await response.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: '', medicine: data, timestamp: new Date()
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant', content: '',
        medicine: { identified: false, message: 'Scan failed. Please try with a clearer image.' },
        timestamp: new Date()
      }])
    } finally {
      setIsScanningMedicine(false)
    }
  }

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(), role: 'user', content: text, timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    const history = messages
      .filter(m => m.role === 'user' || (m.role === 'assistant' && m.triage))
      .map(m => ({ role: m.role, content: m.role === 'assistant' ? (m.triage?.message || '') : m.content }))

    try {
      const response = await fetch(`${BACKEND_URL}/api/triage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, language, history })
      })
      if (!response.ok) throw new Error('API error')
      const data: TriageResult = await response.json()
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: data.message, triage: data, timestamp: new Date()
      }])
      setLastSeverity(data.severity)
      if (data.severity === 'red') setShowMap(true)

      // Save to localStorage for dashboard
      const record = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        userMessage: text,
        severity: data.severity,
        severity_label: data.severity_label,
        message: data.message,
        language,
      }
      const existing = JSON.parse(localStorage.getItem('voicedoc_history') || '[]')
      localStorage.setItem('voicedoc_history', JSON.stringify([...existing, record].slice(-100)))
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(), role: 'assistant', content: '',
        triage: {
          message: 'Connection error. If emergency, call 102.',
          severity: 'green', severity_label: 'Connection Error',
          severity_reason: 'Could not reach server',
          advice: ['Try again'], warning_signs: [], should_ask: null, emergency_number: '102'
        },
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
    }
  }, [messages, isLoading, language])

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Please use Chrome for voice input.')
      return
    }
    if (isRecording) { recognitionRef.current?.stop(); setIsRecording(false); return }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SR()
    const lm: any = { en: 'en-IN', hi: 'hi-IN', pa: 'pa-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN', gu: 'gu-IN' }
    recognition.lang = lm[language] || 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (e: any) => { setInput(e.results[0][0].transcript); setIsRecording(false) }
    recognition.onerror = () => setIsRecording(false)
    recognition.onend = () => setIsRecording(false)
    recognitionRef.current = recognition
    recognition.start()
    setIsRecording(true)
  }

  const resetChat = () => {
    setMessages([]); setLastSeverity(null); setShowMap(false)
    setImagePreview(null); setImageBase64(null)
    setTimeout(() => setMessages([{
      id: '0', role: 'assistant', content: '',
      triage: { message: 'Chat reset!', severity: 'green', severity_label: 'Ready',
        severity_reason: 'New session', advice: [], warning_signs: [], should_ask: null, emergency_number: '102' },
      timestamp: new Date()
    }]), 100)
  }

  const currentLang = languages.find(l => l.code === language)
  const sev = lastSeverity ? severityConfig[lastSeverity] : null

  return (
    <div className="flex flex-col h-screen" style={{ fontFamily: 'var(--font-body)' }}>
      <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />

      {/* Header */}
      <header className="glass border-b border-green-500/10 px-4 py-3 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <ArrowLeft className="w-4 h-4 text-green-400" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                Voice<span className="text-green-400">Doc</span>
              </div>
              <div className="text-xs text-green-400/50">AI Health + MediScan</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {sev && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: sev.bg, border: `1px solid ${sev.border}`, color: sev.color }}
            >
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: sev.color }} />
              {sev.label}
            </motion.div>
          )}
          <div className="relative">
            <button onClick={() => setShowLangMenu(!showLangMenu)}
              className="px-2.5 py-1 rounded-lg glass border border-green-500/20 text-xs text-green-300 hover:border-green-500/40 transition-colors flex items-center gap-1"
            >
              {currentLang?.short || 'EN'} <ChevronDown className="w-3 h-3" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 top-8 glass border border-green-500/20 rounded-xl overflow-hidden z-50 w-36 shadow-xl">
                {languages.map(lang => (
                  <button key={lang.code}
                    onClick={() => { setLanguage(lang.code); setShowLangMenu(false) }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-green-500/10 transition-colors ${language === lang.code ? 'text-green-400 bg-green-500/10' : 'text-green-200/70'}`}
                  >{lang.label}</button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowMap(!showMap)}
            className={`p-1.5 rounded-lg transition-colors ${showMap ? 'bg-green-500/20 text-green-400' : 'hover:bg-white/5 text-green-400/50'}`}
          ><MapPin className="w-4 h-4" /></button>
          <button onClick={resetChat} className="p-1.5 rounded-lg hover:bg-white/5 text-green-400/50 hover:text-green-400 transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div key={msg.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'user' ? (
                    <div className="max-w-sm space-y-2">
                      {msg.imagePreview && (
                        <div className="rounded-xl overflow-hidden border border-green-500/20">
                          <img src={msg.imagePreview} alt="Medicine" className="w-full max-h-40 object-cover" />
                        </div>
                      )}
                      {msg.content && (
                        <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-green-600/30 border border-green-500/20 text-green-100 text-sm leading-relaxed">
                          {msg.content}
                        </div>
                      )}
                    </div>
                  ) : msg.medicine ? (
                    <MedicineCard medicine={msg.medicine} />
                  ) : msg.triage ? (
                    <TriageCard triage={msg.triage} expanded={expandedAdvice === msg.id}
                      onToggle={() => setExpandedAdvice(expandedAdvice === msg.id ? null : msg.id)}
                      onSpeak={() => speakText(msg.triage!.message, msg.id)}
                      isSpeaking={speakingId === msg.id}
                    />
                  ) : null}
                </motion.div>
              ))}
            </AnimatePresence>

            {(isLoading || isScanningMedicine) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                <div className="glass border border-green-500/20 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-xs text-green-400/50 mr-1">
                      {isScanningMedicine ? '💊 Scanning medicine' : 'Analyzing'}
                    </span>
                    {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400 typing-dot" />)}
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick symptoms */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
              {quickSymptoms.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full glass border border-green-500/15 text-green-300/70 text-xs hover:border-green-500/30 hover:text-green-300 transition-all"
                >{s}</button>
              ))}
            </div>
          )}

          {/* Image preview */}
          {imagePreview && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mx-4 mb-2 glass border border-green-500/20 rounded-xl p-3"
            >
              <div className="flex items-center gap-3">
                <img src={imagePreview} alt="Medicine preview" className="w-16 h-16 rounded-lg object-cover border border-green-500/20" />
                <div className="flex-1">
                  <p className="text-xs text-green-300 font-medium">Medicine photo ready</p>
                  <p className="text-xs text-green-400/50 mt-0.5">Tap Scan to identify this medicine</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={scanMedicine}
                    className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-medium transition-colors flex items-center gap-1"
                  ><Pill className="w-3 h-3" /> Scan</button>
                  <button onClick={() => { setImagePreview(null); setImageBase64(null) }}
                    className="p-1.5 rounded-lg glass border border-green-500/20 text-green-400/50 hover:text-green-400 transition-colors"
                  ><RotateCcw className="w-3 h-3" /></button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Emergency banner */}
          {lastSeverity === 'red' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="mx-4 mb-2 rounded-xl bg-red-500/10 border border-red-500/30 overflow-hidden"
            >
              <div className="px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-xs text-red-300">Emergency detected. Call or send SOS!</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowSosSetup(!showSosSetup)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500 text-white text-xs font-bold hover:bg-orange-400 transition-colors"
                  >🆘 SOS</button>
                  <a href="tel:102" className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-colors">
                    <Phone className="w-3 h-3" /> 102
                  </a>
                </div>
              </div>
              {showSosSetup && (
                <div className="px-4 pb-3 flex gap-2 border-t border-red-500/20 pt-2">
                  <input
                    value={sosNumber}
                    onChange={e => setSosNumber(e.target.value)}
                    placeholder="Family WhatsApp number (91XXXXXXXXXX)"
                    className="flex-1 bg-transparent border border-red-500/30 rounded-lg px-3 py-1.5 text-xs text-red-200 placeholder-red-400/40 outline-none"
                  />
                  <button onClick={sendSOS}
                    className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-colors whitespace-nowrap"
                  >Send WhatsApp</button>
                </div>
              )}
            </motion.div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 flex-shrink-0">
            <div className="flex gap-2 items-end glass border border-green-500/20 rounded-2xl p-2">
              <textarea value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }}
                placeholder={placeholders[language] || 'Describe symptoms...'}
                rows={1}
                className="flex-1 bg-transparent text-green-100 placeholder-green-400/30 text-sm resize-none outline-none px-2 py-1 max-h-24"
              />
              <div className="flex gap-1.5 flex-shrink-0">
                {/* Camera button for medicine scan */}
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-9 h-9 rounded-xl glass border border-green-500/20 text-green-400 hover:border-green-500/40 flex items-center justify-center transition-all"
                  title="Scan Medicine"
                ><Camera className="w-4 h-4" /></button>
                {/* Voice button */}
                <button onClick={toggleRecording}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${isRecording ? 'bg-red-500 text-white shadow-lg animate-pulse' : 'glass border border-green-500/20 text-green-400 hover:border-green-500/40'}`}
                >{isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>
                {/* Send button */}
                <button onClick={() => sendMessage(input)} disabled={!input.trim() || isLoading}
                  className="w-9 h-9 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
                ><Send className="w-4 h-4" /></button>
              </div>
            </div>
            <p className="text-center text-xs text-green-400/25 mt-2">
              📷 Camera = Medicine Scan · 🎤 Mic = Voice Input · Emergency: 102
            </p>
          </div>
        </div>

        {/* Map panel */}
        <AnimatePresence>
          {showMap && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="flex-shrink-0 overflow-hidden border-l border-green-500/10"
            >
              <ClinicMap userLocation={userLocation} mapsKey={MAPS_KEY} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function TriageCard({ triage, expanded, onToggle, onSpeak, isSpeaking }: { triage: TriageResult; expanded: boolean; onToggle: () => void; onSpeak?: () => void; isSpeaking?: boolean }) {
  const s = severityConfig[triage.severity]
  const SevIcon = s.icon
  return (
    <div className="max-w-sm w-full rounded-2xl rounded-tl-sm overflow-hidden border"
      style={{ background: 'rgba(15,35,24,0.8)', borderColor: s.border, boxShadow: expanded ? s.glow : 'none', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5" style={{ backgroundColor: s.bg, borderBottom: `1px solid ${s.border}` }}>
        <SevIcon className="w-4 h-4 flex-shrink-0" style={{ color: s.color }} />
        <div className="flex-1">
          <span className="text-xs font-bold tracking-wider" style={{ color: s.color }}>
            {triage.severity.toUpperCase()} — {triage.severity_label}
          </span>
          <p className="text-xs opacity-70 mt-0.5" style={{ color: s.color }}>{triage.severity_reason}</p>
        </div>
        {onSpeak && (
          <button onClick={onSpeak}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            title={isSpeaking ? 'Stop speaking' : 'Listen to response'}
            style={{ color: s.color }}
          >
            {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
        <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ backgroundColor: s.color }} />
      </div>
      <div className="px-4 py-3">
        <p className="text-green-100/90 text-sm leading-relaxed whitespace-pre-line">{triage.message}</p>
      </div>
      {(triage.advice.length > 0 || triage.warning_signs.length > 0) && (
        <>
          <button onClick={onToggle}
            className="w-full flex items-center justify-between px-4 py-2 border-t text-xs font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: `${s.color}20`, color: s.color }}
          >
            <span>{expanded ? 'Hide' : 'Show'} care advice & warning signs</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="px-4 pb-3 space-y-3">
                  {triage.advice.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-green-400 mb-1.5 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Home Care Tips
                      </div>
                      <ul className="space-y-1">
                        {triage.advice.map((tip, i) => (
                          <li key={i} className="text-xs text-green-200/60 flex gap-2"><span className="text-green-500 flex-shrink-0">•</span>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {triage.warning_signs.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-yellow-400 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Warning Signs:
                      </div>
                      <ul className="space-y-1">
                        {triage.warning_signs.map((sign, i) => (
                          <li key={i} className="text-xs text-yellow-200/60 flex gap-2"><span className="text-yellow-500 flex-shrink-0">⚠</span>{sign}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
      {triage.severity === 'red' && (
        <div className="px-4 py-2.5 border-t" style={{ borderColor: 'rgba(239,68,68,0.2)', backgroundColor: 'rgba(239,68,68,0.05)' }}>
          <a href="tel:102" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-colors">
            <Phone className="w-4 h-4" /> Call 102 — Emergency Ambulance
          </a>
        </div>
      )}
    </div>
  )
}

function MedicineCard({ medicine }: { medicine: MedicineResult }) {
  const [expanded, setExpanded] = useState(true)
  if (!medicine.identified) {
    return (
      <div className="max-w-sm w-full rounded-2xl rounded-tl-sm overflow-hidden border border-yellow-500/25 glass p-4">
        <div className="flex items-center gap-2 mb-2">
          <Pill className="w-4 h-4 text-yellow-400" />
          <span className="text-xs font-bold text-yellow-400">MEDICINE NOT IDENTIFIED</span>
        </div>
        <p className="text-green-200/70 text-sm">{medicine.message}</p>
      </div>
    )
  }
  return (
    <div className="max-w-sm w-full rounded-2xl rounded-tl-sm overflow-hidden border border-blue-500/25 glass">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-blue-500/10 border-b border-blue-500/20">
        <Pill className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-xs font-bold text-blue-300">💊 MEDICINE IDENTIFIED</div>
          <div className="text-white font-semibold text-sm mt-0.5">{medicine.name}</div>
          {medicine.category && <div className="text-xs text-blue-300/60">{medicine.category}</div>}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Uses */}
        {medicine.uses && (
          <div>
            <div className="text-xs font-semibold text-green-400 mb-1 flex items-center gap-1">
              <Heart className="w-3 h-3" /> Uses
            </div>
            <p className="text-xs text-green-200/70 leading-relaxed">{medicine.uses}</p>
          </div>
        )}

        {/* Dosage */}
        {medicine.dosage && (
          <div className="p-2.5 rounded-lg bg-green-500/5 border border-green-500/15">
            <div className="text-xs font-semibold text-green-400 mb-1">💉 Dosage</div>
            <p className="text-xs text-green-200/80">{medicine.dosage}</p>
            {medicine.duration && <p className="text-xs text-green-400/50 mt-1">⏱ Duration: {medicine.duration}</p>}
          </div>
        )}

        {/* Safety badges */}
        <div className="flex gap-2 flex-wrap">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${medicine.safe_for_children ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            <Baby className="w-3 h-3" />
            {medicine.safe_for_children ? 'Safe for Children' : 'Not for Children'}
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${medicine.safe_for_pregnant ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            <Heart className="w-3 h-3" />
            {medicine.safe_for_pregnant ? 'Safe in Pregnancy' : 'Avoid in Pregnancy'}
          </div>
          {medicine.prescription_required && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
              <ShieldAlert className="w-3 h-3" /> Prescription Required
            </div>
          )}
        </div>

        <button onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-1 text-xs font-medium text-blue-400/70 hover:text-blue-400 transition-colors"
        >
          <span>{expanded ? 'Hide' : 'Show'} side effects & warnings</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-3">
              {medicine.side_effects && medicine.side_effects.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-yellow-400 mb-1.5">⚠ Side Effects</div>
                  <ul className="space-y-1">
                    {medicine.side_effects.map((s, i) => (
                      <li key={i} className="text-xs text-yellow-200/60 flex gap-2"><span className="text-yellow-500 flex-shrink-0">•</span>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              {medicine.warnings && medicine.warnings.length > 0 && (
                <div>
                  <div className="text-xs font-semibold text-red-400 mb-1.5 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Warnings
                  </div>
                  <ul className="space-y-1">
                    {medicine.warnings.map((w, i) => (
                      <li key={i} className="text-xs text-red-200/60 flex gap-2"><span className="text-red-500 flex-shrink-0">!</span>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
              {medicine.food_interactions && (
                <div className="p-2.5 rounded-lg bg-orange-500/5 border border-orange-500/15">
                  <div className="text-xs font-semibold text-orange-400 mb-1">🍽 Food Interactions</div>
                  <p className="text-xs text-orange-200/60">{medicine.food_interactions}</p>
                </div>
              )}
              {medicine.storage && (
                <div className="text-xs text-green-400/50 flex items-center gap-1">
                  📦 Storage: {medicine.storage}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-2.5 border-t border-blue-500/10 bg-blue-500/5">
        <p className="text-xs text-blue-300/40 text-center">Always consult a doctor before taking any medicine</p>
      </div>
    </div>
  )
}

function ClinicMap({ userLocation, mapsKey }: { userLocation: { lat: number; lon: number }; mapsKey: string }) {
  const [clinics, setClinics] = useState<Clinic[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${BACKEND_URL}/api/nearby-clinics`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat: userLocation.lat, lon: userLocation.lon })
    })
      .then(r => r.json())
      .then(d => { setClinics(d.clinics || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [userLocation])

  const googleMapsUrl = `https://www.google.com/maps/embed/v1/search?key=${mapsKey}&q=hospitals+near+${userLocation.lat},${userLocation.lon}&zoom=13`

  return (
    <div className="h-full flex flex-col bg-[#0a1a0f]">
      <div className="px-3 py-3 border-b border-green-500/10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-400" />
          <span className="text-sm font-semibold text-white">Nearby Hospitals</span>
        </div>
        <div className="flex items-center gap-1 mt-0.5">
          <Navigation className="w-3 h-3 text-green-400/40" />
          <p className="text-xs text-green-400/40">Based on your live location</p>
        </div>
      </div>

      <div className="h-52 flex-shrink-0 border-b border-green-500/10">
        {mapsKey ? (
          <iframe title="Google Maps" src={googleMapsUrl} className="w-full h-full" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        ) : (
          <iframe title="OSM"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lon - 0.05},${userLocation.lat - 0.05},${userLocation.lon + 0.05},${userLocation.lat + 0.05}&layer=mapnik`}
            className="w-full h-full" style={{ filter: 'invert(0.85) hue-rotate(180deg) brightness(0.7)' }}
          />
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="text-center text-green-400/40 text-xs py-4">Finding hospitals near you...</div>
        ) : clinics.length === 0 ? (
          <div className="text-center text-green-400/40 text-xs py-4">No hospitals found nearby</div>
        ) : clinics.map((clinic) => (
          <div key={clinic.id} className="glass border border-green-500/10 rounded-xl p-3 hover:border-green-500/25 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-xs font-semibold text-white">{clinic.name}</div>
                {clinic.address && <div className="text-xs text-green-400/40 mt-0.5">{clinic.address}</div>}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">{clinic.type}</span>
                  {clinic.rating !== 'N/A' && (
                    <span className="flex items-center gap-0.5 text-xs text-yellow-400"><Star className="w-3 h-3" /> {clinic.rating}</span>
                  )}
                  <span className="flex items-center gap-0.5 text-xs text-green-400/40"><Clock className="w-3 h-3" /> {clinic.hours}</span>
                </div>
              </div>
              {clinic.emergency && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0">24/7</span>
              )}
            </div>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${clinic.lat},${clinic.lon}&travelmode=driving`}
              target="_blank" rel="noopener noreferrer"
              className="mt-2 flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors"
            ><Navigation className="w-3 h-3" /> Get Directions</a>
          </div>
        ))}
      </div>
    </div>
  )
}
