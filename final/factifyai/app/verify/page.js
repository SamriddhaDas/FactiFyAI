"use client";

import { useState } from "react";
import CredibilityCard from "../../components/CredibilityCard.jsx";

export default function Verify() {
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeContent = async () => {
    setLoading(true);
    setResult(null);

    const response = await fetch("http://127.0.0.1:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: content, url: url }),
    });

    const data = await response.json();
    setLoading(false);
    setResult(data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-fadeIn">
      <h1 className="text-4xl font-extrabold text-center text-yellow-400 mb-10">
        Verify Content Integrity
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        <div className="bg-black/40 border border-white/10 p-6 rounded-xl">
          <label className="text-sm text-gray-300 font-semibold">Analyze URL (Optional)</label>
          <input
            className="w-full p-3 mt-2 mb-6 rounded-lg bg-black/30 border border-white/10"
            onChange={(e) => setUrl(e.target.value)}
          />

          <label className="text-sm text-gray-300 font-semibold">Analyze Text</label>
          <textarea
            className="w-full h-56 p-4 mt-2 bg-black/30 border border-white/10 rounded-xl"
            onChange={(e) => setContent(e.target.value)}
          ></textarea>

          <button
            onClick={analyzeContent}
            disabled={loading}
            className="mt-5 w-full py-3 bg-blue-500 text-black font-semibold rounded-md"
          >
            {loading ? "Analyzing…" : "Verify Integrity"}
          </button>
        </div>

        <div className="flex justify-center items-start">
          {loading && (
            <div className="bg-black/40 p-10 border border-white/10 rounded-xl animate-pulseSoft">
              <p className="text-xl font-bold text-yellow-400">Analyzing...</p>
              <p className="text-gray-400 text-sm">Running rule-based verification…</p>
            </div>
          )}

          {!loading && !result && (
            <div className="bg-black/40 p-10 border border-white/10 rounded-xl">
              <p className="text-xl font-bold text-gray-200">Ready to Analyze</p>
              <p className="text-sm text-gray-400 mt-2 max-w-xs">
                Enter text or a URL to evaluate credibility.
              </p>
            </div>
          )}

          {!loading && result && (
            <CredibilityCard
              score={result.score}
              factors={result.factors}
              summary={result.summary}
              recommendation={result.recommendation}
            />
          )}
        </div>
      </div>
    </div>
  );
}
