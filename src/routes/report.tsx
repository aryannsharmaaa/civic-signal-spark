import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Upload, X } from "lucide-react";
import { addIssue, analyzeDescription, CATEGORIES, DEMO_USER_ID, KARMA_PER_REPORT, SAMPLE_IMAGES, SEVERITIES, type Analysis, type Category, type Severity } from "@/lib/civic";
import { updateCivic } from "@/lib/civic-store";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Issue — CivicSense" },
      { name: "description", content: "Report a civic issue with photo, location and AI-assisted simulated analysis." },
      { property: "og:title", content: "Report an Issue — CivicSense" },
      { property: "og:description", content: "Submit a civic issue and earn demo karma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Report,
});

type Form = { title: string; description: string; location: string; category: Category | ""; severity: Severity | ""; image: string };
const BLANK: Form = { title: "", description: "", location: "", category: "", severity: "", image: "" };

function validate(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (f.title.trim().length < 5) e.title = "Title must be at least 5 characters.";
  if (f.description.trim().length < 15) e.description = "Description must be at least 15 characters.";
  if (!f.location.trim()) e.location = "Location is required.";
  if (!f.category) e.category = "Choose a category.";
  if (!f.severity) e.severity = "Choose a severity.";
  return e;
}

function Report() {
  const nav = useNavigate();
  const [f, setF] = useState<Form>(BLANK);
  const [errors, setErrors] = useState<ReturnType<typeof validate>>({});
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeMsg, setAnalyzeMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const set = (k: keyof Form, v: string) => setF((p) => ({ ...p, [k]: v }));

  const onFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setSubmitError("Please choose an image file.");
    if (file.size > 1.5 * 1024 * 1024) return setSubmitError("Image is too large for demo storage (max 1.5 MB). Try a sample image.");
    setSubmitError("");
    const r = new FileReader();
    r.onload = () => set("image", String(r.result));
    r.onerror = () => setSubmitError("Could not read that image.");
    r.readAsDataURL(file);
  };

  const runAnalysis = () => {
    setAnalyzeMsg("");
    setAnalyzing(true);
    setTimeout(() => {
      const a = analyzeDescription(f.description, f.location);
      setAnalyzing(false);
      if (!a) return setAnalyzeMsg("Write at least a short sentence in the description first.");
      setAnalysis(a);
    }, 900);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const errs = validate(f);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    const id = `u-${Date.now()}`;
    const ok = updateCivic((s) =>
      addIssue(s, {
        id, title: f.title.trim(), description: f.description.trim(), location: f.location.trim(),
        category: f.category as Category, severity: f.severity as Severity, status: "Reported",
        ...(f.image ? { image: f.image } : {}), ...(analysis ? { summary: analysis.summary } : {}),
        upvotes: 0, voters: [], reporterId: DEMO_USER_ID, createdAt: new Date().toISOString(),
      }),
    );
    if (!ok) {
      setSubmitting(false);
      return setSubmitError("Couldn't save — browser storage is full. Remove the photo or reset demo data in Demo Admin.");
    }
    nav({ to: "/" });
  };

  const err = (k: keyof Form) => errors[k] && <p id={`${k}-err`} className="mt-1 text-xs font-medium text-destructive">{errors[k]}</p>;

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
      <form onSubmit={submit} noValidate className="surface space-y-4 p-5" aria-labelledby="rep-h">
        <div>
          <h1 id="rep-h" className="text-2xl font-bold text-foreground">Report a civic issue</h1>
          <p className="text-sm text-muted-foreground">Earn +{KARMA_PER_REPORT} demo karma for each new report.</p>
        </div>
        <div>
          <label htmlFor="title" className="text-sm font-medium text-foreground">Title *</label>
          <input id="title" className="field mt-1" value={f.title} onChange={(e) => set("title", e.target.value)} aria-invalid={!!errors.title} aria-describedby="title-err" />
          {err("title")}
        </div>
        <div>
          <label htmlFor="description" className="text-sm font-medium text-foreground">Description *</label>
          <textarea id="description" rows={4} className="field mt-1" value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="e.g. Deep pothole near the school gate, children at risk every morning" aria-invalid={!!errors.description} aria-describedby="description-err" />
          {err("description")}
        </div>
        <div>
          <label htmlFor="location" className="text-sm font-medium text-foreground">Location *</label>
          <input id="location" className="field mt-1" value={f.location} onChange={(e) => set("location", e.target.value)} placeholder="Street, landmark or area" aria-invalid={!!errors.location} aria-describedby="location-err" />
          {err("location")}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className="text-sm font-medium text-foreground">Category *</label>
            <select id="category" className="field mt-1" value={f.category} onChange={(e) => set("category", e.target.value)} aria-invalid={!!errors.category}><option value="">Select…</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
            {err("category")}
          </div>
          <div>
            <label htmlFor="severity" className="text-sm font-medium text-foreground">Severity *</label>
            <select id="severity" className="field mt-1" value={f.severity} onChange={(e) => set("severity", e.target.value)} aria-invalid={!!errors.severity}><option value="">Select…</option>{SEVERITIES.map((c) => <option key={c}>{c}</option>)}</select>
            {err("severity")}
          </div>
        </div>
        <fieldset>
          <legend className="text-sm font-medium text-foreground">Photo (optional)</legend>
          {f.image ? (
            <div className="relative mt-2">
              <img src={f.image} alt="Selected photo preview" className="max-h-56 w-full rounded-lg object-cover" />
              <button type="button" onClick={() => set("image", "")} className="btn btn-outline absolute right-2 top-2 h-8 w-8 p-0" aria-label="Remove photo"><X className="h-4 w-4" /></button>
            </div>
          ) : (
            <label className="mt-2 flex cursor-pointer flex-col items-center gap-1 rounded-lg border-2 border-dashed border-input p-5 text-sm text-muted-foreground hover:bg-muted">
              <Upload className="h-5 w-5" aria-hidden /> Upload an image
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          )}
          <p className="mt-2 text-xs text-muted-foreground">Or use a sample image:</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {SAMPLE_IMAGES.map((s) => (
              <button type="button" key={s.src} onClick={() => set("image", s.src)} className={`overflow-hidden rounded-md border-2 ${f.image === s.src ? "border-primary" : "border-transparent"}`} aria-label={`Use sample image: ${s.label}`}>
                <img src={s.src} alt="" className="h-12 w-16 object-cover" />
              </button>
            ))}
          </div>
        </fieldset>
        {submitError && <p role="alert" className="rounded-md bg-destructive/10 p-2 text-sm text-destructive">{submitError}</p>}
        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>{submitting ? "Submitting…" : "Submit report"}</button>
      </form>

      <aside className="surface h-fit space-y-3 p-5" aria-labelledby="ai-h">
        <h2 id="ai-h" className="flex items-center gap-2 font-bold text-foreground"><Sparkles className="h-4 w-4 text-primary" aria-hidden /> AI Auto-Analyze</h2>
        <p className="rounded-md bg-warning/15 p-2 text-xs text-foreground"><strong>AI-assisted simulation.</strong> Uses simple keyword rules in your browser — not real AI inference.</p>
        <button type="button" onClick={runAnalysis} disabled={analyzing} className="btn btn-outline w-full">{analyzing ? "Analyzing…" : "Analyze description"}</button>
        {analyzeMsg && <p role="status" className="text-sm text-destructive">{analyzeMsg}</p>}
        {analysis && !analyzing && (
          <div className="space-y-2 text-sm" role="status">
            <p><span className="text-muted-foreground">Category:</span> <strong className="text-foreground">{analysis.category}</strong></p>
            <p><span className="text-muted-foreground">Severity:</span> <strong className="text-foreground">{analysis.severity}</strong></p>
            <p className="text-xs text-muted-foreground">Rule match confidence: {analysis.confidence}%{analysis.matched.length ? ` · keywords: ${analysis.matched.join(", ")}` : " · no strong keywords"}</p>
            <div>
              <p className="text-muted-foreground">Formal complaint summary:</p>
              <p className="mt-1 rounded-md bg-muted p-2 text-xs leading-relaxed text-foreground">{analysis.summary}</p>
            </div>
            <button type="button" className="btn btn-primary w-full" onClick={() => setF((p) => ({ ...p, category: analysis.category, severity: analysis.severity }))}>Apply suggestions</button>
          </div>
        )}
      </aside>
    </div>
  );
}
