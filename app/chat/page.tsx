"use client";
import { useState, useRef, useEffect } from "react";

const API = "https://mahabub-unlocked-ai-support-saas.hf.space";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  sentiment?: string;
  priority?: string;
  source?: string;
  ticket_id?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "system", content: "Hello! I'm your AI support assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);
    try {
      const response = await fetch(`${API}/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId,
          company_id: 1,
          customer_name: "Guest"
        })
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response,
        sentiment: data.sentiment,
        priority: data.priority,
        source: data.source,
        ticket_id: data.ticket_id
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const priorityColors: Record<string, string> = {
    urgent: "bg-red-500/20 text-red-400 border-red-500/30",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    medium: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const sentimentEmoji: Record<string, string> = {
    angry: "😡", "angry/frustrated": "😡",
    frustrated: "😟", neutral: "😐", happy: "😄"
  };

  const quickReplies = [
    "My payment failed",
    "How to reset password?",
    "Cancel subscription",
    "Refund policy",
  ];

  return (
    <div className="flex flex-col h-screen bg-[#050510] text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07] bg-[#050510]/80 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center text-lg">
              🤖
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#050510]"></div>
          </div>
          <div>
            <div className="font-semibold text-sm">AI Support Assistant</div>
            <div className="text-xs text-green-400">● Online — Powered by LLaMA 3.3</div>
          </div>
        </div>
        <a href="/dashboard" className="text-xs text-white/40 hover:text-white/70 bg-white/5 px-3 py-1.5 rounded-lg transition">
          📊 Dashboard
        </a>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "system" && (
              <div className="w-full text-center">
                <span className="text-xs text-white/30 bg-white/5 px-4 py-1.5 rounded-full">
                  {msg.content}
                </span>
              </div>
            )}
            {msg.role === "user" && (
              <div className="max-w-[75%]">
                <div className="bg-gradient-to-br from-violet-600 to-blue-600 px-4 py-3 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-lg shadow-violet-500/20">
                  {msg.content}
                </div>
              </div>
            )}
            {msg.role === "assistant" && (
              <div className="max-w-[80%] space-y-2">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                    🤖
                  </div>
                  <div className="bg-white/[0.06] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed">
                    {msg.content}
                  </div>
                </div>
                {(msg.sentiment || msg.priority || msg.ticket_id) && (
                  <div className="flex gap-2 ml-9 flex-wrap">
                    {msg.sentiment && (
                      <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">
                        {sentimentEmoji[msg.sentiment] || "😐"} {msg.sentiment}
                      </span>
                    )}
                    {msg.priority && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[msg.priority] || ""}`}>
                        ● {msg.priority}
                      </span>
                    )}
                    {msg.source && (
                      <span className="text-xs text-white/30 bg-white/5 px-2 py-0.5 rounded-full">
                        📚 {msg.source}
                      </span>
                    )}
                    {msg.ticket_id && (
                      <span className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                        🎟 Ticket #{msg.ticket_id}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-xs">
                🤖
              </div>
              <div className="bg-white/[0.06] border border-white/[0.08] px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:"0.15s"}}></div>
                  <div className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{animationDelay:"0.3s"}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick replies */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex gap-2 flex-wrap">
          {quickReplies.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); inputRef.current?.focus(); }}
              className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full transition text-white/60 hover:text-white"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-3 border-t border-white/[0.07]">
        <div className="flex gap-3 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-violet-500/50 transition-all">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-white/30"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 rounded-xl text-sm font-medium transition-all"
          >
            Send ↑
          </button>
        </div>
      </div>
    </div>
  );
}