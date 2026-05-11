import React, { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./components/ui/avatar";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Input } from "./components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "./components/ui/sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  BarChart3,
  Bell,
  Brain,
  Clock,
  FileText,
  Gauge,
  Heart,
  ImageIcon,
  Instagram,
  LayoutDashboard,
  Lightbulb,
  LogOut,
  MessageCircle,
  PenTool,
  PlayCircle,
  Search,
  Settings,
  Smile,
  Sparkles,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

// -----------------------------
// Prototype data model
// These objects mirror the SQL Server schema included in /database/AlgoMate_SQLServer_Setup.sql.
// In a real backend, DashboardView would fetch this from an API endpoint such as /api/dashboard/overview.
// -----------------------------
type PostFormat = "Reel" | "Carousel" | "Image";
type MoodState = "Energised" | "Focused" | "Stable" | "Concerned";

type InstagramPost = {
  id: number;
  title: string;
  caption: string;
  format: PostFormat;
  contentPillar: string;
  publishedAt: string;
  views: number;
  reach: number;
  likes: number;
  comments: number;
  saves: number;
  shares: number;
  profileVisits: number;
  follows: number;
  tags: string[];
  thumbnail: string;
  gradient: string;
};

type InstagramStory = {
  id: number;
  title: string;
  publishedAt: string;
  views: number;
  replies: number;
  stickerTaps: number;
  linkClicks: number;
  completionRate: number;
  thumbnail: string;
  gradient: string;
};

const DEMO_USER = {
  name: "Ege Yüce",
  handle: "@ege.creator",
  email: "demo.creator@algomate.com",
  password: "AlgoMateDemo2026!",
};

const recentPosts: InstagramPost[] = [
  {
    id: 101,
    title: "Desk reset before finals",
    caption: "A calm 20-minute study desk reset before a long revision block.",
    format: "Reel",
    contentPillar: "Study Productivity",
    publishedAt: "2026-05-10T20:15:00",
    views: 48600,
    reach: 39200,
    likes: 5780,
    comments: 462,
    saves: 1740,
    shares: 1180,
    profileVisits: 980,
    follows: 332,
    tags: ["study", "routine", "desk", "finals"],
    thumbnail: "DS",
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
  },
  {
    id: 102,
    title: "3 mistakes in content planning",
    caption: "A quick carousel on why posts fail before editing even starts.",
    format: "Carousel",
    contentPillar: "Creator Education",
    publishedAt: "2026-05-09T18:40:00",
    views: 31100,
    reach: 27400,
    likes: 2860,
    comments: 236,
    saves: 1510,
    shares: 730,
    profileVisits: 510,
    follows: 184,
    tags: ["creator", "planning", "mistakes", "growth"],
    thumbnail: "3M",
    gradient: "from-sky-500 via-cyan-500 to-emerald-400",
  },
  {
    id: 103,
    title: "Gym progress check-in",
    caption: "A short training clip with a transparent weekly progress update.",
    format: "Reel",
    contentPillar: "Lifestyle Progress",
    publishedAt: "2026-05-08T21:05:00",
    views: 42350,
    reach: 33780,
    likes: 3920,
    comments: 318,
    saves: 860,
    shares: 690,
    profileVisits: 720,
    follows: 214,
    tags: ["gym", "progress", "routine", "discipline"],
    thumbnail: "GP",
    gradient: "from-rose-500 via-orange-400 to-amber-300",
  },
  {
    id: 104,
    title: "One-hour deep work sprint",
    caption: "Timer, notes, and what changed after one uninterrupted hour.",
    format: "Reel",
    contentPillar: "Study Productivity",
    publishedAt: "2026-05-07T19:25:00",
    views: 36700,
    reach: 30400,
    likes: 3470,
    comments: 280,
    saves: 1320,
    shares: 890,
    profileVisits: 660,
    follows: 240,
    tags: ["deepwork", "study", "routine", "focus"],
    thumbnail: "DW",
    gradient: "from-slate-800 via-indigo-600 to-blue-500",
  },
  {
    id: 105,
    title: "How I batch content ideas",
    caption: "A carousel showing the weekly board, hooks, and final content map.",
    format: "Carousel",
    contentPillar: "Creator Education",
    publishedAt: "2026-05-06T18:10:00",
    views: 28900,
    reach: 24650,
    likes: 2540,
    comments: 198,
    saves: 1680,
    shares: 612,
    profileVisits: 420,
    follows: 156,
    tags: ["content", "planning", "workflow", "creator"],
    thumbnail: "BI",
    gradient: "from-purple-500 via-pink-500 to-rose-400",
  },
  {
    id: 106,
    title: "Morning coffee and notes",
    caption: "A cosy static image of a morning notes session.",
    format: "Image",
    contentPillar: "Lifestyle Progress",
    publishedAt: "2026-05-05T09:05:00",
    views: 14800,
    reach: 12900,
    likes: 990,
    comments: 84,
    saves: 260,
    shares: 110,
    profileVisits: 180,
    follows: 48,
    tags: ["morning", "notes", "coffee", "routine"],
    thumbnail: "MN",
    gradient: "from-amber-500 via-yellow-400 to-orange-300",
  },
  {
    id: 107,
    title: "Content calendar walkthrough",
    caption: "From idea backlog to a seven-day posting calendar.",
    format: "Carousel",
    contentPillar: "Creator Education",
    publishedAt: "2026-05-04T17:45:00",
    views: 22400,
    reach: 19120,
    likes: 1810,
    comments: 146,
    saves: 1120,
    shares: 402,
    profileVisits: 310,
    follows: 104,
    tags: ["calendar", "creator", "workflow", "planning"],
    thumbnail: "CW",
    gradient: "from-emerald-600 via-teal-500 to-cyan-400",
  },
  {
    id: 108,
    title: "Evening study accountability",
    caption: "A low-pressure reel asking followers to comment their task for the evening.",
    format: "Reel",
    contentPillar: "Community Engagement",
    publishedAt: "2026-05-03T20:35:00",
    views: 39800,
    reach: 32200,
    likes: 3620,
    comments: 590,
    saves: 720,
    shares: 640,
    profileVisits: 690,
    follows: 226,
    tags: ["study", "accountability", "community", "evening"],
    thumbnail: "EA",
    gradient: "from-blue-600 via-indigo-500 to-purple-500",
  },
];

const recentStories: InstagramStory[] = [
  {
    id: 201,
    title: "Poll: post tonight?",
    publishedAt: "2026-05-11T13:10:00",
    views: 12480,
    replies: 184,
    stickerTaps: 980,
    linkClicks: 116,
    completionRate: 88,
    thumbnail: "POLL",
    gradient: "from-fuchsia-500 to-pink-500",
  },
  {
    id: 202,
    title: "Behind the carousel draft",
    publishedAt: "2026-05-11T11:40:00",
    views: 10120,
    replies: 142,
    stickerTaps: 740,
    linkClicks: 82,
    completionRate: 84,
    thumbnail: "BTS",
    gradient: "from-indigo-500 to-sky-500",
  },
  {
    id: 203,
    title: "Study desk Q&A",
    publishedAt: "2026-05-10T22:15:00",
    views: 14920,
    replies: 336,
    stickerTaps: 1220,
    linkClicks: 154,
    completionRate: 91,
    thumbnail: "Q&A",
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    id: 204,
    title: "Gym session check",
    publishedAt: "2026-05-10T17:20:00",
    views: 9430,
    replies: 118,
    stickerTaps: 530,
    linkClicks: 44,
    completionRate: 79,
    thumbnail: "GYM",
    gradient: "from-orange-500 to-rose-500",
  },
];

const instagramConnection = {
  accountName: "Ege Creator Studio",
  handle: DEMO_USER.handle,
  status: "Connected",
  businessType: "Creator account",
  permissions: ["Read posts", "Read stories", "Read insights", "Generate recommendations"],
  lastSync: "2026-05-11T14:35:00",
  nextSync: "2026-05-11T15:35:00",
  syncHealth: 96,
};

const hashtagClusters = [
  {
    name: "Study productivity",
    tags: ["#studygram", "#deepwork", "#studentcreator", "#revisionroutine", "#focusmode", "#desksetup"],
    score: 94,
    useCase: "Best for reels and carousels about revision, desk resets, and study accountability.",
  },
  {
    name: "Creator workflow",
    tags: ["#contentplanning", "#creatorworkflow", "#socialmediatips", "#contentcalendar", "#creatorgrowth"],
    score: 89,
    useCase: "Best for educational posts that teach planning, batching, and posting systems.",
  },
  {
    name: "Lifestyle progress",
    tags: ["#discipline", "#routinebuilder", "#fitnessjourney", "#dayinmylife", "#progresslog"],
    score: 82,
    useCase: "Best for gym, daily routine, and transparent personal progress content.",
  },
];

const optimalPostingSlots = [
  { day: "Monday", slot: "19:30", score: 82, reason: "Audience saves educational carousels after classes/work." },
  { day: "Tuesday", slot: "20:15", score: 88, reason: "High reply rate and strong story completion." },
  { day: "Wednesday", slot: "18:45", score: 79, reason: "Stable reach, especially for creator workflow posts." },
  { day: "Thursday", slot: "20:30", score: 91, reason: "Best window for reels with study or accountability hooks." },
  { day: "Friday", slot: "17:50", score: 74, reason: "Lower comments, but good saves before weekend planning." },
  { day: "Saturday", slot: "11:30", score: 69, reason: "Good for casual lifestyle posts, weaker for education." },
  { day: "Sunday", slot: "19:10", score: 93, reason: "Best planning mindset window for next-week content." },
];

const audienceSegments = [
  {
    segment: "University productivity seekers",
    size: 18400,
    ageRange: "18–24",
    topLocation: "Istanbul",
    interests: "Study routines, exam prep, desk setup",
    bestFormat: "Reel",
    affinity: 94,
  },
  {
    segment: "Aspiring creators",
    size: 12750,
    ageRange: "20–29",
    topLocation: "Ankara",
    interests: "Content calendars, hooks, analytics",
    bestFormat: "Carousel",
    affinity: 89,
  },
  {
    segment: "Lifestyle improvement audience",
    size: 9100,
    ageRange: "18–30",
    topLocation: "Izmir",
    interests: "Gym progress, discipline, routines",
    bestFormat: "Reel",
    affinity: 81,
  },
  {
    segment: "Community responders",
    size: 6400,
    ageRange: "18–26",
    topLocation: "Bursa",
    interests: "Polls, Q&A, accountability prompts",
    bestFormat: "Story",
    affinity: 78,
  },
];

const generatedCaptions = [
  {
    tone: "Professional",
    caption: "A focused reset can change the quality of an entire study session. Here is the exact desk setup and planning flow I use before deep work.",
    cta: "Save this before your next revision block.",
  },
  {
    tone: "Friendly",
    caption: "Before I start studying, I need the desk to feel calm first. This is my 20-minute reset when my brain feels messy but I still need to perform.",
    cta: "Comment one task you are finishing tonight.",
  },
  {
    tone: "High-conversion",
    caption: "Most people try to focus before they remove friction. Try this desk reset first, then start your one-hour deep work sprint.",
    cta: "Share this with someone who is revising this week.",
  },
];


const engagementData = recentPosts
  .slice(0, 7)
  .reverse()
  .map((post) => ({
    day: new Intl.DateTimeFormat("en", { weekday: "short" }).format(new Date(post.publishedAt)),
    views: post.views,
    attracted: getAttractedInterest(post),
    engagementRate: Number(getEngagementRate(post).toFixed(1)),
  }));

function getAttractedInterest(post: InstagramPost) {
  // In prototype mode this is a conservative unique-interest approximation.
  // Backend version can replace this with distinct user interaction records from Engagement.
  return Math.min(
    post.reach,
    post.likes + post.comments + post.saves + post.shares + post.follows,
  );
}

function getDidNotAttractInterest(post: InstagramPost) {
  return Math.max(0, post.reach - getAttractedInterest(post));
}

function getEngagementRate(post: InstagramPost) {
  return post.reach === 0 ? 0 : (getAttractedInterest(post) / post.reach) * 100;
}

function formatNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat("en-US").format(value);
}

