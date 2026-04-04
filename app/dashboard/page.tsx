"use client";
import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://mahabub-unlocked-ai-support-saas.hf.space";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [mood, setMood] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [s, t, m] = await Promise.all([
        axios.get(`${API}/dashboard/stats/1`),
        axios.get(`${API}/dashboard/tickets/recent/1`),
        axios.get(`${API}/dashboard/customer-mood/1`),
      ]);
      setStats(s.data);
      setTickets(t.data);
      setMood(m.data);
    } finally {
      setLoading(false);
    }
  };

  const priorityConfig: Record<string, { bg: string; text: string; dot: string }> = {
    urgent: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400" },
    high: { bg: "bg-orange-500/10", text: "text-orange-400", dot: "bg-orange-400" },
    medium: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
    low: { bg: "bg-gray-500/10", text: "text-gray-400", dot: "bg-gray-400" },
  };

  const statusConfig: Record<string, { bg: string; text: string }> = {
    open: { bg: "bg-yellow-500/10", text: "text-yellow-400" },
    resolved: { bg: "bg-green-500/10", text: "text-green-400" },
    closed: { bg: "bg-gray-500/10", text: "text-gray-400" },
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-white/40 text-sm">Loading dashboard...</div>
      </div>
    </div>
  );

  const o = stats?.overview;

  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Glow */}
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/[0.06] bg-[#050510]/80 backdrop-blur-xl px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-blue-500 rounded-lg flex items-center justify-center text-sm">
            📊
          </div>
          <span className="font-semibold tracking-tight">Analytics Dashboard</span>
        </div>
        <div className="flex gap-3">
          <button onClick={loadData} className="text-xs text-white/40 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition">
            ↻ Refresh
          </button>
          <a href="/chat" className="text-xs bg-violet-600 hover:bg-violet-500 px-4 py-1.5 rounded-lg transition font-medium">
            💬 Live Chat
          </a>
        </div>
      </div>

      <div className="px-8 py-8 max-w-7xl mx-auto space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "🎟", value: o?.total_tickets, label: "Total Tickets", color: "from-violet-500/20 to-violet-500/5" },
            { icon: "🔓", value: o?.open_tickets, label: "Open", color: "from-yellow-500/20 to-yellow-500/5" },
            { icon: "✅", value: o?.resolved_tickets, label: "Resolved", color: "from-green-500/20 to-green-500/5" },
            { icon: "💬", value: o?.total_chats, label: "Chats", color: "from-blue-500/20 to-blue-500/5" },
            { icon: "📈", value: `${o?.resolution_rate}%`, label: "Resolution Rate", color: "from-cyan-500/20 to-cyan-500/5" },
            { icon: "🤖", value: `${o?.ai_handled_rate}%`, label: "AI Handled", color: "from-purple-500/20 to-purple-500/5" },
            { icon: "📨", value: o?.total_messages, label: "Messages", color: "from-indigo-500/20 to-indigo-500/5" },
            { icon: "⚡", value: stats?.priority_breakdown?.urgent || 0, label: "Urgent", color: "from-red-500/20 to-red-500/5" },
          ].map((s, i) => (
            <div key={i} className={`bg-gradient-to-b ${s.color} border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-bold text-white mb-1">{s.value ?? "—"}</div>
              <div className="text-xs text-white/40">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Customer Mood */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-5">Customer Sentiment</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mood.map((m, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center hover:border-white/10 transition">
                <div className="text-4xl mb-2">{m.emoji}</div>
                <div className="text-2xl font-bold">{m.count}</div>
                <div className="text-xs text-white/40 mt-1 capitalize">{m.sentiment}</div>
                <div className="text-xs text-violet-400 font-medium mt-1">{m.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Recent Tickets</h2>
            <span className="text-xs text-white/30">{tickets.length} tickets</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["#", "Title", "Customer", "Status", "Priority", "Source", "Date"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs text-white/30 font-medium uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => {
                  const p = priorityConfig[t.priority] || priorityConfig.low;
                  const s = statusConfig[t.status] || statusConfig.open;
                  return (
                    <tr key={t.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4 text-sm text-white/40">#{t.id}</td>
                      <td className="px-6 py-4 text-sm text-white/80 max-w-[200px] truncate">{t.title}</td>
                      <td className="px-6 py-4 text-sm text-white/50">{t.customer_name || "Guest"}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.bg} ${s.text}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${p.bg} ${p.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
                          {t.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-white/30">{t.source}</td>
                      <td className="px-6 py-4 text-xs text-white/30">
                        {new Date(t.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}