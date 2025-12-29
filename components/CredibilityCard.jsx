export default function CredibilityCard({ score, summary, factors = [], recommendation }) {
  return (
    <div
      className="w-full max-w-md bg-black/40 border border-white/10 
                 backdrop-blur-md p-6 rounded-xl shadow-xl
                 animate-slideInRight"
    >
      {/* Score */}
      <p className="text-sm uppercase font-semibold text-yellow-400 tracking-wide">
        Credibility Score
      </p>

      <div className="text-6xl font-extrabold text-blue-300 mt-1">
        {score}/100
      </div>

      <p className="text-yellow-400 font-semibold text-sm mt-1">
        {score >= 70
          ? "High Confidence"
          : score >= 40
          ? "Medium Confidence"
          : "Low Confidence"}
      </p>

      {/* Summary */}
      <h3 className="mt-6 font-bold text-newsroomXl">Analysis Summary</h3>
      <p className="text-gray-200 text-sm leading-relaxed mt-1">{summary}</p>

      {/* Factors */}
      {factors.length > 0 && (
        <>
          <h3 className="mt-6 font-bold text-newsroomXl">Key Factors</h3>
          <ul className="list-disc ml-5 mt-2 space-y-1 text-gray-300 text-sm">
            {factors.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      )}

      {/* Recommendation */}
      <h3 className="mt-6 font-bold text-newsroomXl">Recommendation</h3>
      <p className="text-gray-200 text-sm leading-relaxed mt-1">
        {recommendation}
      </p>
    </div>
  );
}
