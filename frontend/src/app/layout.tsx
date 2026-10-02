import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import { Navbar } from "@/components/layout/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OpenInterviewAI | AI-Powered Interview Coach",
  description:
    "Practice technical, behavioral, coding, and role-specific interviews with personalized AI feedback. Free, open-source, and privacy-conscious.",
  keywords: ["interview preparation", "AI mock interview", "career coaching", "open source"],
  authors: [{ name: "OpenInterviewAI Community" }],
  openGraph: {
    title: "OpenInterviewAI — AI-Powered Interview Coach",
    description: "Your open-source AI interview prep platform.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f0f18",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans min-h-screen bg-background text-foreground antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          <TooltipProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-border/50 py-8 mt-auto">
                <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                  <p>© 2024 OpenInterviewAI. Open-source & free forever.</p>
                  <div className="flex gap-6">
                    <a href="/about" className="hover:text-foreground transition-colors">About</a>
                    <a href="/contribute" className="hover:text-foreground transition-colors">Contribute</a>
                    <a href="https://github.com" className="hover:text-foreground transition-colors">GitHub</a>
                  </div>
                </div>
              </footer>
            </div>
          </TooltipProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
