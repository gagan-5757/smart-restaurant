"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "bot";
  text: string;
  sources?: { name: string; price: number; image?: string; category: string }[];
  loading?: boolean;
}

const SUGGESTIONS = [
  "What's your most viral dish? 🔥",
  "Show me spicy options 🌶️",
  "What are today's desserts? 🍰",
  "Best burger under ₹300?",
  "What's in the Truffle Burger?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Hey there! 👋 I'm **VibeBot**, your AI food guide. Ask me anything about our menu — ingredients, specials, recommendations — I've got you! 🍽️",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, messages]);

  async function sendMessage(text: string) {
    if (!text.trim() || typing) return;
    const userMsg: Message = { role: "user", text };
    const loadingMsg: Message = { role: "bot", text: "", loading: true };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev.slice(0, -1), // remove loading
        { role: "bot", text: data.reply, sources: data.sources },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", text: "Oops! I had a hiccup 😅 Please try again!" },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  // Render bold markdown
  function renderText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 transition-all hover:scale-110 active:scale-95"
        style={{
          background: "linear-gradient(135deg, #10B981, #059669)",
          border: "2px solid rgba(255,255,255,0.2)",
        }}
        aria-label="Open VibeBot Chat"
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
        {/* Notification dot */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-slate-950 animate-pulse" />
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[360px] max-h-[520px] rounded-3xl flex flex-col overflow-hidden shadow-2xl shadow-black/60"
          style={{
            background: "rgba(7, 22, 14, 0.97)",
            border: "1px solid rgba(16,185,129,0.3)",
            backdropFilter: "blur(24px)",
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3 border-b border-white/10 shrink-0"
            style={{ background: "linear-gradient(90deg, rgba(16,185,129,0.15), rgba(6,95,70,0.1))" }}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-xl shadow-lg">
              🤖
            </div>
            <div className="flex-1">
              <p className="text-white font-extrabold text-sm">VibeBot</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-emerald-300 text-xs font-medium">AI Food Guide • Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition text-lg leading-none"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scroll" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-2`}>
                {msg.role === "bot" && (
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-sm shrink-0 mt-1">
                    🤖
                  </div>
                )}
                <div className={`max-w-[80%] ${msg.role === "user" ? "" : ""}`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-amber-400/90 to-orange-500/90 text-slate-950 font-semibold rounded-tr-sm"
                        : "bg-white/8 text-slate-200 rounded-tl-sm border border-white/10"
                    }`}
                    style={msg.role === "bot" ? { background: "rgba(255,255,255,0.07)" } : {}}
                  >
                    {msg.loading ? (
                      <div className="flex items-center gap-1.5 py-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    ) : (
                      renderText(msg.text)
                    )}
                  </div>

                  {/* Source cards */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      {msg.sources.map((src, si) => (
                        <div
                          key={si}
                          className="flex items-center gap-3 rounded-2xl p-2.5 border border-white/10"
                          style={{ background: "rgba(255,255,255,0.05)" }}
                        >
                          {src.image && (
                            <img
                              src={src.image}
                              alt={src.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          )}
                          <div className="min-w-0">
                            <p className="text-white text-xs font-bold truncate">{src.name}</p>
                            <p className="text-emerald-400 text-xs font-black">₹{src.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-xs text-slate-200 bg-white/8 border border-white/15 rounded-full px-3 py-1.5 whitespace-nowrap hover:bg-emerald-500/15 hover:border-emerald-400/40 transition shrink-0"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-4 py-3 flex gap-2 border-t border-white/10 shrink-0"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any dish..."
              className="flex-1 rounded-2xl border border-white/15 bg-white/6 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400/50 transition"
              style={{ background: "rgba(255,255,255,0.07)" }}
              disabled={typing}
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition disabled:opacity-40 shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(16,185,129,0.3); border-radius: 8px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
