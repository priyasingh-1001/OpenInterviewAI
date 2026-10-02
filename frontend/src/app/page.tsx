"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowRight, Bot, Code2, LineChart, Mic, FileText,
  Sparkles, Shield, Globe, Star, ChevronRight, Zap,
} from "lucide-react";


const features = [
  { icon: Bot, title: "Adaptive AI Interviews", description: "Conversational interviews that adjust difficulty in real-time based on your answers. Feels exactly like the real thing.", gradient: "from-violet-500/20 to-blue-500/20", iconColor: "text-violet-400" },
  { icon: FileText, title: "Resume Intelligence", description: "Upload your PDF and we generate laser-targeted questions from your actual projects and experience.", gradient: "from-blue-500/20 to-cyan-500/20", iconColor: "text-blue-400" },
  { icon: Code2, title: "Coding Playground", description: "Write and run code in-browser. AI reviews time complexity, edge cases, and style — instantly.", gradient: "from-emerald-500/20 to-teal-500/20", iconColor: "text-emerald-400" },
  { icon: Mic, title: "Voice Interviews", description: "Use your microphone for spoken answers. Get feedback on pace, clarity, and filler words.", gradient: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-400" },
  { icon: LineChart, title: "Skill Gap Analysis", description: "Paste a job description and instantly see which required skills you're missing before you apply.", gradient: "from-pink-500/20 to-rose-500/20", iconColor: "text-pink-400" },
  { icon: Globe, title: "Global & Multilingual", description: "Supports multiple languages and interview styles from different countries and industries.", gradient: "from-indigo-500/20 to-purple-500/20", iconColor: "text-indigo-400" },
];

const steps = [
  { number: "01", title: "Build Your Profile", desc: "Set your target role, experience level, and upload your resume." },
  { number: "02", title: "Configure Interview", desc: "Choose type, difficulty, duration, and paste the job description." },
  { number: "03", title: "Practice with AI", desc: "Answer adaptive questions in a real conversational flow." },
  { number: "04", title: "Get Detailed Feedback", desc: "Receive structured feedback with scores and improvement tips." },
  { number: "05", title: "Track Progress", desc: "Monitor improvement over time across topics and difficulty levels." },
];

const stats = [
  { value: "15+", label: "Interview Roles" },
  { value: "6", label: "AI Providers" },
  { value: "8+", label: "Languages" },
  { value: "100%", label: "Free & Open Source" },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 py-20 hero-gradient grid-bg">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-violet-500/8 blur-3xl animate-float" />
          <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-emerald-500/8 blur-3xl animate-float-delayed" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="px-4 py-1.5 text-xs sm:text-sm border-primary/30 bg-primary/5 text-primary font-medium gap-2 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Free, Open-Source & Privacy-First
            </Badge>
          </div>

          <div className="space-y-4">
            {user ? (
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Welcome back, <span className="gradient-text">{user.name.split(" ")[0]}.</span>
              </h1>
            ) : (
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Prepare Smarter. <br className="hidden sm:block" />
                <span className="gradient-text">Interview Better.</span>
              </h1>
            )}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light">
              {user
                ? `Your target: ${user.targetRole}. ${user.interviewsCompleted} interviews done, ${user.questionsPracticed} questions practiced.`
                : "Your open-source AI interview coach. Practice technical, behavioral, coding and role-specific interviews with personalized AI feedback."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
            {user ? (
              <>
                <Link href="/interview/setup" className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base rounded-xl shadow-lg shadow-primary/25 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group">
                  <Zap className="h-5 w-5" />
                  Start New Interview
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center h-14 px-10 text-base rounded-xl border border-border bg-background/50 hover:bg-muted/60 transition-all font-semibold">
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link href="/register" className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base rounded-xl shadow-lg shadow-primary/25 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group">
                  Get Started Free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base rounded-xl border border-border bg-background/50 hover:bg-muted/60 transition-all font-semibold">
                  <Sparkles className="h-4 w-4" />
                  Try Demo
                </Link>
              </>
            )}
          </div>

          {!user && (
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2 flex-wrap">
              <div className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-400 fill-amber-400" /><span>4.9 rating</span></div>
              <div className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-emerald-400" /><span>No credit card needed</span></div>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" /></svg>
                <span>Open source on GitHub</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Stats ─── */}
      <section className="py-16 border-y border-border/50 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="text-3xl sm:text-4xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-sm text-muted-foreground font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="py-24 md:py-32 px-4 sm:px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 text-primary bg-primary/5">Core Features</Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Everything you need to <span className="gradient-text">land the offer</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Analyzes your resume, matches it against job descriptions, and generates dynamic mock interviews.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((f, i) => (
              <div key={i} className="glow-card group relative flex flex-col p-7 bg-card rounded-2xl border border-border/60 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.gradient} border border-white/10 flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                    <f.icon className={`h-6 w-6 ${f.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="py-24 px-4 sm:px-6 bg-muted/20 border-y border-border/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="text-xs px-3 py-1 border-primary/30 text-primary bg-primary/5">How It Works</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">From zero to interview-ready</h2>
          </div>
          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-6 bg-card rounded-2xl border border-border/60 glow-card group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 font-mono font-bold text-primary text-sm group-hover:bg-primary/20 transition-colors">
                  {step.number}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground hidden sm:block shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      {!user && (
        <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 hero-gradient" />
          <div className="relative z-10 container mx-auto max-w-3xl text-center space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Start practicing today — <span className="gradient-text">completely free</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">No credit card. No account required to try the demo. Open-source and always will be.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center justify-center gap-2 h-14 px-10 text-base rounded-xl shadow-lg shadow-primary/25 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all group">
                Create Free Account <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center h-14 px-10 text-base rounded-xl border border-border bg-background/50 hover:bg-muted/60 transition-all font-semibold">
                View Demo
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
