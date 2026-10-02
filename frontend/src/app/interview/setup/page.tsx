"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mic, FileText, Settings, Play, Lock, BrainCircuit } from "lucide-react";
import Link from "next/link";

const roles = [
  "Software Engineer", "Machine Learning Engineer", "Data Scientist",
  "Data Analyst", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "DevOps Engineer", "Product Manager", "Cybersecurity Analyst",
];

const interviewTypes = [
  { value: "technical", label: "Technical / Domain Knowledge" },
  { value: "behavioral", label: "Behavioral (Leadership & Culture)" },
  { value: "system-design", label: "System Design" },
  { value: "coding", label: "Coding / Algorithms" },
  { value: "mixed", label: "Mixed (General Screen)" },
];

const difficulties = [
  { value: "beginner", label: "Beginner", sub: "Intern / Junior", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/5 ring-emerald-500" },
  { value: "intermediate", label: "Intermediate", sub: "Mid-Level", color: "border-blue-500/40 text-blue-400 bg-blue-500/5 ring-blue-500" },
  { value: "advanced", label: "Advanced", sub: "Senior / Staff", color: "border-violet-500/40 text-violet-400 bg-violet-500/5 ring-violet-500" },
  { value: "expert", label: "Expert", sub: "Principal+", color: "border-rose-500/40 text-rose-400 bg-rose-500/5 ring-rose-500" },
];

const durations = [
  { value: "10", label: "10 min", sub: "Quick Screen" },
  { value: "20", label: "20 min", sub: "Standard" },
  { value: "30", label: "30 min", sub: "Full Screen" },
  { value: "45", label: "45 min", sub: "Full Round" },
];

export default function InterviewSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState(user?.targetRole || "Machine Learning Engineer");
  const [type, setType] = useState("mixed");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [duration, setDuration] = useState("20");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedDiff = difficulties.find((d) => d.value === difficulty);

  const handleStart = async () => {
    if (!user) { router.push("/login"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/interview/session");
  };

  return (
    <div className="container mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Setup Interview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Setup Mock Interview</h1>
        <p className="text-muted-foreground text-base mt-2">Configure your AI interviewer. The more details you provide, the more realistic your session will be.</p>
      </div>

      {/* User context banner */}
      {user && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
          <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Personalized for you</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user.experienceLevel} targeting {user.targetRole}. Questions will be tailored to your background.
            </p>
          </div>
          <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5 shrink-0">
            {user.interviewsCompleted} sessions done
          </Badge>
        </div>
      )}

      <Card className="rounded-2xl border-border/60 shadow-xl shadow-black/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Settings className="h-5 w-5 text-primary" /> Interview Configuration
          </CardTitle>
          <CardDescription>Pre-filled with your profile defaults. Adjust as needed.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Role & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold">Target Role</Label>
              <Select value={role} onValueChange={(v) => v && setRole(v)}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {roles.map((r) => (
                    <SelectItem key={r} value={r} className="py-2.5 cursor-pointer">{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-sm font-semibold">Interview Type</Label>
              <Select value={type} onValueChange={(v) => v && setType(v)}>
                <SelectTrigger className="w-full h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {interviewTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value} className="py-2.5 cursor-pointer">{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Difficulty picker */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Difficulty Level</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {difficulties.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  className={`relative p-3 rounded-xl border text-left transition-all ${
                    difficulty === d.value
                      ? `${d.color} ring-2 ring-offset-2 ring-offset-background`
                      : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <p className="text-xs font-bold">{d.label}</p>
                  <p className="text-xs font-normal opacity-75 mt-0.5">{d.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Duration picker */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Duration</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {durations.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDuration(d.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    duration === d.value
                      ? "border-primary bg-primary/10 text-primary ring-2 ring-offset-2 ring-offset-background ring-primary"
                      : "border-border/60 text-muted-foreground hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <p className="text-xs font-bold">{d.label}</p>
                  <p className="text-xs font-normal opacity-75 mt-0.5">{d.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Job Description */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-semibold">
              <FileText className="h-4 w-4 text-primary" />
              Job Description
              <span className="text-muted-foreground font-normal text-xs">(Optional but recommended)</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Paste the exact job posting. The AI will generate questions aligned with what the employer needs.
            </p>
            <Textarea
              placeholder="Paste the job description here — requirements, responsibilities, tech stack..."
              className="min-h-[140px] text-sm rounded-xl bg-background/50 resize-y leading-relaxed"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* Voice mode */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-muted/30 border border-border/50">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
              <Mic className="h-5 w-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Voice Mode Available</p>
              <p className="text-xs text-muted-foreground mt-0.5">Use your microphone. We analyse pace, filler words, and clarity.</p>
            </div>
            <Button variant="outline" size="sm" className="rounded-lg self-start sm:self-auto text-xs h-8 shrink-0">Enable</Button>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-border/50 p-6 bg-muted/10 rounded-b-2xl">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {selectedDiff && (
              <Badge variant="outline" className={`text-xs border ${selectedDiff.color}`}>{selectedDiff.label}</Badge>
            )}
            <span>• {duration} min • {interviewTypes.find(t => t.value === type)?.label.split(" ")[0]}</span>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Link href="/dashboard" className="flex-1 sm:flex-none inline-flex items-center justify-center h-11 px-6 rounded-xl border border-border font-medium text-sm hover:bg-muted/60 transition-all">
              Cancel
            </Link>
            <button
              onClick={handleStart}
              disabled={loading || !user}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Starting..." : !user ? (
                <><Lock className="h-4 w-4" /> Sign in to Start</>
              ) : (
                <><Play className="h-4 w-4" /> Start Interview</>
              )}
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
