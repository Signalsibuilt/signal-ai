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

  const generateIdea = () => {
    const ideas = [
      '2-for-1 deal this weekend',
      'Happy hour special after 6pm',
      'Limited time discount on best sellers',
      'Weekend special with free drink',
      'Flash sale today only',
    ];
    const random = ideas[Math.floor(Math.random() * ideas.length)];
    setPrompt(random);
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

  const shareInstagram = (text: string) => {
    navigator.clipboard.writeText(text);
    window.open('https://www.instagram.com/', '_blank');
    alert('Caption copied! Paste it into Instagram 🚀');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8 animate-fade-in">

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight animate-pulse">
            Signal <span className="text-green-400">AI</span>
          </h1>
          <p className="text-zinc-400">Turn simple ideas into customer-grabbing promos</p>
          <p className="text-xs text-green-400">
            Helping local businesses get more customers 🚀
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl hover:scale-[1.01] transition">

          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
            className="rounded-xl h-44 w-full object-cover opacity-80"
          />

          {/* EXAMPLE */}
          <p className="text-sm text-yellow-400 text-center animate-pulse">
            ⚡ Example: “2-for-1 burgers tonight after 6pm”
          </p>

          {/* BUSINESS */}
          <input
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 focus:border-green-400 transition"
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
                    ? 'bg-white text-black scale-105'
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
                className={`px-4 py-2 rounded-full text-sm transition ${
                  tone === t
                    ? 'bg-white text-black scale-105'
                    : 'bg-white/10 hover:bg-white/20'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <input
            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 focus:border-green-400 transition"
            placeholder="e.g. burger special tonight"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* IDEA BUTTON */}
          <button
            onClick={generateIdea}
            className="w-full p-2 text-sm text-zinc-400 hover:text-white transition"
          >
            Generate idea for me ✨
          </button>

          {/* CTA */}
          <button
            onClick={generate}
            disabled={!prompt}
            className="w-full p-4 rounded-xl bg-green-400 text-black font-bold text-lg hover:scale-[1.03] active:scale-[0.98] transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Get Customers Now 🚀'}
          </button>

        </div>

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="space-y-6 animate-fade-in">

            <div
              ref={imageRef}
              className="bg-white text-black rounded-2xl p-6 space-y-4 shadow-2xl animate-slide-up"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{business || 'Your Business'}</h2>
                <p className="text-sm uppercase tracking-widest text-zinc-500">
                  {mode} Special
                </p>
              </div>

              {results.map((text, i) => (
                <div key={i} className="p-4 bg-white rounded-xl shadow-md space-y-2 hover:scale-[1.02] transition">
                  <p className="text-lg font-semibold">{text}</p>
                  <p className="text-sm text-zinc-500">Limited time offer</p>
                </div>
              ))}

              <p className="text-xs text-center opacity-50">
                {business || 'Your Business'} • Signal AI
              </p>
            </div>

            <button
              onClick={copyAll}
              className="w-full p-3 rounded-xl bg-purple-500 text-white font-semibold hover:scale-[1.02] transition"
            >
              Copy All Promos
            </button>

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

            <button
              onClick={() => shareInstagram(results[0])}
              className="w-full p-4 rounded-xl bg-pink-500 text-white font-semibold hover:scale-[1.02] transition"
            >
              Open Instagram & Paste 📸
            </button>

            <button
              onClick={downloadImage}
              className="w-full p-4 rounded-xl bg-blue-500 text-white font-semibold hover:scale-[1.02] transition"
            >
              Download Promo Image
            </button>

          </div>
        )}

      </div>

      {/* ANIMATIONS */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.6s ease forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
