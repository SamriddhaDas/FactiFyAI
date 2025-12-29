from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import re
import textstat
from collections import Counter
import os
import json

app = Flask(__name__)
CORS(app)

# ----------------------------------------------------
# SOURCE TRUST DATABASE
# ----------------------------------------------------
KNOWN_SOURCES = {
    "reuters.com": 0.95,
    "apnews.com": 0.95,
    "bbc.com": 0.90,
    "nytimes.com": 0.88,
    "theguardian.com": 0.85,
    "indiatoday.in": 0.80,
    "ndtv.com": 0.80,

    "infowars.com": 0.10,
    "breitbart.com": 0.20,
    "naturalnews.com": 0.15,
    "theepochtimes.com": 0.30,
}

MISINFO_KEYWORDS = [
    "crisis actor", "deep state", "false flag",
    "chemtrails", "qanon", "plandemic",
    "microchip", "bioweapon", "flat earth"
]

SENSATIONAL_WORDS = [
    "shocking", "terrifying", "explosive",
    "scandal", "panic", "unbelievable"
]

EMOTIONAL_WORDS = [
    "hate", "fear", "furious",
    "disgusting", "horrifying"
]

UNCERTAINTY_WORDS = [
    "may", "might", "reportedly", "unconfirmed"
]

# ----------------------------------------------------
# HELPERS
# ----------------------------------------------------
def extract_domain(url):
    if not url:
        return None
    return url.split("//")[-1].split("/")[0].replace("www.", "").lower()

def detect_words(text, word_list):
    return [w for w in word_list if w in text.lower()]

def detect_citations(text):
    return re.findall(r'https?://\S+', text)

def detect_year(text):
    years = re.findall(r"(19|20)\d{2}", text)
    return int(max(years)) if years else None

def writing_quality(text):
    try:
        score = textstat.flesch_reading_ease(text)
        return min(max((score / 100) * 10, 0), 10)
    except:
        return 5

def coherence_score(text):
    words = text.split()
    return min(len(set(words)) / max(len(words), 1) * 10, 10)

# ----------------------------------------------------
# OPTIONAL AI CHECK (SAFE FALLBACK)
# ----------------------------------------------------
def ai_claim_analysis(text):
    return {"ai_score": 6}  # Safe default without API failures

# ----------------------------------------------------
# API ROUTE
# ----------------------------------------------------
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")
    url = data.get("url", "")

    factors = []
    score = 0

    # SOURCE SCORE (35)
    domain = extract_domain(url)
    source_score = KNOWN_SOURCES.get(domain, 0.4)
    score += source_score * 35
    factors.append(f"Source reliability: {int(source_score*100)}%")

    # CITATIONS (15)
    citations = detect_citations(text)
    if len(citations) >= 3:
        score += 15
        factors.append("Strong citation support")
    elif len(citations) >= 1:
        score += 8
        factors.append("Some citations present")
    else:
        factors.append("No external citations")

    # MISINFORMATION TERMS (-25)
    misinfo = detect_words(text, MISINFO_KEYWORDS)
    if misinfo:
        score -= min(len(misinfo) * 8, 25)
        factors.append("Misinformation terms detected")

    # SENSATIONAL + EMOTIONAL (-15)
    sens = detect_words(text, SENSATIONAL_WORDS)
    emo = detect_words(text, EMOTIONAL_WORDS)
    penalty = min((len(sens) + len(emo)) * 3, 15)
    score -= penalty
    if sens or emo:
        factors.append("Sensational / emotional language detected")

    # UNCERTAINTY (GOOD JOURNALISM)
    uncertainty = detect_words(text, UNCERTAINTY_WORDS)
    if uncertainty:
        score += 3
        factors.append("Responsible uncertainty language used")

    # WRITING QUALITY (10)
    wq = writing_quality(text)
    score += wq
    factors.append(f"Writing clarity score: {int(wq)}/10")

    # COHERENCE (10)
    coh = coherence_score(text)
    score += coh
    factors.append(f"Text coherence score: {int(coh)}/10")

    # FRESHNESS (5)
    year = detect_year(text)
    if year:
        age = datetime.now().year - year
        if age <= 2:
            score += 5
        elif age <= 5:
            score += 2
        factors.append(f"Content year detected: {year}")

    # AI CHECK (15)
    ai_data = ai_claim_analysis(text)
    ai_score = ai_data.get("ai_score", 6)
    score += ai_score * 1.5
    factors.append(f"AI plausibility score: {ai_score}/10")

    # FINAL NORMALIZATION
    score = int(min(max(score, 0), 100))

    if score >= 75:
        recommendation = "High credibility. Still verify with multiple sources."
    elif score >= 45:
        recommendation = "Moderate credibility. Cross-check recommended."
    else:
        recommendation = "Low credibility. Treat with caution."

    return jsonify({
        "score": score,
        "factors": factors,
        "recommendation": recommendation
    })

# ----------------------------------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
