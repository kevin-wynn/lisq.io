import { KeyRound, Loader2, LogIn } from "lucide-react";
import { useEffect, useState } from "react";

const THEMES = [
  { name: "Paper", bg: "#fdfcfb", accent: "#6366f1", text: "#1c1917", card: "#f5f4f2" },
  { name: "Dracula", bg: "#282a36", accent: "#bd93f9", text: "#f8f8f2", card: "#44475a" },
  { name: "Tokyo Night", bg: "#1a1b26", accent: "#7aa2f7", text: "#c0caf5", card: "#24283b" },
  { name: "Nord", bg: "#2e3440", accent: "#88c0d0", text: "#eceff4", card: "#3b4252" },
  { name: "Rosé Pine", bg: "#191724", accent: "#ebbcba", text: "#e0def4", card: "#26233a" },
  { name: "Synthwave", bg: "#262335", accent: "#f564c4", text: "#ffffff", card: "#36304e" },
];

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setThemeIndex((prev) => (prev + 1) % THEMES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const theme = THEMES[themeIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-900">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-[120px] transition-colors duration-[2000ms]"
          style={{ backgroundColor: theme.accent + "25" }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-[120px] transition-colors duration-[2000ms]"
          style={{ backgroundColor: theme.accent + "20" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[180px] transition-colors duration-[2000ms]"
          style={{ backgroundColor: theme.accent + "08" }}
        />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:48px_48px]" />

      {/* Login Card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Logo + Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-tactical-500 shadow-lg shadow-tactical-500/25 mb-4">
            <span className="text-white font-mono font-bold text-xl">LQ</span>
          </div>
          <h1 className="text-2xl font-bold text-dark-50 tracking-tight">
            Welcome to LISQ
          </h1>
          <p className="text-sm text-dark-200 mt-1">
            Sign in to access your lists & notes
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-800 border border-dark-500 rounded-2xl shadow-2xl shadow-dark-50/5 overflow-hidden">
          {/* Theme preview strip */}
          <div className="h-1.5 w-full flex">
            {THEMES.map((t, i) => (
              <div
                key={t.name}
                className="flex-1 transition-all duration-500"
                style={{
                  backgroundColor: i === themeIndex ? t.accent : "transparent",
                  opacity: i === themeIndex ? 1 : 0.15,
                }}
              />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-dark-200 uppercase tracking-wider mb-2"
              >
                Username
              </label>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  autoFocus
                  required
                  className="input pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-dark-200 uppercase tracking-wider mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  required
                  className="input pl-10"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-300">
                  <KeyRound size={16} />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full btn-primary justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6">
            <div className="flex items-center gap-3 text-[10px] text-dark-300 font-mono uppercase tracking-widest">
              <div className="h-px flex-1 bg-dark-600" />
              <span>LISQ</span>
              <span>·</span>
              <span
                className="transition-colors duration-500"
                style={{ color: theme.accent }}
              >
                {theme.name}
              </span>
              <div className="h-px flex-1 bg-dark-600" />
            </div>
          </div>
        </div>

        {/* Security note */}
        <p className="text-center text-[11px] text-dark-300 mt-6 font-mono">
          🔒 Credentials secured with bcrypt · Self-hosted
        </p>
      </div>
    </div>
  );
}
