export default function Hero() {
  return (
    <section
      className="max-w-6xl mx-auto mt-24 px-4 py-20 
                 animate-fadeIn animate-slideUp"
    >
      <h1 className="text-5xl md:text-6xl font-extrabold text-yellow-400 mb-6 leading-tight">
        FactiFy <span className="text-blue-300">AI</span>
      </h1>

      <p className="text-newsroomLg text-gray-200 max-w-2xl leading-relaxed">
        In an era of digital noise, clarity is power. FactiFyAI helps you evaluate
        the credibility of online information using transparent, rule-based analysis.
      </p>

      <a
        href="/verify"
        className="inline-block mt-10 bg-blue-500 px-8 py-3 rounded-md font-semibold
                   text-black hover:bg-blue-400 transition-all duration-200
                   shadow-md"
      >
        Start Verification →
      </a>
    </section>
  );
}
