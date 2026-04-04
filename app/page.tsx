"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${p.opacity})`;
        ctx.fill();
      });
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, []);

  const features = [
    { icon: "🧠", title: "RAG Intelligence", desc: "Knowledge base powered instant answers" },
    { icon: "⚡", title: "Real-time Chat", desc: "WebSocket live communication" },
    { icon: "🎤", title: "Voice AI", desc: "Whisper STT + Neural TTS" },
    { icon: "🎟", title: "Smart Tickets", desc: "Auto-creation with priority detection" },
    { icon: "📧", title: "Email Automation", desc: "Auto-reply and follow-up engine" },
    { icon: "📊", title: "Analytics", desc: "Real-time sentiment dashboard" },
  ];

  return (
    <div className="relative min-h-screen bg-[#050510] text-white overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Glow effects */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl z-0" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-sm font-bold">
            AI
          </div>
          <span className="font-semibold text-white/90 tracking-tight">SupportAI</span>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <button className="text-sm text-white/60 hover:text-white px-4 py-2 transition">
              Dashboard
            </button>
          </Link>
          <Link href="/chat">
            <button className="text-sm bg-violet-600 hover:bg-violet-500 px-5 py-2 rounded-lg transition font-medium">
              Start Chat
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-300 mb-8">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
          Powered by Groq LLaMA 3.3 70B
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Customer Support
          <br />
          <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Reimagined with AI
          </span>
        </h1>

        <p className="text-lg text-white/50 max-w-xl mb-10 leading-relaxed">
          Automate your entire support workflow — from instant AI replies to smart ticket routing, voice support, and real-time analytics.
        </p>

        <div className="flex gap-4 mb-20">
          <Link href="/chat">
            <button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 px-8 py-3.5 rounded-xl font-semibold text-base transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105">
              💬 Try Live Chat
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:scale-105">
              📊 View Dashboard
            </button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-12 mb-20 text-center">
          {[
            { value: "< 1s", label: "Response Time" },
            { value: "RAG", label: "Knowledge Base" },
            { value: "7", label: "AI Features" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl font-bold text-white">{s.value}</div>
              <div className="text-sm text-white/40 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl w-full">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 text-left hover:bg-white/[0.06] hover:border-violet-500/30 transition-all hover:-translate-y-1 group"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <div className="font-semibold text-white/90 mb-1 text-sm">{f.title}</div>
              <div className="text-xs text-white/40 leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 text-white/20 text-xs border-t border-white/5">
        Built with FastAPI · LangChain · ChromaDB · Groq · Next.js
      </div>
    </div>
  );
}