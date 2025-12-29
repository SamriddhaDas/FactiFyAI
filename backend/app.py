from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import re
import textstat
import requests
from collections import Counter

# ---------------------------------------------------------
# INITIALIZE
# ---------------------------------------------------------
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# ---------------------------------------------------------
# KNOWN SOURCE RELIABILITY DATABASE (NewsGuard-style)
# ---------------------------------------------------------
KNOWN_SOURCES = {
    "reuters.com": 0.95,
    "apnews.com": 0.95,
    "bbc.com": 0.90,
    "nytimes.com": 0.88,
    "theguardian.com": 0.85,
    "indiatoday.in": 0.80,
    "ndtv.com": 0.80,

    # Low-trust or known misinformation sites
    "infowars.com": 0.10,
    "breitbart.com": 0.20,
    "yournewswire.com": 0.10,
    "naturalnews.com": 0.15,
    "theepochtimes.com": 0.30,
}

# ---------------------------------------------------------
# MISINFORMATION KEYWORD DATABASE
# ---------------------------------------------------------
MISINFO_KEYWORDS = [
    "crisis actor", "deep state", "hoax", "false flag", "mind control",
    "chemtrails", "illuminati", "new world order", "qanon", "bioweapon",
    "5g causes", "flat earth", "microchip", "plandemic", "population control"
]

# ---------------------------------------------------------
# URL / Domain Extractor
# ---------------------------------------------------------
def extract_domain(url):
    try:
        domain = url.split("//")[-1].split("/")[0].replace("www.", "")
        return domain.lower()
    except:
        return None

# ---------------------------------------------------------
# Linguistic Scanners
# ---------------------------------------------------------
def detect_sensational(text):
    words = ["shocking", "terrifying", "panic", "explosive", "scandal"]
    return [w for w in words if w in text.lower()]

def detect_bias(text):
    markers = ["everyone knows", "clearly proves", "they don't want you to know"]
    return [m for m in markers if m in text.lower()]

def detect_emotional_tone(text):
    emotional_words = ["fear", "hate", "furious", "disgusting", "horrifying"]
    return [w for w in emotional_words if w in text.lower()]

def detect_uncertainty(text):
    indicators = ["may", "possibly", "reportedly", "unconfirmed"]
    return [w for w in indicators if w in text.lower()]

def detect_claim_density(text):
    claim_verbs = ["is", "are", "claims", "states", "reveals", "reports"]
    sents = [s.strip() for s in text.split(".") if s.strip()]
    return sum(1 for s in sents if any(v in s.lower() for v in claim_verbs))

def detect_citations(text):
    return re.findall(r'https?://\S+', text)

def detect_year(text):
    years = re.findall(r"(20|19)\d{2}", text)
    return int(max(years)) if years else None

def detect_misinformation_terms(text):
    return [term for term in MISINFO_KEYWORDS if term in text.lower()]

def coherence_score(text):
    words = text.lower().split()
    freq = Counter(words).most_common(10)
    return min(len(freq) * 2, 10)

def writing_quality(text):
    try:
        score = textstat.flesch_reading_ease(text)
        if score > 60:
            return 10
        elif score > 30:
            return 5
        else:
            return 0
    except:
        return 5

# ---------------------------------------------------------
# AI CLAIM EXTRACTION (Optional)
# Uses OpenAI if API key available; otherwise fallback.
# ---------------------------------------------------------
import os
OPENAI_KEY = os.getenv("OPENAI_API_KEY")

def ai_claim_analysis(text):
    if not OPENAI_KEY:
        return {"claims": [], "ai_score": 7}   # fallback mid confidence

    try:
        import openai
        openai.api_key = OPENAI_KEY

        prompt = f"""
        Extract factual claims from the text and evaluate whether 
        they seem plausible on a scale of 1–10.

        Text: {text}

        Return JSON: {{"claims": [...], "ai_score": number}}
        """

        res = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )

        content = res["choices"][0]["message"]["content"]
        print("AI:", content)
        return json.loads(content)

    except:
        return {"claims": [], "ai_score": 6}  # fallback