function formatPeople(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getTopFivePosts(posts: InstagramPost[]) {
  return [...posts]
    .sort((a, b) => getEngagementRate(b) - getEngagementRate(a))
    .slice(0, 5);
}

function getMostFrequent<T extends string>(items: T[]) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Reel";
}

function buildInductiveRecommendation(posts: InstagramPost[]) {
  const topFive = getTopFivePosts(posts);
  const bestFormat = getMostFrequent(topFive.map((post) => post.format));
  const bestPillar = getMostFrequent(topFive.map((post) => post.contentPillar));
  const bestTags = topFive.flatMap((post) => post.tags);
  const leadingTag = getMostFrequent(bestTags);
  const hours = topFive.map((post) => new Date(post.publishedAt).getHours());
  const averageHour = Math.round(hours.reduce((sum, hour) => sum + hour, 0) / hours.length);
  const averageEngagementRate =
    topFive.reduce((sum, post) => sum + getEngagementRate(post), 0) / topFive.length;
  const saveShareScore = topFive.reduce((sum, post) => sum + post.saves + post.shares, 0);
  const conversationScore = topFive.reduce((sum, post) => sum + post.comments, 0);
  const angle = saveShareScore > conversationScore * 4 ? "save-worthy checklist" : "discussion-led prompt";

  return {
    title: `${bestPillar}: ${leadingTag} ${angle}`,
    format: bestFormat,
    postingWindow: `${String(Math.max(0, averageHour - 1)).padStart(2, "0")}:00–${String(Math.min(23, averageHour + 1)).padStart(2, "0")}:30`,
    confidence: Math.min(96, Math.round(averageEngagementRate * 4.5)),
    predictedEngagementRate: Number((averageEngagementRate * 1.08).toFixed(1)),
    hook: "Start with the finished result, then reveal the exact steps that created it.",
    rationale: `Top posts repeatedly combine ${bestFormat.toLowerCase()} format, ${bestPillar.toLowerCase()} themes, and ${leadingTag}-related hooks. Evening publishing also appears stronger than morning publishing.`,
    sourcePosts: topFive,
  };
}

