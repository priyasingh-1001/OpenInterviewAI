"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BrainCircuit, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    const ok = await login(email, password);
    if (ok) router.push("/dashboard");
    else setError("Invalid credentials. Please try again.");
    setLoading(false);
  };

  const handleDemo = async () => {
    setLoading(true);
    await login("alex@example.com", "demo");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 relative">
      <div className="pointer-events-none absolute inset-0 hero-gradient" />
      <div className="relative z-10 w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 items-center justify-center mb-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-sm">Sign in to continue your interview prep</p>
        </div>

        <Card className="rounded-2xl border-border/60 shadow-2xl shadow-black/20 glass">
          <CardHeader className="pb-0 pt-6 px-6">
            <button
              onClick={handleDemo}
              disabled={loading}
              className="w-full h-11 rounded-xl border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              <Sparkles className="h-4 w-4" />
              Continue with Demo Account
            </button>
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-card text-muted-foreground">or sign in with email</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-6 pb-6 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 rounded-xl bg-background/50" autoComplete="email" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 rounded-xl bg-background/50 pr-10" autoComplete="current-password" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {error && <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-60 group"
              >
                {loading ? "Signing in..." : <><span>Sign In</span> <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>}
              </button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">Create one free</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
