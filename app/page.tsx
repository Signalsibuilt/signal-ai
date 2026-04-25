'use client';

import { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-8"
      >

        {/* HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-bold tracking-tight">
            Signal <span className="text-green-400">AI</span>
          </h1>
          <p className="text-zinc-400">Turn ideas into customer-grabbing promos</p>
          <p className="text-xs text-green-400">
            Built for local businesses 🚀
          </p>
        </div>

        {/* CARD */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 space-y-6 shadow-2xl"
        >

          <img
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df"
            className="rounded-xl h-44 w-full object-cover opacity-80"
          />

          <p className="text-sm text-yellow-400 text-center">
            ⚡ Example: “2-for-1 burgers tonight after 6pm”
          </p>

          {/* BUSINESS */}
          <Input
            placeholder="Business name (e.g. Craft Café)"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
          />

          {/* MODES */}
          <div className="flex gap-2 justify-center flex-wrap">
            {['🍔 Food', '👕 Clothing', '💈 Barber'].map((m) => (
              <Button
                key={m}
                variant={mode === m ? "default" : "outline"}
                onClick={() => setMode(m)}
              >
                {m}
              </Button>
            ))}
          </div>

          {/* TONE */}
          <div className="flex gap-2 justify-center flex-wrap">
            {['🔥 Hype', '💎 Premium', '😊 Friendly'].map((t) => (
              <Button
                key={t}
                variant={tone === t ? "default" : "outline"}
                onClick={() => setTone(t)}
              >
                {t}
              </Button>
            ))}
          </div>

          {/* INPUT */}
          <Input
            placeholder="e.g. burger special tonight"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* IDEA */}
          <Button variant="ghost" onClick={generateIdea}>
            Generate idea ✨
          </Button>

          {/* CTA */}
          <Button
            onClick={generate}
            disabled={!prompt}
            className="w-full text-lg font-bold"
          >
            {loading ? 'Generating...' : 'Get Customers Now 🚀'}
          </Button>

        </motion.div>

        {/* RESULTS */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >

            <div
              ref={imageRef}
              className="bg-white text-black rounded-2xl p-6 space-y-4 shadow-2xl"
            >
              <h2 className="text-xl font-bold text-center">
                {business || 'Your Business'}
              </h2>

              {results.map((text, i) => (
                <div key={i} className="p-4 bg-white rounded-xl shadow-md">
                  <p>{text}</p>
                </div>
              ))}
            </div>

            <Button onClick={copyAll}>Copy All</Button>

            {results.map((text, i) => (
              <div key={i} className="flex gap-2">
                <Button onClick={() => copy(text, i)}>
                  {copiedIndex === i ? 'Copied ✅' : `Copy ${i + 1}`}
                </Button>

                <Button onClick={() => shareWhatsApp(text)}>
                  WhatsApp 📲
                </Button>
              </div>
            ))}

            <Button onClick={() => shareInstagram(results[0])}>
              Open Instagram 📸
            </Button>

            <Button onClick={downloadImage}>
              Download Image
            </Button>

          </motion.div>
        )}

      </motion.div>
    </main>
  );
}
