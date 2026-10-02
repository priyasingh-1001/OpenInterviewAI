"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, API_BASE } from "@/lib/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  User, Mail, Briefcase, MapPin, FileText, Upload, Trash2,
  CheckCircle, AlertTriangle, Edit3, Save, X, Star, TrendingUp,
  Clock, Target,
} from "lucide-react";
import Link from "next/link";

const ROLES = [
  "Software Engineer", "Machine Learning Engineer", "Data Scientist",
  "Data Analyst", "Frontend Developer", "Backend Developer",
  "Full Stack Developer", "DevOps Engineer", "Product Manager",
  "Cybersecurity Analyst",
];
const LEVELS = ["Intern", "Junior", "Mid Level", "Senior", "Staff", "Principal", "Manager"];

interface Resume {
  id: number;
  filename: string;
  uploaded_at: string;
  extracted_skills: string;
}

export default function ProfilePage() {
  const { user, isLoading, refreshUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Profile form state
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [country, setCountry] = useState("");
  const [bio, setBio] = useState("");

  // Resume state
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      setTargetRole(user.targetRole);
      setExperienceLevel(user.experienceLevel);
      setCountry(user.country ?? "");
      setBio(user.bio ?? "");
      fetchResumes(user.id);
    }
  }, [user]);

  const fetchResumes = async (userId: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}/resumes`);
      if (res.ok) setResumes(await res.json());
    } catch { /* offline */ }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/users/${user.id}/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target_role: targetRole,
          experience_level: experienceLevel,
          country,
          bio,
        }),
      });
      if (res.ok) {
        await refreshUser();
        setSaveMsg("Profile saved successfully!");
        setEditing(false);
      } else {
        setSaveMsg("Failed to save. Try again.");
      }
    } catch {
      setSaveMsg("Network error. Is the backend running?");
    }
    setSaving(false);
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    setUploadMsg("");
    try {
      const res = await fetch(`${API_BASE}/api/users/${user.id}/resume`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setUploadMsg("Resume uploaded successfully!");
        await fetchResumes(user.id);
      } else {
        const err = await res.json();
        setUploadMsg(err.detail ?? "Upload failed.");
      }
    } catch {
      setUploadMsg("Network error. Is the backend running?");
    }
    setUploading(false);
    e.target.value = "";
  };

  const handleDeleteResume = async (id: number) => {
    if (!user) return;
    await fetch(`${API_BASE}/api/resumes/${id}`, { method: "DELETE" });
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  if (isLoading || !user) return null;

  const statCards = [
    { icon: CheckCircle, label: "Interviews Done", value: user.interviewsCompleted, color: "text-emerald-400" },
    { icon: Target, label: "Questions Practiced", value: user.questionsPracticed, color: "text-blue-400" },
    { icon: Star, label: "Avg Score", value: `${user.averageScore}%`, color: "text-amber-400" },
    { icon: Clock, label: "Total Practice", value: `${user.totalMinutes} min`, color: "text-violet-400" },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          <span>/</span>
          <span className="text-foreground font-medium">My Profile</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your account, preferences, and resumes.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <Card key={label} className="rounded-2xl border-border/60 shadow-sm">
            <CardContent className="p-4 flex flex-col gap-1">
              <Icon className={`h-5 w-5 ${color} mb-1`} />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar + basic info */}
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-1 self-start">
          <CardContent className="p-6 flex flex-col items-center text-center gap-4">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 border-2 border-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="text-xs border-primary/30 bg-primary/5 text-primary">
                {user.targetRole}
              </Badge>
              <Badge variant="outline" className="text-xs border-emerald-500/30 bg-emerald-500/5 text-emerald-400">
                {user.experienceLevel}
              </Badge>
            </div>
            {user.country && (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {user.country}
              </div>
            )}
            {user.bio && (
              <p className="text-sm text-muted-foreground leading-relaxed text-left w-full px-1">{user.bio}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Member since {user.joinedAt ? new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}
            </p>
          </CardContent>
        </Card>

        {/* Right — Edit form */}
        <Card className="rounded-2xl border-border/60 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-primary" />
                Profile Details
              </CardTitle>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                >
                  <Edit3 className="h-3.5 w-3.5" /> Edit
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setEditing(false); setSaveMsg(""); }}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" /> Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline disabled:opacity-60"
                  >
                    <Save className="h-3.5 w-3.5" /> {saving ? "Saving…" : "Save"}
                  </button>
                </div>
              )}
            </div>
            {saveMsg && (
              <p className={`text-xs mt-1 ${saveMsg.includes("success") ? "text-emerald-400" : "text-rose-400"}`}>
                {saveMsg}
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-5 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Full Name</Label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/40 border border-border/50 text-sm">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{user.name}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</Label>
                <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/40 border border-border/50 text-sm">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Target Role</Label>
                {editing ? (
                  <Select value={targetRole} onValueChange={(v) => v && setTargetRole(v)}>
                    <SelectTrigger className="h-10 rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/40 border border-border/50 text-sm">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{user.targetRole}</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Experience Level</Label>
                {editing ? (
                  <Select value={experienceLevel} onValueChange={(v) => v && setExperienceLevel(v)}>
                    <SelectTrigger className="h-10 rounded-xl text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/40 border border-border/50 text-sm">
                    <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{user.experienceLevel}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Country / Location</Label>
              {editing ? (
                <Input
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. India, United States"
                  className="h-10 rounded-xl text-sm"
                />
              ) : (
                <div className="flex items-center gap-2 h-10 px-3 rounded-xl bg-muted/40 border border-border/50 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{user.country || "Not set"}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Bio</Label>
              {editing ? (
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself, your goals, experience..."
                  className="rounded-xl text-sm min-h-[90px] resize-none"
                />
              ) : (
                <div className="px-3 py-2.5 rounded-xl bg-muted/40 border border-border/50 text-sm text-muted-foreground min-h-[60px]">
                  {user.bio || "No bio yet. Click Edit to add one."}
                </div>
              )}
            </div>

            <Separator className="bg-border/50" />

            {/* Strong / Weak areas display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Strong Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.strongAreas.length > 0
                    ? user.strongAreas.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs border-emerald-500/30 bg-emerald-500/10 text-emerald-400">{a}</Badge>
                      ))
                    : <p className="text-xs text-muted-foreground">Complete interviews to unlock</p>}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Areas to Improve</p>
                <div className="flex flex-wrap gap-1.5">
                  {user.weakAreas.length > 0
                    ? user.weakAreas.map((a) => (
                        <Badge key={a} variant="outline" className="text-xs border-rose-500/30 bg-rose-500/10 text-rose-400">{a}</Badge>
                      ))
                    : <p className="text-xs text-muted-foreground">Complete interviews to unlock</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resume Upload Section */}
      <Card className="rounded-2xl border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            My Resumes
          </CardTitle>
          <CardDescription>Upload your resume so the AI can tailor questions to your exact experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Upload area */}
          <div className="relative">
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center gap-3 w-full h-36 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-primary/5 cursor-pointer transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{uploading ? "Uploading…" : "Click to upload your resume"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">PDF, DOCX, DOC, TXT — max 10MB</p>
              </div>
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              onChange={handleResumeUpload}
              disabled={uploading}
            />
          </div>
          {uploadMsg && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl border ${uploadMsg.includes("success") ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-rose-500/30 bg-rose-500/10 text-rose-400"}`}>
              {uploadMsg.includes("success") ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
              {uploadMsg}
            </div>
          )}

          {/* Resume list */}
          {resumes.length > 0 && (
            <div className="space-y-3">
              {resumes.map((r) => {
                const skills = (() => { try { return JSON.parse(r.extracted_skills) as string[]; } catch { return []; } })();
                return (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-border/50 bg-muted/20">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{r.filename}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Uploaded {new Date(r.uploaded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className="text-xs text-muted-foreground">Skills found:</span>
                          {skills.slice(0, 6).map((s) => (
                            <Badge key={s} variant="outline" className="text-xs border-primary/20 bg-primary/5 text-primary">{s}</Badge>
                          ))}
                          {skills.length > 6 && <span className="text-xs text-muted-foreground">+{skills.length - 6} more</span>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteResume(r.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all self-start sm:self-center"
                      title="Delete resume"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {resumes.length === 0 && !uploading && (
            <p className="text-center text-sm text-muted-foreground py-4">No resumes uploaded yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
