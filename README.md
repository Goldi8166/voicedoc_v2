# VoiceDoc - AI-Powered Voice Health Triage Assistant

![VoiceDoc Banner](https://img.shields.io/badge/Status-Live-brightgreen) ![Deployment](https://img.shields.io/badge/Frontend-Vercel-blue) ![Backend](https://img.shields.io/badge/Backend-Render-purple)

## 🎯 Problem Statement

**Rural India faces a critical healthcare crisis:**
- Over **65% of India's population** lives in rural areas with limited access to medical professionals
- Average doctor-to-patient ratio in rural areas is **1:10,000** (vs 1:700 in urban areas)
- Healthcare costs are prohibitive for economically weaker sections
- Language barriers prevent effective communication with healthcare providers
- Emergency situations require immediate triage and guidance

**VoiceDoc solves this by providing an accessible, multilingual AI-powered health triage system available 24/7.**

---

## 💡 Solution Overview

VoiceDoc is a **voice-first AI health triage assistant** designed specifically for rural and underserved populations. It leverages cutting-edge AI models to provide:

- **Instant Health Assessment** - Voice-based symptom analysis and triage
- **Multilingual Support** - Hindi and English voice interaction
- **Emergency Response** - SOS feature for critical situations
- **Accessible Design** - Works on basic smartphones with minimal internet

The system understands natural speech patterns, asks clarifying questions, and provides initial triage guidance while maintaining a compassionate, doctor-like interaction style.

---

## 🌟 Key Features

### 1. **Voice-First Interface**
- Natural language voice input in Hindi and English
- Real-time speech recognition and processing
- Natural-sounding AI responses via text-to-speech
- No need for typing - fully voice-controlled interaction

### 2. **AI-Powered Health Triage**
- Powered by **Groq LLaMA** models for fast, accurate processing
- Analyzes symptoms and medical history
- Provides initial health assessment
- Recommends urgency level (routine, urgent, emergency)
- Suggests next steps (home care, clinic visit, hospital)

### 3. **Multilingual Communication**
- Seamless Hindi/English switching
- Context-aware responses in user's preferred language
- Preserves medical terminology while translating explanations

### 4. **MediScan - Medicine Information**
- 📷 **Camera-based medicine recognition** - Capture medicine bottle/package photos
- 💊 **AI-powered medicine details** - Get dosage, uses, side effects via Groq/LLaMA
- 🎤 **Voice queries** - Ask about medicines in natural language
- 🔊 **Audio response** - Listen to medicine information via text-to-speech
- Complete medicine consultation at your fingertips

### 5. **Emergency SOS Feature**
- One-tap emergency alert system
- Captures current location and symptoms
- Generates emergency summary for responders
- Can be used when immediate medical help is needed

### 6. **User-Friendly Design**
- Simple, intuitive interface for non-tech-savvy users
- Clear voice instructions and guidance
- Visual confirmation of inputs
- Accessibility features for elderly and visually impaired

---

## 🏗️ Technical Architecture

### **Frontend Stack**
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **Voice Processing:** Web Speech API
- **Deployment:** Vercel
- **Live URL:** [https://voicedoc-v2.vercel.app/chat](https://voicedoc-v2.vercel.app/chat)

### **Backend Stack**
- **Framework:** Flask (Python)
- **AI Model:** Groq LLaMA (via Groq API)
- **API:** RESTful endpoints
- **Deployment:** Render
- **Live URL:** [https://voicedoc-v2.onrender.com](https://voicedoc-v2.onrender.com)

### **System Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    VoiceDoc System                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │   Frontend (Next.js) │◄────►│  Backend (Flask)     │    │
│  │  - Voice Input       │      │  - LLaMA AI Model    │    │
│  │  - UI/UX             │      │  - Triage Logic      │    │
│  │  - Emergency SOS     │      │  - API Endpoints     │    │
│  └──────────────────────┘      └──────────────────────┘    │
│           │                              │                  │
│           │                              │                  │
│    Web Speech API                   Groq API               │
│           │                              │                  │
│           ▼                              ▼                  │
│    [User's Device]                 [LLaMA Model]           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- Git
- API Keys:
  - Groq API Key (free tier available)
  - Google Maps API Key (optional, for future features)

### **Frontend Setup**

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_BACKEND_URL=https://voicedoc-v2.onrender.com
NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_api_key_here
EOF

# Run development server
npm run dev

# Build for production
npm run build
```

### **Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
GROQ_API_KEY=your_groq_api_key_here
FLASK_ENV=production
EOF

# Run the server
python app.py

# Or with Gunicorn (for production)
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### **Deployment**

**Frontend (Vercel):**
```bash
npm install -g vercel
vercel
# Follow prompts to deploy
```

**Backend (Render):**
1. Push code to GitHub
2. Connect repository to Render
3. Set environment variables
4. Deploy

---

## 📊 How It Works

### **User Journey**

1. **Start Conversation**
   - User opens VoiceDoc
   - System provides voice-based instructions

2. **Voice Input**
   - User describes symptoms in natural language
   - System recognizes speech (Hindi/English)

3. **AI Analysis**
   - Backend processes through LLaMA model
   - AI asks clarifying questions if needed
   - Analyzes symptom severity

4. **Triage Response**
   - Provides health assessment
   - Recommends urgency level
   - Suggests next steps
   - Offers self-care advice if appropriate

5. **Emergency Support**
   - User can trigger SOS anytime
   - System captures location and symptoms
   - Provides emergency guidance

### **API Endpoints**

```
POST /api/triage
- Input: symptoms (text), medical_history (optional)
- Output: assessment, urgency_level, recommendations

POST /api/sos
- Input: user_location, symptoms_summary
- Output: emergency_response, contact_info

GET /health
- System health check
```

---

## 💾 Tech Stack Summary

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | Next.js 14, React, Tailwind CSS | User interface and voice interaction |
| **Backend** | Flask, Python 3.11 | API and business logic |
| **AI Model** | Groq LLaMA | Health assessment and triage |
| **Voice Processing** | Web Speech API | Speech recognition and synthesis |
| **Database** | (Currently stateless, ready for MongoDB/PostgreSQL) | Future: Patient data storage |
| **Hosting** | Vercel (Frontend), Render (Backend) | Cloud deployment |
| **Version Control** | GitHub | Source code management |

---

## 🎯 Current Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Voice Input (Hindi/English) | ✅ Live | Real-time speech recognition |
| AI Health Triage | ✅ Live | Powered by Groq LLaMA |
| MediScan - Medicine Information | ✅ Live | Camera + voice medicine queries |
| Emergency SOS | ✅ Live | One-tap emergency alert |
| Multilingual Support | ✅ Live | Hindi and English |
| Real-time Doctor Consultation | 🔄 Planned | Q2 2026 |
| Offline Mode | 🔄 Planned | Q3 2026 |
| Healthcare System Integration | 🔄 Planned | Q3 2026 |
| Advanced AI Features | 🔄 Planned | Drug interaction, severity scoring |
| Community Features | 🔄 Planned | Symptom database, peer support |
| Analytics Dashboard | 🔄 Planned | For healthcare workers |

---

## 🗺️ Future Roadmap

### **Phase 2: Enhanced Consultation (Q2 2026)**
- Real-time video/audio consultation with verified doctors
- Prescription generation and digital records
- Medical history tracking and personalization

### **Phase 3: Offline & Integration (Q3 2026)**
- Offline mode for areas with poor connectivity
- Direct integration with hospitals and clinics
- Patient record management system
- Insurance claim automation

### **Phase 4: Advanced Intelligence (Q4 2026)**
- Symptom severity classification
- Drug interaction checker
- Personalized health recommendations
- AI-powered health monitoring

### **Phase 5: Community & Impact (2027)**
- Community symptom database
- Peer support groups
- Health awareness campaigns
- Regional disease tracking
- Government health data reporting

---

## 📈 Impact Potential

### **Healthcare Access**
- Bridges gap for underserved populations
- Reduces burden on overstretched rural healthcare system
- Provides 24/7 availability

### **Economic Impact**
- Reduces unnecessary hospital visits
- Decreases healthcare costs for rural families
- Creates employment for health workers and doctors

### **Social Impact**
- Empowers elderly and non-literate populations
- Saves lives through faster emergency response
- Improves health literacy in rural areas

### **Scalability**
- Can serve millions with minimal infrastructure
- Language-agnostic architecture
- Adaptable to different healthcare systems

---

## 🤝 Contributing

We welcome contributions! Areas for collaboration:

- **Healthcare Professionals:** Help refine medical logic and triage algorithms
- **Developers:** Contribute to features and improvements
- **Designers:** Enhance UX/UI for diverse user groups
- **Translators:** Add more regional language support

---

## 📝 License

This project is open-source under the MIT License. See LICENSE file for details.

---

## 🔗 Links

- **Live Frontend:** [https://voicedoc-v2.vercel.app/chat](https://voicedoc-v2.vercel.app/chat)
- **Live Backend:** [https://voicedoc-v2.onrender.com](https://voicedoc-v2.onrender.com)
- **GitHub Repository:** [https://github.com/Goldi8166/voicedoc_v2](https://github.com/Goldi8166/voicedoc_v2)
- **Contact:** panshulthapiyal241@gmail.com

---

## 🙏 Acknowledgments

- **Groq** - For providing fast, accessible LLaMA inference
- **Vercel & Render** - For seamless deployment platforms
- **OpenAI & Anthropic** - For advancing AI accessibility
- **Rural Healthcare Community** - For inspiring this solution

---

## 📞 Support & Feedback

For issues, suggestions, or feedback:
- Open an issue on GitHub
- Email: panshulthapiyal241@gmail.com
- Contribute to discussions and improvements

---

**Built with ❤️ for accessible healthcare in rural India**

*VoiceDoc - Healthcare, Just a Voice Away*
