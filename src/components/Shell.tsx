import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutDashboard, PlusCircle, ShieldCheck, Trophy, Moon, Sun, Landmark } from "lucide-react";
import { loadCivic, useCivic } from "@/lib/civic-store";
import { DEMO_USER_ID } from "@/lib/civic";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report", label: "Report", icon: PlusCircle },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/admin", label: "Demo Admin", icon: ShieldCheck },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  const { data, error } = useCivic();
  const [dark, setDark] = useState(false);
  useEffect(() => {
    loadCivic();
    const saved = localStorage.getItem("civicsense-theme");
    const d = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
  }, []);
  const toggle = () => {
    const d = !dark;
    setDark(d);
    document.documentElement.classList.toggle("dark", d);
    localStorage.setItem("civicsense-theme", d ? "dark" : "light");
  };
  const karma = data.contributors.find((c) => c.id === DEMO_USER_ID)?.karma ?? 0;
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-20 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Landmark className="h-4 w-4" aria-hidden /></span>
            CivicSense
          </Link>
          <nav className="ml-6 hidden gap-1 md:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground" activeProps={{ className: "bg-secondary text-foreground" }}>
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground" aria-label={`Your demo karma: ${karma}`}>⚡ {karma} Karma</span>
            <button onClick={toggle} className="btn btn-outline h-9 w-9 p-0" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}>
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>
      {error && <div role="alert" className="bg-warning/15 px-4 py-2 text-center text-sm text-foreground">{error}</div>}
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-8 text-center text-xs text-muted-foreground">
        CivicSense is a hackathon demo. Data is fictional and stored only in your browser. Not connected to any municipal authority.
      </footer>
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 border-t border-border bg-card md:hidden" aria-label="Mobile">
        {NAV.map((n) => (
          <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground" activeProps={{ className: "text-primary" }}>
            <n.icon className="h-5 w-5" aria-hidden />
            {n.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export const statusTone: Record<string, string> = {
  Reported: "bg-info/15 text-info",
  "In Progress": "bg-warning/20 text-foreground",
  Resolved: "bg-success/15 text-success",
};
export const severityTone: Record<string, string> = {
  Low: "bg-muted text-muted-foreground",
  Medium: "bg-info/15 text-info",
  High: "bg-warning/20 text-foreground",
  Critical: "bg-destructive/15 text-destructive",
};
export function Pill({ className, children }: { className?: string | undefined; children: ReactNode }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className ?? ""}`}>{children}</span>;
}
