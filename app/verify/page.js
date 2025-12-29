"use client";

import { useState } from "react";
import CredibilityCard from "../../components/CredibilityCard";

export default function Verify() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeContent = async () => {
    setLoading(true);
    setResult(null);

    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: content,
        url: url,
      }),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-10 animate-slideUp">
        Verify Content Integrity
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT PANEL — INPUTS */}
        <div className="bg-black/40 border border-white/10 backdrop-blur-md p-6 rounded-xl animate-slideInLeft">

          {/* URL Input */}
          <label className="text-sm text-gray-300 font-semibold">Analyze URL (Optional)</label>
          <input
            type="text"
            placeholder="https://example.com/news-article"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full mt-2 mb-6 p-3 rounded-lg bg-black/30 border border-white/10 text-sm"
          />

          {/* TEXT AREA */}
          <label className="text-sm text-gray-300 font-semibold">Analyze Text</label>
          <textarea
            className="w-full h-56 p-4 bg-black/30 border border-white/10 rounded-xl mt-2 text-sm"
            placeholder="Paste article text or social media content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          {/* BUTTON */}
          <button
            onClick={analyzeContent}
            disabled={loading}
            className="mt-5 w-full py-3 bg-blue-500 text-black font-semibold rounded-md transition-colors
                       hover:bg-blue-400 disabled:bg-blue-900 disabled:text-gray-300"
          >
            {loading ? "Analyzing…" : "Verify Integrity"}
          </button>
        </div>

        {/* RIGHT PANEL — RESULTS */}
        <div className="flex justify-center items-start animate-slideInRight">

          {/* LOADING STATE */}
          {loading && (
            <div className="bg-black/40 border border-white/10 backdrop-blur-md p-10 rounded-xl text-center animate-pulseSoft">
              <p className="text-xl font-bold text-yellow-400">Analyzing...</p>
              <p className="text-gray-300 text-sm mt-2">
                Applying rule-based checks for credibility, reliability, and linguistic patterns.
              </p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !result && (
            <div className="bg-black/40 border border-white/10 backdrop-blur-md p-10 rounded-xl text-center animate-fadeIn">
              <p className="text-xl font-bold text-gray-200">Ready to Analyze</p>
              <p className="text-sm text-gray-400 mt-2 max-w-xs">
                Enter a URL or paste content to evaluate credibility.   
                Results will appear here.
              </p>
            </div>
          )}

          {/* RESULT CARD */}
          {!loading && result && (
            <CredibilityCard
              score={result.score}
              summary={result.summary}
              factors={result.factors}
              recommendation={result.recommendation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
