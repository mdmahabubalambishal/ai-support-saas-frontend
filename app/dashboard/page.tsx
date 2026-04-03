"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://mahabub-unlocked-ai-support-saas.hf.space";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [mood, setMood] = useState<any[]>([]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [s, t, m] = await Promise.all([
      axios.get(`${API}/dashboard/stats/1`),
      axios.get(`${API}/dashboard/tickets/recent/1`),
      axios.get(`${API}/dashboard/customer-mood/1`),
    ]);
    setStats(s.data);
    setTickets(t.data);
    setMood(m.data);
  };

  const priorityColor: Record<string, string> = {
    urgent: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-blue-100 text-blue-700",
    low: "bg-gray-100 text-gray-700",
  };

  const statusColor: Record<string, string> = {
    open: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-700",
  };

  if (!stats) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-gray-500">Loading dashboard...</div>
    </div>
  );

  const o = stats.overview;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📊 AI Support Dashboard</h1>
        <div className="flex gap-3">
          <button onClick={loadData} className="bg-white bg-opacity-20 px-4 py-2 rounded-full hover:bg-opacity-30">
            🔄 Refresh
          </button>
          <a href="/chat" className="bg-white text-purple-600 px-4 py-2 rounded-full font-bold hover:bg-purple-50">
            💬 Live Chat
          </a>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { emoji: "🎟", value: o.total_tickets, label: "Total Tickets" },
            { emoji: "🔓", value: o.open_tickets, label: "Open Tickets" },
            { emoji: "✅", value: o.resolved_tickets, label: "Resolved" },
            { emoji: "💬", value: o.total_chats, label: "Total Chats" },
            { emoji: "📈", value: o.resolution_rate + "%", label: "Resolution Rate" },
            { emoji: "🤖", value: o.ai_handled_rate + "%", label: "AI Handled" },
            { emoji: "📨", value: o.total_messages, label: "Messages" },
            { emoji: "⚡", value: stats.priority_breakdown["urgent"] || 0, label: "Urgent" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="text-3xl mb-1">{s.emoji}</div>
              <div className="text-3xl font-bold text-purple-600">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Customer Mood */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
          <h2 className="font-bold text-lg mb-4">😄 Customer Mood</h2>
          <div className="flex gap-4 flex-wrap">
            {mood.map((m, i) => (
              <div key={i} className="flex-1 min-w-[120px] text-center bg-gray-50 rounded-xl p-4">
                <div className="text-4xl">{m.emoji}</div>
                <div className="text-2xl font-bold mt-1">{m.count}</div>
                <div className="text-gray-500 text-sm">{m.sentiment}</div>
                <div className="text-purple-600 font-bold">{m.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-lg mb-4">🎟 Recent Tickets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 border-b">
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">Title</th>
                  <th className="text-left py-2 px-3">Customer</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-left py-2 px-3">Priority</th>
                  <th className="text-left py-2 px-3">Source</th>
                  <th className="text-left py-2 px-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3 font-bold">#{t.id}</td>
                    <td className="py-3 px-3 max-w-[200px] truncate">{t.title}</td>
                    <td className="py-3 px-3">{t.customer_name || "Guest"}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColor[t.status] || ""}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityColor[t.priority] || ""}`}>
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3 px-3">{t.source}</td>
                    <td className="py-3 px-3 text-gray-500">
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}