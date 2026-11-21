export type Status = "Reported" | "In Progress" | "Resolved";
export type Severity = "Low" | "Medium" | "High" | "Critical";
export const STATUSES: Status[] = ["Reported", "In Progress", "Resolved"];
export const SEVERITIES: Severity[] = ["Low", "Medium", "High", "Critical"];
export const CATEGORIES = [
  "Roads & Potholes",
  "Garbage & Sanitation",
  "Streetlights",
  "Water & Drainage",
  "Public Safety",
  "Parks & Trees",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: Category;
  severity: Severity;
  status: Status;
  location: string;
  image?: string;
  beforeImage?: string;
  afterImage?: string;
  upvotes: number;
  voters: string[];
  reporterId: string;
  createdAt: string;
  summary?: string;
}
export interface Contributor {
  id: string;
  name: string;
  area: string;
  karma: number;
  reports: number;
}
export interface CivicState {
  issues: Issue[];
  contributors: Contributor[];
  awardedIssueIds: string[];
}

export const DEMO_USER_ID = "demo-user";
export const KARMA_PER_REPORT = 50;
export const SAMPLE_IMAGES = [
  { src: "/images/pothole.svg", label: "Pothole" },
  { src: "/images/garbage.svg", label: "Garbage" },
  { src: "/images/streetlight.svg", label: "Streetlight" },
  { src: "/images/drain.svg", label: "Waterlogging" },
];

export function seedState(): CivicState {
  const i = (p: Partial<Issue> & Pick<Issue, "id" | "title" | "category" | "severity" | "status">): Issue => ({
    description: "",
    location: "",
    upvotes: 0,
    voters: [],
    reporterId: "c1",
    createdAt: "2026-11-10T09:00:00.000Z",
    ...p,
  });
  return {
    issues: [
      i({ id: "s1", title: "Deep pothole near Metro Gate 2", description: "Large pothole causing two-wheelers to swerve dangerously during peak hours.", category: "Roads & Potholes", severity: "High", status: "Reported", location: "MG Road, Sector 14", image: "/images/pothole.svg", upvotes: 42, reporterId: "c1", createdAt: "2026-11-20T08:30:00.000Z" }),
      i({ id: "s2", title: "Overflowing garbage bins at market", description: "Bins not cleared for 5 days, foul smell and stray animals.", category: "Garbage & Sanitation", severity: "Medium", status: "In Progress", location: "Central Market, Block C", image: "/images/garbage.svg", upvotes: 31, reporterId: "c2", createdAt: "2026-11-19T11:00:00.000Z" }),
      i({ id: "s3", title: "Streetlights out on park lane", description: "Entire stretch dark after 7pm, residents feel unsafe walking.", category: "Streetlights", severity: "High", status: "Reported", location: "Lake View Lane", image: "/images/streetlight.svg", upvotes: 27, reporterId: "c3", createdAt: "2026-11-18T19:45:00.000Z" }),
      i({ id: "s4", title: "Waterlogging after light rain", description: "Blocked drain floods the underpass with knee-deep water.", category: "Water & Drainage", severity: "Critical", status: "In Progress", location: "Railway Underpass, East", image: "/images/drain.svg", upvotes: 58, reporterId: "c4", createdAt: "2026-11-17T07:10:00.000Z" }),
      i({ id: "s5", title: "Broken railing on footbridge", description: "Railing is loose and could give way, children use this daily.", category: "Public Safety", severity: "Critical", status: "Reported", location: "School Road Footbridge", upvotes: 19, reporterId: "c5", createdAt: "2026-11-16T14:20:00.000Z" }),
      i({ id: "s6", title: "Fallen branch blocking jogging track", description: "Branch fell during the storm and blocks half the path.", category: "Parks & Trees", severity: "Low", status: "Reported", location: "Green Park, North Gate", upvotes: 8, reporterId: "c6", createdAt: "2026-11-15T06:40:00.000Z" }),
      i({ id: "s7", title: "Cratered stretch repaired", description: "Multiple potholes on the bus route were patched and resurfaced.", category: "Roads & Potholes", severity: "High", status: "Resolved", location: "Ring Road, Stop 7", beforeImage: "/images/before-road.svg", afterImage: "/images/after-road.svg", upvotes: 64, reporterId: "c1", createdAt: "2026-11-05T10:00:00.000Z" }),
      i({ id: "s8", title: "Littered playground cleaned", description: "Debris cleared, tree replanted and bench restored by volunteers.", category: "Parks & Trees", severity: "Medium", status: "Resolved", location: "Sunrise Colony Park", beforeImage: "/images/before-park.svg", afterImage: "/images/after-park.svg", upvotes: 36, reporterId: "c2", createdAt: "2026-11-02T16:00:00.000Z" }),
    ],
    contributors: [
      { id: "c1", name: "Priya Nair", area: "Sector 14", karma: 1840, reports: 31 },
      { id: "c2", name: "Rahul Mehta", area: "Central Market", karma: 1525, reports: 26 },
      { id: "c3", name: "Ananya Iyer", area: "Lake View", karma: 1190, reports: 20 },
      { id: "c4", name: "Kabir Singh", area: "East Zone", karma: 960, reports: 17 },
      { id: "c5", name: "Fatima Sheikh", area: "School Road", karma: 720, reports: 12 },
      { id: "c6", name: "Arjun Das", area: "Green Park", karma: 430, reports: 8 },
      { id: "c7", name: "Meera Kapoor", area: "Old Town", karma: 260, reports: 5 },
      { id: DEMO_USER_ID, name: "You (Demo User)", area: "Your area", karma: 150, reports: 3 },
    ],
    awardedIssueIds: [],
  };
}

