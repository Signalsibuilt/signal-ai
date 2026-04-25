'use client';
import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [business, setBusiness] = useState('');
  const [tone, setTone] = useState('🔥 Hype');
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
          prompt: `${business} - ${mode} promotion in a ${tone} tone: ${prompt}`,
        }),
      });

      const data = await res.json();

      const variations = [
        data.result,
        `🔥 ${business} Special: ${prompt}! Limited time!`,
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

  const copyAll = () => {
    navigator.clipboard.writeText(results.join('\n\n'));
  };

  const downloadImage = async () => {
    if (!imageRef.current) return;

    const dataUrl = await htmlToImage.toPng(imageRef.current);
    const link = document.createElement('a');
    link.download = 'signal-ai-promo.png';
    link.href = dataUrl;
    link.click();
  };

  const shareWhatsApp = (text: string) => {
    const message = `${text}\n\nCreated with Signal AI`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Instagram doesn't allow direct text sharing like WhatsApp
  // So we guide user to copy + open IG
  const shareInstagram = async () => {
    if (!imageRef.current) return;

    const dataUrl = await htmlToImage.toPng(imageRef.current);

    const link = document.createElement('a');
    link.download = 'promo-for-instagram.png';
    link.href = dataUrl;
    link.click();

    alert('Image downloaded! Upload it to Instagram and paste your promo caption 🚀');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Signal <span className="text-green-400">AI</span>
          </h1>
          <p className="text-zinc-400">
            AI marketing tool for local businesses
          </p>
          <p className="text-sm text-zinc-500">
            Create high-converting promos for WhatsApp, Instagram & daily offers
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl">

          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
            className="rounded-xl h-44 w-full object-cover opacity-80"
          />

          {/* BUSINESS NAME */}
          <input
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
            placeholder="Business name (e.g. Craft Café)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />

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

          {/* TONE */}
          <div className="flex gap-2 justify-center flex-wrap">
            {['🔥 Hype', '💎 Premium', '😊 Friendly'].map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-4 py-2 rounded-full text-sm ${
                  tone === t ? 'bg-white text-black' : 'bg-white/10'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <input
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10"
            placeholder="e.g. burger special tonight"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* CTA */}
          <button
            onClick={generate}
            className="w-full p-4 rounded-xl bg-green-400 text-black font-bold text-lg hover:scale-[1.03]"
          >
            {loading ? 'Generating...' : 'Generate High-Converting Promos'}
          </button>

        </div>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="space-y-6">

            <div
              ref={imageRef}
              className="bg-gradient-to-br from-white to-zinc-200 text-black rounded-2xl p-6 space-y-4 shadow-2xl"
            >
              <h2 className="text-xl font-bold">🔥 Ready-to-Post Promos</h2>

              {results.map((text, i) => (
                <div key={i} className="p-3 bg-white rounded-lg shadow">
                  <p>{text}</p>
                </div>
              ))}

              <p className="text-xs text-center opacity-50">
                {business || 'Your Business'} • Powered by Signal AI
              </p>
            </div>

            {/* COPY ALL */}
            <button
              onClick={copyAll}
              className="w-full p-3 rounded-xl bg-purple-500 text-white font-semibold"
            >
              Copy All Promos
            </button>

            {/* ACTION BUTTONS */}
            {results.map((text, i) => (
              <div key={i} className="flex gap-2">
                <button
                  onClick={() => copy(text, i)}
                  className="flex-1 p-3 rounded-xl bg-green-500 text-black font-semibold"
                >
                  {copiedIndex === i ? 'Copied ✅' : `Copy ${i + 1}`}
                </button>

                <button
                  onClick={() => shareWhatsApp(text)}
                  className="flex-1 p-3 rounded-xl bg-green-600 text-white font-semibold"
                >
                  WhatsApp 📲
                </button>
              </div>
            ))}

            {/* INSTAGRAM */}
            <button
              onClick={shareInstagram}
              className="w-full p-4 rounded-xl bg-pink-500 text-white font-semibold"
            >
              Download for Instagram 📸
            </button>

            {/* DOWNLOAD */}
            <button
              onClick={downloadImage}
              className="w-full p-4 rounded-xl bg-blue-500 text-white font-semibold"
            >
              Download Promo Image
            </button>

          </div>
        )}

      </div>
    </main>
  );
}
