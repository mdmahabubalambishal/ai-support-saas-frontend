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
    { role: "system", content: "👋 Hello! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);

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
    } catch (error) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sentimentEmoji = (s?: string) => {
    const map: Record<string, string> = {
      angry: "😡", frustrated: "😟",
      "angry/frustrated": "😡", neutral: "😐", happy: "😄"
    };
    return s ? map[s] || "😐" : "";
  };

  const priorityColor = (p?: string) => {
    const map: Record<string, string> = {
      urgent: "text-red-500", high: "text-orange-500",
      medium: "text-blue-500", low: "text-gray-500"
    };
    return p ? map[p] || "" : "";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center gap-3">
        <div className="text-2xl">🤖</div>
        <div>
          <div className="font-bold text-lg">AI Customer Support</div>
          <div className="text-sm opacity-80">🟢 Online</div>
        </div>
        <a href="/dashboard" className="ml-auto bg-white bg-opacity-20 px-4 py-1 rounded-full text-sm hover:bg-opacity-30">
          📊 Dashboard
        </a>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "system" && (
              <div className="text-center text-gray-500 text-sm italic w-full">{msg.content}</div>
            )}
            {msg.role === "user" && (
              <div className="max-w-xs lg:max-w-md">
                <div className="bg-purple-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm">
                  {msg.content}
                </div>
              </div>
            )}
            {msg.role === "assistant" && (
              <div className="max-w-xs lg:max-w-md">
                <div className="flex items-start gap-2">
                  <div className="text-2xl">🤖</div>
                  <div>
                    <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                      {msg.content}
                    </div>
                    <div className="flex gap-2 mt-1 text-xs text-gray-500">
                      {msg.sentiment && <span>{sentimentEmoji(msg.sentiment)} {msg.sentiment}</span>}
                      {msg.priority && <span className={priorityColor(msg.priority)}>● {msg.priority}</span>}
                      {msg.source && <span>📚 {msg.source}</span>}
                      {msg.ticket_id && <span className="text-orange-500">🎟 Ticket #{msg.ticket_id}</span>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🤖</div>
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white border-t p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-purple-400"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 disabled:opacity-50 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}