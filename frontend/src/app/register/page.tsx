"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, Eye, EyeOff, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const perks = [
  "Free AI mock interviews for any role",
  "Resume analysis & skill gap detection",
  "Adaptive difficulty based on your answers",
  "Detailed feedback on every answer",
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setLoading(true);
    const ok = await register(name, email, password);
    if (ok) router.push("/dashboard");
    else setError("Registration failed. Please try again.");
    setLoading(false);
  };

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : password.length < 12 ? 3 : 4;
  const strengthColors = ["", "bg-rose-500", "bg-amber-500", "bg-blue-500", "bg-emerald-500"];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="pointer-events-none absolute inset-0 hero-gradient" />
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left panel */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight">
              Land your dream role with{" "}
              <span className="gradient-text">AI-powered prep</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Join thousands of engineers and professionals who practice with OpenInterviewAI.
            </p>
          </div>
          <div className="space-y-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{perk}</span>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl bg-card/50 border border-border/60 glass">
            <p className="text-sm italic text-muted-foreground leading-relaxed">
              &ldquo;I went from failing to passing system design rounds in 3 weeks. The adaptive questioning really exposes your weak spots.&rdquo;
            </p>
            <p className="text-xs text-primary font-semibold mt-3">— Maria T., ML Engineer</p>
          </div>
        </div>

        {/* Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 space-y-6">
          <div className="text-center lg:text-left space-y-2">
            <div className="lg:hidden inline-flex h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-2">
              <BrainCircuit className="h-7 w-7 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-muted-foreground text-sm">Free forever. No credit card required.</p>
          </div>

          <Card className="rounded-2xl border-border/60 shadow-2xl shadow-black/20 glass">
            <CardHeader className="pb-0" />
            <CardContent className="px-6 pb-6 space-y-5 pt-2">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full name</Label>
                  <Input id="name" type="text" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-xl bg-background/50" autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-background/50" autoComplete="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl bg-background/50 pr-10" autoComplete="new-password" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= passwordStrength ? strengthColors[passwordStrength] : "bg-muted"}`} />
                      ))}
                    </div>
                  )}
                </div>
                {error && <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 group"
                >
                  {loading ? "Creating account..." : <><span>Create Free Account</span> <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
                </button>
              </form>
              <p className="text-center text-xs text-muted-foreground">
                By registering, you agree to our{" "}
                <Link href="#" className="text-primary hover:underline">Terms</Link>{" & "}
                <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
