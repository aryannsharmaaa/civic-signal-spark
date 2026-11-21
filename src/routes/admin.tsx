import { createFileRoute } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { computeStats, setStatus, STATUSES, type Status } from "@/lib/civic";
import { resetCivic, updateCivic, useCivic } from "@/lib/civic-store";
import { Pill, severityTone } from "@/components/Shell";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Demo Admin Mode — CivicSense" },
      { name: "description", content: "Demo-only admin panel to change civic issue status." },
      { property: "og:title", content: "Demo Admin Mode — CivicSense" },
      { property: "og:description", content: "Simulated admin panel for the CivicSense demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

function Admin() {
  const { data, ready } = useCivic();
  const s = computeStats(data.issues);
  return (
    <div className="space-y-5">
      <div className="flex gap-3 rounded-xl border border-warning bg-warning/15 p-4" role="note">
        <ShieldAlert className="h-5 w-5 shrink-0 text-foreground" aria-hidden />
        <div>
          <h1 className="text-xl font-bold text-foreground">Demo Admin Mode</h1>
          <p className="text-sm text-foreground">For demonstration only. Status changes are saved in your browser and are <strong>not</strong> sent to any municipal authority.</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-sm text-foreground">
        <Pill className="bg-info/15 text-info">Reported {s.reported}</Pill>
        <Pill className="bg-warning/20 text-foreground">In Progress {s.inProgress}</Pill>
        <Pill className="bg-success/15 text-success">Resolved {s.resolved}</Pill>
        <span className="font-semibold">Resolution rate: {s.resolutionRate}%</span>
        <button className="btn btn-outline ml-auto" onClick={() => confirm("Reset all demo data to the 8 sample issues?") && resetCivic()}>Reset demo data</button>
      </div>
      {!ready ? <div className="skeleton h-64" /> : data.issues.length === 0 ? (
        <p className="surface p-8 text-center text-muted-foreground">No issues yet.</p>
      ) : (
        <ul className="surface divide-y divide-border">
          {data.issues.map((i) => (
            <li key={i.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{i.title}</p>
                <p className="text-xs text-muted-foreground">{i.category} · {i.location} · 👍 {i.upvotes}</p>
              </div>
              <Pill className={severityTone[i.severity]}>{i.severity}</Pill>
              <label className="sm:w-44"><span className="sr-only">Status for {i.title}</span>
                <select className="field" value={i.status} onChange={(e) => updateCivic((st) => setStatus(st, i.id, e.target.value as Status))}>
                  {STATUSES.map((x) => <option key={x}>{x}</option>)}
                </select>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
