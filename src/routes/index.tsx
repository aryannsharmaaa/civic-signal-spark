import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORIES, computeStats, filterIssues, SEVERITIES, STATUSES, type IssueFilters } from "@/lib/civic";
import { useCivic } from "@/lib/civic-store";
import { IssueCard } from "@/components/IssueCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CivicSense Dashboard — Live City Feed" },
      { name: "description", content: "Live civic issue feed with resolution stats, filters and upvotes." },
      { property: "og:title", content: "CivicSense Dashboard" },
      { property: "og:description", content: "Track and upvote local civic issues in a live feed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const EMPTY: IssueFilters = { search: "", category: "all", status: "all", severity: "all", sort: "newest" };

function Dashboard() {
  const { data, ready } = useCivic();
  const [f, setF] = useState<IssueFilters>(EMPTY);
  const stats = computeStats(data.issues);
  const list = useMemo(() => filterIssues(data.issues, f), [data.issues, f]);
  const set = (k: keyof IssueFilters) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="space-y-6">
      <section className="hero-band rounded-2xl p-6 md:p-8">
        <p className="text-sm font-medium opacity-90">Community-powered civic tracking · Demo</p>
        <h1 className="mt-1 text-3xl font-extrabold md:text-4xl">Make your city better, one report at a time.</h1>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link to="/report" className="btn btn-accent">Report an issue</Link>
          <div className="min-w-[220px] flex-1">
            <div className="flex justify-between text-sm font-semibold"><span>Resolution rate</span><span data-testid="resolution-rate">{stats.resolutionRate}%</span></div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-background/30" role="progressbar" aria-valuenow={stats.resolutionRate} aria-valuemin={0} aria-valuemax={100} aria-label="Resolution rate">
              <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${stats.resolutionRate}%` }} />
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-5" aria-label="Statistics">
        {[
          ["Total issues", stats.total],
          ["Reported", stats.reported],
          ["In progress", stats.inProgress],
          ["Resolved", stats.resolved],
          ["Open critical", stats.critical],
        ].map(([label, v]) => (
          <div key={label} className="surface p-4">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            {ready ? <p className="mt-1 font-display text-2xl font-bold text-foreground">{v}</p> : <div className="skeleton mt-2 h-7 w-12" />}
          </div>
        ))}
      </section>

      <section aria-labelledby="feed-h" className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 id="feed-h" className="text-xl font-bold text-foreground">Live City Feed</h2>
          <p className="text-sm text-muted-foreground">{list.length} of {stats.total} issues · {stats.upvotes} total upvotes</p>
        </div>
        <div className="surface grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-5">
          <label className="lg:col-span-1"><span className="sr-only">Search</span><input className="field" placeholder="Search issues…" value={f.search} onChange={set("search")} /></label>
          <label><span className="sr-only">Category</span><select className="field" value={f.category} onChange={set("category")}><option value="all">All categories</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label><span className="sr-only">Status</span><select className="field" value={f.status} onChange={set("status")}><option value="all">All statuses</option>{STATUSES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label><span className="sr-only">Severity</span><select className="field" value={f.severity} onChange={set("severity")}><option value="all">All severities</option>{SEVERITIES.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label><span className="sr-only">Sort</span><select className="field" value={f.sort} onChange={set("sort")}><option value="newest">Newest first</option><option value="upvotes">Most upvoted</option></select></label>
        </div>
        {!ready ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-72" />)}</div>
        ) : list.length === 0 ? (
          <div className="surface p-10 text-center">
            <p className="font-semibold text-foreground">No issues match these filters.</p>
            <button className="btn btn-outline mt-3" onClick={() => setF(EMPTY)}>Clear filters</button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.map((i) => <IssueCard key={i.id} issue={i} />)}</div>
        )}
      </section>
    </div>
  );
}
