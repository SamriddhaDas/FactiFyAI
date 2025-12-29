export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-20 animate-fadeIn">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 animate-slideUp">
        About FactiFyAI
      </h1>

      <p className="text-gray-200 text-newsroomLg leading-relaxed">
        FactiFyAI is a rule-based content verification tool designed to help users
        evaluate the credibility of online information. During major events and
        high-traffic news cycles, misinformation spreads rapidly. FactiFyAI aims
        to reduce confusion by offering transparent credibility analysis — without
        censorship or automated content suppression.
      </p>

      <h2 className="text-2xl text-yellow-400 font-bold mt-10 animate-slideUp">
        Why FactiFyAI?
      </h2>
      <p className="text-gray-300 mt-2 leading-relaxed">
        Traditional automated content filters can be biased or overly aggressive.
        FactiFyAI takes a different approach: instead of deleting or limiting content,
        it provides readers with clear signals, context, and explanations regarding
        the reliability of what they’re viewing.
      </p>

      <h2 className="text-2xl text-yellow-400 font-bold mt-10 animate-slideUp">
        Features
      </h2>
      <ul className="list-disc ml-6 mt-2 space-y-2 text-gray-300">
        <li>Rule-based credibility checks (source, patterns, date, bias)</li>
        <li>Source reliability indicators and context awareness</li>
        <li>Clear reasoning behind credibility scores</li>
        <li>Encourages critical thinking, not censorship</li>
      </ul>

      <h2 className="text-2xl text-yellow-400 font-bold mt-10 animate-slideUp">
        Vision
      </h2>
      <p className="text-gray-300 mt-2 leading-relaxed">
        Our mission is to create digital tools that promote informed decision-making.
        FactiFyAI empowers users to slow down, verify information, and navigate
        online content with confidence.
      </p>
    </div>
  );
}
