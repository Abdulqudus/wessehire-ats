import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Clock3,
  Download,
  FileText,
  Filter,
  LayoutDashboard,
  Link2,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  Mic,
  MoreHorizontal,
  NotebookPen,
  Phone,
  PhoneCall,
  Plus,
  Search,
  Send,
  Settings2,
  Sparkles,
  TrendingUp,
  Upload,
  UserRoundPlus,
  UsersRound,
  Volume2,
  X,
} from "lucide-react";
import "./Workspace.css";
import "./App.css";
import "./FriendlyTheme.css";

type Stage = string;
type View =
  | "overview"
  | "candidates"
  | "reminders"
  | "jobs"
  | "clients"
  | "submissions"
  | "reports"
  | "integrations";
type Candidate = {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  stage: Stage;
  source: string;
  score: number;
  updated: string;
  resumeText: string;
  visaStatus?: string;
  targetComp?: string;
  relocation?: string;
  availability?: string;
  jobId?: string;
  profileUrl?: string;
  stageHistory?: { stage: Stage; at: string }[];
};
type Note = {
  id: string;
  candidateId: string;
  body: string;
  tags: string[];
  noteType?: string;
  createdAt: string;
};
type Reminder = {
  id: string;
  candidateId: string;
  title: string;
  when: string;
  done: boolean;
};
type Client = {
  id: string;
  name: string;
  industry: string;
  contact: string;
  email: string;
  openRoles: number;
  fee: number;
  relationship: string;
};
type Job = {
  id: string;
  title: string;
  clientId: string;
  location: string;
  status: string;
  fee: number;
  split: number;
  partner: string;
  stages: Stage[];
};
type Submission = {
  id: string;
  candidateId: string;
  jobId: string;
  narrative: string;
  targetComp: string;
  createdAt: string;
  status: string;
};
type SavedSearch = {
  id: string;
  name: string;
  query: string;
  visaStatus: string;
  availability: string;
};
type TimelineItem = {
  id: string;
  date: string;
  label: string;
  detail: string;
  tags?: string[];
};
type SpeechAlternative = { transcript: string };
type SpeechResult = ArrayLike<SpeechAlternative>;
type SpeechEvent = Event & { results: ArrayLike<SpeechResult> };
type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionInstance;
  webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
};

const defaultStages: Stage[] = ["New", "Screen", "Interview", "Offer", "Hired"];
const noteTypes = ["Call", "Screen", "Submittal", "Comp", "Client feedback"];
const noteTags = [
  "Interview",
  "Follow-up",
  "Technical",
  "Culture",
  "Visa",
  "Relocation",
  "Availability",
];
const storageKeys = {
  candidates: "hireflow.candidates",
  notes: "hireflow.notes",
  reminders: "hireflow.reminders",
  clients: "hireflow.clients",
  jobs: "hireflow.jobs",
  submissions: "hireflow.submissions",
  savedSearches: "hireflow.saved-searches",
  stages: "hireflow.stages",
};
const dashboardDateLabel = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
}).format(new Date());
const dashboardTimestamp = Date.now();
const seedCandidates: Candidate[] = [
  {
    id: "c-101",
    name: "Olivia Chen",
    role: "Senior Product Designer",
    company: "Figma",
    email: "olivia.chen@email.com",
    phone: "+1 (415) 555-0138",
    location: "San Francisco, CA",
    stage: "Interview",
    source: "LinkedIn",
    score: 94,
    updated: "Today",
    resumeText: "Product design systems, Figma, accessibility",
    visaStatus: "US citizen",
    targetComp: "$180k-$195k",
    relocation: "No",
    availability: "2 weeks",
    jobId: "j-1",
  },
  {
    id: "c-102",
    name: "Marcus Johnson",
    role: "Staff Software Engineer",
    company: "Stripe",
    email: "marcus.j@email.com",
    phone: "+1 (646) 555-0192",
    location: "Brooklyn, NY",
    stage: "Screen",
    source: "Referral",
    score: 89,
    updated: "Today",
    resumeText: "Workday, payroll systems, H-1B transfer",
    visaStatus: "H-1B transfer",
    targetComp: "$210k",
    relocation: "Open",
    availability: "30 days",
    jobId: "j-2",
  },
  {
    id: "c-103",
    name: "Priya Nair",
    role: "Product Marketing Manager",
    company: "Notion",
    email: "priya.nair@email.com",
    phone: "+1 (312) 555-0146",
    location: "Chicago, IL",
    stage: "New",
    source: "Wellfound",
    score: 87,
    updated: "Yesterday",
    resumeText: "B2B SaaS, GTM strategy, lifecycle marketing",
    visaStatus: "US citizen",
    targetComp: "$155k",
    relocation: "No",
    availability: "Immediate",
    jobId: "j-3",
  },
  {
    id: "c-104",
    name: "Theo Williams",
    role: "Senior Product Designer",
    company: "Linear",
    email: "theo.williams@email.com",
    phone: "+1 (206) 555-0177",
    location: "Seattle, WA",
    stage: "Offer",
    source: "LinkedIn",
    score: 96,
    updated: "Yesterday",
    resumeText: "Portfolio, product systems, prototyping",
    visaStatus: "US citizen",
    targetComp: "$185k",
    relocation: "No",
    availability: "2 weeks",
    jobId: "j-1",
  },
  {
    id: "c-105",
    name: "Amara Okafor",
    role: "Staff Software Engineer",
    company: "Vercel",
    email: "amara.okafor@email.com",
    phone: "+1 (512) 555-0124",
    location: "Austin, TX",
    stage: "Interview",
    source: "GitHub",
    score: 91,
    updated: "Mon",
    resumeText: "Distributed systems, TypeScript, platform",
    visaStatus: "Permanent resident",
    targetComp: "$225k",
    relocation: "Open",
    availability: "4 weeks",
    jobId: "j-2",
  },
  {
    id: "c-106",
    name: "Ethan Park",
    role: "Product Marketing Manager",
    company: "Webflow",
    email: "ethan.park@email.com",
    phone: "+1 (617) 555-0108",
    location: "Boston, MA",
    stage: "New",
    source: "Portfolio",
    score: 82,
    updated: "Mon",
    resumeText: "SaaS, demand generation, product launches",
    visaStatus: "US citizen",
    targetComp: "$165k",
    relocation: "No",
    availability: "30 days",
    jobId: "j-3",
  },
];
const seedNotes: Note[] = [
  {
    id: "n-1",
    candidateId: "c-101",
    body: "Strong systems thinking. Wants to own the end-to-end design process; available to interview next week.",
    tags: ["Interview", "Availability"],
    createdAt: "Today, 10:42 AM",
  },
  {
    id: "n-2",
    candidateId: "c-104",
    body: "Offer review is on track. Confirm equity details before the Friday follow-up.",
    tags: ["Compensation", "Follow-up"],
    createdAt: "Yesterday, 3:18 PM",
  },
];
const seedClients: Client[] = [
  {
    id: "cl-1",
    name: "Northstar Labs",
    industry: "SaaS",
    contact: "Elena Ramirez",
    email: "elena@northstarlabs.example",
    openRoles: 2,
    fee: 22,
    relationship: "Active",
  },
  {
    id: "cl-2",
    name: "Fieldwork Health",
    industry: "Health tech",
    contact: "Jordan Blake",
    email: "jordan@fieldwork.example",
    openRoles: 1,
    fee: 20,
    relationship: "Active",
  },
  {
    id: "cl-3",
    name: "Common Thread",
    industry: "Fintech",
    contact: "Noah Brooks",
    email: "noah@commonthread.example",
    openRoles: 1,
    fee: 25,
    relationship: "Prospect",
  },
];
const seedJobs: Job[] = [
  {
    id: "j-1",
    title: "Senior Product Designer",
    clientId: "cl-1",
    location: "Remote, US",
    status: "Open",
    fee: 22,
    split: 50,
    partner: "Maya Chen",
    stages: defaultStages,
  },
  {
    id: "j-2",
    title: "Staff Software Engineer",
    clientId: "cl-3",
    location: "New York, NY",
    status: "Open",
    fee: 25,
    split: 60,
    partner: "Maya Chen",
    stages: defaultStages,
  },
  {
    id: "j-3",
    title: "Product Marketing Manager",
    clientId: "cl-2",
    location: "Chicago, IL",
    status: "Open",
    fee: 20,
    split: 50,
    partner: "Maya Chen",
    stages: defaultStages,
  },
];
const seedSubmissions: Submission[] = [
  {
    id: "s-1",
    candidateId: "c-104",
    jobId: "j-1",
    narrative:
      "Theo combines strong product judgment with systems-level design craft. His recent work at Linear shows the kind of crisp execution Northstar Labs needs as it expands its collaboration suite.",
    targetComp: "$185,000",
    createdAt: "Yesterday",
    status: "Sent",
  },
];

function readStored<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function readCandidates() {
  return readStored<Candidate[]>(storageKeys.candidates, seedCandidates).map(
    (candidate) => {
      const sample = seedCandidates.find((entry) => entry.id === candidate.id);
      if (!sample) return candidate;
      return {
        ...sample,
        ...candidate,
        resumeText: candidate.resumeText || sample.resumeText,
        visaStatus: candidate.visaStatus ?? sample.visaStatus,
        targetComp: candidate.targetComp ?? sample.targetComp,
        relocation: candidate.relocation ?? sample.relocation,
        availability: candidate.availability ?? sample.availability,
        jobId: candidate.jobId ?? sample.jobId,
      };
    },
  );
}

