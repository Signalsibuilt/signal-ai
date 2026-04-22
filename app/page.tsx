'use client';
import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mode, setMode] = useState('');
  const imageRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!prompt) return;

    setLoading(true);
    setResults([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `${mode} promotion: ${prompt}`,
        }),
      });

      const data = await res.json();

      const variations = [
        data.result,
        `🔥 Limited Deal: ${prompt}! Only today!`,
        `🚀 ${prompt.toUpperCase()} — Don’t miss out!`,
      ];

      setResults(variations);
    } catch {
      setResults(['Something went wrong']);
    }

    setLoading(false);
  };

  const copy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const downloadImage = async () => {
    if (!imageRef.current) return;

    const dataUrl = await htmlToImage.toPng(imageRef.current);

    const link = document.createElement('a');
    link.download = 'signal-ai-promo.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold">Signal AI</h1>
          <p className="text-zinc-400 text-lg">
            AI marketing tool for local businesses
          </p>
          <p className="text-sm text-zinc-400">
            Turn your ideas into <span className="text-white font-semibold">sales-driving promos</span> in seconds
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-xl">

          {/* IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
            className="rounded-xl h-44 w-full object-cover opacity-80"
          />

          {/* USE CASE TEXT */}
          <p className="text-sm text-zinc-400 text-center">
            Perfect for Instagram posts, WhatsApp promotions, and daily offers
          </p>

          {/* MODES */}
          <div className="flex gap-2 justify-center flex-wrap">
            {['🍔 Food', '👕 Clothing', '💈 Barber'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  mode === m
                    ? 'bg-white text-black'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <input
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 outline-none focus:border-white/40 transition"
            placeholder="e.g. burger special tonight"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* BUTTON */}
          <button
            onClick={generate}
            className="w-full p-4 rounded-xl bg-white text-black font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? 'Generating...' : 'Generate Promos'}
          </button>

        </div>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="space-y-6">

            {/* PREVIEW CARD */}
            <div
              ref={imageRef}
              className="bg-white text-black rounded-2xl p-6 space-y-4 shadow-2xl"
            >
              <h2 className="text-xl font-bold">🔥 Ready-to-Post Promos</h2>

              {results.map((text, i) => (
                <div key={i} className="p-3 bg-zinc-100 rounded-lg">
                  <p>{text}</p>
                </div>
              ))}

              <p className="text-xs text-center opacity-50">
                Powered by Signal AI
              </p>
            </div>

            {/* COPY BUTTONS */}
            {results.map((text, i) => (
              <button
                key={i}
                onClick={() => copy(text, i)}
                className="w-full p-3 rounded-xl bg-green-500 text-black font-semibold hover:scale-[1.02] transition"
              >
                {copiedIndex === i ? 'Copied ✅' : `Copy Promo ${i + 1}`}
              </button>
            ))}

            {/* DOWNLOAD */}
            <button
              onClick={downloadImage}
              className="w-full p-4 rounded-xl bg-blue-500 text-white font-semibold hover:scale-[1.02] transition"
            >
              Download Promo Image
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
