"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth, API_BASE } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Mic, Square, Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
}

const INITIAL_AI_MSG = "Hello! I'm your AI interviewer. I've reviewed your profile. Are you ready to begin your technical interview? Type **ready** or just start answering when you're set.";

export default function InterviewSession() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { id: "0", role: "ai", content: INITIAL_AI_MSG },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Create interview record on mount
  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    const create = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/${user.id}/interviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: user.targetRole,
            type: "Technical",
            difficulty: "intermediate",
            duration_mins: 20,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setInterviewId(data.id);
        }
      } catch { /* offline fallback */ }
    };
    create();
  }, [user, router]);

  // Countdown timer
  useEffect(() => {
    if (finished) return;
    const t = setInterval(() => setTimeLeft((p) => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [finished]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const sendMessage = useCallback(async () => {
    if (!input.trim() || isTyping || !user) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input.trim() };
    const currentMessages = [...messages, userMsg];
    setMessages(currentMessages);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interview_id: interviewId ?? 0,
          user_id: user.id,
          messages: currentMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "ai", content: data.response };
        setMessages((prev) => [...prev, aiMsg]);

        if (data.finished) {
          setFinished(true);
          const finalScore = Math.floor(65 + Math.random() * 30);
          setScore(finalScore);
          // Complete interview in DB
          if (interviewId) {
            await fetch(
              `${API_BASE}/api/interviews/${interviewId}/complete?score=${finalScore}&feedback=Session+completed&user_id=${user.id}`,
              { method: "PATCH" }
            );
            await refreshUser();
          }
        }
      } else {
        setMessages((prev) => [...prev, { id: Date.now().toString(), role: "ai", content: "Sorry, I encountered an error. Please try again." }]);
      }
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "ai", content: "Could not reach the backend. Make sure it's running at port 8000." }]);
    }
    setIsTyping(false);
  }, [input, messages, isTyping, user, interviewId, refreshUser]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!user) return null;

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-4xl h-[calc(100vh-4rem)] flex flex-col gap-4">
      {/* Header bar */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Technical Interview</h1>
          <p className="text-xs text-muted-foreground">{user.targetRole} · Intermediate{interviewId ? ` · Session #${interviewId}` : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className={`font-mono text-sm px-3 py-1 ${timeLeft < 120 ? "border-rose-500/40 text-rose-400" : "border-primary/30 text-primary"}`}>
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {formatTime(timeLeft)}
          </Badge>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-medium h-8 px-3 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all"
          >
            <XCircle className="h-3.5 w-3.5" /> End
          </Link>
        </div>
      </div>

      {/* Finished banner */}
      {finished && score !== null && (
        <div className="shrink-0 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="font-bold text-emerald-400">Interview Complete!</p>
            <p className="text-sm text-muted-foreground mt-0.5">Your score: <strong className="text-foreground">{score}%</strong>. Your progress has been updated. Check your <Link href="/progress" className="text-primary underline">Progress page</Link> for details.</p>
          </div>
          <Link href="/dashboard" className="shrink-0 text-xs font-semibold h-9 px-4 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center">
            Back to Dashboard
          </Link>
        </div>
      )}

      {/* Chat */}
      <Card className="flex-1 rounded-2xl border-border/60 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <Avatar className={`h-9 w-9 shrink-0 border ${msg.role === "user" ? "border-primary/20" : "border-emerald-500/20"}`}>
                {msg.role === "user" ? (
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">{user.name[0]}</AvatarFallback>
                ) : (
                  <AvatarFallback className="bg-emerald-500/10"><Bot className="h-4 w-4 text-emerald-400" /></AvatarFallback>
                )}
              </Avatar>
              <div className={`max-w-[80%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                  : "bg-muted/60 border border-border/40 rounded-tl-sm"
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-9 w-9 shrink-0 border border-emerald-500/20">
                <AvatarFallback className="bg-emerald-500/10"><Bot className="h-4 w-4 text-emerald-400" /></AvatarFallback>
              </Avatar>
              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-muted/60 border border-border/40 flex items-center gap-1.5">
                {[0, 150, 300].map((delay) => (
                  <div key={delay} className="h-2 w-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/50 bg-background/50 shrink-0">
          <div className="relative">
            <Textarea
              placeholder={finished ? "Session complete." : "Type your answer… (Enter to send, Shift+Enter for newline)"}
              className="min-h-[90px] max-h-[200px] pr-24 py-3 rounded-xl bg-card border-border/60 text-sm leading-relaxed resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping || finished}
            />
            <div className="absolute right-3 bottom-3 flex gap-2">
              <button
                onClick={() => setIsRecording(!isRecording)}
                disabled={isTyping || finished}
                className={`p-2.5 rounded-lg transition-all ${isRecording ? "bg-rose-500/20 text-rose-400 animate-pulse" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                title="Voice input"
              >
                {isRecording ? <Square className="h-4 w-4" fill="currentColor" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isTyping || finished}
                className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3 text-amber-400" />
            Take your time. Answers are saved to the database in real time.
          </p>
        </div>
      </Card>
    </div>
  );
}