function makeSeedReminders(): Reminder[] {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const inTwoDays = new Date();
  inTwoDays.setDate(inTwoDays.getDate() + 2);
  return [
    {
      id: "r-1",
      candidateId: "c-101",
      title: "Send portfolio review notes",
      when: `${new Date().toISOString().slice(0, 10)}T14:30`,
      done: false,
    },
    {
      id: "r-2",
      candidateId: "c-104",
      title: "Follow up on offer details",
      when: `${tomorrow.toISOString().slice(0, 10)}T11:00`,
      done: false,
    },
    {
      id: "r-3",
      candidateId: "c-102",
      title: "Share technical screen feedback",
      when: `${inTwoDays.toISOString().slice(0, 10)}T10:00`,
      done: false,
    },
  ];
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function matchesQuery(searchableText: string, query: string) {
  if (!query.trim()) return true;
  const normalizedText = searchableText.toLowerCase();
  return query.split(/\s+OR\s+/i).some((group) => {
    const terms = group.match(/NOT\s+"[^"]+"|NOT\s+\S+|"[^"]+"|\S+/gi) ?? [];
    return terms.every((rawTerm) => {
      const negative = /^NOT\s+/i.test(rawTerm);
      const term = rawTerm
        .replace(/^NOT\s+/i, "")
        .replaceAll('"', "")
        .replace(/[(),]/g, "")
        .toLowerCase();
      if (["and", "or"].includes(term)) return true;
      return negative
        ? !normalizedText.includes(term)
        : normalizedText.includes(term);
    });
  });
}

function candidateFit(candidate: Candidate, job: Job) {
  const jobTerms = Array.from(
    new Set(job.title.toLowerCase().match(/[a-z0-9+#]+/g) ?? []),
  ).filter((term) => !["senior", "staff", "lead", "the"].includes(term));
  if (jobTerms.length === 0) return 0;
  const role = candidate.role.toLowerCase();
  const resume = candidate.resumeText.toLowerCase();
  const roleCoverage = jobTerms.filter((term) => role.includes(term)).length / jobTerms.length;
  const resumeCoverage = jobTerms.filter((term) => resume.includes(term)).length / jobTerms.length;
  return Math.min(
    99,
    Math.round(20 + roleCoverage * 45 + resumeCoverage * 34),
  );
}

function formatReminder(when: string) {
  const date = new Date(when);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const day =
    date.toDateString() === today.toDateString()
      ? "Today"
      : date.toDateString() === tomorrow.toDateString()
        ? "Tomorrow"
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${day} · ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
}

function formatTimelineDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}

async function extractResume(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "txt") return file.text();
  const data = await file.arrayBuffer();
  if (extension === "docx") {
    const mammoth = await import("mammoth");
    return (await mammoth.default.extractRawText({ arrayBuffer: data })).value;
  }
  if (extension === "pdf") {
    const [pdfjs, worker] = await Promise.all([
      import("pdfjs-dist"),
      import("pdfjs-dist/build/pdf.worker.min.mjs?url"),
    ]);
    pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
    const document = await pdfjs.getDocument({ data }).promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(
        content.items.map((item) => ("str" in item ? item.str : "")).join(" "),
      );
    }
    return pages.join("\n");
  }
  throw new Error("Use a PDF, DOCX, or TXT resume.");
}

function App() {
  const [view, setView] = useState<View>("overview");
  const [candidates, setCandidates] = useState<Candidate[]>(readCandidates);
  const [notes, setNotes] = useState<Note[]>(() =>
    readStored(storageKeys.notes, seedNotes),
  );
  const [reminders, setReminders] = useState<Reminder[]>(() =>
    readStored(storageKeys.reminders, makeSeedReminders()),
  );
  const [clients, setClients] = useState<Client[]>(() =>
    readStored(storageKeys.clients, seedClients),
  );
  const [jobs, setJobs] = useState<Job[]>(() =>
    readStored(storageKeys.jobs, seedJobs),
  );
  const [submissions, setSubmissions] = useState<Submission[]>(() =>
    readStored(storageKeys.submissions, seedSubmissions),
  );
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() =>
    readStored(storageKeys.savedSearches, []),
  );
  const [pipelineStages, setPipelineStages] = useState<Stage[]>(() =>
    readStored(storageKeys.stages, defaultStages),
  );
  const [selectedJobId, setSelectedJobId] = useState("j-1");
  const [showClientForm, setShowClientForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [showStageEditor, setShowStageEditor] = useState(false);
  const [candidateLayout, setCandidateLayout] = useState<"list" | "board">(
    "list",
  );
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>(
    [],
  );
  const [showOutreach, setShowOutreach] = useState(false);
  const [outreachDraft, setOutreachDraft] = useState(
    "Hi {{first_name}}, I came across your background and thought you could be a strong fit for {{role}}. Would you be open to a quick conversation?",
  );
  const [clientDraft, setClientDraft] = useState({
    name: "",
    industry: "",
    contact: "",
    email: "",
    fee: "20",
  });
  const [jobDraft, setJobDraft] = useState({
    title: "",
    clientId: "",
    location: "",
    fee: "20",
    split: "50",
    partner: "Maya Chen",
  });
  const [submissionDraft, setSubmissionDraft] = useState({
    candidateId: "",
    jobId: "",
    narrative: "",
    targetComp: "",
  });
  const [stageDraft, setStageDraft] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeStage, setActiveStage] = useState("All candidates");
  const [visaFilter, setVisaFilter] = useState("All visa statuses");
  const [availabilityFilter, setAvailabilityFilter] = useState("Any availability");
  const [reportColumns, setReportColumns] = useState([
    "Candidate",
    "Role",
    "Client",
    "Stage",
    "Source",
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null,
  );
  const [showCandidateForm, setShowCandidateForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [callCandidate, setCallCandidate] = useState<Candidate | null>(null);
  const [callStarted, setCallStarted] = useState(false);
  const [recordingNoticeRead, setRecordingNoticeRead] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [selectedTag, setSelectedTag] = useState(noteTags[0]);
  const [selectedNoteType, setSelectedNoteType] = useState(noteTypes[0]);
  const [awaitingNoteType, setAwaitingNoteType] = useState(false);
  const [listening, setListening] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");
  const [candidateDraft, setCandidateDraft] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    location: "",
    source: "LinkedIn",
    visaStatus: "",
    targetComp: "",
    relocation: "",
    availability: "",
    profileUrl: "",
  });
  const [pastedResume, setPastedResume] = useState("");
  const [reminderDraft, setReminderDraft] = useState({
    candidateId: "",
    title: "",
    when: "",
  });
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.candidates,
      JSON.stringify(candidates),
    );
  }, [candidates]);
  useEffect(() => {
    window.localStorage.setItem(storageKeys.notes, JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.reminders,
      JSON.stringify(reminders),
    );
  }, [reminders]);
  useEffect(() => {
    window.localStorage.setItem(storageKeys.clients, JSON.stringify(clients));
  }, [clients]);
  useEffect(() => {
    window.localStorage.setItem(storageKeys.jobs, JSON.stringify(jobs));
  }, [jobs]);
  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.submissions,
      JSON.stringify(submissions),
    );
  }, [submissions]);
  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.savedSearches,
      JSON.stringify(savedSearches),
    );
  }, [savedSearches]);
  useEffect(() => {
    window.localStorage.setItem(
      storageKeys.stages,
      JSON.stringify(pipelineStages),
    );
  }, [pipelineStages]);

  const handleShortcut = useEffectEvent((event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      searchInputRef.current?.focus();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "n") {
      event.preventDefault();
      setShowCandidateForm(true);
    }
    if ((event.metaKey || event.ctrlKey) && event.shiftKey) {
      const key = event.key.toLowerCase();
      if (key === "m" && selectedCandidate) {
        event.preventDefault();
        openDialer(selectedCandidate);
      } else if (key === "r" && selectedCandidate) {
        event.preventDefault();
        setReminderDraft((current) => ({
          ...current,
          candidateId: selectedCandidate.id,
        }));
        setShowReminderForm(true);
      } else if (key === "s" && selectedCandidate) {
        event.preventDefault();
        openSubmission(selectedCandidate.id);
      } else if (key === "e" && selectedCandidate) {
        event.preventDefault();
        setSelectedCandidateIds([selectedCandidate.id]);
        setShowOutreach(true);
      } else if (/^[1-9]$/.test(event.key) && selectedCandidate) {
        const stage = pipelineStages[Number(event.key) - 1];
        if (stage) {
          event.preventDefault();
          updateStage(selectedCandidate.id, stage);
        }
      }
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const openToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3200);
  };
  const candidateName = (id: string) =>
    candidates.find((candidate) => candidate.id === id)?.name ?? "Candidate";
  const searchableTextFor = (candidate: Candidate) => {
    const job = jobs.find(
      (item) => item.id === candidate.jobId || item.title === candidate.role,
    );
    const client = clients.find((item) => item.id === job?.clientId);
    const noteText = notes
      .filter((note) => note.candidateId === candidate.id)
      .map((note) => `${note.body} ${note.tags.join(" ")}`)
      .join(" ");
    return [
      candidate.name,
      candidate.role,
      candidate.company,
      candidate.email,
      candidate.phone,
      candidate.location,
      candidate.source,
      candidate.resumeText,
      candidate.visaStatus,
      candidate.targetComp,
      candidate.relocation,
      candidate.availability,
      candidate.profileUrl,
      job?.title,
      client?.name,
      noteText,
    ].join(" ");
  };
  const filteredCandidates = candidates.filter(
    (candidate) =>
      matchesQuery(searchableTextFor(candidate), search) &&
      (visaFilter === "All visa statuses" || candidate.visaStatus === visaFilter) &&
      (availabilityFilter === "Any availability" ||
        candidate.availability === availabilityFilter) &&
      (activeStage === "All candidates" || candidate.stage === activeStage),
  );
  const quickCandidateResults = search.trim()
    ? candidates
        .filter((candidate) =>
          matchesQuery(searchableTextFor(candidate), search),
        )
        .slice(0, 5)
    : [];
  const quickJobResults = search.trim()
    ? jobs
        .filter((job) =>
          matchesQuery(
            `${job.title} ${job.location} ${clients.find((client) => client.id === job.clientId)?.name ?? ""}`,
            search,
          ),
        )
        .slice(0, 3)
    : [];
  const quickClientResults = search.trim()
    ? clients
        .filter((client) =>
          matchesQuery(
            `${client.name} ${client.industry} ${client.contact} ${client.email}`,
            search,
          ),
        )
        .slice(0, 3)
    : [];
  const quickNoteResults = search.trim()
    ? notes
        .filter((note) =>
          matchesQuery(
            `${note.body} ${note.tags.join(" ")} ${candidateName(note.candidateId)}`,
            search,
          ),
        )
        .slice(0, 3)
    : [];
  const pendingReminders = reminders
    .filter((reminder) => !reminder.done)
    .sort((a, b) => a.when.localeCompare(b.when));
  const staleCandidates = candidates
    .filter((candidate) => {
      const latestStageChange = candidate.stageHistory?.at(-1)?.at;
      if (latestStageChange) {
        return dashboardTimestamp - Date.parse(latestStageChange) > 7 * 24 * 60 * 60 * 1000;
      }
      return ["Yesterday", "Mon", "Tue", "Wed", "Thu", "Fri", "Last week"].includes(candidate.updated);
    })
    .filter((candidate) => candidate.stage !== "Hired")
    .slice(0, 3);
  function updateStage(candidateId: string, stage: Stage) {
    const changedAt = new Date().toISOString();
    setCandidates((current) =>
      current.map((candidate) =>
        candidate.id === candidateId
          ? {
              ...candidate,
              stage,
              updated: "Just now",
              stageHistory: [
                ...(candidate.stageHistory ?? []),
                { stage, at: changedAt },
              ],
            }
          : candidate,
      ),
    );
    setSelectedCandidate((current) =>
      current?.id === candidateId
        ? {
            ...current,
            stage,
            updated: "Just now",
            stageHistory: [
              ...(current.stageHistory ?? []),
              { stage, at: changedAt },
            ],
          }
        : current,
    );
    if (
      ["Interview", "Offer"].includes(stage) &&
      !reminders.some(
        (reminder) =>
          reminder.candidateId === candidateId &&
          !reminder.done &&
          reminder.title.toLowerCase().includes(stage.toLowerCase()),
      )
    ) {
      const followUp = new Date();
      followUp.setDate(followUp.getDate() + 2);
      setReminders((current) => [
        ...current,
        {
          id: `r-${Date.now()}`,
          candidateId,
          title: `${stage} follow-up`,
          when: `${followUp.toISOString().slice(0, 10)}T10:00`,
          done: false,
        },
      ]);
      openToast(`${stage} follow-up reminder added automatically.`);
    }
  }

  function saveClient(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!clientDraft.name.trim()) return;
    setClients((current) => [
      {
        id: `cl-${Date.now()}`,
        name: clientDraft.name.trim(),
        industry: clientDraft.industry,
        contact: clientDraft.contact,
        email: clientDraft.email,
        openRoles: 0,
        fee: Number(clientDraft.fee) || 0,
        relationship: "Prospect",
      },
      ...current,
    ]);
    setClientDraft({
      name: "",
      industry: "",
      contact: "",
      email: "",
      fee: "20",
    });
    setShowClientForm(false);
    openToast("Client account added.");
  }

  function saveJob(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!jobDraft.title.trim() || !jobDraft.clientId) return;
    const job: Job = {
      id: `j-${Date.now()}`,
      title: jobDraft.title.trim(),
      clientId: jobDraft.clientId,
      location: jobDraft.location.trim(),
      status: "Open",
      fee: Number(jobDraft.fee) || 0,
      split: Number(jobDraft.split) || 0,
      partner: jobDraft.partner,
      stages: pipelineStages,
    };
    setJobs((current) => [job, ...current]);
    setClients((current) =>
      current.map((client) =>
        client.id === job.clientId
          ? { ...client, openRoles: client.openRoles + 1 }
          : client,
      ),
    );
    setSelectedJobId(job.id);
    setJobDraft({
      title: "",
      clientId: "",
      location: "",
      fee: "20",
      split: "50",
      partner: "Maya Chen",
    });
    setShowJobForm(false);
    openToast("Job order added to the pipeline.");
  }

  function openSubmission(candidateId = "") {
    const candidate =
      candidates.find((item) => item.id === candidateId) ?? candidates[0];
    const job = jobs.find((item) => item.title === candidate?.role) ?? jobs[0];
    const candidateNotes = notes
      .filter((note) => note.candidateId === candidate?.id)
      .map((note) => note.body)
      .join(" ");
    setSubmissionDraft({
      candidateId: candidate?.id ?? "",
      jobId: job?.id ?? "",
      narrative: candidate
        ? `${candidate.name} is a ${candidate.role} with experience at ${candidate.company}. ${candidateNotes}`.trim()
        : "",
      targetComp: candidate?.targetComp ?? "",
    });
    setShowSubmissionForm(true);
  }

  function saveSubmission(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!submissionDraft.candidateId || !submissionDraft.jobId) return;
    const submission: Submission = {
      id: `s-${Date.now()}`,
      ...submissionDraft,
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      status: "Draft",
    };
    setSubmissions((current) => [submission, ...current]);
    setShowSubmissionForm(false);
    setView("submissions");
    openToast("Submission draft saved.");
  }

  function savePipelineStages(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextStages = Array.from(
      new Set(
        stageDraft
          .split(",")
          .map((stage) => stage.trim())
          .filter(Boolean),
      ),
    );
    if (nextStages.length < 2) {
      openToast("Add at least two pipeline stages.");
      return;
    }
    setPipelineStages(nextStages);
    setCandidates((current) =>
      current.map((candidate) =>
        nextStages.includes(candidate.stage)
          ? candidate
          : { ...candidate, stage: nextStages[0] },
      ),
    );
    setShowStageEditor(false);
    openToast("Pipeline stages updated.");
  }

  function saveCurrentSearch() {
    if (!search.trim() && visaFilter === "All visa statuses" && availabilityFilter === "Any availability") {
      openToast("Add a query or filter before saving a smart list.");
      return;
    }
    const savedSearch: SavedSearch = {
      id: `ss-${Date.now()}`,
      name: search.trim() || [visaFilter, availabilityFilter].filter((value) => !value.startsWith("All") && !value.startsWith("Any")).join(" · "),
      query: search.trim(),
      visaStatus: visaFilter === "All visa statuses" ? "" : visaFilter,
      availability: availabilityFilter === "Any availability" ? "" : availabilityFilter,
    };
    setSavedSearches((current) => [savedSearch, ...current]);
    openToast("Smart list saved.");
  }

  function downloadReport() {
    const reportValues: Record<string, (candidate: Candidate) => string> = {
      Candidate: (candidate) => candidate.name,
      Role: (candidate) => candidate.role,
      Client: (candidate) => clients.find((client) => client.id === jobs.find((job) => job.id === candidate.jobId || job.title === candidate.role)?.clientId)?.name ?? "",
      Stage: (candidate) => candidate.stage,
      Source: (candidate) => candidate.source,
      "Visa status": (candidate) => candidate.visaStatus ?? "",
      "Target compensation": (candidate) => candidate.targetComp ?? "",
      Availability: (candidate) => candidate.availability ?? "",
    };
    const rows = [
      reportColumns,
      ...candidates.map((candidate) => reportColumns.map((column) => reportValues[column](candidate))),
    ];
    const csv = rows
      .map((row) =>
        row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","),
      )
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "hireflow-pipeline-report.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function toggleCandidateSelection(candidateId: string) {
    setSelectedCandidateIds((current) =>
      current.includes(candidateId)
        ? current.filter((id) => id !== candidateId)
        : [...current, candidateId],
    );
  }

  function saveOutreachDrafts() {
    const drafts = candidates
      .filter((candidate) => selectedCandidateIds.includes(candidate.id))
      .map((candidate) => ({
        id: `n-${Date.now()}-${candidate.id}`,
        candidateId: candidate.id,
        body: outreachDraft
          .replaceAll("{{first_name}}", candidate.name.split(" ")[0])
          .replaceAll("{{role}}", candidate.role),
        tags: ["Outreach"],
        createdAt: "Drafted just now",
      }));
    setNotes((current) => [...drafts, ...current]);
    setShowOutreach(false);
    setSelectedCandidateIds([]);
    openToast(`${drafts.length} outreach drafts saved. No emails were sent.`);
  }

  function resetCandidateForm() {
    setCandidateDraft({
      name: "",
      role: "",
      email: "",
      phone: "",
      location: "",
      source: "LinkedIn",
      visaStatus: "",
      targetComp: "",
      relocation: "",
      availability: "",
      profileUrl: "",
    });
    setResumeName("");
    setResumeText("");
    setPastedResume("");
    setFormError("");
    if (uploadRef.current) uploadRef.current.value = "";
  }

  async function handleResumeUpload(file?: File) {
    if (!file) return;
    setFormError("");
    try {
      const text = await extractResume(file);
      setResumeName(file.name);
      setResumeText(text);
      const email =
        text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
      const phone = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0] ?? "";
      const firstLine =
        text
          .split(/\r?\n/)
          .map((line) => line.trim())
          .find((line) => line.length > 2 && line.length < 55) ?? "";
      setPastedResume(text);
      setCandidateDraft((current) => ({
        ...current,
        name: current.name || firstLine,
        email: current.email || email,
        phone: current.phone || phone,
      }));
      openToast("Resume added. Review the extracted details before saving.");
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Could not read that resume.",
      );
    }
  }

  function handleResumePaste(text: string) {
    setPastedResume(text);
    setResumeText(text);
    if (!text.trim()) return;
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    const email =
      text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? "";
    const phone = text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0] ?? "";
    const firstLine =
      lines.find(
        (line) => line.length > 2 && line.length < 55 && !line.includes("@"),
      ) ?? "";
    const secondLine =
      lines.find(
        (line) =>
          line !== firstLine &&
          !line.includes("@") &&
          !/^[+\d(]/.test(line) &&
          line.length < 65,
      ) ?? "";
    setCandidateDraft((current) => ({
      ...current,
      name: current.name || firstLine,
      role: current.role || secondLine,
      email: current.email || email,
      phone: current.phone || phone,
    }));
  }

  function saveCandidate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!candidateDraft.name.trim() || !candidateDraft.role.trim()) {
      setFormError("Add a candidate name and target role to continue.");
      return;
    }
    const normalizedEmail = candidateDraft.email.trim().toLowerCase();
    const normalizedPhone = candidateDraft.phone.replace(/\D/g, "");
    const duplicate = candidates.find(
      (candidate) =>
        (normalizedEmail &&
          candidate.email.toLowerCase() === normalizedEmail) ||
        (normalizedPhone.length >= 10 &&
          candidate.phone.replace(/\D/g, "") === normalizedPhone) ||
        (candidateDraft.profileUrl &&
          candidate.profileUrl === candidateDraft.profileUrl),
    );
    if (duplicate) {
      setFormError(
        `${duplicate.name} already exists. Open the existing profile instead of creating a duplicate.`,
      );
      return;
    }
    const candidate: Candidate = {
      id: `c-${Date.now()}`,
      name: candidateDraft.name.trim(),
      role: candidateDraft.role.trim(),
      company: "Independent",
      email: candidateDraft.email.trim(),
      phone: candidateDraft.phone.trim(),
      location: candidateDraft.location.trim() || "Location not added",
      stage: pipelineStages[0] ?? "New",
      source: candidateDraft.source,
      score: 0,
      updated: "Just added",
      resumeText: resumeText || pastedResume,
      visaStatus: candidateDraft.visaStatus,
      targetComp: candidateDraft.targetComp,
      relocation: candidateDraft.relocation,
      availability: candidateDraft.availability,
      profileUrl: candidateDraft.profileUrl,
    };
    setCandidates((current) => [candidate, ...current]);
    setShowCandidateForm(false);
    resetCandidateForm();
    setView("candidates");
    setSelectedCandidate(candidate);
    openToast(`${candidate.name} added to your pipeline.`);
  }

  function saveReminder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !reminderDraft.candidateId ||
      !reminderDraft.title ||
      !reminderDraft.when
    )
      return;
    setReminders((current) =>
      [
        ...current,
        { ...reminderDraft, id: `r-${Date.now()}`, done: false },
      ].sort((a, b) => a.when.localeCompare(b.when)),
    );
    setShowReminderForm(false);
    setReminderDraft({ candidateId: "", title: "", when: "" });
    openToast("Follow-up reminder added.");
  }

  function openDialer(candidate: Candidate) {
    setCallCandidate(candidate);
    setCallStarted(false);
    setRecordingNoticeRead(false);
    setNoteDraft("");
    setSelectedTag(noteTags[0]);
    setSelectedNoteType(noteTypes[0]);
    setAwaitingNoteType(false);
  }

  function speakText(text: string, onEnd?: () => void) {
    if (!("speechSynthesis" in window)) {
      openToast("Read-aloud is not available in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    if (onEnd) utterance.onend = onEnd;
    window.speechSynthesis.speak(utterance);
  }

  function startVoiceNotes(listenForType = awaitingNoteType) {
    const speechWindow = window as SpeechWindow;
    const Recognition =
      speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
    if (!Recognition) {
      openToast(
        "Voice notes need Chrome or another browser with speech recognition.",
      );
      return;
    }
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();
      if (listenForType) {
        const spokenType = noteTypes.find((type) =>
          transcript.toLowerCase().includes(type.toLowerCase()),
        );
        if (spokenType) {
          setSelectedNoteType(spokenType);
          setAwaitingNoteType(false);
          recognition.stop();
          setListening(false);
          saveCallNote(spokenType);
        }
        return;
      }
      const isSubmitCommand = /\bsubmit\b/i.test(transcript);
      const cleanedTranscript = transcript
        .replace(/\bsubmit(?:\s+(?:this\s+)?note)?\b/i, "")
        .trim();
      if (cleanedTranscript) setNoteDraft(cleanedTranscript);
      if (isSubmitCommand) {
        setAwaitingNoteType(true);
        recognition.stop();
        setListening(false);
        speakText(
          `What note type should I use? Say ${noteTypes.join(", ")}.`,
          () => startVoiceNotes(true),
        );
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  function saveCallNote(noteType = selectedNoteType) {
    if (!callCandidate || !noteDraft.trim()) {
      openToast("Add a note before saving.");
      return;
    }
    const note: Note = {
      id: `n-${Date.now()}`,
      candidateId: callCandidate.id,
      body: noteDraft.trim(),
      tags: [selectedTag],
      noteType,
      createdAt: new Date().toISOString(),
    };
    setNotes((current) => [note, ...current]);
    setNoteDraft("");
    setAwaitingNoteType(false);
    openToast(`Note saved to ${callCandidate.name}'s profile.`);
  }

  function summarizeCallDraft() {
    const cleaned = noteDraft
      .replace(/\b(um|uh|you know|basically)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();
    const sentences = cleaned.match(/[^.!?]+[.!?]?/g) ?? [];
    setNoteDraft(sentences.slice(0, 2).join(" ").trim() || cleaned);
    openToast("Local summary draft ready. Review it before saving.");
  }

  function closeCall() {
    recognitionRef.current?.stop();
    setListening(false);
    setCallCandidate(null);
    setCallStarted(false);
  }

  function completeReminder(reminderId: string) {
    setReminders((current) =>
      current.map((reminder) =>
        reminder.id === reminderId ? { ...reminder, done: true } : reminder,
      ),
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a
          className="brand"
          href="#overview"
          onClick={() => setView("overview")}
          aria-label="Wessehire home"
        >
          <span className="brand-mark">
            <span />
            <span />
            <span />
          </span>
          <span>
            Wessehire<span className="brand-period">.</span>
          </span>
        </a>
        <div className="workspace-switcher">
          <div className="workspace-avatar">N</div>
          <div className="workspace-copy">
            <strong>Northstar Studio</strong>
            <span>Recruiting team</span>
          </div>
          <ChevronDown size={15} />
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav className="primary-nav" aria-label="Main navigation">
          <button
            className={view === "overview" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("overview");
              setSelectedCandidate(null);
            }}
          >
            <LayoutDashboard size={18} />
            <span>Today</span>
          </button>
          <button
            className={view === "candidates" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("candidates");
              setSelectedCandidate(null);
            }}
          >
            <UsersRound size={18} />
            <span>Candidates</span>
            <span className="nav-count">{candidates.length}</span>
          </button>
          <button
            className={view === "jobs" ? "nav-item active" : "nav-item"}
            onClick={() => setView("jobs")}
          >
            <BriefcaseBusiness size={18} />
            <span>Jobs</span>
            <span className="nav-count">{jobs.length}</span>
          </button>
          <button
            className={view === "clients" ? "nav-item active" : "nav-item"}
            onClick={() => setView("clients")}
          >
            <Building2 size={18} />
            <span>Clients</span>
            <span className="nav-count">{clients.length}</span>
          </button>
          <button
            className={view === "reminders" ? "nav-item active" : "nav-item"}
            onClick={() => {
              setView("reminders");
              setSelectedCandidate(null);
            }}
          >
            <CalendarClock size={18} />
            <span>Reminders</span>
            {pendingReminders.length > 0 && (
              <span className="nav-count nav-count-accent">
                {pendingReminders.length}
              </span>
            )}
          </button>
          <button
            className={view === "submissions" ? "nav-item active" : "nav-item"}
            onClick={() => setView("submissions")}
          >
            <ClipboardList size={18} />
            <span>Submissions</span>
            <span className="nav-count">{submissions.length}</span>
          </button>
          <button
            className={view === "reports" ? "nav-item active" : "nav-item"}
            onClick={() => setView("reports")}
          >
            <TrendingUp size={18} />
            <span>Reports</span>
          </button>
          <button
            className={view === "integrations" ? "nav-item active" : "nav-item"}
            onClick={() => setView("integrations")}
          >
            <Link2 size={18} />
            <span>Integrations</span>
          </button>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <div className="tip-icon">
              <Sparkles size={16} />
            </div>
            <strong>Good hiring starts here</strong>
            <p>Keep every conversation and next step in one place.</p>
            <button onClick={() => setShowCandidateForm(true)}>
              Add a candidate <ArrowRight size={14} />
            </button>
          </div>
          <button className="profile-switcher">
            <span className="avatar avatar-maya">MC</span>
            <span className="workspace-copy">
              <strong>Maya Chen</strong>
              <span>Recruiter</span>
            </span>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb">
            <span>Northstar Studio</span>
            <ChevronRight size={14} />
            <strong>
              {view === "overview"
                ? "Today"
                : view[0].toUpperCase() + view.slice(1)}
            </strong>
          </div>
          <div className="topbar-actions">
            <div className="search-control">
              <label className="global-search">
                <Search size={16} />
                <input
                  ref={searchInputRef}
                  value={search}
                  onFocus={() => setShowQuickSearch(true)}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setShowQuickSearch(true);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setShowQuickSearch(false);
                  }}
                  placeholder="Search everything"
                  aria-label="Search candidates, jobs, clients and notes"
                />
                <kbd>Ctrl K</kbd>
              </label>
              {showQuickSearch && search.trim() && (
                <div
                  className="quick-search-results"
                  onMouseDown={(event) => event.preventDefault()}
                >
                  {quickCandidateResults.length +
                    quickJobResults.length +
                    quickClientResults.length +
                    quickNoteResults.length ===
                  0 ? (
                    <p>No matching records.</p>
                  ) : (
                    <>
                      {quickCandidateResults.length > 0 && (
                        <section>
                          <small>CANDIDATES</small>
                          {quickCandidateResults.map((candidate) => (
                            <button
                              key={candidate.id}
                              onClick={() => {
                                setView("candidates");
                                setSelectedCandidate(candidate);
                                setSearch("");
                                setShowQuickSearch(false);
                              }}
                            >
                              <span className="avatar">
                                {initials(candidate.name)}
                              </span>
                              <span>
                                <strong>{candidate.name}</strong>
                                <small>
                                  {candidate.role} · {candidate.location}
                                </small>
                              </span>
                            </button>
                          ))}
                        </section>
                      )}
                      {quickJobResults.length > 0 && (
                        <section>
                          <small>JOBS</small>
                          {quickJobResults.map((job) => (
                            <button
                              key={job.id}
                              onClick={() => {
                                setView("jobs");
                                setSelectedJobId(job.id);
                                setSearch("");
                                setShowQuickSearch(false);
                              }}
                            >
                              <BriefcaseBusiness size={15} />
                              <span>
                                <strong>{job.title}</strong>
                                <small>
                                  {
                                    clients.find(
                                      (client) => client.id === job.clientId,
                                    )?.name
                                  }
                                </small>
                              </span>
                            </button>
                          ))}
                        </section>
                      )}
                      {quickClientResults.length > 0 && (
                        <section>
                          <small>CLIENTS</small>
                          {quickClientResults.map((client) => (
                            <button
                              key={client.id}
                              onClick={() => {
                                setView("clients");
                                setSelectedClientId(client.id);
                                setSearch("");
                                setShowQuickSearch(false);
                              }}
                            >
                              <Building2 size={15} />
                              <span>
                                <strong>{client.name}</strong>
                                <small>
                                  {client.contact} · {client.industry}
                                </small>
                              </span>
                            </button>
                          ))}
                        </section>
                      )}
                      {quickNoteResults.length > 0 && (
                        <section>
                          <small>NOTES</small>
                          {quickNoteResults.map((note) => (
                            <button
                              key={note.id}
                              onClick={() => {
                                const candidate = candidates.find(
                                  (item) => item.id === note.candidateId,
                                );
                                if (candidate) {
                                  setView("candidates");
                                  setSelectedCandidate(candidate);
                                }
                                setSearch("");
                                setShowQuickSearch(false);
                              }}
                            >
                              <NotebookPen size={15} />
                              <span>
                                <strong>
                                  {candidateName(note.candidateId)}
                                </strong>
                                <small>{note.body}</small>
                              </span>
                            </button>
                          ))}
                        </section>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell size={18} />
              <span />
            </button>
            <span className="topbar-avatar">MC</span>
          </div>
        </header>
        <div className="page-content">
          {view === "overview" && (
            <>
              <section className="page-heading overview-heading">
                <div>
                  <p className="eyebrow">{dashboardDateLabel}</p>
                  <h1>
                    Today, in focus<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    Calls due, follow-ups to send, and people worth a fresh
                    look.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setShowCandidateForm(true)}
                >
                  <Plus size={17} /> Add candidate
                </button>
              </section>
              <section className="stats-row" aria-label="Recruiting summary">
                <div className="stat-block">
                  <span className="stat-label">Active candidates</span>
                  <div className="stat-value">
                    {
                      candidates.filter(
                        (candidate) => candidate.stage !== "Hired",
                      ).length
                    }
                    <span className="stat-change">
                      <ArrowUpRight size={14} /> 12%
                    </span>
                  </div>
                  <span className="stat-caption">vs. last month</span>
                </div>
                <div className="stat-block">
                  <span className="stat-label">In interviews</span>
                  <div className="stat-value">
                    {candidates
                      .filter((candidate) => candidate.stage === "Interview")
                      .length.toString()
                      .padStart(2, "0")}
                    <span className="stat-note">across 3 roles</span>
                  </div>
                  <span className="stat-caption">Ready for your review</span>
                </div>
                <div className="stat-block">
                  <span className="stat-label">Follow-ups due</span>
                  <div className="stat-value">
                    {pendingReminders.length.toString().padStart(2, "0")}
                    <span className="stat-overdue">
                      <Clock3 size={13} /> today
                    </span>
                  </div>
                  <span className="stat-caption">
                    Keep conversations moving
                  </span>
                </div>
                <div className="stat-block">
                  <span className="stat-label">Time to hire</span>
                  <div className="stat-value">
                    24<span className="stat-unit">days</span>
                    <span className="stat-change">
                      <ArrowDownToLine size={14} /> 8%
                    </span>
                  </div>
                  <span className="stat-caption">Median · this quarter</span>
                </div>
              </section>
              <div className="overview-grid">
                <section className="section-panel pipeline-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Your talent funnel</p>
                      <h2>Pipeline at a glance</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setView("candidates")}
                    >
                      View candidates <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="pipeline-summary">
                    <span>{candidates.length} total candidates</span>
                    <span className="pipeline-period">
                      <span className="live-dot" /> Updated just now
                    </span>
                  </div>
                  <div className="pipeline-stages">
                    {pipelineStages.map((stage, index) => {
                      const count = candidates.filter(
                        (candidate) => candidate.stage === stage,
                      ).length;
                      const stageCandidates = candidates
                        .filter((candidate) => candidate.stage === stage)
                        .slice(0, 2);
                      return (
                        <button
                          className={`pipeline-stage stage-${index}`}
                          key={stage}
                          onClick={() => {
                            setActiveStage(stage);
                            setView("candidates");
                          }}
                        >
                          <span className="stage-top">
                            <span>{stage}</span>
                            <strong>{count.toString().padStart(2, "0")}</strong>
                          </span>
                          <span className="stage-track">
                            <span
                              style={{
                                width: `${Math.max(16, (count / Math.max(candidates.length, 1)) * 100)}%`,
                              }}
                            />
                          </span>
                          <span className="stage-people">
                            {stageCandidates.length ? (
                              stageCandidates.map((candidate) => (
                                <span
                                  key={candidate.id}
                                  className="mini-avatar"
                                  title={candidate.name}
                                >
                                  {initials(candidate.name)}
                                </span>
                              ))
                            ) : (
                              <span className="empty-stage">
                                No candidates yet
                              </span>
                            )}
                            {stageCandidates.length > 0 && (
                              <span className="stage-more">
                                {count > 2 ? `+${count - 2}` : " "}
                              </span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
                <section className="section-panel reminders-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Don’t let a good thing go quiet</p>
                      <h2>Coming up</h2>
                    </div>
                    <button
                      className="icon-button subtle-icon"
                      onClick={() => setShowReminderForm(true)}
                      aria-label="Add reminder"
                      title="Add reminder"
                    >
                      <Plus size={17} />
                    </button>
                  </div>
                  {pendingReminders.length === 0 ? (
                    <div className="empty-state compact-empty">
                      Nothing on the calendar.{" "}
                      <button onClick={() => setShowReminderForm(true)}>
                        Add a reminder
                      </button>
                    </div>
                  ) : (
                    <div className="reminder-list">
                      {pendingReminders.slice(0, 3).map((reminder) => (
                        <ReminderRow
                          key={reminder.id}
                          reminder={reminder}
                          name={candidateName(reminder.candidateId)}
                          onComplete={completeReminder}
                          onOpen={() => setView("reminders")}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    className="text-button reminder-link"
                    onClick={() => setView("reminders")}
                  >
                    See all reminders <ArrowRight size={15} />
                  </button>
                </section>
                <section className="section-panel recent-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Fresh faces</p>
                      <h2>Recently sourced</h2>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => setView("candidates")}
                    >
                      All candidates <ArrowRight size={15} />
                    </button>
                  </div>
                  <div className="recent-list">
                    {candidates.slice(0, 4).map((candidate) => (
                      <CandidateRow
                        key={candidate.id}
                        candidate={candidate}
                        onClick={() => {
                          setView("candidates");
                          setCandidateLayout("list");
                          setSelectedCandidate(candidate);
                        }}
                        onCall={() => openDialer(candidate)}
                      />
                    ))}
                  </div>
                </section>
                <section className="section-panel stale-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">Keep the conversation warm</p>
                      <h2>Could use a check-in</h2>
                    </div>
                    <Clock3 size={17} className="section-heading-icon" />
                  </div>
                  {staleCandidates.length === 0 ? (
                    <div className="empty-state">Everyone has a recent next step.</div>
                  ) : (
                    <div className="recent-list">
                      {staleCandidates.map((candidate) => (
                        <CandidateRow
                          key={candidate.id}
                          candidate={candidate}
                          onClick={() => {
                            setView("candidates");
                            setCandidateLayout("list");
                            setSelectedCandidate(candidate);
                          }}
                          onCall={() => openDialer(candidate)}
                        />
                      ))}
                    </div>
                  )}
                </section>
                <section className="section-panel activity-panel">
                  <div className="section-heading">
                    <div>
                      <p className="eyebrow">
                        A little context goes a long way
                      </p>
                      <h2>Latest notes</h2>
                    </div>
                    <NotebookPen size={18} className="section-heading-icon" />
                  </div>
                  {notes.length === 0 ? (
                    <div className="empty-state">
                      Your saved notes will show up here.
                    </div>
                  ) : (
                    <div className="activity-list">
                      {notes.slice(0, 3).map((note) => (
                        <button
                          className="activity-row"
                          key={note.id}
                          onClick={() => {
                            const found = candidates.find(
                              (candidate) => candidate.id === note.candidateId,
                            );
                            if (found) {
                              setView("candidates");
                              setCandidateLayout("list");
                              setSelectedCandidate(found);
                            }
                          }}
                        >
                          <span className="activity-avatar">
                            {initials(candidateName(note.candidateId))}
                          </span>
                          <span className="activity-copy">
                            <strong>
                              {candidateName(note.candidateId)}{" "}
                              <span>· {formatTimelineDate(note.createdAt)}</span>
                            </strong>
                            <span className="activity-note">{note.body}</span>
                            <span className="tag-list">
                              {note.tags.map((tag) => (
                                <span className="note-tag" key={tag}>
                                  {tag}
                                </span>
                              ))}
                            </span>
                          </span>
                          <ChevronRight size={15} />
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>
              <footer className="page-footer">
                <span>Wessehire demo workspace</span>
                <span>Recruiting, with room to breathe.</span>
              </footer>
            </>
          )}

          {view === "candidates" && (
            <>
              <section className="page-heading candidates-heading">
                <div>
                  <p className="eyebrow">Your people, all in one place</p>
                  <h1>
                    Candidate pipeline<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    Source thoughtfully. Keep every next step visible.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setShowCandidateForm(true)}
                >
                  <Plus size={17} /> Add candidate
                </button>
              </section>
              <div className="candidate-toolbar">
                <div className="stage-filters">
                  <button
                    className={
                      activeStage === "All candidates"
                        ? "filter-pill selected"
                        : "filter-pill"
                    }
                    onClick={() => setActiveStage("All candidates")}
                  >
                    All candidates <span>{candidates.length}</span>
                  </button>
                  {pipelineStages.map((stage) => (
                    <button
                      className={
                        activeStage === stage
                          ? "filter-pill selected"
                          : "filter-pill"
                      }
                      key={stage}
                      onClick={() => setActiveStage(stage)}
                    >
                      {stage}
                      <span>
                        {
                          candidates.filter(
                            (candidate) => candidate.stage === stage,
                          ).length
                        }
                      </span>
                    </button>
                  ))}
                </div>
                <div className="quick-filters">
                  <label>
                    Visa
                    <select
                      value={visaFilter}
                      onChange={(event) => setVisaFilter(event.target.value)}
                    >
                      <option>All visa statuses</option>
                      {Array.from(new Set(candidates.map((candidate) => candidate.visaStatus).filter(Boolean))).map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Available
                    <select
                      value={availabilityFilter}
                      onChange={(event) => setAvailabilityFilter(event.target.value)}
                    >
                      <option>Any availability</option>
                      {Array.from(new Set(candidates.map((candidate) => candidate.availability).filter(Boolean))).map((availability) => (
                        <option key={availability}>{availability}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="toolbar-actions">
                  <button
                    className="icon-button subtle-icon"
                    onClick={() => {
                      setStageDraft(pipelineStages.join(", "));
                      setShowStageEditor(true);
                    }}
                    aria-label="Customize pipeline stages"
                    title="Customize stages"
                  >
                    <Settings2 size={16} />
                  </button>
                  <button
                    className="icon-button subtle-icon"
                    onClick={() => setCandidateLayout("list")}
                    aria-label="List view"
                    title="List view"
                  >
                    <List size={16} />
                  </button>
                  <button
                    className="icon-button subtle-icon"
                    onClick={() => setCandidateLayout("board")}
                    aria-label="Board view"
                    title="Board view"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    className="button button-quiet"
                    onClick={saveCurrentSearch}
                  >
                    <Search size={14} /> Save smart list
                  </button>
                  <button
                    className="button button-quiet"
                    onClick={() =>
                      openToast(
                        "Filter candidates using the stage and search controls.",
                      )
                    }
                  >
                    <Filter size={15} /> Filters
                  </button>
                  {selectedCandidateIds.length > 0 && (
                    <button
                      className="button button-primary"
                      onClick={() => setShowOutreach(true)}
                    >
                      <Mail size={14} /> Draft outreach (
                      {selectedCandidateIds.length})
                    </button>
                  )}
                </div>
              </div>
              {savedSearches.length > 0 && (
                <div className="saved-search-row">
                  <span>SMART LISTS</span>
                  {savedSearches.map((savedSearch) => (
                    <button
                      className="filter-pill"
                      key={savedSearch.id}
                      onClick={() => {
                        setSearch(savedSearch.query);
                        setVisaFilter(savedSearch.visaStatus || "All visa statuses");
                        setAvailabilityFilter(savedSearch.availability || "Any availability");
                      }}
                    >
                      <Search size={12} />
                      {savedSearch.name}
                    </button>
                  ))}
                </div>
              )}
              {candidateLayout === "board" ? (
                <div className="kanban-board candidate-kanban">
                  {pipelineStages.map((stage) => {
                    const stageCandidates = filteredCandidates.filter(
                      (candidate) => candidate.stage === stage,
                    );
                    return (
                      <div
                        className="kanban-column"
                        key={stage}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                          const candidateId =
                            event.dataTransfer.getData("text/candidate-id");
                          if (candidateId) updateStage(candidateId, stage);
                        }}
                      >
                        <div className="kanban-column-heading">
                          <span>{stage}</span>
                          <span>{stageCandidates.length}</span>
                        </div>
                        {stageCandidates.map((candidate) => (
                          <article
                            className="kanban-card"
                            key={candidate.id}
                            draggable
                            onDragStart={(event) =>
                              event.dataTransfer.setData(
                                "text/candidate-id",
                                candidate.id,
                              )
                            }
                          >
                            <button
                              className="kanban-card-name"
                              onClick={() => {
                                setCandidateLayout("list");
                                setSelectedCandidate(candidate);
                              }}
                            >
                              {candidate.name}
                            </button>
                            <span>{candidate.role}</span>
                            <span>{candidate.location}</span>
                          </article>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <section className="candidate-layout">
                  <div className="candidate-table-wrap">
                    <div className="table-heading">
                      <span />
                      <span>Candidate</span>
                      <span>Target role</span>
                      <span>Source</span>
                      <span>Stage</span>
                      <span>Fit</span>
                      <span />
                    </div>
                    {filteredCandidates.length === 0 ? (
                      <div className="empty-state table-empty">
                        No candidates match that search. Try another name or
                        role.
                      </div>
                    ) : (
                      filteredCandidates.map((candidate) => (
                        <CandidateTableRow
                          key={candidate.id}
                          candidate={candidate}
                          stages={pipelineStages}
                          selected={selectedCandidate?.id === candidate.id}
                          checked={selectedCandidateIds.includes(candidate.id)}
                          onToggle={() =>
                            toggleCandidateSelection(candidate.id)
                          }
                          onClick={() => setSelectedCandidate(candidate)}
                          onCall={() => openDialer(candidate)}
                          onStageChange={(stage) =>
                            updateStage(candidate.id, stage)
                          }
                        />
                      ))
                    )}
                    <div className="table-footer">
                      <span>
                        Showing {filteredCandidates.length} of{" "}
                        {candidates.length} candidates
                      </span>
                      <button
                        className="text-button"
                        onClick={() => setShowCandidateForm(true)}
                      >
                        <Plus size={14} /> Add another
                      </button>
                    </div>
                  </div>
                  {selectedCandidate && (
                    <CandidateProfile
                      candidate={selectedCandidate}
                      notes={notes.filter(
                        (note) => note.candidateId === selectedCandidate.id,
                      )}
                      reminders={reminders.filter(
                        (reminder) =>
                          reminder.candidateId === selectedCandidate.id,
                      )}
                      submissions={submissions.filter(
                        (submission) =>
                          submission.candidateId === selectedCandidate.id,
                      )}
                      stages={pipelineStages}
                      onClose={() => setSelectedCandidate(null)}
                      onCall={() => openDialer(selectedCandidate)}
                      onSubmit={() => openSubmission(selectedCandidate.id)}
                      onStageChange={(stage) =>
                        updateStage(selectedCandidate.id, stage)
                      }
                      onReminder={() => {
                        setReminderDraft((current) => ({
                          ...current,
                          candidateId: selectedCandidate.id,
                        }));
                        setShowReminderForm(true);
                      }}
                    />
                  )}
                </section>
              )}
              <footer className="page-footer">
                <span>Wessehire demo workspace</span>
                <span>
                  Resume files are parsed in your browser and aren’t uploaded.
                </span>
              </footer>
            </>
          )}

          {view === "reminders" && (
            <>
              <section className="page-heading candidates-heading">
                <div>
                  <p className="eyebrow">Submittals and follow-ups, on time</p>
                  <h1>
                    Reminders<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    Never miss a submission deadline or candidate check-in.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setShowReminderForm(true)}
                >
                  <Plus size={17} /> New reminder
                </button>
              </section>
              <section className="reminder-page-list">
                <div className="reminder-page-heading">
                  <div>
                    <CalendarDays size={18} />
                    <h2>Upcoming follow-ups</h2>
                  </div>
                  <span>{pendingReminders.length} open</span>
                </div>
                {pendingReminders.length === 0 ? (
                  <div className="empty-state">
                    All caught up. Add a reminder when there’s a next step to
                    remember.
                  </div>
                ) : (
                  pendingReminders.map((reminder) => (
                    <ReminderRow
                      key={reminder.id}
                      reminder={reminder}
                      name={candidateName(reminder.candidateId)}
                      onComplete={completeReminder}
                      onOpen={() => {
                        const candidate = candidates.find(
                          (entry) => entry.id === reminder.candidateId,
                        );
                        if (candidate) {
                          setView("candidates");
                          setSelectedCandidate(candidate);
                        }
                      }}
                      expanded
                    />
                  ))
                )}
                {reminders.some((reminder) => reminder.done) && (
                  <div className="completed-reminders">
                    <p>COMPLETED</p>
                    {reminders
                      .filter((reminder) => reminder.done)
                      .map((reminder) => (
                        <div className="completed-reminder" key={reminder.id}>
                          <CheckCircle2 size={17} />
                          <span>{reminder.title}</span>
                          <small>{candidateName(reminder.candidateId)}</small>
                        </div>
                      ))}
                  </div>
                )}
              </section>
              <footer className="page-footer">
                <span>Wessehire demo workspace</span>
                <span>Follow-through is a recruiting superpower.</span>
              </footer>
            </>
          )}

          {view === "jobs" && (
            <>
              <section className="page-heading candidates-heading">
                <div>
                  <p className="eyebrow">Full-desk recruiting</p>
                  <h1>
                    Job orders<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    Every opening, client, fee, and candidate in one working
                    view.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setShowJobForm(true)}
                >
                  <Plus size={17} /> Add job order
                </button>
              </section>
              <div className="job-switcher">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    className={
                      selectedJobId === job.id
                        ? "job-switch active"
                        : "job-switch"
                    }
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <span>{job.title}</span>
                    <small>
                      {clients.find((client) => client.id === job.clientId)
                        ?.name ?? "Client"}
                    </small>
                  </button>
                ))}
              </div>
              {jobs
                .filter((job) => job.id === selectedJobId)
                .map((job) => (
                  <section className="job-board" key={job.id}>
                    <div className="job-board-heading">
                      <div>
                        <span className="job-open-pill">OPEN</span>
                        <strong>{job.title}</strong>
                        <span>{job.location}</span>
                      </div>
                      <button
                        className="button button-outline"
                        onClick={() => setView("clients")}
                      >
                        <Building2 size={14} />{" "}
                        {
                          clients.find((client) => client.id === job.clientId)
                            ?.name
                        }
                      </button>
                    </div>
                    <div className="job-meta-row">
                      <span>
                        <strong>{job.fee}%</strong> placement fee
                      </span>
                      <span>
                        <strong>{job.split}%</strong> split
                      </span>
                      <span>
                        Partner <strong>{job.partner}</strong>
                      </span>
                      <span>
                        {
                          candidates.filter(
                            (candidate) =>
                              candidate.role === job.title ||
                              candidate.jobId === job.id,
                          ).length
                        }{" "}
                        candidates
                      </span>
                      <button
                        className="text-button"
                        onClick={() => {
                          setJobDraft({
                            ...jobDraft,
                            title: job.title,
                            clientId: job.clientId,
                            location: job.location,
                          });
                          setShowJobForm(true);
                        }}
                      >
                        Edit job details
                      </button>
                    </div>
                    <div className="kanban-board">
                      {pipelineStages.map((stage) => {
                        const stageCandidates = candidates.filter(
                          (candidate) =>
                            (candidate.role === job.title ||
                              candidate.jobId === job.id) &&
                            candidate.stage === stage,
                        );
                        return (
                          <div
                            className="kanban-column"
                            key={stage}
                            onDragOver={(event) => event.preventDefault()}
                            onDrop={(event) => {
                              const candidateId =
                                event.dataTransfer.getData("text/candidate-id");
                              if (candidateId) updateStage(candidateId, stage);
                            }}
                          >
                            <div className="kanban-column-heading">
                              <span>{stage}</span>
                              <span>{stageCandidates.length}</span>
                            </div>
                            {stageCandidates.map((candidate) => (
                              <article
                                className="kanban-card"
                                key={candidate.id}
                                draggable
                                onDragStart={(event) =>
                                  event.dataTransfer.setData(
                                    "text/candidate-id",
                                    candidate.id,
                                  )
                                }
                              >
                                <button
                                  className="kanban-card-name"
                                  onClick={() => {
                                    setView("candidates");
                                    setCandidateLayout("list");
                                    setSelectedCandidate(candidate);
                                  }}
                                >
                                  {candidate.name}
                                </button>
                                <span>{candidate.location}</span>
                                <span className="fit-caption">
                                  <Sparkles size={11} /> Local fit estimate
                                  <strong>{candidateFit(candidate, job)}%</strong>
                                </span>
                                <div>
                                  <span className="source-label">
                                    {candidate.source}
                                  </span>
                                  <button
                                    className="icon-button row-action"
                                    onClick={() => openSubmission(candidate.id)}
                                    title="Build submission"
                                    aria-label={`Build submission for ${candidate.name}`}
                                  >
                                    <ClipboardList size={14} />
                                  </button>
                                </div>
                              </article>
                            ))}
                            {stageCandidates.length === 0 && (
                              <p className="kanban-empty">
                                Drop a candidate here
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
            </>
          )}

          {view === "clients" && (
            <>
              <section className="page-heading candidates-heading">
                <div>
                  <p className="eyebrow">Relationships make the desk</p>
                  <h1>
                    Client CRM<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    Keep hiring contacts, open roles, fee terms, and next steps
                    together.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => setShowClientForm(true)}
                >
                  <Plus size={17} /> Add client
                </button>
              </section>
              <div className="client-grid">
                {clients.map((client) => (
                  <article
                    className={
                      selectedClientId === client.id
                        ? "client-card selected-client-card"
                        : "client-card"
                    }
                    key={client.id}
                  >
                    <div className="client-card-head">
                      <span className="client-monogram">
                        {initials(client.name)}
                      </span>
                      <span
                        className={
                          client.relationship === "Active"
                            ? "client-state active"
                            : "client-state"
                        }
                      >
                        {client.relationship}
                      </span>
                    </div>
                    <h2>{client.name}</h2>
                    <p>{client.industry}</p>
                    <div className="client-contact">
                      <strong>{client.contact}</strong>
                      <span>{client.email}</span>
                    </div>
                    <div className="client-metrics">
                      <span>
                        <strong>{client.openRoles}</strong> open roles
                      </span>
                      <span>
                        <strong>{client.fee}%</strong> fee
                      </span>
                    </div>
                    <button
                      className="text-button"
                      onClick={() => {
                        const clientJob = jobs.find(
                          (job) => job.clientId === client.id,
                        );
                        if (clientJob) {
                          setSelectedJobId(clientJob.id);
                          setView("jobs");
                        } else setView("jobs");
                      }}
                    >
                      View job orders <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}

          {view === "submissions" && (
            <>
              <section className="page-heading candidates-heading">
                <div>
                  <p className="eyebrow">Thoughtful candidate presentation</p>
                  <h1>
                    Submissions<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    A concise narrative, target compensation, and a clear client
                    handoff.
                  </p>
                </div>
                <button
                  className="button button-primary"
                  onClick={() => openSubmission()}
                >
                  <Plus size={17} /> Build submission
                </button>
              </section>
              <div className="submission-list">
                {submissions.length === 0 ? (
                  <div className="empty-state">
                    No submissions yet. Build one from a candidate profile or
                    start here.
                  </div>
                ) : (
                  submissions.map((submission) => {
                    const candidate = candidates.find(
                      (item) => item.id === submission.candidateId,
                    );
                    const job = jobs.find(
                      (item) => item.id === submission.jobId,
                    );
                    const client = clients.find(
                      (item) => item.id === job?.clientId,
                    );
                    return (
                      <article className="submission-card" key={submission.id}>
                        <div className="submission-card-top">
                          <span className="submission-icon">
                            <ClipboardList size={18} />
                          </span>
                          <span className="submission-status">
                            {submission.status}
                          </span>
                          <span className="submission-date">
                            {submission.createdAt}
                          </span>
                        </div>
                        <h2>
                          {candidate?.name ?? "Candidate"} <span>for</span>{" "}
                          {job?.title ?? "Role"}
                        </h2>
                        <p className="submission-client">
                          {client?.name ?? "Client"} ·{" "}
                          {submission.targetComp ||
                            "Target compensation not set"}
                        </p>
                        <p className="submission-narrative">
                          {submission.narrative}
                        </p>
                        <div className="submission-card-actions">
                          <button
                            className="button button-outline"
                            onClick={() => {
                              setSubmissionDraft(submission);
                              setShowSubmissionForm(true);
                            }}
                          >
                            Edit narrative
                          </button>
                          <button
                            className="button button-quiet"
                            onClick={() => {
                              setSubmissions((current) =>
                                current.map((item) =>
                                  item.id === submission.id
                                    ? { ...item, status: "Sent" }
                                    : item,
                                ),
                              );
                              openToast("Submission marked as sent.");
                            }}
                          >
                            <Send size={14} /> Mark sent
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </>
          )}

          {view === "reports" && (
            <>
              <section className="page-heading candidates-heading">
                <div>
                  <p className="eyebrow">Your desk, in numbers</p>
                  <h1>
                    Reporting<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    A live snapshot of sourcing, submissions, interviews, and
                    placements.
                  </p>
                </div>
                <button
                  className="button button-outline"
                  onClick={downloadReport}
                >
                  <Download size={15} /> Export CSV
                </button>
              </section>
              <div className="report-grid">
                <article className="report-tile">
                  <span>Candidates sourced</span>
                  <strong>{candidates.length}</strong>
                  <small>
                    Across{" "}
                    {
                      new Set(candidates.map((candidate) => candidate.source))
                        .size
                    }{" "}
                    sources
                  </small>
                </article>
                <article className="report-tile">
                  <span>Open job orders</span>
                  <strong>
                    {jobs.filter((job) => job.status === "Open").length}
                  </strong>
                  <small>Across {clients.length} client accounts</small>
                </article>
                <article className="report-tile">
                  <span>Submissions</span>
                  <strong>{submissions.length}</strong>
                  <small>
                    {
                      submissions.filter(
                        (submission) => submission.status === "Sent",
                      ).length
                    }{" "}
                    sent to clients
                  </small>
                </article>
                <article className="report-tile">
                  <span>Interviews</span>
                  <strong>
                    {
                      candidates.filter(
                        (candidate) => candidate.stage === "Interview",
                      ).length
                    }
                  </strong>
                  <small>Currently in progress</small>
                </article>
              </div>
              <section className="report-config">
                <div>
                  <strong>Report fields</strong>
                  <span>Choose columns for your CSV export.</span>
                </div>
                <div className="report-field-options">
                  {["Candidate", "Role", "Client", "Stage", "Source", "Visa status", "Target compensation", "Availability"].map((column) => (
                    <label key={column}>
                      <input
                        type="checkbox"
                        checked={reportColumns.includes(column)}
                        onChange={() => setReportColumns((current) => current.includes(column) ? current.filter((item) => item !== column) : [...current, column])}
                      />
                      {column}
                    </label>
                  ))}
                </div>
              </section>
              <section className="section-panel report-breakdown">
                <div className="section-heading">
                  <div>
                    <p className="eyebrow">Pipeline distribution</p>
                    <h2>Candidates by stage</h2>
                  </div>
                  <TrendingUp size={18} className="section-heading-icon" />
                </div>
                {pipelineStages.map((stage, index) => {
                  const count = candidates.filter(
                    (candidate) => candidate.stage === stage,
                  ).length;
                  return (
                    <div className="report-bar-row" key={stage}>
                      <span>{stage}</span>
                      <span className="report-bar">
                        <span
                          className={`report-bar-fill report-color-${index % 5}`}
                          style={{
                            width: `${Math.max(3, (count / Math.max(candidates.length, 1)) * 100)}%`,
                          }}
                        />
                      </span>
                      <strong>{count}</strong>
                    </div>
                  );
                })}
              </section>
            </>
          )}

          {view === "integrations" && (
            <>
              <section className="page-heading candidates-heading">
                <div>
                  <p className="eyebrow">Connected, not complicated</p>
                  <h1>
                    Integrations<span className="heading-dot">.</span>
                  </h1>
                  <p className="heading-subtitle">
                    An open ecosystem for the tools your desk already depends
                    on.
                  </p>
                </div>
                <button
                  className="button button-outline"
                  onClick={() =>
                    openToast(
                      "API access is part of the production integration plan.",
                    )
                  }
                >
                  <Link2 size={15} /> API access
                </button>
              </section>
              <div className="integration-grid">
                <IntegrationCard
                  icon={<Building2 size={19} />}
                  name="Broadbean"
                  category="Job distribution"
                  description="Connect job posting workflows and access a catalog of 7,000+ job boards through your Broadbean account."
                  action="Connect Broadbean"
                  onConnect={() =>
                    openToast(
                      "Broadbean connector preview. Production credentials are required.",
                    )
                  }
                />
                <IntegrationCard
                  icon={<Mail size={19} />}
                  name="Email & calendar"
                  category="Communication"
                  description="Prepare outreach templates and keep candidate conversations close to the record."
                  action="Connect email"
                  onConnect={() =>
                    openToast(
                      "Email sync requires a production OAuth connection.",
                    )
                  }
                />
                <IntegrationCard
                  icon={<Link2 size={19} />}
                  name="Open API & webhooks"
                  category="Developer platform"
                  description="Build custom integrations for staffing workflows, reporting, and record synchronization."
                  action="View API plan"
                  onConnect={() =>
                    openToast(
                      "API documentation will be available with the production backend.",
                    )
                  }
                />
                <IntegrationCard
                  icon={<UsersRound size={19} />}
                  name="LinkedIn sourcing"
                  category="Candidate sourcing"
                  description="Paste a public profile URL or resume text to create a structured candidate record."
                  action="Paste a profile"
                  onConnect={() => {
                    setView("candidates");
                    setShowCandidateForm(true);
                  }}
                />
              </div>
              <p className="integration-footnote">
                Connectors shown here are product previews. No external account
                is linked in this local demo.
              </p>
            </>
          )}
        </div>
      </main>

      {showCandidateForm && (
        <Modal
          title="Add a candidate"
          subtitle="Start with a resume or add their details by hand."
          onClose={() => {
            setShowCandidateForm(false);
            resetCandidateForm();
          }}
        >
          <form className="modal-form" onSubmit={saveCandidate}>
            <div
              className="resume-dropzone"
              onClick={() => uploadRef.current?.click()}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                void handleResumeUpload(event.dataTransfer.files[0]);
              }}
            >
              <div className="upload-icon">
                <Upload size={20} />
              </div>
              <div>
                <strong>{resumeName || "Drop a resume here or browse"}</strong>
                <span>
                  PDF, DOCX or TXT · details are extracted in this browser
                </span>
              </div>
              <button
                type="button"
                className="button button-outline"
                onClick={(event) => {
                  event.stopPropagation();
                  uploadRef.current?.click();
                }}
              >
                Browse
              </button>
              <input
                ref={uploadRef}
                type="file"
                accept=".pdf,.docx,.txt,application/pdf"
                hidden
                onChange={(event) =>
                  void handleResumeUpload(event.target.files?.[0])
                }
              />
            </div>
            <label className="paste-profile-label">
              Paste resume text or LinkedIn profile summary
              <textarea
                className="submission-textarea paste-profile"
                value={pastedResume}
                onChange={(event) => handleResumePaste(event.target.value)}
                placeholder="Paste resume text or a public LinkedIn profile summary to extract the basics."
              />
            </label>
            <div className="form-grid">
              <label>
                Candidate name
                <input
                  autoFocus
                  value={candidateDraft.name}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      name: event.target.value,
                    })
                  }
                  placeholder="e.g. Jordan Lee"
                />
              </label>
              <label>
                Target role
                <input
                  value={candidateDraft.role}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      role: event.target.value,
                    })
                  }
                  placeholder="e.g. Product Designer"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={candidateDraft.email}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      email: event.target.value,
                    })
                  }
                  placeholder="name@email.com"
                />
              </label>
              <label>
                Phone
                <input
                  value={candidateDraft.phone}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      phone: event.target.value,
                    })
                  }
                  placeholder="+1 (555) 000-0000"
                />
              </label>
              <label>
                Location
                <input
                  value={candidateDraft.location}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      location: event.target.value,
                    })
                  }
                  placeholder="City, State"
                />
              </label>
              <label>
                Visa status
                <input
                  value={candidateDraft.visaStatus}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      visaStatus: event.target.value,
                    })
                  }
                  placeholder="US citizen, H-1B..."
                />
              </label>
              <label>
                Target compensation
                <input
                  value={candidateDraft.targetComp}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      targetComp: event.target.value,
                    })
                  }
                  placeholder="$180k base"
                />
              </label>
              <label>
                Relocation
                <input
                  value={candidateDraft.relocation}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      relocation: event.target.value,
                    })
                  }
                  placeholder="Open, not open..."
                />
              </label>
              <label>
                Availability
                <input
                  value={candidateDraft.availability}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      availability: event.target.value,
                    })
                  }
                  placeholder="2 weeks, immediate..."
                />
              </label>
              <label>
                LinkedIn / profile URL
                <input
                  type="url"
                  value={candidateDraft.profileUrl}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      profileUrl: event.target.value,
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                />
              </label>
              <label>
                Source
                <select
                  value={candidateDraft.source}
                  onChange={(event) =>
                    setCandidateDraft({
                      ...candidateDraft,
                      source: event.target.value,
                    })
                  }
                >
                  <option>LinkedIn</option>
                  <option>Referral</option>
                  <option>Wellfound</option>
                  <option>GitHub</option>
                  <option>Portfolio</option>
                  <option>Other</option>
                </select>
              </label>
            </div>
            {resumeText && (
              <div className="resume-extracted">
                <FileText size={15} />
                <span>
                  Resume text extracted ·{" "}
                  {resumeText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
                <button type="button" onClick={() => setResumeText("")}>
                  Remove
                </button>
              </div>
            )}
            {formError && <p className="form-error">{formError}</p>}
            <div className="modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => {
                  setShowCandidateForm(false);
                  resetCandidateForm();
                }}
              >
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                <UserRoundPlus size={16} /> Add to pipeline
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showClientForm && (
        <Modal
          title="Add a client"
          subtitle="Capture the people and terms behind the relationship."
          onClose={() => setShowClientForm(false)}
        >
          <form className="modal-form" onSubmit={saveClient}>
            <label>
              Company
              <input
                required
                value={clientDraft.name}
                onChange={(event) =>
                  setClientDraft({ ...clientDraft, name: event.target.value })
                }
                placeholder="Company name"
              />
            </label>
            <div className="form-grid">
              <label>
                Industry
                <input
                  value={clientDraft.industry}
                  onChange={(event) =>
                    setClientDraft({
                      ...clientDraft,
                      industry: event.target.value,
                    })
                  }
                  placeholder="Technology"
                />
              </label>
              <label>
                Recruiting fee (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={clientDraft.fee}
                  onChange={(event) =>
                    setClientDraft({ ...clientDraft, fee: event.target.value })
                  }
                />
              </label>
              <label>
                Primary contact
                <input
                  value={clientDraft.contact}
                  onChange={(event) =>
                    setClientDraft({
                      ...clientDraft,
                      contact: event.target.value,
                    })
                  }
                  placeholder="Hiring manager"
                />
              </label>
              <label>
                Contact email
                <input
                  type="email"
                  value={clientDraft.email}
                  onChange={(event) =>
                    setClientDraft({
                      ...clientDraft,
                      email: event.target.value,
                    })
                  }
                  placeholder="name@company.com"
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowClientForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <Building2 size={15} /> Save client
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showJobForm && (
        <Modal
          title="Add a job order"
          subtitle="Tie the role to a client, fee, and recruiting partner."
          onClose={() => setShowJobForm(false)}
        >
          <form className="modal-form" onSubmit={saveJob}>
            <label>
              Job title
              <input
                required
                value={jobDraft.title}
                onChange={(event) =>
                  setJobDraft({ ...jobDraft, title: event.target.value })
                }
                placeholder="Senior Product Designer"
              />
            </label>
            <div className="form-grid">
              <label>
                Client
                <select
                  required
                  value={jobDraft.clientId}
                  onChange={(event) =>
                    setJobDraft({ ...jobDraft, clientId: event.target.value })
                  }
                >
                  <option value="">Choose a client</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Location
                <input
                  value={jobDraft.location}
                  onChange={(event) =>
                    setJobDraft({ ...jobDraft, location: event.target.value })
                  }
                  placeholder="Remote, US"
                />
              </label>
              <label>
                Placement fee (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={jobDraft.fee}
                  onChange={(event) =>
                    setJobDraft({ ...jobDraft, fee: event.target.value })
                  }
                />
              </label>
              <label>
                Partner split (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={jobDraft.split}
                  onChange={(event) =>
                    setJobDraft({ ...jobDraft, split: event.target.value })
                  }
                />
              </label>
              <label>
                Partner
                <input
                  value={jobDraft.partner}
                  onChange={(event) =>
                    setJobDraft({ ...jobDraft, partner: event.target.value })
                  }
                />
              </label>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowJobForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <BriefcaseBusiness size={15} /> Save job order
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showSubmissionForm && (
        <Modal
          title="Submission builder"
          subtitle="A client-ready narrative with target compensation only."
          onClose={() => setShowSubmissionForm(false)}
        >
          <form className="modal-form" onSubmit={saveSubmission}>
            <div className="form-grid">
              <label>
                Candidate
                <select
                  required
                  value={submissionDraft.candidateId}
                  onChange={(event) =>
                    setSubmissionDraft({
                      ...submissionDraft,
                      candidateId: event.target.value,
                    })
                  }
                >
                  {candidates.map((candidate) => (
                    <option key={candidate.id} value={candidate.id}>
                      {candidate.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Job order
                <select
                  required
                  value={submissionDraft.jobId}
                  onChange={(event) =>
                    setSubmissionDraft({
                      ...submissionDraft,
                      jobId: event.target.value,
                    })
                  }
                >
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id}>
                      {job.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <label>
              Client narrative
              <textarea
                className="submission-textarea"
                maxLength={1600}
                value={submissionDraft.narrative}
                onChange={(event) =>
                  setSubmissionDraft({
                    ...submissionDraft,
                    narrative: event.target.value,
                  })
                }
                placeholder="Summarize relevant experience, motivation, and fit."
              />
            </label>
            <div className="character-count">
              {submissionDraft.narrative.length} / 1,600 characters
            </div>
            <label>
              Target compensation
              <input
                value={submissionDraft.targetComp}
                onChange={(event) =>
                  setSubmissionDraft({
                    ...submissionDraft,
                    targetComp: event.target.value,
                  })
                }
                placeholder="$180,000 base"
              />
            </label>
            <div className="assist-callout">
              <Sparkles size={15} />
              <span>
                Draft seeded from the candidate profile and notes. Review before
                sharing with a client.
              </span>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowSubmissionForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <ClipboardList size={15} /> Save submission
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showStageEditor && (
        <Modal
          title="Customize pipeline"
          subtitle="Separate stages with commas. These stages apply to jobs and candidate boards."
          onClose={() => setShowStageEditor(false)}
        >
          <form className="modal-form" onSubmit={savePipelineStages}>
            <label>
              Pipeline stages
              <input
                autoFocus
                value={stageDraft}
                onChange={(event) => setStageDraft(event.target.value)}
                placeholder="New, Screen, Interview, Offer, Hired"
              />
            </label>
            <p className="form-hint">
              Candidates in removed stages move to your first stage.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowStageEditor(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <Settings2 size={15} /> Save stages
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showOutreach && (
        <Modal
          title={`Outreach draft · ${selectedCandidateIds.length} candidates`}
          subtitle="Prepare a reusable email draft. Nothing is sent from this local demo."
          onClose={() => setShowOutreach(false)}
        >
          <form
            className="modal-form"
            onSubmit={(event) => {
              event.preventDefault();
              saveOutreachDrafts();
            }}
          >
            <label>
              Email template
              <textarea
                className="submission-textarea"
                value={outreachDraft}
                onChange={(event) => setOutreachDraft(event.target.value)}
              />
            </label>
            <p className="form-hint">
              Personalization tokens: {"{{first_name}}"}, {"{{role}}"}.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowOutreach(false)}
              >
                Cancel
              </button>
              <button type="submit" className="button button-primary">
                <Mail size={15} /> Save drafts to timelines
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showReminderForm && (
        <Modal
          title="Create a reminder"
          subtitle="Give the next submission or conversation a date."
          onClose={() => setShowReminderForm(false)}
        >
          <form className="modal-form" onSubmit={saveReminder}>
            <label>
              Candidate
              <select
                required
                value={reminderDraft.candidateId}
                onChange={(event) =>
                  setReminderDraft({
                    ...reminderDraft,
                    candidateId: event.target.value,
                  })
                }
              >
                <option value="">Choose a candidate</option>
                {candidates.map((candidate) => (
                  <option value={candidate.id} key={candidate.id}>
                    {candidate.name} · {candidate.role}
                  </option>
                ))}
              </select>
            </label>
            <label>
              What needs to happen?
              <input
                required
                value={reminderDraft.title}
                onChange={(event) =>
                  setReminderDraft({
                    ...reminderDraft,
                    title: event.target.value,
                  })
                }
                placeholder="e.g. Submit resume to hiring manager"
              />
            </label>
            <label>
              Date and time
              <input
                required
                type="datetime-local"
                value={reminderDraft.when}
                onChange={(event) =>
                  setReminderDraft({
                    ...reminderDraft,
                    when: event.target.value,
                  })
                }
              />
            </label>
            <div className="modal-actions">
              <button
                type="button"
                className="button button-quiet"
                onClick={() => setShowReminderForm(false)}
              >
                Cancel
              </button>
              <button className="button button-primary" type="submit">
                <CalendarClock size={16} /> Save reminder
              </button>
            </div>
          </form>
        </Modal>
      )}

      {callCandidate && (
        <Modal
          title={
            callStarted
              ? `Call with ${callCandidate.name}`
              : `Call ${callCandidate.name}`
          }
          subtitle={callStarted ? "Demo call in progress" : "Recruiter dialer"}
          onClose={closeCall}
          wide
        >
          <div className="call-layout">
            <section className="dialer-side">
              <div className="call-person">
                <span className="avatar avatar-large">
                  {initials(callCandidate.name)}
                </span>
                <strong>{callCandidate.name}</strong>
                <span>{callCandidate.role}</span>
                <span className="call-number">
                  <Phone size={14} />{" "}
                  {callCandidate.phone || "Add a phone number to this profile"}
                </span>
              </div>
              <div className="demo-status">
                <span className="demo-pill">
                  <span /> SIMULATED CALL
                </span>
                <span>
                  No phone connection or audio recording is made in this demo.
                </span>
              </div>
              <p className="dialer-label">DIALPAD</p>
              <div className="dialpad">
                {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "*",
                  "0",
                  "#",
                ].map((key) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => openToast(`Dialpad · ${key}`)}
                  >
                    {key}
                    <small>
                      {key === "2"
                        ? "ABC"
                        : key === "3"
                          ? "DEF"
                          : key === "4"
                            ? "GHI"
                            : key === "5"
                              ? "JKL"
                              : key === "6"
                                ? "MNO"
                                : key === "7"
                                  ? "PQRS"
                                  : key === "8"
                                    ? "TUV"
                                    : key === "9"
                                      ? "WXYZ"
                                      : ""}
                    </small>
                  </button>
                ))}
              </div>
              {!callStarted ? (
                <button
                  className="call-start-button"
                  disabled={!callCandidate.phone}
                  onClick={() => {
                    if (!recordingNoticeRead) {
                      openToast(
                        "Confirm that you have shared the recording notice first.",
                      );
                      return;
                    }
                    setCallStarted(true);
                  }}
                >
                  <PhoneCall size={17} /> Start simulated call
                </button>
              ) : (
                <button className="call-end-button" onClick={closeCall}>
                  <Phone size={17} /> End demo call
                </button>
              )}
            </section>
            <section className="call-notes-side">
              <div className="recording-disclosure">
                <div className="disclosure-symbol">
                  <Bell size={17} />
                </div>
                <div>
                  <strong>Recording disclosure</strong>
                  <p>
                    “Before we begin, I want to let you know this call is being
                    recorded for recruiting purposes. Is it okay to continue?”
                  </p>
                  <span>
                    Read this to the candidate and follow your organization’s
                    consent policy.
                  </span>
                </div>
              </div>
              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={recordingNoticeRead}
                  onChange={(event) =>
                    setRecordingNoticeRead(event.target.checked)
                  }
                />
                <span>I’ve shared the recording notice with the candidate</span>
              </label>
              <div className="note-editor-heading">
                <div>
                  <NotebookPen size={17} />
                  <strong>Call notes</strong>
                </div>
                <span>{callStarted ? "Ready to capture" : "Draft"}</span>
              </div>
              <div className="note-input-wrap">
                <textarea
                  value={noteDraft}
                  onChange={(event) => setNoteDraft(event.target.value)}
                  placeholder="Capture the details you’ll want to remember…"
                  aria-label="Call note"
                />
                <button
                  type="button"
                  className={listening ? "mic-button listening" : "mic-button"}
                  onClick={() =>
                    listening
                      ? recognitionRef.current?.stop()
                      : startVoiceNotes()
                  }
                  title={listening ? "Stop voice notes" : "Dictate note"}
                  aria-label={listening ? "Stop voice notes" : "Dictate note"}
                >
                  <Mic size={17} />
                </button>
              </div>
              {listening && (
                <p className="listening-indicator">
                  <span /> Listening · speak naturally
                </p>
              )}
              {awaitingNoteType && (
                <p className="voice-type-prompt" role="status">
                  What note type should I use? Say Call, Screen, Submittal, Comp,
                  or Client feedback.
                </p>
              )}
              <div className="note-assistant-actions">
                <span>LOCAL DEMO ASSIST</span>
                <button type="button" onClick={summarizeCallDraft}>
                  <Sparkles size={13} /> Summarize
                </button>
                <button
                  type="button"
                  onClick={() =>
                    noteDraft.trim()
                      ? speakText(noteDraft)
                      : openToast("Add a note before reading it aloud.")
                  }
                >
                  <Volume2 size={13} /> Read aloud
                </button>
              </div>
              <div className="note-controls">
                <label>
                  Note type
                  <select
                    aria-label="Note type"
                    value={selectedNoteType}
                    onChange={(event) =>
                      setSelectedNoteType(event.target.value)
                    }
                  >
                    {noteTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Tag
                  <select
                    aria-label="Note tag"
                    value={selectedTag}
                    onChange={(event) => setSelectedTag(event.target.value)}
                  >
                    {noteTags.map((tag) => (
                      <option key={tag}>{tag}</option>
                    ))}
                  </select>
                </label>
                <button
                  className="button button-primary"
                  onClick={() => saveCallNote()}
                  disabled={awaitingNoteType}
                >
                  <Send size={15} /> Save note
                </button>
              </div>
              <p className="privacy-note">
                <Check size={13} /> Notes save to this browser and appear in the
                candidate profile.
              </p>
            </section>
          </div>
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {toast}
        </div>
      )}
    </div>
  );
}

function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className={wide ? "modal-card modal-wide" : "modal-card"}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <button
            className="icon-button modal-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function ReminderRow({
  reminder,
  name,
  onComplete,
  onOpen,
  expanded = false,
}: {
  reminder: Reminder;
  name: string;
  onComplete: (id: string) => void;
  onOpen: () => void;
  expanded?: boolean;
}) {
  return (
    <div
      className={
        expanded ? "reminder-row reminder-row-expanded" : "reminder-row"
      }
    >
      <button
        className="reminder-check"
        onClick={() => onComplete(reminder.id)}
        aria-label={`Complete ${reminder.title}`}
      >
        <Check size={14} />
      </button>
      <button className="reminder-main" onClick={onOpen}>
        <span className="reminder-title">{reminder.title}</span>
        <span className="reminder-meta">
          <span>{name}</span>
          <span className="reminder-time">
            <Clock3 size={13} /> {formatReminder(reminder.when)}
          </span>
        </span>
      </button>
      <ChevronRight size={15} className="reminder-chevron" />
    </div>
  );
}

function CandidateRow({
  candidate,
  onClick,
  onCall,
}: {
  candidate: Candidate;
  onClick: () => void;
  onCall: () => void;
}) {
  return (
    <div className="recent-candidate-row">
      <button className="recent-candidate-main" onClick={onClick}>
        <span className="avatar">{initials(candidate.name)}</span>
        <span className="recent-candidate-copy">
          <strong>{candidate.name}</strong>
          <span>{candidate.role}</span>
        </span>
      </button>
      <span
        className={`stage-badge stage-badge-${candidate.stage.toLowerCase()}`}
      >
        {candidate.stage}
      </span>
      <button
        className="icon-button row-action"
        onClick={onCall}
        title={`Call ${candidate.name}`}
        aria-label={`Call ${candidate.name}`}
      >
        <Phone size={15} />
      </button>
    </div>
  );
}

function CandidateTableRow({
  candidate,
  stages,
  selected,
  checked,
  onToggle,
  onClick,
  onCall,
  onStageChange,
}: {
  candidate: Candidate;
  stages: Stage[];
  selected: boolean;
  checked: boolean;
  onToggle: () => void;
  onClick: () => void;
  onCall: () => void;
  onStageChange: (stage: Stage) => void;
}) {
  return (
    <div
      className={
        selected ? "candidate-table-row selected-row" : "candidate-table-row"
      }
    >
      <label className="candidate-select">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          aria-label={`Select ${candidate.name}`}
        />
      </label>
      <button className="table-candidate" onClick={onClick}>
        <span className="avatar">{initials(candidate.name)}</span>
        <span>
          <strong>{candidate.name}</strong>
          <small>{candidate.location}</small>
        </span>
      </button>
      <span className="table-role">
        <strong>{candidate.role}</strong>
        <small>{candidate.company}</small>
      </span>
      <span className="source-label">{candidate.source}</span>
      <select
        className={`stage-select stage-select-${candidate.stage.toLowerCase()}`}
        value={candidate.stage}
        onChange={(event) => onStageChange(event.target.value as Stage)}
        aria-label={`Stage for ${candidate.name}`}
      >
        {stages.map((stage) => (
          <option key={stage}>{stage}</option>
        ))}
      </select>
      <span className={candidate.score ? "fit-score" : "fit-score fit-empty"}>
        {candidate.score ? `${candidate.score}%` : "—"}
      </span>
      <button
        className="icon-button row-action"
        onClick={onCall}
        aria-label={`Call ${candidate.name}`}
        title={`Call ${candidate.name}`}
      >
        <Phone size={15} />
      </button>
    </div>
  );
}

function CandidateProfile({
  candidate,
  notes,
  reminders,
  submissions,
  stages,
  onClose,
  onCall,
  onSubmit,
  onStageChange,
  onReminder,
}: {
  candidate: Candidate;
  notes: Note[];
  reminders: Reminder[];
  submissions: Submission[];
  stages: Stage[];
  onClose: () => void;
  onCall: () => void;
  onSubmit: () => void;
  onStageChange: (stage: Stage) => void;
  onReminder: () => void;
}) {
  const timelineItems: TimelineItem[] = [
    ...notes.map((note) => ({
      id: note.id,
      date: note.createdAt,
      label: `${note.noteType ?? note.tags[0] ?? "Note"} note added`,
      detail: note.body,
      tags: note.tags,
    })),
    ...(candidate.stageHistory ?? []).map((entry, index) => ({
      id: `stage-${candidate.id}-${index}`,
      date: entry.at,
      label: "Pipeline updated",
      detail: `Moved to ${entry.stage}`,
    })),
    ...reminders.map((reminder) => ({
      id: reminder.id,
      date: reminder.when,
      label: reminder.done ? "Reminder completed" : "Reminder set",
      detail: reminder.title,
    })),
    ...submissions.map((submission) => ({
      id: submission.id,
      date: submission.createdAt,
      label: `Submission ${submission.status.toLowerCase()}`,
      detail: submission.narrative,
    })),
  ].sort((left, right) => {
    const leftTime = Date.parse(left.date);
    const rightTime = Date.parse(right.date);
    return (Number.isNaN(rightTime) ? 0 : rightTime) - (Number.isNaN(leftTime) ? 0 : leftTime);
  });

  return (
    <aside className="profile-panel">
      <div className="profile-panel-top">
        <span>PROFILE</span>
        <button
          className="icon-button subtle-icon"
          onClick={onClose}
          aria-label="Close profile"
        >
          <X size={17} />
        </button>
      </div>
      <div className="profile-identity">
        <span className="avatar avatar-xl">{initials(candidate.name)}</span>
        <h2>{candidate.name}</h2>
        <p>{candidate.role}</p>
        <span className="profile-company">
          <BriefcaseBusiness size={14} /> Previously at {candidate.company}
        </span>
      </div>
      <div className="profile-actions">
        <button className="button button-primary" onClick={onCall}>
          <PhoneCall size={15} /> Call
        </button>
        <button className="button button-outline" onClick={onReminder}>
          <CalendarClock size={15} /> Remind
        </button>
        <button className="button button-outline" onClick={onSubmit}>
          <ClipboardList size={15} /> Submit
        </button>
      </div>
      <div className="profile-section">
        <div className="profile-section-title">
          <h3>Pipeline stage</h3>
          <span
            className={`stage-badge stage-badge-${candidate.stage.toLowerCase()}`}
          >
            {candidate.stage}
          </span>
        </div>
        <select
          className="profile-stage-select"
          value={candidate.stage}
          onChange={(event) => onStageChange(event.target.value as Stage)}
          aria-label="Update pipeline stage"
        >
          {stages.map((stage) => (
            <option key={stage}>{stage}</option>
          ))}
        </select>
      </div>
      <div className="profile-section">
        <h3>Contact details</h3>
        <p className="contact-line">
          <span>Email</span>
          <strong>{candidate.email || "Not added"}</strong>
        </p>
        <p className="contact-line">
          <span>Phone</span>
          <strong>{candidate.phone || "Not added"}</strong>
        </p>
        <p className="contact-line">
          <span>Location</span>
          <strong>
            <MapPin size={13} /> {candidate.location}
          </strong>
        </p>
        <p className="contact-line">
          <span>Sourced via</span>
          <strong>{candidate.source}</strong>
        </p>
        <p className="contact-line">
          <span>Visa status</span>
          <strong>{candidate.visaStatus || "Not added"}</strong>
        </p>
        <p className="contact-line">
          <span>Target comp</span>
          <strong>{candidate.targetComp || "Not added"}</strong>
        </p>
        <p className="contact-line">
          <span>Relocation</span>
          <strong>{candidate.relocation || "Not added"}</strong>
        </p>
        <p className="contact-line">
          <span>Availability</span>
          <strong>{candidate.availability || "Not added"}</strong>
        </p>
        {candidate.profileUrl && (
          <p className="contact-line">
            <span>Profile</span>
              <a className="profile-contact-link" href={candidate.profileUrl} target="_blank" rel="noreferrer">
              Open profile <ArrowUpRight size={12} />
            </a>
          </p>
        )}
      </div>
      <div className="profile-section profile-notes">
        <div className="profile-section-title">
          <h3>Notes</h3>
          <span>{notes.length}</span>
        </div>
        {notes.length === 0 ? (
          <p className="profile-empty">
            No notes yet. Use the dialer to capture a conversation.
          </p>
        ) : (
          notes.map((note) => (
            <article className="profile-note" key={note.id}>
              <p>{note.body}</p>
              <div>
                <span>{formatTimelineDate(note.createdAt)}</span>
                <span className="tag-list">
                  {note.tags.map((tag) => (
                    <span className="note-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
      <div className="profile-section profile-timeline">
        <div className="profile-section-title">
          <h3>Activity timeline</h3>
          <span>{timelineItems.length}</span>
        </div>
        {timelineItems.length === 0 ? (
          <p className="profile-empty">Notes, stage changes, reminders, and submissions will appear here.</p>
        ) : (
          timelineItems.map((item) => (
            <article className="timeline-item" key={item.id}>
              <span className="timeline-marker" />
              <div>
                <strong>{item.label}</strong>
                <p>{item.detail}</p>
                <small>{formatTimelineDate(item.date)}</small>
                {item.tags && <span className="tag-list">{item.tags.map((tag) => <span className="note-tag" key={tag}>{tag}</span>)}</span>}
              </div>
            </article>
          ))
        )}
      </div>
      <div className="profile-section">
        <div className="profile-section-title">
          <h3>Next steps</h3>
          <button
            className="text-button small-text-button"
            onClick={onReminder}
          >
            <Plus size={13} /> Add
          </button>
        </div>
        {reminders.length === 0 ? (
          <p className="profile-empty">No upcoming reminders.</p>
        ) : (
          reminders.map((reminder) => (
            <div className="profile-next-step" key={reminder.id}>
              <Clock3 size={14} />
              <span>{reminder.title}</span>
              <small>{formatReminder(reminder.when)}</small>
            </div>
          ))
        )}
      </div>
      <div className="profile-score">
        <Sparkles size={15} />
        <span>
          Profile added{" "}
          {candidate.updated === "Just added" ? "just now" : candidate.updated}
        </span>
        {candidate.score > 0 && <strong>{candidate.score}% fit</strong>}
      </div>
    </aside>
  );
}

function IntegrationCard({
  icon,
  name,
  category,
  description,
  action,
  onConnect,
}: {
  icon: ReactNode;
  name: string;
  category: string;
  description: string;
  action: string;
  onConnect: () => void;
}) {
  return (
    <article className="integration-card">
      <div className="integration-card-top">
        <span className="integration-icon">{icon}</span>
        <span>{category}</span>
      </div>
      <h2>{name}</h2>
      <p>{description}</p>
      <button className="button button-outline" onClick={onConnect}>
        {action} <ArrowRight size={14} />
      </button>
    </article>
  );
}

export default App;
