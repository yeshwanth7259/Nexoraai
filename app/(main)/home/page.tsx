import Link from "next/link";
import { ArrowRight, Globe, LineChart, MessageSquare, Rocket, Users, Zap, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Command Center | Nexora AI",
};

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-3 animate-in fade-in slide-in-from-bottom-2">
          Good Afternoon, User
        </h1>
        <p className="text-slate-400 text-lg animate-in fade-in slide-in-from-bottom-3">
          Welcome to your Nexora AI Command Center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <MetricCard icon={Globe} label="Websites" value="2" color="from-blue-500/20 to-cyan-500/10" iconColor="text-cyan-400" />
        <MetricCard icon={Rocket} label="Deployments" value="1" color="from-purple-500/20 to-pink-500/10" iconColor="text-purple-400" />
        <MetricCard icon={LineChart} label="SEO Reports" value="4" color="from-green-500/20 to-emerald-500/10" iconColor="text-emerald-400" />
        <MetricCard icon={Users} label="CRM Leads" value="12" color="from-orange-500/20 to-amber-500/10" iconColor="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Continue Working</h2>
              <Link href="/workspaces" className="text-sm text-primary hover:text-accent transition flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickLink icon={Users} title="CRM Dashboard" desc="Manage active leads" href="/studios/crm" />
              <QuickLink icon={Globe} title="Website Builder" desc="Edit agency site" href="/studios/website" />
              <QuickLink icon={LineChart} title="SEO Audit" desc="Review weekly rankings" href="/studios/seo" />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recent AI Conversations</h2>
              <Link href="/assistant" className="text-sm text-primary hover:text-accent transition flex items-center gap-1">
                Open Assistant <ArrowRight size={14} />
              </Link>
            </div>
            
            <div className="glass-panel border border-white/5 rounded-2xl overflow-hidden">
              <div className="divide-y divide-white/5">
                <ConversationItem title="Generate React frontend for CRM" time="2 hours ago" />
                <ConversationItem title="Write 5 blog posts about AI" time="Yesterday" />
                <ConversationItem title="Analyze competitor backlink profile" time="Yesterday" />
              </div>
            </div>
          </section>
        </div>

        <div>
          <section>
            <h2 className="text-xl font-bold mb-4">Tasks & Activity</h2>
            <div className="glass-panel border border-white/5 rounded-2xl p-5 space-y-4">
              <TaskItem text="Review new lead from website" />
              <TaskItem text="Deploy staging environment" />
              <TaskItem text="Approve Q3 marketing copy" />
              <div className="pt-2">
                <button className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition">
                  View All Tasks
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, color, iconColor }: any) {
  return (
    <div className={`glass-panel p-5 rounded-2xl border border-white/5 flex items-center gap-4 hover:border-white/10 transition cursor-pointer relative overflow-hidden group`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-50 group-hover:opacity-100 transition-opacity`}></div>
      <div className={`w-12 h-12 rounded-xl bg-background/50 border border-white/5 flex items-center justify-center backdrop-blur-md relative z-10`}>
        <Icon size={24} className={iconColor} />
      </div>
      <div className="relative z-10">
        <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, title, desc, href }: any) {
  return (
    <Link href={href}>
      <div className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-primary/30 hover:bg-white/5 transition group h-full">
        <Icon size={20} className="text-slate-400 group-hover:text-primary mb-3 transition" />
        <h3 className="font-semibold text-white mb-1 group-hover:text-primary transition">{title}</h3>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
    </Link>
  );
}

function ConversationItem({ title, time }: any) {
  return (
    <div className="p-4 hover:bg-white/5 transition cursor-pointer flex items-center gap-4 group">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
        <MessageSquare size={14} />
      </div>
      <div className="flex-1 truncate">
        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition">{title}</p>
      </div>
      <div className="text-xs text-slate-500 whitespace-nowrap">{time}</div>
    </div>
  );
}

function TaskItem({ text }: any) {
  return (
    <div className="flex items-start gap-3 cursor-pointer group">
      <div className="mt-0.5 text-slate-600 group-hover:text-green-500 transition">
        <CheckCircle2 size={16} />
      </div>
      <p className="text-sm text-slate-300 group-hover:text-white transition leading-tight">{text}</p>
    </div>
  );
}