export function computeStats(issues: Issue[]) {
  const total = issues.length;
  const by = (s: Status) => issues.filter((x) => x.status === s).length;
  const resolved = by("Resolved");
  return {
    total,
    reported: by("Reported"),
    inProgress: by("In Progress"),
    resolved,
    critical: issues.filter((x) => x.severity === "Critical" && x.status !== "Resolved").length,
    upvotes: issues.reduce((a, x) => a + x.upvotes, 0),
    resolutionRate: total === 0 ? 0 : Math.round((resolved / total) * 100),
  };
}

export function upvote(state: CivicState, issueId: string, userId = DEMO_USER_ID): CivicState {
  return {
    ...state,
    issues: state.issues.map((x) =>
      x.id === issueId && !x.voters.includes(userId)
        ? { ...x, upvotes: x.upvotes + 1, voters: [...x.voters, userId] }
        : x,
    ),
  };
}

export function addIssue(state: CivicState, issue: Issue): CivicState {
  if (state.issues.some((x) => x.id === issue.id)) return state;
  const award = !state.awardedIssueIds.includes(issue.id);
  return {
    issues: [issue, ...state.issues],
    awardedIssueIds: award ? [...state.awardedIssueIds, issue.id] : state.awardedIssueIds,
    contributors: state.contributors.map((c) =>
      c.id === issue.reporterId && award
        ? { ...c, karma: c.karma + KARMA_PER_REPORT, reports: c.reports + 1 }
        : c,
    ),
  };
}

export function setStatus(state: CivicState, issueId: string, status: Status): CivicState {
  return { ...state, issues: state.issues.map((x) => (x.id === issueId ? { ...x, status } : x)) };
}

export interface IssueFilters {
  search: string;
  category: string;
  status: string;
  severity: string;
  sort: "newest" | "upvotes";
}
export function filterIssues(issues: Issue[], f: IssueFilters) {
  const q = f.search.trim().toLowerCase();
  return issues
    .filter((x) => (f.category === "all" || x.category === f.category) && (f.status === "all" || x.status === f.status) && (f.severity === "all" || x.severity === f.severity))
    .filter((x) => !q || `${x.title} ${x.description} ${x.location}`.toLowerCase().includes(q))
    .sort((a, b) => (f.sort === "upvotes" ? b.upvotes - a.upvotes : b.createdAt.localeCompare(a.createdAt)));
}

const RULES: { category: Category; words: string[] }[] = [
  { category: "Roads & Potholes", words: ["pothole", "road", "crack", "asphalt", "speed breaker", "pavement", "footpath"] },
  { category: "Garbage & Sanitation", words: ["garbage", "trash", "waste", "litter", "dump", "smell", "bin", "sewage"] },
  { category: "Streetlights", words: ["light", "lamp", "dark", "bulb", "streetlight"] },
  { category: "Water & Drainage", words: ["water", "drain", "flood", "leak", "pipe", "waterlog", "overflow"] },
  { category: "Public Safety", words: ["unsafe", "danger", "railing", "wire", "accident", "theft", "broken signal", "exposed"] },
  { category: "Parks & Trees", words: ["park", "tree", "branch", "garden", "playground", "bench"] },
];
const SEVERE = { Critical: ["accident", "injur", "exposed wire", "electrocut", "collapse", "critical", "emergency", "flood"], High: ["danger", "unsafe", "children", "school", "hospital", "deep", "night", "dark"], Medium: ["days", "smell", "blocked", "overflow", "traffic"] };

export interface Analysis { category: Category; severity: Severity; summary: string; confidence: number; matched: string[] }
export function analyzeDescription(text: string, location = ""): Analysis | null {
  const t = text.toLowerCase();
  if (t.trim().length < 10) return null;
  let best: { category: Category; hits: string[] } = { category: "Public Safety", hits: [] };
  for (const r of RULES) {
    const hits = r.words.filter((w) => t.includes(w));
    if (hits.length > best.hits.length) best = { category: r.category, hits };
  }
  const severity: Severity = SEVERE.Critical.some((w) => t.includes(w)) ? "Critical" : SEVERE.High.some((w) => t.includes(w)) ? "High" : SEVERE.Medium.some((w) => t.includes(w)) ? "Medium" : "Low";
  const where = location.trim() ? ` at ${location.trim()}` : "";
  const summary = `Respected Sir/Madam, I wish to bring to your attention a ${severity.toLowerCase()}-severity ${best.category.toLowerCase()} issue${where}. ${text.trim().replace(/\s+/g, " ")} I kindly request timely inspection and corrective action. Thank you.`;
  return { category: best.category, severity, summary, confidence: Math.min(95, 40 + best.hits.length * 20), matched: best.hits };
}

export function badgeFor(karma: number) {
  if (karma >= 1500) return { title: "City Guardian", icon: "🏛️" };
  if (karma >= 1000) return { title: "Civic Champion", icon: "🏆" };
  if (karma >= 500) return { title: "Neighbourhood Hero", icon: "⭐" };
  if (karma >= 200) return { title: "Active Citizen", icon: "📣" };
  return { title: "Newcomer", icon: "🌱" };
}
export function rankContributors(cs: Contributor[]) {
  return [...cs].sort((a, b) => b.karma - a.karma).map((c, i) => ({ ...c, rank: i + 1, badge: badgeFor(c.karma) }));
}
