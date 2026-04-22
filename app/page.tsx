'use client';
import { useState, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';

export default function Home() {
  const [business, setBusiness] = useState('');
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('general');
  const [tone, setTone] = useState('exciting');
  const imageRef = useRef<HTMLDivElement>(null);

  // 🔥 Load saved data
  useEffect(() => {
    const savedBusiness = localStorage.getItem('business');
    if (savedBusiness) setBusiness(savedBusiness);
  }, []);

  // 🔥 Save business
  useEffect(() => {
    if (business) {
      localStorage.setItem('business', business);
    }
  }, [business]);

  // 🔥 Load promos per business
  useEffect(() => {
    if (business) {
      const saved = localStorage.getItem(`promos_${business}`);
      if (saved) setResults(JSON.parse(saved));
    }
  }, [business]);

  const generate = async () => {
    if (!prompt || !business) return;

    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      let base = prompt;

      if (mode === 'restaurant') base = `Delicious food alert! ${prompt}`;
      if (mode === 'barber') base = `Fresh cuts available! ${prompt}`;
      if (mode === 'clothing') base = `New drip just dropped! ${prompt}`;
      if (mode === 'gym') base = `Push your limits! ${prompt}`;

      let styled = base;

      if (tone === 'luxury') styled = `✨ Premium: ${base}`;
      if (tone === 'funny') styled = `😂 Don’t miss this: ${base}`;
      if (tone === 'urgent') styled = `⏳ LAST CHANCE! ${base}`;

      const newPromos = [
        data.result,
        `🔥 ${styled}`,
        `🚀 ${styled.toUpperCase()}`,
      ];

      setResults(newPromos);

      // 🔥 Save per business
      localStorage.setItem(
        `promos_${business}`,
        JSON.stringify(newPromos)
      );

    } catch {
      setResults(['Error generating promo']);
    }

    setLoading(false);
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied!');
  };

  const downloadImage = async () => {
    if (!imageRef.current) return;
    const dataUrl = await htmlToImage.toPng(imageRef.current);

    const link = document.createElement('a');
    link.download = 'promo.png';
    link.href = dataUrl;
    link.click();
  };

  return (
    <main className="min-h-screen bg-black text-white p-6 flex justify-center">
      <div className="w-full max-w-2xl space-y-6">

        <h1 className="text-4xl font-bold text-center">Signal AI</h1>

        {/* BUSINESS NAME */}
        <input
          placeholder="Business name (e.g. Joe’s Barbershop)"
          value={business}
          onChange={(e) => setBusiness(e.target.value)}
          className="w-full p-3 bg-zinc-900 rounded-xl"
        />

        {/* MODE */}
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full p-3 bg-zinc-900 rounded-xl"
        >
          <option value="general">General</option>
          <option value="restaurant">Restaurant</option>
          <option value="barber">Barber</option>
          <option value="clothing">Clothing</option>
          <option value="gym">Gym</option>
        </select>

        {/* TONE */}
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full p-3 bg-zinc-900 rounded-xl"
        >
          <option value="exciting">Exciting</option>
          <option value="luxury">Luxury</option>
          <option value="funny">Funny</option>
          <option value="urgent">Urgent</option>
        </select>

        {/* PROMPT */}
        <input
          placeholder="e.g. haircut special today"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-4 bg-zinc-900 rounded-xl"
        />

        <button
          onClick={generate}
          className="w-full p-4 bg-white text-black rounded-xl"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>

        {results.length > 0 && (
          <>
            <div ref={imageRef} className="bg-white text-black p-4 rounded-xl">
              {results.map((r, i) => (
                <p key={i}>{r}</p>
              ))}
              <p className="text-xs text-center mt-2">
  {business} • Powered by Signal AI
</p>
            </div>

            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => copy(r)}
                className="w-full p-2 bg-green-500 rounded"
              >
                Copy Promo
              </button>
            ))}

            <button
              onClick={downloadImage}
              className="w-full p-3 bg-blue-500 rounded"
            >
              Download Image
            </button>
          </>
        )}
      </div>
    </main>
  );
}
