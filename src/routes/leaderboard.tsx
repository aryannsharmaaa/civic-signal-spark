import { createFileRoute } from "@tanstack/react-router";
import { DEMO_USER_ID, rankContributors } from "@/lib/civic";
import { useCivic } from "@/lib/civic-store";

export const Route = createFileRoute("/leaderboard")({
  head: () => ({
    meta: [
      { title: "Leaderboard — CivicSense" },
      { name: "description", content: "Top civic contributors ranked by karma, with badges and achievements." },
      { property: "og:title", content: "CivicSense Leaderboard" },
      { property: "og:description", content: "Fictional demo contributors ranked by karma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Leaderboard,
});

const REWARDS = [
  { name: "Metro ride voucher", cost: 500 },
  { name: "Local café discount", cost: 800 },
  { name: "Tree planted in your name", cost: 1200 },
];

function Leaderboard() {
  const { data, ready } = useCivic();
  const ranked = rankContributors(data.contributors);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section aria-labelledby="lb-h">
        <h1 id="lb-h" className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="mb-4 text-sm text-muted-foreground">Fictional demo contributors, ranked by karma.</p>
        {!ready ? <div className="skeleton h-80" /> : (
          <ol className="surface divide-y divide-border">
            {ranked.map((c) => (
              <li key={c.id} className={`flex items-center gap-3 p-4 ${c.id === DEMO_USER_ID ? "bg-secondary" : ""}`}>
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-display font-bold ${c.rank <= 3 ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`} aria-label={`Rank ${c.rank}`}>{c.rank}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.area} · {c.reports} reports<span className="sm:hidden"> · {c.badge.icon} {c.badge.title}</span></p>
                </div>
                <span className="hidden rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground sm:inline">{c.badge.icon} {c.badge.title}</span>
                <span className="font-display font-bold text-primary">{c.karma}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
      <aside className="surface h-fit space-y-3 p-5">
        <h2 className="font-bold text-foreground">Rewards</h2>
        <p className="rounded-md bg-muted p-2 text-xs text-muted-foreground"><strong className="text-foreground">Concept preview only.</strong> These rewards are not real and cannot be redeemed.</p>
        {REWARDS.map((r) => (
          <div key={r.name} className="flex items-center justify-between rounded-lg border border-border p-3">
            <div><p className="text-sm font-medium text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">{r.cost} karma</p></div>
            <button className="btn btn-outline px-3 py-1 text-xs" disabled aria-label={`${r.name}: concept preview, not redeemable`}>Preview</button>
          </div>
        ))}
        <h3 className="pt-2 text-sm font-bold text-foreground">Badge tiers</h3>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li>🌱 Newcomer · 0+</li><li>📣 Active Citizen · 200+</li><li>⭐ Neighbourhood Hero · 500+</li><li>🏆 Civic Champion · 1000+</li><li>🏛️ City Guardian · 1500+</li>
        </ul>
      </aside>
    </div>
  );
}
