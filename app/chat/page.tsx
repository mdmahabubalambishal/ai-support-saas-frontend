"use client";
import { useState, useEffect, useRef } from "react";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  sentiment?: string;
  priority?: string;
  source?: string;
  ticket_id?: number;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // ✅ FIX: companyId define করো
  const companyId = "demo-company";

  useEffect(() => {
    const ws = new WebSocket(
      `wss://mahabub-unlocked-ai-support-saas.hf.space/chat/ws/${companyId}/${sessionId}`
    );

    ws.onopen = () => setConnected(true);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "typing") {
        setLoading(true);
        return;
      }

      setLoading(false);

      if (data.type === "assistant") {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            sentiment: data.sentiment,
            priority: data.priority,
            source: data.source,
            ticket_id: data.ticket_id,
          },
        ]);
      }

      if (data.type === "system") {
        setMessages([
          {
            role: "system",
            content: data.message,
          },
        ]);
      }
    };

    ws.onclose = () => setConnected(false);
    wsRef.current = ws;

    return () => ws.close();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = () => {
    if (!input.trim() || !wsRef.current) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);

    wsRef.current.send(JSON.stringify({ message: input }));
    setInput("");
    setLoading(true);
  };

  // ... rest unchanged
}