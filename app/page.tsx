"use client";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
      <div className="text-center text-white px-6">
        <div className="text-6xl mb-6">🤖</div>
        <h1 className="text-5xl font-bold mb-4">AI Customer Support</h1>
        <p className="text-xl mb-8 opacity-90">
          Automate your customer support with AI
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/chat">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-purple-50 transition">
              💬 Live Chat
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-white hover:text-purple-600 transition">
              📊 Dashboard
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          {[
            { icon: "🧠", title: "AI Powered", desc: "LLM + RAG technology" },
            { icon: "⚡", title: "Real-time", desc: "WebSocket live chat" },
            { icon: "🎤", title: "Voice AI", desc: "Speech to text & back" },
            { icon: "🎟", title: "Auto Tickets", desc: "Smart ticket creation" },
            { icon: "📧", title: "Email Auto", desc: "Automated responses" },
            { icon: "📊", title: "Analytics", desc: "Full dashboard" },
          ].map((f, i) => (
            <div key={i} className="bg-white bg-opacity-10 rounded-2xl p-5 backdrop-blur">
              <div className="text-3xl mb-2">{f.icon}</div>
              <div className="font-bold">{f.title}</div>
              <div className="text-sm opacity-80">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}