export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto mt-24 px-4 py-20">
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-6">
        FactiFy <span className="text-blue-300">AI</span>
      </h1>
      <p className="text-gray-200 max-w-2xl">
        In a digital era filled with misinformation, FactiFyAI gives you clarity.
      </p>
      <a
        href="/verify"
        className="inline-block mt-10 bg-blue-500 px-8 py-3 text-black rounded-md font-semibold"
      >
        Start Verification →
      </a>
    </section>
  );
}
