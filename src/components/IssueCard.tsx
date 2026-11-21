import { ThumbsUp, MapPin } from "lucide-react";
import { DEMO_USER_ID, upvote, type Issue } from "@/lib/civic";
import { updateCivic } from "@/lib/civic-store";
import { Pill, severityTone, statusTone } from "./Shell";

export function IssueCard({ issue }: { issue: Issue }) {
  const voted = issue.voters.includes(DEMO_USER_ID);
  return (
    <article className="surface flex flex-col overflow-hidden">
      {issue.beforeImage && issue.afterImage ? (
        <div className="grid grid-cols-2 gap-px bg-border">
          <figure><img src={issue.beforeImage} alt="Illustrative before image" className="aspect-[4/3] w-full object-cover" /><figcaption className="bg-card px-2 py-1 text-[11px] text-muted-foreground">Before (illustrative)</figcaption></figure>
          <figure><img src={issue.afterImage} alt="Illustrative after image" className="aspect-[4/3] w-full object-cover" /><figcaption className="bg-card px-2 py-1 text-[11px] text-muted-foreground">After (illustrative)</figcaption></figure>
        </div>
      ) : issue.image ? (
        <img src={issue.image} alt={`Photo for ${issue.title}`} className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div className="grid aspect-[16/9] place-items-center bg-muted text-sm text-muted-foreground">No photo attached</div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          <Pill className={statusTone[issue.status]}>{issue.status}</Pill>
          <Pill className={severityTone[issue.severity]}>{issue.severity}</Pill>
          <Pill className="bg-secondary text-secondary-foreground">{issue.category}</Pill>
        </div>
        <h3 className="font-semibold text-foreground">{issue.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{issue.description}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" aria-hidden />{issue.location}</span>
          <button
            onClick={() => updateCivic((s) => upvote(s, issue.id))}
            disabled={voted}
            aria-pressed={voted}
            aria-label={voted ? `You upvoted ${issue.title}` : `Upvote ${issue.title}`}
            className={`btn px-3 py-1.5 ${voted ? "btn-primary" : "btn-outline"}`}
          >
            <ThumbsUp className="h-4 w-4" aria-hidden /> {issue.upvotes}
          </button>
        </div>
      </div>
    </article>
  );
}
