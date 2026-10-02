"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
  country: string;
  bio: string;
  interviewsCompleted: number;
  questionsPracticed: number;
  averageScore: number;
  totalMinutes: number;
  strongAreas: string[];
  weakAreas: string[];
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const API_BASE = "http://localhost:8000";

function mapApiUser(data: any): User {
  const p = data.profile ?? {};
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    targetRole: p.target_role ?? "Software Engineer",
    experienceLevel: p.experience_level ?? "Junior",
    country: p.country ?? "",
    bio: p.bio ?? "",
    interviewsCompleted: p.interviews_completed ?? 0,
    questionsPracticed: p.questions_practiced ?? 0,
    averageScore: p.average_score ?? 0,
    totalMinutes: p.total_minutes ?? 0,
    strongAreas: (() => { try { return JSON.parse(p.strong_areas ?? "[]"); } catch { return []; } })(),
    weakAreas: (() => { try { return JSON.parse(p.weak_areas ?? "[]"); } catch { return []; } })(),
    joinedAt: data.created_at ?? "",
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistUser = (u: User) => {
    setUser(u);
    localStorage.setItem("oiai_user", JSON.stringify(u));
  };

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("oiai_user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /**/ }
    }
    setIsLoading(false);
  }, []);

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem("oiai_user");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as User;
      const res = await fetch(`${API_BASE}/api/users/${parsed.id}`);
      if (res.ok) {
        const data = await res.json();
        persistUser(mapApiUser(data));
      }
    } catch { /**/ }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Demo shortcut
    if (email === "alex@example.com" && password === "demo") {
      // try to register the demo user first (will 400 if already exists — that's fine)
      await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Alex Johnson", email, password: "demo" }),
      });
    }
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      persistUser(mapApiUser(data));
      return true;
    } catch { return false; }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      persistUser(mapApiUser(data));
      return true;
    } catch { return false; }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("oiai_user");
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
