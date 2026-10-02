"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  BrainCircuit,
  LayoutDashboard,
  Mic,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  Settings,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/interview/setup", label: "Practice", icon: Mic },
  { href: "/progress", label: "Progress", icon: BarChart3 },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    router.push("/");
  };

  const handleNav = (href: string) => {
    setDropdownOpen(false);
    router.push(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 flex h-16 items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <BrainCircuit className="h-5 w-5 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">
            OpenInterview<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
            aria-label="GitHub"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>

          {/* User menu OR auth buttons */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              {/* Trigger button */}
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-border/60 px-3 py-1.5 hover:bg-muted/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                {/* Avatar circle */}
                <span className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                  {getInitials(user.name)}
                </span>
                <span className="hidden sm:block text-sm font-medium max-w-[120px] truncate">
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground hidden sm:block transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border/60 bg-background shadow-2xl shadow-black/30 overflow-hidden z-[100]">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-border/40">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <Sparkles className="h-3 w-3 text-primary shrink-0" />
                      <span className="text-xs text-primary font-medium truncate">{user.targetRole}</span>
                    </div>
                  </div>

                  {/* Nav items */}
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={() => handleNav("/profile")}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-muted/60 transition-colors text-left"
                    >
                      <User className="h-4 w-4 text-muted-foreground shrink-0" />
                      My Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/dashboard")}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-muted/60 transition-colors text-left"
                    >
                      <LayoutDashboard className="h-4 w-4 text-muted-foreground shrink-0" />
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNav("/progress")}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm hover:bg-muted/60 transition-colors text-left"
                    >
                      <BarChart3 className="h-4 w-4 text-muted-foreground shrink-0" />
                      Progress
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="p-1.5 border-t border-border/40">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4 shrink-0" />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-muted/60 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                pathname === href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}

          {user ? (
            <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => { setMobileOpen(false); router.push("/profile"); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all text-left"
              >
                <User className="h-5 w-5" /> My Profile
              </button>
              <button
                type="button"
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-all text-left"
              >
                <LogOut className="h-5 w-5" /> Log out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-border/50 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center h-11 rounded-xl border border-border font-medium text-sm hover:bg-muted/60 transition-all"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="w-full inline-flex items-center justify-center h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all"
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
