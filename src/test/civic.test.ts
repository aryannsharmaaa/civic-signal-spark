import { describe, expect, it } from "vitest";
import { addIssue, analyzeDescription, computeStats, DEMO_USER_ID, filterIssues, rankContributors, seedState, setStatus, upvote, type Issue } from "@/lib/civic";

const demoKarma = (s: ReturnType<typeof seedState>) => s.contributors.find((c) => c.id === DEMO_USER_ID)!.karma;
const newIssue: Issue = { id: "n1", title: "Test", description: "Pothole", category: "Roads & Potholes", severity: "Low", status: "Reported", location: "X", upvotes: 0, voters: [], reporterId: DEMO_USER_ID, createdAt: "2026-11-21T00:00:00.000Z" };

describe("civic rules", () => {
  it("seeds 8 issues with 2 resolved", () => {
    const s = seedState();
    expect(s.issues).toHaveLength(8);
    expect(computeStats(s.issues).resolved).toBe(2);
    expect(computeStats(s.issues).resolutionRate).toBe(25);
  });
  it("upvote counts once per demo user", () => {
    const s0 = seedState();
    const s2 = upvote(upvote(s0, "s1"), "s1");
    expect(s2.issues.find((x) => x.id === "s1")!.upvotes).toBe(43);
  });
  it("awards +50 karma once per submitted issue", () => {
    const s0 = seedState();
    const s2 = addIssue(addIssue(s0, newIssue), newIssue);
    expect(demoKarma(s2)).toBe(demoKarma(s0) + 50);
    expect(s2.issues).toHaveLength(9);
  });
  it("status change updates resolution rate", () => {
    const s = setStatus(seedState(), "s1", "Resolved");
    expect(computeStats(s.issues).resolutionRate).toBe(38);
  });
  it("filters by status", () => {
    const r = filterIssues(seedState().issues, { search: "", category: "all", status: "In Progress", severity: "all", sort: "newest" });
    expect(r).toHaveLength(2);
  });
  it("analyzer suggests category and severity", () => {
    const a = analyzeDescription("Exposed wire near the school, accident waiting to happen");
    expect(a?.severity).toBe("Critical");
    expect(analyzeDescription("Garbage bin overflowing for days")?.category).toBe("Garbage & Sanitation");
  });
  it("ranks by karma", () => {
    expect(rankContributors(seedState().contributors)[0]!.name).toBe("Priya Nair");
  });
});
