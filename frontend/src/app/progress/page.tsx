"use client";

import { useState, useEffect } from "react";
import { useAuth, API_BASE } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Trophy, Target, Clock, Calendar, CheckCircle2, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Interview {
  id: number;
  role: string;
  type: string;
  difficulty: string;
  duration_mins: number;
  status: string;
  started_at: string;
  overall_score: number | null;
  feedback_summary: string | null;
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <Badge variant="outline" className="text-xs text-muted-foreground">In progress</Badge>;
  if (score >= 80) return <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 font-bold">{score}%</Badge>;
  if (score >= 65) return <Badge variant="outline" className="text-amber-400 border-amber-500/30 bg-amber-500/10 font-bold">{score}%</Badge>;
  return <Badge variant="outline" className="text-rose-400 border-rose-500/30 bg-rose-500/10 font-bold">{score}%</Badge>;
}

export default function ProgressPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<Interview[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setFetching(true);
      try {
        const res = await fetch(`${API_BASE}/api/users/${user.id}/interviews`);
        if (res.ok) setHistory(await res.json());
      } catch { /* offline */ }
      setFetching(false);
    };
    load();
  }, [user]);

  if (isLoading || !user) return null;

  // Build chart data from real history
  const completedSessions = history.filter((h) => h.status === "completed" && h.overall_score !== null);
  const chartData = completedSessions.slice(-8).map((s, i) => ({
    name: `#${i + 1}`,
    score: s.overall_score ?? 0,
  }));

  const avgScore = completedSessions.length
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.overall_score ?? 0), 0) / completedSessions.length)
    : 0;

  const statCards = [
    { icon: Trophy, label: "Sessions Completed", value: completedSessions.length, color: "text-amber-400" },
    { icon: TrendingUp, label: "Average Score", value: `${avgScore}%`, color: "text-emerald-400" },
    { icon: Clock, label: "Total Practice", value: `${user.totalMinutes} min`, color: "text-violet-400" },
    { icon: Target, label: "Questions Practiced", value: user.questionsPracticed, color: "text-blue-400" },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
            <span>/</span>
            <span className="text-foreground font-medium">My Progress</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Your Progress</h1>
          <p className="text-muted-foreground mt-2">Real data from every session saved to your account.</p>
        </div>
        <Link href="/interview/setup" className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all shrink-0">
          Start Practice <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="rounded-2xl border-border/60">
            <CardContent className="p-5">
              <Icon className={`h-5 w-5 ${color} mb-3`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="rounded-2xl border-border/60 shadow-xl shadow-black/10">
          <CardHeader>
            <CardTitle className="text-lg">Score Trend</CardTitle>
            <CardDescription>Your last {chartData.length} completed sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262 83% 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262 83% 58%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(240 10% 8%)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }}
                    labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                  />
                  <Area type="monotone" dataKey="score" stroke="hsl(262 83% 58%)" strokeWidth={3} fill="url(#scoreGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History list */}
      <Card className="rounded-2xl border-border/60 shadow-xl shadow-black/10">
        <CardHeader>
          <CardTitle className="text-lg">Interview History</CardTitle>
          <CardDescription>
            {fetching ? "Loading your sessions…" : `${history.length} session${history.length !== 1 ? "s" : ""} total`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!fetching && history.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Trophy className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">No sessions yet. Start your first practice interview!</p>
              <Link href="/interview/setup" className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all">
                Start Now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session) => (
                <div key={session.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <ScoreBadge score={session.overall_score} />
                      <span className="font-semibold text-sm">{session.role}</span>
                      <Badge variant="outline" className="text-xs border-border/60 text-muted-foreground capitalize">{session.difficulty}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{new Date(session.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{session.duration_mins} min</span>
                      <span className="flex items-center gap-1"><Target className="h-3.5 w-3.5" />{session.type}</span>
                    </div>
                    {session.feedback_summary && (
                      <div className="flex items-start gap-2 text-xs text-muted-foreground p-2.5 rounded-lg bg-background/50 border border-border/40 mt-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        {session.feedback_summary}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