function getDynamicMood(posts: InstagramPost[]) {
  const latestThree = posts.slice(0, 3);
  const previousThree = posts.slice(3, 6);
  const latestAverage = latestThree.reduce((sum, post) => sum + getEngagementRate(post), 0) / latestThree.length;
  const previousAverage = previousThree.reduce((sum, post) => sum + getEngagementRate(post), 0) / previousThree.length;
  const latestPost = posts[0];
  const delta = latestAverage - previousAverage;
  const latestAttracted = getAttractedInterest(latestPost);
  const latestDidNotAttract = getDidNotAttractInterest(latestPost);

  let mood: MoodState = "Stable";
  let burnoutRisk = "Moderate";
  let note = "Recent performance is steady. Keep posting with a consistent structure and avoid overreacting to one post.";

  if (latestAverage >= previousAverage * 1.08 && getEngagementRate(latestPost) >= 18) {
    mood = "Energised";
    burnoutRisk = "Low";
    note = "Your latest posts are outperforming the previous batch. This is a good moment to plan, but avoid posting too many experiments at once.";
  } else if (delta >= 0) {
    mood = "Focused";
    burnoutRisk = "Low";
    note = "Engagement is improving. Continue with the same format family and test one new hook rather than changing everything.";
  } else if (latestDidNotAttract > latestAttracted * 5) {
    mood = "Concerned";
    burnoutRisk = "Elevated";
    note = "The latest post reached many passive viewers. Use a stronger first-frame promise and a clearer save/share reason next time.";
  }

  return {
    mood,
    burnoutRisk,
    latestAverage: Number(latestAverage.toFixed(1)),
    previousAverage: Number(previousAverage.toFixed(1)),
    delta: Number(delta.toFixed(1)),
    note,
  };
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeScreen, setActiveScreen] = useState("Dashboard");

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveScreen("Dashboard");
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/20">
        <AppSidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-slate-50/70">
          <TopHeader onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {activeScreen === "Dashboard" && <DashboardView setActiveScreen={setActiveScreen} />}
            {activeScreen === "Connect Instagram" && <ConnectInstagramView />}
            {activeScreen === "Content Ideas" && <ContentIdeasView />}
            {activeScreen === "Caption & Hashtags" && <CaptionHashtagsView />}
            {activeScreen === "Posting Time" && <PostingTimeView />}
            {activeScreen === "Engagement Analysis" && <EngagementAnalysisView />}
            {activeScreen === "Mood Tracker" && <MoodTrackerView />}
            {activeScreen === "Audience Targeting" && <AudienceTargetingView />}
            {activeScreen === "Reports" && <ReportsView />}
            {activeScreen === "Settings" && <SettingsView />}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(DEMO_USER.email);
  const [password, setPassword] = useState(DEMO_USER.password);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === DEMO_USER.email && password === DEMO_USER.password) {
      onLogin();
    } else {
      alert(`Invalid credentials. Use ${DEMO_USER.email} / ${DEMO_USER.password}`);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background font-sans">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-600 p-12 text-white lg:flex">
        <div className="absolute left-[-12%] top-[-20%] h-[140%] w-[140%] rounded-full bg-white/5 blur-3xl" />
        <div className="relative z-10">
          <div className="mb-12 flex items-center gap-3">
            <div className="rounded-xl bg-white/20 p-2 backdrop-blur-md">
              <BarChart3 className="size-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">AlgoMate</h1>
          </div>
          <h2 className="mb-6 bg-gradient-to-r from-white to-white/70 bg-clip-text text-5xl font-extrabold leading-[1.1] tracking-tight text-transparent">
            Create smarter.
            <br />
            Post calmer.
            <br />
            Grow faster.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-indigo-100">
            AI-powered Instagram content planning, engagement analysis, mood-aware recommendations, and creator growth support.
          </p>
        </div>
        <div className="relative z-10 rounded-2xl border border-white/15 bg-white/10 p-4 text-sm text-white/80 backdrop-blur-md">
          Demo login: <strong>{DEMO_USER.email}</strong> / <strong>{DEMO_USER.password}</strong>
        </div>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2 lg:p-24">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Badge className="mb-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-50">Software Design Document Prototype</Badge>
            <h3 className="mb-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back</h3>
            <p className="text-slate-500">Sign in to open the AlgoMate dashboard.</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-2 rounded-lg bg-slate-100 p-1">
              <TabsTrigger value="login" className="rounded-md">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-md">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Email address</label>
                  <Input
                    type="email"
                    placeholder={DEMO_USER.email}
                    className="h-12 border-slate-200 bg-slate-50 px-4 focus-visible:ring-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-12 border-slate-200 bg-slate-50 px-4 focus-visible:ring-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="h-12 w-full bg-indigo-600 text-base font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700">
                  Login to AlgoMate
                </Button>
              </form>

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                <div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-slate-500">Or continue with</span></div>
              </div>

              <Button variant="outline" className="h-12 w-full border-slate-200 font-medium text-slate-700 hover:bg-slate-50">
                <Instagram className="mr-2 size-5 text-[#E1306C]" /> Continue with Instagram
              </Button>
            </TabsContent>
            <TabsContent value="register">
              <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                <p className="mb-4 text-sm text-slate-500">Registration is disabled in this prototype. Use the demo account above.</p>
                <Button variant="outline" onClick={() => document.querySelector<HTMLButtonElement>('[data-value="login"]')?.click()}>
                  Go to Login
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function AppSidebar({ activeScreen, setActiveScreen }: { activeScreen: string; setActiveScreen: (s: string) => void }) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Connect Instagram", icon: Instagram },
    { name: "Content Ideas", icon: Lightbulb },
    { name: "Caption & Hashtags", icon: PenTool },
    { name: "Posting Time", icon: Clock },
    { name: "Engagement Analysis", icon: BarChart3 },
    { name: "Mood Tracker", icon: Smile },
    { name: "Audience Targeting", icon: Target },
    { name: "Reports", icon: FileText },
    { name: "Settings", icon: Settings },
  ];

  return (
    <Sidebar className="border-r border-slate-200 bg-white">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-indigo-600 p-1.5 shadow-sm">
            <BarChart3 className="size-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">AlgoMate</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.name} className="mb-1">
              <SidebarMenuButton
                isActive={activeScreen === item.name}
                onClick={() => setActiveScreen(item.name)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all ${
                  activeScreen === item.name
                    ? "bg-indigo-50 font-medium text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <item.icon className={`size-5 ${activeScreen === item.name ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function TopHeader({ onLogout }: { onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/85 px-4 backdrop-blur-md sm:px-6">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative hidden w-full max-w-md md:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search insights, posts, ideas..."
            className="h-9 w-full rounded-full border-slate-200 bg-slate-50 pl-9 focus-visible:ring-indigo-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Badge variant="outline" className="hidden items-center gap-1.5 border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700 sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Instagram data loaded
        </Badge>
        <Button variant="ghost" size="icon" className="relative rounded-full text-slate-500 hover:text-slate-700">
          <Bell className="size-5" />
          <span className="absolute right-2.5 top-2 size-2 rounded-full bg-pink-500" />
        </Button>
        <div className="hidden items-center gap-3 border-l border-slate-200 pl-4 md:flex">
          <Avatar className="size-9 border border-slate-200 shadow-sm">
            <AvatarImage src="https://i.pravatar.cc/150?img=11" />
            <AvatarFallback className="bg-indigo-100 font-semibold text-indigo-700">EY</AvatarFallback>
          </Avatar>
          <div className="leading-tight">
            <span className="block text-sm font-medium text-slate-700">{DEMO_USER.name}</span>
            <span className="text-xs text-slate-400">{DEMO_USER.handle}</span>
          </div>
        </div>
        <Button variant="outline" className="gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50" onClick={onLogout}>
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}

function DashboardView({ setActiveScreen }: { setActiveScreen: (screen: string) => void }) {
  const recommendation = useMemo(() => buildInductiveRecommendation(recentPosts), []);
  const mood = useMemo(() => getDynamicMood(recentPosts), []);
  const totals = useMemo(() => {
    const views = recentPosts.reduce((sum, post) => sum + post.views, 0);
    const attracted = recentPosts.reduce((sum, post) => sum + getAttractedInterest(post), 0);
    const comments = recentPosts.reduce((sum, post) => sum + post.comments, 0);
    const followers = recentPosts.reduce((sum, post) => sum + post.follows, 0);
    return { views, attracted, comments, followers };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge className="mb-3 bg-white text-indigo-700 shadow-sm hover:bg-white">Dashboard initialized with recent Instagram activity</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Analytics Dashboard</h2>
          <p className="mt-1 text-base text-slate-500">Recent posts, stories, engagement quality, mood state, and next-content recommendation.</p>
        </div>
        <Button className="gap-2 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700" onClick={() => setActiveScreen("Content Ideas")}>
          <Sparkles className="size-4" /> Open AI Ideas
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Views" value={formatNumber(totals.views)} trend="recent posts" trendUp icon={TrendingUp} color="indigo" isTextTrend />
        <StatCard title="Attracted Interest" value={formatNumber(totals.attracted)} trend="unique-intent estimate" trendUp icon={Heart} color="pink" isTextTrend />
        <StatCard title="Comments" value={formatNumber(totals.comments)} trend="conversation volume" trendUp icon={MessageCircle} color="blue" isTextTrend />
        <StatCard title="Follower Growth" value={`+${formatNumber(totals.followers)}`} trend="from posts" trendUp icon={Users} color="emerald" isTextTrend />
      </div>

      <RecentInstagramActivity />

      <div className="grid gap-6 xl:grid-cols-7">
        <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm xl:col-span-5">
          <CardHeader className="border-b border-slate-100 bg-white pb-4">
            <CardTitle className="text-lg font-bold text-slate-800">Engagement Over Time</CardTitle>
            <CardDescription>Views and attracted-interest estimate from the latest seven posts.</CardDescription>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="h-[310px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData} margin={{ top: 8, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dx={10} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 12px 30px rgb(15 23 42 / 0.14)" }} />
                  <Line yAxisId="left" type="monotone" dataKey="views" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="attracted" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 xl:col-span-2">
          <RecommendationCard recommendation={recommendation} />
          <MoodSummaryCard mood={mood} onOpen={() => setActiveScreen("Mood Tracker")} />
        </div>
      </div>

      <PostsPerformanceTable posts={recentPosts} limit={8} />
    </div>
  );
}

