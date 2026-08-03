import Link from "next/link";
import { 
  Globe, Smartphone, Palette, LineChart, Users, Edit3, 
  ArrowRight, Mic, Send, Code, Share2, Rocket, FileText, CheckCircle2,
  FolderOpen, Folder, PlayCircle, MessageSquare, Plus, UploadCloud, Sparkles, Video
} from "lucide-react";
import { getDashboardMetrics, getRecentProjects, getUpcomingTasks, getSessionUser } from "@/utils/supabase/queries";
import { formatDistanceToNow } from 'date-fns';
import { InlinePrompt } from "@/components/home/inline-prompt";
import { QuickUploadAction } from "@/components/home/quick-upload-action";

export const metadata = {
  title: "Dashboard | Nexora AI OS",
};

export default async function HomePage() {
  const [dashboardData, projects, tasks, user] = await Promise.all([
    getDashboardMetrics(),
    getRecentProjects(),
    getUpcomingTasks(),
    getSessionUser()
  ]);

  const { projectsCount, metrics } = dashboardData;

  // Calculate greeting
  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 18) greeting = "Good afternoon";

  const firstName = user?.profileName || user?.email?.split('@')[0] || "User";

  return (
    <div className="w-full min-h-full max-w-[1600px] mx-auto text-foreground px-2 sm:px-4 md:px-8 pt-6 pb-32 md:pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (9 columns) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* HERO SECTION */}
          <div className="relative w-full min-h-[300px] md:min-h-[360px] rounded-[2rem] border border-borders bg-gradient-to-br from-[#0B0B14] to-[#12121A] p-6 sm:p-8 md:p-10 flex flex-col justify-between shadow-2xl">
            {/* Background Glows & Graphics */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
              <div className="absolute top-0 right-0 w-[600px] h-full transform translate-x-10 md:translate-x-0">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] bg-blue-600/20 rounded-full blur-[80px]"></div>
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] bg-purple-600/30 rounded-full blur-[60px]"></div>
              
              {/* Orbits and Floating Icons mock */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-borders rounded-full border-dashed animate-[spin_60s_linear_infinite]"></div>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[460px] h-[460px] border border-borders rounded-full animate-[spin_90s_linear_infinite_reverse]"></div>
              
              {/* Center Glowing N */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-cyan-400/30 bg-background/50 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(0,229,255,0.3)] z-0">
                <div className="w-24 h-24 rounded-full border border-purple-500/50 flex items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-600/20 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-blue-600">N</span>
                </div>
              </div>

              {/* Floating Element Mockups */}
              <div className="absolute top-[10%] left-[15%] text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]"><Code size={20} /></div>
              <div className="absolute top-[60%] left-[25%] text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"><LineChart size={24} /></div>
              <div className="absolute top-[20%] right-[20%] text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]"><Users size={20} /></div>
              <div className="absolute top-[55%] right-[30%] text-pink-400 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"><Rocket size={22} /></div>
              </div>
            </div>

            <div className="relative z-10 max-w-xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">{greeting}, <br className="block sm:hidden" /><span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{firstName}</span>! <span className="animate-wave inline-block origin-bottom-right">👋</span></h1>
              <p className="text-textMuted text-[15px] leading-relaxed max-w-md mb-8">
                Welcome to Nexora AI OS. Build, grow & manage your digital universe with the power of artificial intelligence.
              </p>
            </div>

            {/* Inline Prompt */}
            <div className="relative z-20">
              <InlinePrompt />
            </div>
          </div>

          {/* AI STUDIOS */}
          <div className="bg-background rounded-[2rem] border border-borders p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="text-primary" />
                <h2 className="text-lg font-semibold tracking-wide">AI Studios</h2>
              </div>
              <Link href="/studios/website" className="text-sm text-primary hover:text-foreground transition flex items-center gap-1">
                View all Studios <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              <StudioCard 
                icon={LineChart} title="SEO Studio" desc="Rank higher & grow organic traffic" 
                color="green" href="/studios/seo"
              />
              <StudioCard 
                icon={Edit3} title="Content Studio" desc="Create engaging content 10x faster" 
                color="cyan" href="/studios/content"
              />
              <StudioCard 
                icon={FileText} title="Resume Maker" desc="Build ATS-friendly resumes" 
                color="purple" href="/studios/resume"
              />
              <StudioCard 
                icon={Palette} title="UI/UX Studio" desc="Generate modern designs" 
                color="pink" href="/studios/ui-ux"
              />
              <StudioCard 
                icon={Smartphone} title="App Dev Studio" desc="Build mobile apps instantly" 
                color="blue" href="/studios/app-dev"
              />
              <StudioCard 
                icon={Video} title="Video Generation" desc="Create cinematic videos" 
                color="orange" href="/studios/video"
              />
            </div>
          </div>

          {/* BOTTOM ROW (Overview/Projects + Tasks) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* OVERVIEW & PROJECTS */}
            <div className="flex flex-col gap-6">
              <div className="bg-background rounded-[2rem] border border-borders p-6 md:p-8">
                <h2 className="text-lg font-semibold mb-5">Overview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                  <MetricCard value={projectsCount.toString()} label="Projects" change="+ 0%" trend="up" color="blue" icon={FolderOpen} />
                  <MetricCard value={metrics?.seo_traffic?.toString() || "0"} label="SEO Traffic" change={`+ ${metrics?.traffic_growth || 0}%`} trend="up" color="green" icon={LineChart} />
                  <MetricCard value={metrics?.active_leads?.toString() || "0"} label="Active Leads" change={`+ ${metrics?.leads_growth || 0}%`} trend="up" color="orange" icon={Users} />
                </div>
              </div>

              <div className="bg-background rounded-[2rem] border border-borders p-6 md:p-8 flex-1 min-h-[250px]">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold">Recent Projects</h2>
                  <Link href="/projects" className="text-sm text-primary hover:text-foreground transition flex items-center gap-1">
                    View all projects <ArrowRight size={14} />
                  </Link>
                </div>
                <div className="space-y-4">
                  {projects.length > 0 ? (
                    projects.map((proj: any) => (
                      <ProjectRow 
                        key={proj.id} 
                        title={proj.title} 
                        category={proj.type} 
                        time={`Updated ${formatDistanceToNow(new Date(proj.updated_at))} ago`} 
                        progress={proj.progress} 
                        color="bg-blue-500" 
                        iconColor="text-blue-500" 
                      />
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <FolderOpen size={32} className="mx-auto mb-3 text-textMuted" />
                      <p className="text-sm text-textMuted">No projects yet. Build something amazing!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TASKS */}
            <div className="bg-background rounded-[2rem] border border-borders p-6 md:p-8 min-h-[300px]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">Tasks</h2>
                <Link href="/tasks" className="text-sm text-primary hover:text-foreground transition flex items-center gap-1">
                  View all tasks <ArrowRight size={14} />
                </Link>
              </div>
              <div className="space-y-3">
                {tasks.length > 0 ? (
                  tasks.map((task: any) => (
                    <TaskRow 
                      key={task.id} 
                      text={task.title} 
                      date={task.due_date} 
                      dateColor={task.due_date === "Today" ? "text-red-400" : "text-textMuted"} 
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <CheckCircle2 size={32} className="mx-auto mb-3 text-textMuted" />
                    <p className="text-sm text-textMuted">You're all caught up!</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>


        {/* RIGHT COLUMN (3 columns) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* AI ASSISTANT PROMO */}
          <div className="bg-gradient-to-b from-[#1A1438] to-[#0B0B14] rounded-[2rem] border border-purple-500/30 p-6 md:p-8 relative overflow-hidden shadow-[0_10px_40px_-10px_rgba(109,91,255,0.3)]">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/30 rounded-full blur-[40px]"></div>
            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-purple-400" />
                <span className="text-sm font-semibold text-foreground">AI Assistant</span>
              </div>
              <Link href="/assistant" className="text-textMuted hover:text-foreground"><ArrowRight size={14} /></Link>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-foreground mb-2 leading-tight">I'm Nexora AI</h3>
              <p className="text-sm text-textMuted mb-6 leading-relaxed">
                Your digital business partner. How can I help you today?
              </p>
              <Link href="/assistant">
                <button className="w-full py-2.5 rounded-xl bg-primary hover:bg-accent text-foreground text-sm font-medium transition flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(109,91,255,0.4)]">
                  Start a conversation <ArrowRight size={14} />
                </button>
              </Link>
            </div>
          </div>

          {/* ACTIVITY FEED */}
          <div className="bg-background rounded-[2rem] border border-borders p-6 md:p-8 flex-1 min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Activity Feed</h2>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">Live</span>
              </div>
            </div>
            
            {projects.length === 0 && tasks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-textMuted italic">No recent activity yet.</p>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/5 before:to-transparent">
                <ActivityRow icon={CheckCircle2} title="Dashboard initialized" desc="Nexora AI OS" time="Just now" color="text-green-500" bgColor="bg-green-500/10" />
                {projects.map((proj: any, idx: number) => (
                  <ActivityRow 
                    key={idx} 
                    icon={Folder} 
                    title={`Project created`} 
                    desc={proj.title} 
                    time={formatDistanceToNow(new Date(proj.created_at))} 
                    color="text-blue-500" 
                    bgColor="bg-blue-500/10" 
                  />
                ))}
              </div>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-background rounded-[2rem] border border-borders p-6 md:p-8">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/studios/resume"><ActionCard icon={FileText} label="New Resume" color="text-purple-400" bgColor="bg-purple-500/10" /></Link>
              <QuickUploadAction />
              <Link href="/assistant"><ActionCard icon={MessageSquare} label="AI Chat" color="text-pink-400" bgColor="bg-pink-500/10" /></Link>
              <Link href="/studios/seo"><ActionCard icon={LineChart} label="SEO Report" color="text-green-400" bgColor="bg-green-500/10" /></Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- Helper Components ---

function StudioCard({ icon: Icon, title, desc, color, href }: any) {
  const colorMap: any = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20 group-hover:border-purple-500/50 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]",
    pink: "text-pink-400 bg-pink-500/10 border-pink-500/20 group-hover:border-pink-500/50 group-hover:shadow-[0_0_15px_rgba(236,72,153,0.3)]",
    green: "text-green-400 bg-green-500/10 border-green-500/20 group-hover:border-green-500/50 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20 group-hover:border-orange-500/50 group-hover:shadow-[0_0_15px_rgba(249,115,22,0.3)]",
    cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]",
  };

  return (
    <Link href={href}>
      <div className="flex flex-col h-full bg-bgDarker rounded-[1.5rem] border border-borders p-5 transition-all duration-300 hover:bg-hoverBg hover:-translate-y-1 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02]"></div>
        <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center border transition-all duration-300 ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <h3 className="text-[13px] font-bold text-foreground mb-1.5 leading-tight">{title}</h3>
        <p className="text-[10px] text-textMuted leading-snug flex-1">{desc}</p>
        <div className="mt-3 flex justify-end">
          <div className="w-5 h-5 rounded-full bg-hoverBg flex items-center justify-center group-hover:bg-primary group-hover:text-foreground text-textMuted transition">
            <ArrowRight size={10} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function MetricCard({ value, label, change, trend, color, icon: Icon }: any) {
  return (
    <div className="bg-bgDarker border border-borders rounded-2xl p-4 flex flex-col justify-between h-[110px]">
      <div className="flex justify-between items-start">
        <span className="text-2xl font-bold text-foreground leading-none">{value}</span>
        <div className={`w-7 h-7 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-500`}>
          <Icon size={14} />
        </div>
      </div>
      <div>
        <p className="text-[11px] font-medium text-foreground mb-1">{label}</p>
        <p className={`text-[10px] font-semibold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {change} <span className="text-textMuted font-normal ml-1">this week</span>
        </p>
      </div>
    </div>
  );
}

function ProjectRow({ title, category, time, progress, color, iconColor }: any) {
  return (
    <div className="flex items-center justify-between text-sm group cursor-pointer border-b border-borders pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-hoverBg border border-borders flex items-center justify-center group-hover:border-white/20 transition shrink-0">
           <Folder size={14} className={iconColor} />
        </div>
        <div>
          <h4 className="text-[13px] font-medium text-foreground group-hover:text-foreground transition leading-tight">{title}</h4>
          <p className="text-[10px] text-textMuted mt-0.5">{category}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[11px] text-textMuted hidden sm:block whitespace-nowrap">{time}</span>
        <div className="flex items-center gap-2 w-24">
          <div className="flex-1 h-1.5 bg-hoverBg rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }}></div>
          </div>
          <span className="text-[11px] font-semibold text-foreground w-6 text-right">{progress}%</span>
        </div>
      </div>
    </div>
  );
}

function TaskRow({ text, date, dateColor }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-borders bg-bgDarker hover:bg-hoverBg transition cursor-pointer group">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-primary transition flex items-center justify-center shrink-0"></div>
        <span className="text-[13px] text-foreground group-hover:text-foreground transition line-clamp-1">{text}</span>
      </div>
      <span className={`text-[11px] font-semibold ${dateColor} whitespace-nowrap pl-3`}>{date}</span>
    </div>
  );
}

function ActivityRow({ icon: Icon, title, desc, time, color, bgColor }: any) {
  return (
    <div className="relative flex gap-4 w-full">
      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-background shadow-[0_0_0_2px_rgba(255,255,255,0.05)] ${bgColor}`}>
        <Icon size={12} className={color} />
      </div>
      <div className="flex-1 flex justify-between items-start pt-1 overflow-hidden">
        <div className="overflow-hidden pr-2">
          <h4 className="text-[12px] font-bold text-foreground leading-tight truncate">{title}</h4>
          <p className="text-[11px] text-textMuted mt-0.5 truncate">{desc}</p>
        </div>
        <span className="text-[10px] text-textMuted whitespace-nowrap shrink-0">{time}</span>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, label, color, bgColor }: any) {
  return (
    <div className="bg-bgDarker rounded-xl border border-borders p-4 flex flex-col items-center justify-center gap-3 hover:bg-hoverBg transition cursor-pointer group h-full">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${bgColor}`}>
        <Icon size={18} className={color} />
      </div>
      <span className="text-[11px] font-semibold text-foreground group-hover:text-foreground transition text-center">{label}</span>
    </div>
  );
}
