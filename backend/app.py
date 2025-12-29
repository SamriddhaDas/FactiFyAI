from flask import Flask, request, jsonify
from datetime import datetime
import re
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
def analyze():
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

KNOWN_SOURCES = {
    "reuters.com": 0.95,
    "apnews.com": 0.95,
    "bbc.com": 0.90,
    "nytimes.com": 0.85,
    "washingtonpost.com": 0.85,
    "theguardian.com": 0.85,

    "medium.com": 0.50,
    "substack.com": 0.50,

    "infowars.com": 0.10,
    "yournewswire.com": 0.15,
    "leadstories.com": 0.30
}


def extract_domain(url):
    try:
        return re.sub(r"^www\.", "", url.split("//")[-1].split("/")[0].lower())
    except:
        return None


def check_source_reliability(url):
    if not url:
        return 0.5, "No URL provided — source reliability neutral."

    domain = extract_domain(url)
    if domain in KNOWN_SOURCES:
        score = KNOWN_SOURCES[domain]
        return score, f"Recognized domain: {domain}"
    else:
        return 0.4, f"Unrecognized or low-history domain: {domain}"

SENSATIONAL_WORDS = [
    "shocking", "disaster", "urgent", "secret", "government cover-up",
    "breaking", "explosive", "panic", "terrifying", "cannot believe"
]

BIAS_PHRASES = [
    "clearly proves", "everyone knows", "they don't want you to know",
    "no evidence but", "rumor has it"
]


def detect_sensationalism(text):
    found = [w for w in SENSATIONAL_WORDS if w in text.lower()]
    return len(found), found


def detect_bias(text):
    found = [p for p in BIAS_PHRASES if p in text.lower()]
    return len(found), found

def detect_citations(text):
    urls = re.findall(r'https?://\S+', text)
    numbers = re.findall(r'\[\d+\]', text)

    count = len(urls) + len(numbers)
    return count, urls + numbers

def detect_dates(text):
    years = re.findall(r"(19|20)\d{2}", text)
    years = [int(y) for y in years]

    if not years:
        return None, "No publication date detected."

    latest = max(years)
    current = datetime.now().year

    age = current - latest
    return age, f"Most recent date mentioned: {latest}"

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")
    url = data.get("url", "")

    factors = []

    source_score, source_msg = check_source_reliability(url)
    factors.append(source_msg)

    sens_count, sens_words = detect_sensationalism(text)
    if sens_count > 0:
        factors.append(f"Sensational language detected: {', '.join(sens_words)}")
    else:
        factors.append("Minimal sensational language.")

    bias_count, bias_terms = detect_bias(text)
    if bias_count > 0:
        factors.append(f"Bias-indicating phrases: {', '.join(bias_terms)}")
    else:
        factors.append("No strong bias indicators detected.")

    cite_count, cite_list = detect_citations(text)
    if cite_count > 0:
        factors.append(f"Citations/evidence found: {cite_count}")
    else:
        factors.append("No citations or evidence provided.")

    article_age, date_msg = detect_dates(text)
    if article_age is not None:
        if article_age <= 2:
            factors.append(f"Recent information ({date_msg}).")
        else:
            factors.append(f"Outdated information ({date_msg}).")
    else:
        factors.append("No date context detected.")

    score = 0

    score += source_score * 30

    score += max(0, 25 - sens_count * 5)

    score += min(20, cite_count * 4)

    if article_age is None:
        score += 8  
    else:
        score += max(0, 15 - (article_age * 3))

    score += max(0, 10 - (bias_count * 3))

    score = int(max(0, min(100, score)))

    if score >= 70:
        recommendation = "Information appears generally credible. Verify with one additional reputable source for confirmation."
    elif score >= 40:
        recommendation = "Mixed reliability indicators. Cross-check with multiple credible sources before accepting the information."
    else:
        recommendation = "Low credibility indicators detected. Strongly verify claims from trusted fact-checking organizations."

    summary = (
        "This analysis evaluates source reliability, linguistic tone, evidence quality, "
        "and contextual publication details to estimate the credibility of the content."
    )

    return jsonify({
        "score": score,
        "summary": summary,
        "factors": factors,
        "recommendation": recommendation
    })


if __name__ == "__main__":
    app.run(port=5000)
