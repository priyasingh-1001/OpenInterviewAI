"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, API_BASE } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BrainCircuit, Play, BarChart3, FileText, ArrowRight,
  TrendingUp, Clock, CheckCircle, Target, Zap,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  // Refresh from backend on mount so stats are live
  useEffect(() => {
    if (user) refreshUser();
  }, []); // eslint-disable-line

  if (isLoading || !user) return null;

  const statCards = [
    { icon: CheckCircle, label: "Interviews Done", value: user.interviewsCompleted, color: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
    { icon: Target, label: "Questions Practiced", value: user.questionsPracticed, color: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
    { icon: TrendingUp, label: "Average Score", value: `${user.averageScore}%`, color: "from-violet-500/20 to-purple-500/20", iconColor: "text-violet-400" },
    { icon: Clock, label: "Total Minutes", value: user.totalMinutes, color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
  ];

  const quickActions = [
    { label: "Start Interview", sub: "Adaptive AI-powered mock round", href: "/interview/setup", icon: Play, primary: true },
    { label: "View Progress", sub: "Charts & session history", href: "/progress", icon: BarChart3, primary: false },
    { label: "My Resume", sub: "Upload & manage resumes", href: "/profile", icon: FileText, primary: false },
    { label: "My Profile", sub: "Update role & preferences", href: "/profile", icon: BrainCircuit, primary: false },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl space-y-8">
      {/* Welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-sm text-primary font-medium mb-1 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" /> Welcome back
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{user.name.split(" ")[0]}</h1>
          <p className="text-muted-foreground mt-2 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{user.targetRole}</Badge>
            <span className="text-sm">·</span>
            <span className="text-sm">{user.experienceLevel}</span>
          </p>
        </div>
        <Link
          href="/interview/setup"
          className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all hover:-translate-y-0.5 group shrink-0"
        >
          <Play className="h-4 w-4" />
          Start Practicing
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color, iconColor }) => (
          <Card key={label} className="rounded-2xl border-border/60 hover:border-border transition-colors group shadow-sm">
            <CardContent className="p-5">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ label, sub, href, icon: Icon, primary }) => (
            <Link
              key={label}
              href={href}
              className={`group flex flex-col gap-4 p-5 rounded-2xl border transition-all hover:-translate-y-0.5 ${
                primary
                  ? "border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60"
                  : "border-border/60 bg-card hover:border-border hover:bg-muted/40"
              }`}
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${primary ? "bg-primary/20" : "bg-muted"} group-hover:scale-110 transition-transform`}>
                <Icon className={`h-5 w-5 ${primary ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${primary ? "text-primary" : ""}`}>{label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Skill areas */}
      {(user.strongAreas.length > 0 || user.weakAreas.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {user.strongAreas.length > 0 && (
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Strong Areas</CardTitle>
                <CardDescription>Topics where you excel</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.strongAreas.map((a) => (
                  <Badge key={a} variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">{a}</Badge>
                ))}
              </CardContent>
            </Card>
          )}
          {user.weakAreas.length > 0 && (
            <Card className="rounded-2xl border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Areas to Improve</CardTitle>
                <CardDescription>Focus your next practice here</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {user.weakAreas.map((a) => (
                  <Badge key={a} variant="outline" className="border-rose-500/30 bg-rose-500/10 text-rose-400">{a}</Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
