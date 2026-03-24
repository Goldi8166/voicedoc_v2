# 🏥 VoiceDoc — AI Health Assistant for Rural India

> *"600 million Indians live in rural areas with fewer than 1 doctor per 10,000 people. VoiceDoc gives them an AI-powered first opinion — in their language, on their phone, instantly."*

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://voicedoc.vercel.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-blue)](https://flask.palletsprojects.com)

---

## 🌍 The Problem

In rural India (and across the Global South), healthcare access is critically limited:
- **1 doctor per 11,000** rural patients (WHO recommends 1 per 1,000)
- Patients travel **4–6 hours** to reach a specialist
- **70% of health spending** is out-of-pocket, often on unnecessary visits
- Language barriers prevent understanding of medical information

VoiceDoc is a **voice-first, bilingual AI health triage assistant** that helps rural users understand their symptoms, assess severity, and decide whether to seek emergency care — before they travel anywhere.

---

## ✨ Features

- 🎙️ **Voice Input** — Speak your symptoms in Hindi or English
- 🤖 **AI Triage** — Claude AI assesses severity (Green / Yellow / Red)
- 🌐 **Bilingual** — Full Hindi and English support
- 🗺️ **Find Nearby Clinics** — OpenStreetMap integration
- 📋 **Symptom History** — Track past consultations
- 📱 **Mobile-First** — Designed for rural smartphone users
- 🔒 **Privacy First** — No data stored on servers

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, Tailwind CSS, Framer Motion |
| Backend | Flask (Python 3.11) |
| AI | Anthropic Claude API (claude-sonnet-4-20250514) |
| Voice | Web Speech API + OpenAI Whisper |
| Maps | Leaflet.js + OpenStreetMap |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Anthropic API Key

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/voicedoc.git
cd voicedoc
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
python app.py
```

### 3. Setup Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Add your NEXT_PUBLIC_BACKEND_URL to .env.local
npm run dev
```

### 4. Open in Browser
```
http://localhost:3000
```

---

## 📁 Project Structure

```
voicedoc/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   └── lib/             # Utilities & API calls
│   └── package.json
├── backend/                  # Flask API
│   ├── app.py               # Main Flask app
│   ├── triage.py            # AI triage logic
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd frontend
npx vercel --prod
```

### Backend (Render)
1. Push to GitHub
2. Connect repo to [Render](https://render.com)
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`
5. Add environment variables

---

## 📊 Impact

| Metric | Value |
|---|---|
| Target Population | 600M+ rural Indians |
| Languages Supported | Hindi, English |
| Avg Triage Time | < 30 seconds |
| Potential Doctor Visits Saved | Est. 40% unnecessary visits |

---

## 🏆 Built For

**GenAI Devs Hackathon 2026** — Social Good Track: Healthcare Accessibility

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com) for Claude API
- [OpenStreetMap](https://openstreetmap.org) contributors
- All rural healthcare workers in India 🫶
