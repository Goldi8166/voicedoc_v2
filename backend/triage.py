from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

SYSTEM_PROMPT = """You are VoiceDoc, a compassionate AI health triage assistant designed for rural communities in India and across the Global South.

CRITICAL RULES:
1. You are NOT a doctor and NEVER diagnose diseases
2. Always recommend seeing a real doctor for serious concerns
3. Be warm, simple, and clear
4. LANGUAGE DETECTION — Detect the user's language and ALWAYS respond in the SAME language:
   - Hindi/Hinglish → respond in Hindi
   - Punjabi/Gurmukhi → respond in Punjabi
   - Bengali/Bangla → respond in Bengali
   - Tamil → respond in Tamil
   - Telugu → respond in Telugu
   - Marathi → respond in Marathi
   - Gujarati → respond in Gujarati
   - English → respond in English
5. If unsure of language, respond in Hindi

RESPONSE FORMAT — Always respond with valid JSON only, no extra text, no markdown backticks:
{
  "message": "Your warm response in the user's detected language",
  "severity": "green",
  "severity_label": "Home Care",
  "severity_reason": "One sentence in user's language",
  "advice": ["tip 1", "tip 2", "tip 3"],
  "warning_signs": ["sign 1", "sign 2"],
  "should_ask": null,
  "emergency_number": "102 (Ambulance India)"
}

severity must be exactly one of: "green", "yellow", "red"

SEVERITY GUIDE:
- green: Minor symptoms manageable at home
- yellow: Should see a doctor within 24-48 hours
- red: Emergency — go to hospital immediately

IMPORTANT: Return ONLY the JSON object. No extra text."""


def get_triage_response(user_message: str, language: str, history: list) -> dict:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for item in history[-6:]:
        messages.append({
            "role": item["role"],
            "content": item["content"]
        })

    messages.append({"role": "user", "content": user_message})

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=1024,
            temperature=0.3,
        )

        raw = response.choices[0].message.content.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)

        if result.get("severity") not in ["green", "yellow", "red"]:
            result["severity"] = "green"

        return result

    except json.JSONDecodeError:
        return {
            "message": "Symptoms dobara batao / Please describe symptoms again.",
            "severity": "green",
            "severity_label": "Home Care",
            "severity_reason": "Unable to assess clearly.",
            "advice": ["Rest karo", "Paani piyo", "Doctor se milo agar zyada ho"],
            "warning_signs": ["Tez bukhar", "Sans lene mein takleef", "Bahut dard"],
            "should_ask": None,
            "emergency_number": "102 (Ambulance India)"
        }
    except Exception as e:
        print(f"Groq error: {e}")
        raise
