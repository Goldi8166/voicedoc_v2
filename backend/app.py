from flask import Flask, request, jsonify
from flask_cors import CORS
from triage import get_triage_response
from medicine import scan_medicine
import os
import base64
import requests as req
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", os.getenv("FRONTEND_URL", "*")])


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "VoiceDoc API is running"})


@app.route("/api/triage", methods=["POST"])
def triage():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Message is required"}), 400

    user_message = data.get("message", "")
    language = data.get("language", "en")
    conversation_history = data.get("history", [])

    if not user_message.strip():
        return jsonify({"error": "Message cannot be empty"}), 400

    try:
        result = get_triage_response(user_message, language, conversation_history)
        return jsonify(result)
    except Exception as e:
        print(f"Triage error: {e}")
        return jsonify({"error": "Failed to process triage request"}), 500


@app.route("/api/medicine-scan", methods=["POST"])
def medicine_scan():
    data = request.get_json()
    if not data or "image" not in data:
        return jsonify({"error": "Image is required"}), 400

    image_base64 = data.get("image", "")
    language = data.get("language", "en")

    if not image_base64:
        return jsonify({"error": "Image data is empty"}), 400

    try:
        result = scan_medicine(image_base64, language)
        return jsonify(result)
    except Exception as e:
        print(f"Medicine scan error: {e}")
        return jsonify({"error": "Failed to scan medicine"}), 500


@app.route("/api/nearby-clinics", methods=["POST"])
def nearby_clinics():
    data = request.get_json()
    lat = data.get("lat", 28.6139)
    lon = data.get("lon", 77.2090)

    api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    try:
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{lat},{lon}",
            "radius": 5000,
            "type": "hospital",
            "key": api_key
        }
        response = req.get(url, params=params)
        places = response.json().get("results", [])

        clinics = []
        for i, place in enumerate(places[:6]):
            loc = place["geometry"]["location"]
            clinics.append({
                "id": i + 1,
                "name": place.get("name", "Unknown"),
                "type": "Hospital",
                "distance": "Nearby",
                "phone": "Call for info",
                "hours": "Open Now" if place.get("opening_hours", {}).get("open_now") else "Check timings",
                "lat": loc["lat"],
                "lon": loc["lng"],
                "emergency": True,
                "rating": place.get("rating", "N/A"),
                "address": place.get("vicinity", "")
            })

        return jsonify({"clinics": clinics})

    except Exception as e:
        print(f"Maps error: {e}")
        return jsonify({"clinics": [
            {"id": 1, "name": "Primary Health Centre", "type": "PHC", "distance": "1.2 km",
             "phone": "+91-11-2664-1234", "hours": "8AM - 8PM", "lat": lat+0.01, "lon": lon+0.01, "emergency": False, "rating": "N/A", "address": "Nearby"},
            {"id": 2, "name": "Community Health Centre", "type": "CHC", "distance": "3.4 km",
             "phone": "+91-11-2665-5678", "hours": "24 Hours", "lat": lat-0.02, "lon": lon+0.015, "emergency": True, "rating": "N/A", "address": "Nearby"},
            {"id": 3, "name": "District Hospital", "type": "Hospital", "distance": "5.8 km",
             "phone": "+91-11-2666-9012", "hours": "24 Hours", "lat": lat+0.03, "lon": lon-0.02, "emergency": True, "rating": "N/A", "address": "Nearby"},
        ]})


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