function RecentInstagramActivity() {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-white">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Recent Instagram Posts & Stories</CardTitle>
            <CardDescription>Main dashboard view loads this first so the user immediately sees fresh Instagram activity.</CardDescription>
          </div>
          <Badge variant="outline" className="w-fit border-indigo-200 bg-indigo-50 text-indigo-700">{recentPosts.length} posts · {recentStories.length} stories</Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 bg-white p-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Latest posts</h3>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">sorted by publish date</Badge>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recentPosts.slice(0, 6).map((post) => (
              <PostPreviewCard key={post.id} post={post} />
            ))}
          </div>
        </div>
        <div className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Stories</h3>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">last 24–48 hours</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {recentStories.map((story) => (
              <StoryPreviewCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PostPreviewCard({ post }: { post: InstagramPost }) {
  const attracted = getAttractedInterest(post);
  const didNotAttract = getDidNotAttractInterest(post);

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${post.gradient} text-2xl font-black tracking-tight text-white`}>
        {post.format === "Reel" && <PlayCircle className="mr-2 size-8 text-white/90" />}
        {post.format !== "Reel" && <ImageIcon className="mr-2 size-8 text-white/90" />}
        {post.thumbnail}
      </div>
      <div className="space-y-3 p-4">
        <div>
          <div className="mb-1 flex items-center justify-between gap-2">
            <Badge variant="secondary" className="border-0 bg-slate-100 text-slate-600">{post.format}</Badge>
            <span className="text-xs text-slate-400">{formatDateTime(post.publishedAt)}</span>
          </div>
          <h4 className="line-clamp-1 font-semibold text-slate-900">{post.title}</h4>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{post.caption}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <MetricPill label="Attracted Interest" value={`${formatPeople(attracted)} people`} tone="positive" />
          <MetricPill label="Did Not Attract" value={`${formatPeople(didNotAttract)} people`} tone="neutral" />
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <span>{formatNumber(post.views)} views</span>
          <span className="font-semibold text-indigo-600">{getEngagementRate(post).toFixed(1)}% ER</span>
        </div>
      </div>
    </div>
  );
}

function StoryPreviewCard({ story }: { story: InstagramStory }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md">
      <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${story.gradient} text-xs font-black text-white`}>
        {story.thumbnail}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <h4 className="truncate font-semibold text-slate-900">{story.title}</h4>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">{story.completionRate}%</Badge>
        </div>
        <p className="text-xs text-slate-400">{formatDateTime(story.publishedAt)}</p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-500">
          <span>{formatNumber(story.views)} views</span>
          <span>{story.replies} replies</span>
          <span>{story.stickerTaps} taps</span>
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: ReturnType<typeof buildInductiveRecommendation> }) {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
      <div className="absolute right-0 top-0 p-4 opacity-10"><Brain className="size-20 text-indigo-600" /></div>
      <CardHeader className="pb-2">
        <Badge className="mb-2 w-fit border-0 bg-indigo-100 text-indigo-700 hover:bg-indigo-200">Inductive Recommendation Engine</Badge>
        <CardTitle className="text-lg font-bold text-slate-800">Optimized next content idea</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-xl font-bold leading-tight text-slate-900">{recommendation.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{recommendation.rationale}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <MetricBox label="Format" value={recommendation.format} />
          <MetricBox label="Best window" value={recommendation.postingWindow} />
          <MetricBox label="Confidence" value={`${recommendation.confidence}%`} />
          <MetricBox label="Predicted ER" value={`${recommendation.predictedEngagementRate}%`} />
        </div>
        <p className="rounded-xl border border-indigo-100 bg-white/80 p-3 text-xs leading-relaxed text-slate-600">
          <strong className="text-indigo-700">Hook:</strong> {recommendation.hook}
        </p>
      </CardContent>
    </Card>
  );
}

