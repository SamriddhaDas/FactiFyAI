export default function Resources() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 animate-fadeIn">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 animate-slideUp">
        Resources
      </h1>

      <p className="text-gray-200 text-newsroomLg leading-relaxed">
        Explore trusted tools and references used globally in misinformation
        detection, journalism, and content verification.
      </p>

      <h2 className="text-2xl font-bold text-yellow-400 mt-10 animate-slideUp">
        Recommended Fact-Checking Databases
      </h2>
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-300">
        <li>PolitiFact</li>
        <li>Snopes</li>
        <li>Reuters Fact Check</li>
        <li>AP Fact Check</li>
        <li>BBC Reality Check</li>
      </ul>

      <h2 className="text-2xl font-bold text-yellow-400 mt-10">
        Tools for Verification
      </h2>
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-300">
        <li>Google Reverse Image Search</li>
        <li>InVID Video Verification</li>
        <li>Wayback Machine (Archive.org)</li>
      </ul>

      <h2 className="text-2xl font-bold text-yellow-400 mt-10">
        Educational Resources
      </h2>
      <p className="text-gray-300 mt-2 leading-relaxed">
        Learn how misinformation spreads and how to identify credible sources.
      </p>
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-300">
        <li>Digital Journalism Ethics</li>
        <li>How to Evaluate Sources</li>
        <li>Media Bias Indicators</li>
      </ul>
    </div>
  );
}
