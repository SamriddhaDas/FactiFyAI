export default function CredibilityCard({ score, summary, factors = [], recommendation }) {
  return (
    <div className="w-full max-w-md bg-black/40 border border-white/10 p-6 rounded-xl">
      <p className="text-sm uppercase font-semibold text-yellow-400">Credibility Score</p>
      <div className="text-6xl font-extrabold text-blue-300">{score}/100</div>

      <h3 className="mt-6 font-bold text-lg">Analysis Summary</h3>
      <p className="text-gray-200 text-sm mt-1">{summary}</p>

      {factors.length > 0 && (
        <>
          <h3 className="mt-6 font-bold text-lg">Key Factors</h3>
          <ul className="list-disc ml-5 mt-2 text-gray-300 text-sm">
            {factors.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </>
      )}

      <h3 className="mt-6 font-bold text-lg">Recommendation</h3>
      <p className="text-gray-200 text-sm">{recommendation}</p>
    </div>
  );
}
