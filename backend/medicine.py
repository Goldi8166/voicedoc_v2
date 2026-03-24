import os
import json
import base64
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

MEDICINE_PROMPT = """You are MediScan, an AI medicine identifier. Analyze this medicine image and provide detailed information.

RESPONSE FORMAT — Always respond with valid JSON only, no extra text, no markdown:
{
  "name": "Medicine name (brand + generic)",
  "category": "Type of medicine (antibiotic, painkiller, etc.)",
  "uses": "What this medicine is used for (2-3 sentences)",
  "dosage": "Typical dosage and frequency",
  "duration": "How long to take it",
  "side_effects": ["side effect 1", "side effect 2", "side effect 3"],
  "warnings": ["warning 1", "warning 2"],
  "food_interactions": "What to avoid eating/drinking with this medicine",
  "safe_for_children": true or false,
  "safe_for_pregnant": true or false,
  "prescription_required": true or false,
  "storage": "How to store this medicine",
  "identified": true
}

If you cannot identify the medicine clearly, return:
{
  "identified": false,
  "message": "Could not identify medicine. Please take a clearer photo showing the medicine name."
}

IMPORTANT: Return ONLY the JSON. Be accurate and responsible. Always recommend consulting a doctor before taking any medicine."""


def scan_medicine(image_base64: str, language: str = "en") -> dict:
    try:
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/jpeg;base64,{image_base64}"
                            }
                        },
                        {
                            "type": "text",
                            "text": MEDICINE_PROMPT + (
                                "\n\nRespond in Hindi language." if language == "hi" else
                                "\n\nRespond in the appropriate Indian regional language based on context, default English."
                            )
                        }
                    ]
                }
            ],
            max_tokens=1024,
            temperature=0.2,
        )

        raw = response.choices[0].message.content.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        result = json.loads(raw)
        return result

    except json.JSONDecodeError:
        return {
            "identified": False,
            "message": "Could not read the response. Please try again with a clearer image."
        }
    except Exception as e:
        print(f"Medicine scan error: {e}")
        raise