# ---------------------------------------------------------
# MAIN /analyze ENDPOINT
# ---------------------------------------------------------
@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

    data = request.json
    text = data.get("text", "") or ""
    url = data.get("url", "") or ""

    factors = []

    # ---------------------------------------------------------
    # SOURCE ANALYSIS (25%)
    # ---------------------------------------------------------
    domain = extract_domain(url)
    source_score = KNOWN_SOURCES.get(domain, 0.40)
    factors.append(f"Source reliability: {source_score*100:.0f}% ({domain})")

    # ---------------------------------------------------------
    # LINGUISTIC SIGNALS
    # ---------------------------------------------------------
    sens = detect_sensational(text)
    bias = detect_bias(text)
    emotional = detect_emotional_tone(text)
    uncertain = detect_uncertainty(text)
    misinfo_terms = detect_misinformation_terms(text)
    citations = detect_citations(text)
    cite_count = len(citations)

    if sens: factors.append("Sensational terms: " + ", ".join(sens))
    if bias: factors.append("Bias indicators: " + ", ".join(bias))
    if emotional: factors.append("Emotional tone: " + ", ".join(emotional))
    if uncertain: factors.append("Uncertainty indicators: " + ", ".join(uncertain))
    if misinfo_terms: factors.append("Misinformation terms: " + ", ".join(misinfo_terms))

    # ---------------------------------------------------------
    # ARTICLE DATE (Freshness)
    # ---------------------------------------------------------
    latest_year = detect_year(text)
    current_year = datetime.now().year
    article_age = current_year - latest_year if latest_year else None

    if latest_year:
        factors.append(f"Detected publication year: {latest_year}")

    # ---------------------------------------------------------
    # ADVANCED SCORING (FULL MODEL)
    # ---------------------------------------------------------
    score = 0

    # 1. Source Reliability (25)
    score += source_score * 25

    # 2. Sensationalism (10)
    score += 10 if not sens else 5 if len(sens) <= 2 else 0

    # 3. Emotional Tone (10)
    score += 10 if not emotional else 5 if len(emotional) <= 2 else 0

    # 4. Bias (10)
    score += 10 if not bias else 5 if len(bias) <= 2 else 0

    # 5. Citation Quality (10)
    if cite_count >= 3:
        score += 10
    elif cite_count >= 1:
        score += 5

    # 6. Logical Coherence (10)
    score += coherence_score(text)

    # 7. Writing Quality (10)
    score += writing_quality(text)

    # 8. Freshness (5)
    if article_age is None:
        score += 3
    elif article_age <= 2:
        score += 5
    elif article_age <= 5:
        score += 2

    # 9. Uncertainty Indicators (5)
    score += 5 if not uncertain else 3

    # 10. Claim Density (5)
    claims = detect_claim_density(text)
    if claims <= 2:
        score += 5
    elif claims <= 5:
        score += 3
    else:
        score += 1

    # ---------------------------------------------------------
    # AI Claim Plausibility Boost (optional)
    # ---------------------------------------------------------
    ai_data = ai_claim_analysis(text)
    ai_score = ai_data.get("ai_score", 6)
    factors.append(f"AI plausibility score: {ai_score}/10")
    score += ai_score * 0.5   # small boost (max +5)

    # ---------------------------------------------------------
    # FINALIZE SCORE
    # ---------------------------------------------------------
    score = int(min(max(score, 0), 100))

    # ---------------------------------------------------------
    # RECOMMENDATION
    # ---------------------------------------------------------
    if score >= 75:
        recommendation = "Content appears credible, though verification is still advised."
    elif score >= 45:
        recommendation = "Mixed reliability indicators. Verify with reputable sources."
    else:
        recommendation = "Low credibility detected. Treat with caution."

    # ---------------------------------------------------------
    # SUMMARY
    # ---------------------------------------------------------
    summary = (
        "This analysis evaluates source reliability, linguistic patterns, "
        "citation depth, emotional tone, misinformation markers, and writing structure "
        "to estimate the credibility of the provided content."
    )

    # ---------------------------------------------------------
    # FINAL RESPONSE
    # ---------------------------------------------------------
    return jsonify({
        "score": score,
        "summary": summary,
        "factors": factors,
        "recommendation": recommendation
    })

# ---------------------------------------------------------
if __name__ == "__main__":
    app.run(port=5000)