function MoodSummaryCard({ mood, onOpen }: { mood: ReturnType<typeof getDynamicMood>; onOpen: () => void }) {
  const moodClasses: Record<MoodState, string> = {
    Energised: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Focused: "border-indigo-200 bg-indigo-50 text-indigo-700",
    Stable: "border-sky-200 bg-sky-50 text-sky-700",
    Concerned: "border-amber-200 bg-amber-50 text-amber-700",
  };

  return (
    <Card className="rounded-2xl border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Smile className="size-5 text-emerald-600" /> Responsive Mood Tracker
        </CardTitle>
        <CardDescription>Updates from recent post performance.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Current mood</span>
          <Badge variant="outline" className={moodClasses[mood.mood]}>{mood.mood}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Burnout risk</span>
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">{mood.burnoutRisk}</Badge>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white p-3">
          <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
            <span>Recent avg ER</span>
            <span className="font-semibold text-emerald-700">{mood.latestAverage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, mood.latestAverage * 4)}%` }} />
          </div>
        </div>
        <p className="border-l-2 border-emerald-300 pl-3 text-xs italic leading-relaxed text-slate-600">{mood.note}</p>
        <Button variant="outline" className="w-full border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50" onClick={onOpen}>
          View mood details
        </Button>
      </CardContent>
    </Card>
  );
}

function PostsPerformanceTable({ posts, limit }: { posts: InstagramPost[]; limit?: number }) {
  const visiblePosts = limit ? posts.slice(0, limit) : posts;

  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm">
      <CardHeader className="border-b border-slate-100 bg-white">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-800">Engagement Metrics per Post</CardTitle>
            <CardDescription>Each post includes attracted and non-attracted audience estimates.</CardDescription>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-slate-50 text-slate-600">Attracted = likes + comments + saves + shares + follows</Badge>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[220px] font-semibold text-slate-600">Post</TableHead>
              <TableHead className="font-semibold text-slate-600">Format</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Reach</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Attracted Interest</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Did Not Attract</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Eng. Rate</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Saves</TableHead>
              <TableHead className="text-right font-semibold text-slate-600">Shares</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visiblePosts.map((post) => {
              const attracted = getAttractedInterest(post);
              const didNotAttract = getDidNotAttractInterest(post);
              return (
                <TableRow key={post.id} className="cursor-pointer hover:bg-slate-50/80">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${post.gradient} text-xs font-bold text-white`}>
                        {post.thumbnail}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{post.title}</p>
                        <p className="text-xs text-slate-400">{formatDateTime(post.publishedAt)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="secondary" className="border-0 bg-slate-100 text-slate-600">{post.format}</Badge></TableCell>
                  <TableCell className="text-right text-slate-600">{formatPeople(post.reach)}</TableCell>
                  <TableCell className="text-right font-medium text-emerald-700">Attracted Interest: {formatPeople(attracted)} people</TableCell>
                  <TableCell className="text-right text-slate-500">Did Not Attract Interest: {formatPeople(didNotAttract)} people</TableCell>
                  <TableCell className="text-right font-semibold text-indigo-600">{getEngagementRate(post).toFixed(1)}%</TableCell>
                  <TableCell className="text-right text-slate-600">{formatPeople(post.saves)}</TableCell>
                  <TableCell className="text-right text-slate-600">{formatPeople(post.shares)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ContentIdeasView() {
  const recommendation = useMemo(() => buildInductiveRecommendation(recentPosts), []);
  const topFive = recommendation.sourcePosts;

  const contentIdeas = [
    {
      title: recommendation.title,
      desc: `${recommendation.hook} Build it as a ${recommendation.format.toLowerCase()} and post around ${recommendation.postingWindow}.`,
      format: recommendation.format,
      score: recommendation.confidence,
      difficulty: "Easy",
      time: recommendation.postingWindow,
    },
    {
      title: "Before vs after content planning board",
      desc: "Show a messy idea list becoming a clean seven-day creator calendar.",
      format: "Carousel",
      score: 86,
      difficulty: "Medium",
      time: "18:00–20:00",
    },
    {
      title: "Study sprint with a comment prompt",
      desc: "Ask followers to comment one task, then show your own one-hour sprint result.",
      format: "Reel",
      score: 83,
      difficulty: "Easy",
      time: "19:30–21:00",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Content Ideas</h2>
          <p className="mt-1 text-base text-slate-500">Personalised suggestions deduced from your top five best-performing posts.</p>
        </div>
        <Button className="gap-2 whitespace-nowrap bg-indigo-600 text-white shadow-sm hover:bg-indigo-700">
          <Lightbulb className="size-4" /> Generate New Ideas
        </Button>
      </div>

      <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
        <CardHeader>
          <Badge className="w-fit bg-indigo-100 text-indigo-700 hover:bg-indigo-100">Pattern analysis</Badge>
          <CardTitle>What the engine learned from the top 5</CardTitle>
          <CardDescription>Simple inductive logic: identify repeated formats, themes, tags, engagement types, and posting windows.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-5">
          {topFive.map((post, index) => (
            <div key={post.id} className="rounded-xl border border-white bg-white/80 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <Badge variant="secondary" className="bg-slate-100 text-slate-600">#{index + 1}</Badge>
                <span className="text-sm font-semibold text-indigo-600">{getEngagementRate(post).toFixed(1)}%</span>
              </div>
              <p className="font-semibold text-slate-900">{post.title}</p>
              <p className="mt-1 text-xs text-slate-500">{post.format} · {post.contentPillar}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Badge className="cursor-pointer bg-indigo-600 px-4 py-1.5 text-sm font-medium hover:bg-indigo-700">All Types</Badge>
        <Badge variant="outline" className="cursor-pointer bg-white px-4 py-1.5 text-sm font-medium text-slate-600">Reels Only</Badge>
        <Badge variant="outline" className="cursor-pointer bg-white px-4 py-1.5 text-sm font-medium text-slate-600">Carousels</Badge>
        <Badge variant="outline" className="cursor-pointer bg-white px-4 py-1.5 text-sm font-medium text-slate-600">Growth Goal</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {contentIdeas.map((idea, i) => (
          <Card key={i} className="flex flex-col rounded-2xl border-slate-200 shadow-sm transition-shadow hover:shadow-md">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="mb-2 flex items-start justify-between">
                <Badge variant="secondary" className="border-0 bg-indigo-50 text-indigo-700">{idea.format}</Badge>
                <div className="flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp className="size-3" /> {idea.score}% Match
                </div>
              </div>
              <CardTitle className="text-lg font-bold leading-tight text-slate-800">{idea.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-4">
              <p className="mb-6 text-sm leading-relaxed text-slate-600">{idea.desc}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1.5 text-slate-500"><Target className="size-4" /> {idea.difficulty}</div>
                <div className="flex items-center gap-1.5 text-slate-500"><Clock className="size-4" /> Best at {idea.time}</div>
              </div>
            </CardContent>
            <CardFooter className="gap-3 px-6 pb-5 pt-0">
              <Button className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700">Use Idea</Button>
              <Button variant="outline" className="border-slate-200 text-slate-600">Save</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EngagementAnalysisView() {
  const chartData = recentPosts.map((post) => ({
    title: post.title.length > 18 ? `${post.title.slice(0, 18)}...` : post.title,
    attracted: getAttractedInterest(post),
    didNotAttract: getDidNotAttractInterest(post),
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Engagement Analysis</h2>
        <p className="mt-1 text-base text-slate-500">Per-post audience interest split and engagement quality.</p>
      </div>
      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Attracted vs Did Not Attract</CardTitle>
          <CardDescription>Visual comparison for each recent post.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 55, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="title" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} angle={-20} textAnchor="end" interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 12px 30px rgb(15 23 42 / 0.14)" }} />
                <Bar dataKey="attracted" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="didNotAttract" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <PostsPerformanceTable posts={recentPosts} />
    </div>
  );
}

function MoodTrackerView() {
  const mood = useMemo(() => getDynamicMood(recentPosts), []);
  const moodData = recentPosts.slice(0, 6).reverse().map((post) => ({
    day: new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(post.publishedAt)),
    engagementRate: Number(getEngagementRate(post).toFixed(1)),
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Mood Tracker</h2>
        <p className="mt-1 text-base text-slate-500">Mood is recalculated from recent post engagement rates, not manually selected.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-emerald-100 bg-gradient-to-br from-emerald-50 to-white shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Gauge className="size-5 text-emerald-600" /> Current creator state</CardTitle>
            <CardDescription>Based on the latest 3 posts vs the previous 3 posts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
              <p className="text-sm text-slate-500">Current mood</p>
              <p className="mt-2 text-4xl font-black text-slate-900">{mood.mood}</p>
              <p className="mt-1 text-sm text-slate-500">Burnout risk: {mood.burnoutRisk}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricBox label="Recent avg ER" value={`${mood.latestAverage}%`} />
              <MetricBox label="Previous avg ER" value={`${mood.previousAverage}%`} />
            </div>
            <p className="rounded-xl border border-emerald-100 bg-white p-4 text-sm leading-relaxed text-slate-600">{mood.note}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Engagement-rate trend behind mood</CardTitle>
            <CardDescription>Changing the latest post data changes the calculated mood state.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData} margin={{ top: 8, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 12px 30px rgb(15 23 42 / 0.14)" }} />
                  <Line type="monotone" dataKey="engagementRate" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


function ConnectInstagramView() {
  const latestPost = recentPosts[0];
  const totals = recentPosts.reduce(
    (acc, post) => {
      acc.reach += post.reach;
      acc.interactions += getAttractedInterest(post);
      acc.follows += post.follows;
      return acc;
    },
    { reach: 0, interactions: 0, follows: 0 },
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageIntro
        eyebrow="Instagram integration"
        title="Connect Instagram"
        description="Manage the connected creator account, sync permissions, imported content, and dashboard data readiness."
        action={<Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><Instagram className="size-4" /> Reconnect account</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white shadow-sm lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Badge className="mb-3 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">{instagramConnection.status}</Badge>
                <CardTitle className="text-2xl font-bold text-slate-900">{instagramConnection.accountName}</CardTitle>
                <CardDescription className="mt-1">{instagramConnection.handle} · {instagramConnection.businessType}</CardDescription>
              </div>
              <div className="rounded-2xl bg-white p-4 text-center shadow-sm">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Sync health</p>
                <p className="mt-1 text-3xl font-black text-emerald-600">{instagramConnection.syncHealth}%</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <MetricBox label="Imported posts" value={`${recentPosts.length}`} />
            <MetricBox label="Imported stories" value={`${recentStories.length}`} />
            <MetricBox label="Recent reach" value={formatNumber(totals.reach)} />
            <MetricBox label="Attracted people" value={formatPeople(totals.interactions)} />
            <MetricBox label="New followers" value={formatPeople(totals.follows)} />
            <MetricBox label="Last sync" value={formatDateTime(instagramConnection.lastSync)} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><Brain className="size-5 text-indigo-600" /> Data permissions</CardTitle>
            <CardDescription>Required for analysis and recommendation features.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {instagramConnection.permissions.map((permission) => (
              <div key={permission} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="text-sm font-medium text-slate-700">{permission}</span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Allowed</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent import preview</CardTitle>
            <CardDescription>The dashboard opens with these posts and stories loaded into the main view.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[latestPost, recentPosts[1], recentPosts[2]].map((post) => (
              <PostMiniRow key={post.id} post={post} />
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Connection workflow</CardTitle>
            <CardDescription>Prototype flow that should map to Instagram Graph API OAuth later.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              ["1", "Authenticate", "User signs in with an Instagram professional account."],
              ["2", "Request insight permissions", "AlgoMate requests media and story insight access."],
              ["3", "Import content", "Recent posts, stories, and engagement rows are pulled into SQL Server."],
              ["4", "Refresh dashboard", "Mood, reports, and recommendations are recalculated."],
            ].map(([step, title, body]) => (
              <div key={step} className="flex gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">{step}</div>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="text-sm leading-relaxed text-slate-500">{body}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CaptionHashtagsView() {
  const recommendation = useMemo(() => buildInductiveRecommendation(recentPosts), []);
  const [selectedTone, setSelectedTone] = useState("Friendly");
  const selectedCaption = generatedCaptions.find((item) => item.tone === selectedTone) ?? generatedCaptions[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageIntro
        eyebrow="Content preparation"
        title="Caption & Hashtags"
        description="Generate caption variants, CTA options, and hashtag clusters based on your highest-performing content patterns."
        action={<Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><Sparkles className="size-4" /> Generate caption</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Recommended caption brief</CardTitle>
            <CardDescription>Created from the top-five-post inductive recommendation engine.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 md:grid-cols-4">
              <MetricBox label="Idea" value={recommendation.title} />
              <MetricBox label="Format" value={recommendation.format} />
              <MetricBox label="Window" value={recommendation.postingWindow} />
              <MetricBox label="Predicted ER" value={`${recommendation.predictedEngagementRate}%`} />
            </div>
            <div className="rounded-2xl border border-white bg-white p-5 shadow-sm">
              <div className="mb-4 flex flex-wrap gap-2">
                {generatedCaptions.map((item) => (
                  <Button
                    key={item.tone}
                    variant={selectedTone === item.tone ? "default" : "outline"}
                    className={selectedTone === item.tone ? "bg-indigo-600 text-white hover:bg-indigo-700" : "border-slate-200 bg-white text-slate-600"}
                    onClick={() => setSelectedTone(item.tone)}
                  >
                    {item.tone}
                  </Button>
                ))}
              </div>
              <p className="text-lg font-semibold leading-relaxed text-slate-900">{selectedCaption.caption}</p>
              <p className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50 p-3 text-sm font-medium text-indigo-700">CTA: {selectedCaption.cta}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Caption quality checklist</CardTitle>
            <CardDescription>What the generated text is optimized for.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Clear first-line promise", "Specific audience pain point", "Save/share reason", "One direct CTA", "Natural keyword usage"].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span className="text-sm font-medium text-slate-700">{item}</span>
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Passed</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {hashtagClusters.map((cluster) => (
          <Card key={cluster.name} className="rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg">{cluster.name}</CardTitle>
                  <CardDescription className="mt-1">{cluster.useCase}</CardDescription>
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">{cluster.score}%</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {cluster.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">{tag}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function PostingTimeView() {
  const chartData = optimalPostingSlots.map((slot) => ({ day: slot.day.slice(0, 3), score: slot.score }));
  const bestSlot = [...optimalPostingSlots].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageIntro
        eyebrow="Scheduling intelligence"
        title="Posting Time"
        description="Find the strongest upcoming posting windows based on post engagement, story completion, and audience response patterns."
        action={<Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><Clock className="size-4" /> Schedule best slot</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
          <CardHeader>
            <CardTitle>Best next slot</CardTitle>
            <CardDescription>Highest predicted audience readiness.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
              <p className="text-sm text-slate-500">{bestSlot.day}</p>
              <p className="mt-2 text-5xl font-black text-indigo-600">{bestSlot.slot}</p>
              <p className="mt-2 text-sm text-slate-500">Optimization score: {bestSlot.score}%</p>
            </div>
            <p className="rounded-xl border border-indigo-100 bg-white p-4 text-sm leading-relaxed text-slate-600">{bestSlot.reason}</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly timing score</CardTitle>
            <CardDescription>Higher bars indicate stronger predicted reach and engagement.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 12px 30px rgb(15 23 42 / 0.14)" }} />
                  <Bar dataKey="score" fill="#6366f1" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Recommended weekly schedule</CardTitle>
          <CardDescription>Each row can later be stored as a scheduled content recommendation in SQL Server.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Best time</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Recommendation reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {optimalPostingSlots.map((slot) => (
                <TableRow key={slot.day}>
                  <TableCell className="font-medium text-slate-900">{slot.day}</TableCell>
                  <TableCell className="font-semibold text-indigo-600">{slot.slot}</TableCell>
                  <TableCell><Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">{slot.score}%</Badge></TableCell>
                  <TableCell className="text-slate-600">{slot.reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function AudienceTargetingView() {
  const primary = [...audienceSegments].sort((a, b) => b.affinity - a.affinity)[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageIntro
        eyebrow="Audience intelligence"
        title="Audience Targeting"
        description="Identify the best audience segments for the next content idea and tailor the hook, format, and CTA accordingly."
        action={<Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><Target className="size-4" /> Build targeting plan</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm lg:col-span-1">
          <CardHeader>
            <CardTitle>Primary target</CardTitle>
            <CardDescription>Highest fit for the next recommended post.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Segment</p>
              <h3 className="mt-1 text-2xl font-black tracking-tight text-slate-900">{primary.segment}</h3>
              <p className="mt-2 text-sm text-slate-500">{primary.interests}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricBox label="Audience size" value={formatPeople(primary.size)} />
              <MetricBox label="Affinity" value={`${primary.affinity}%`} />
              <MetricBox label="Age" value={primary.ageRange} />
              <MetricBox label="Format" value={primary.bestFormat} />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Segment strategy</CardTitle>
            <CardDescription>How the dashboard should tailor content for each major audience group.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Segment</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Top location</TableHead>
                  <TableHead>Best format</TableHead>
                  <TableHead>Affinity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {audienceSegments.map((segment) => (
                  <TableRow key={segment.segment}>
                    <TableCell>
                      <p className="font-medium text-slate-900">{segment.segment}</p>
                      <p className="text-xs text-slate-500">{segment.interests}</p>
                    </TableCell>
                    <TableCell>{formatPeople(segment.size)}</TableCell>
                    <TableCell>{segment.ageRange}</TableCell>
                    <TableCell>{segment.topLocation}</TableCell>
                    <TableCell><Badge variant="secondary" className="bg-slate-100 text-slate-600">{segment.bestFormat}</Badge></TableCell>
                    <TableCell className="font-semibold text-indigo-600">{segment.affinity}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Hook angle", body: "Lead with a visible before/after result before explaining the process.", icon: Sparkles },
          { title: "CTA focus", body: "Ask for saves on educational posts and comments on accountability posts.", icon: MessageCircle },
          { title: "Creative note", body: "Use text overlays in the first two seconds for study and creator audiences.", icon: ImageIcon },
        ].map((item) => (
          <Card key={item.title} className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><item.icon className="size-5 text-indigo-600" /> {item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-slate-600">{item.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReportsView() {
  const totalReach = recentPosts.reduce((sum, post) => sum + post.reach, 0);
  const totalAttracted = recentPosts.reduce((sum, post) => sum + getAttractedInterest(post), 0);
  const averageEngagement = recentPosts.reduce((sum, post) => sum + getEngagementRate(post), 0) / recentPosts.length;
  const bestPost = getTopFivePosts(recentPosts)[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageIntro
        eyebrow="Performance reporting"
        title="Reports"
        description="Create a clean weekly report for SDD demonstration: reach, attracted users, mood, best post, and next action."
        action={<Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><FileText className="size-4" /> Export PDF</Button>}
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total reach" value={formatNumber(totalReach)} trend="+14.2%" trendUp icon={Users} color="indigo" />
        <StatCard title="Attracted interest" value={formatNumber(totalAttracted)} trend="+21.7%" trendUp icon={Heart} color="emerald" />
        <StatCard title="Average ER" value={`${averageEngagement.toFixed(1)}%`} trend="+3.6%" trendUp icon={TrendingUp} color="blue" />
        <StatCard title="Best post" value={bestPost.thumbnail} trend={bestPost.format} trendUp icon={Sparkles} color="pink" isTextTrend />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly executive summary</CardTitle>
            <CardDescription>Ready to paste into a Software Design Document or presentation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              `The dashboard imported ${recentPosts.length} recent posts and ${recentStories.length} recent stories from the connected Instagram account.`,
              `The strongest post was “${bestPost.title}” with ${getEngagementRate(bestPost).toFixed(1)}% engagement rate and ${formatPeople(getAttractedInterest(bestPost))} attracted users.`,
              `The next recommended content should use a ${buildInductiveRecommendation(recentPosts).format.toLowerCase()} format and publish around ${buildInductiveRecommendation(recentPosts).postingWindow}.`,
              `Mood tracker currently reports “${getDynamicMood(recentPosts).mood}” because recent engagement is ${getDynamicMood(recentPosts).latestAverage}% compared with ${getDynamicMood(recentPosts).previousAverage}% previously.`,
            ].map((line) => (
              <div key={line} className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">{line}</div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm">
          <CardHeader>
            <CardTitle>Export options</CardTitle>
            <CardDescription>Prototype buttons for future backend export endpoints.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Weekly PDF report", "CSV engagement export", "Mood tracker log", "Recommendation summary"].map((item) => (
              <Button key={item} variant="outline" className="w-full justify-start border-slate-200 bg-white text-slate-700 hover:bg-slate-50">
                <FileText className="mr-2 size-4 text-indigo-600" /> {item}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      <PostsPerformanceTable posts={recentPosts} limit={5} />
    </div>
  );
}

function SettingsView() {
  const [autoSync, setAutoSync] = useState(true);
  const [emailReports, setEmailReports] = useState(true);
  const [moodAlerts, setMoodAlerts] = useState(true);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageIntro
        eyebrow="Workspace preferences"
        title="Settings"
        description="Configure account profile, data sync, notification preferences, and prototype safety controls."
        action={<Button className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"><Settings className="size-4" /> Save settings</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="rounded-2xl border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile settings</CardTitle>
            <CardDescription>These fields are ready to map to the Users and InstagramAccounts tables.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <LabeledInput label="Full name" value={DEMO_USER.name} />
            <LabeledInput label="Email" value={DEMO_USER.email} />
            <LabeledInput label="Instagram handle" value={DEMO_USER.handle} />
            <LabeledInput label="Workspace name" value="AlgoMate Creator Dashboard" />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Session and login controls for the prototype.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <MetricBox label="Current session" value="Active" />
            <MetricBox label="Login method" value="Demo credentials" />
            <MetricBox label="Instagram status" value="Connected" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <ToggleSetting title="Auto-sync Instagram data" description="Refresh posts, stories, and engagement metrics every hour." enabled={autoSync} onToggle={() => setAutoSync(!autoSync)} />
        <ToggleSetting title="Email weekly reports" description="Send a weekly creator performance report to the account email." enabled={emailReports} onToggle={() => setEmailReports(!emailReports)} />
        <ToggleSetting title="Mood performance alerts" description="Warn the user when recent posts underperform and burnout risk rises." enabled={moodAlerts} onToggle={() => setMoodAlerts(!moodAlerts)} />
      </div>

      <Card className="rounded-2xl border-red-100 bg-red-50/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-700">Danger zone</CardTitle>
          <CardDescription>Non-destructive prototype actions only. Real deletion should require backend confirmation.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button variant="outline" className="border-red-200 bg-white text-red-700 hover:bg-red-50">Disconnect Instagram</Button>
          <Button variant="outline" className="border-red-200 bg-white text-red-700 hover:bg-red-50">Clear imported mock data</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Badge className="mb-3 bg-white text-indigo-700 shadow-sm hover:bg-white">{eyebrow}</Badge>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h2>
        <p className="mt-1 max-w-3xl text-base text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function PostMiniRow({ post }: { post: InstagramPost }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${post.gradient} text-xs font-bold text-white`}>{post.thumbnail}</div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">{post.title}</p>
          <p className="text-xs text-slate-500">{post.format} · {formatDateTime(post.publishedAt)}</p>
        </div>
      </div>
      <div className="hidden text-right sm:block">
        <p className="text-sm font-semibold text-emerald-700">{formatPeople(getAttractedInterest(post))}</p>
        <p className="text-xs text-slate-400">attracted</p>
      </div>
    </div>
  );
}

function LabeledInput({ label, value }: { label: string; value: string }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <Input defaultValue={value} className="h-11 border-slate-200 bg-slate-50 focus-visible:ring-indigo-500" />
    </label>
  );
}

function ToggleSetting({ title, description, enabled, onToggle }: { title: string; description: string; enabled: boolean; onToggle: () => void }) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={enabled ? "default" : "outline"}
          className={enabled ? "w-full bg-emerald-600 text-white hover:bg-emerald-700" : "w-full border-slate-200 bg-white text-slate-600"}
          onClick={onToggle}
        >
          {enabled ? "Enabled" : "Disabled"}
        </Button>
      </CardContent>
    </Card>
  );
}

function PlaceholderView({ title, onReturn }: { title: string; onReturn: () => void }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="mb-6 rounded-full bg-indigo-50 p-6">
        <Settings className="size-12 animate-[spin_10s_linear_infinite] text-indigo-300" />
      </div>
      <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">{title}</h2>
      <p className="mx-auto max-w-md text-slate-500">
        This screen is included in the navigation and can be connected to the same SQL-backed data model later.
      </p>
      <Button className="mt-8 border border-indigo-200 bg-white text-indigo-600 shadow-sm hover:bg-indigo-50" onClick={onReturn}>
        Return to Dashboard
      </Button>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color, isTextTrend = false }: any) {
  const colorMap: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-600",
    pink: "bg-pink-100 text-pink-600",
    blue: "bg-blue-100 text-blue-600",
    emerald: "bg-emerald-100 text-emerald-600",
  };

  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className={`rounded-lg p-2 ${colorMap[color]}`}><Icon className="size-4" /></div>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
          {!isTextTrend ? (
            <span className={`flex items-center text-sm font-semibold ${trendUp ? "text-emerald-600" : "text-red-600"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          ) : (
            <span className="text-right text-sm font-medium text-slate-400">{trend}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MetricPill({ label, value, tone }: { label: string; value: string; tone: "positive" | "neutral" }) {
  return (
    <div className={`rounded-xl p-2 ${tone === "positive" ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-600"}`}>
      <p className="text-[10px] uppercase tracking-wide opacity-70">{label}</p>
      <p className="font-semibold leading-tight">{value}</p>
    </div>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-sm">
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}
