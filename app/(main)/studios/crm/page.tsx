"use client";

import { useState } from "react";
import { 
  Users, Plus, Search, Filter, MoreHorizontal, MessageSquare, 
  Phone, Mail, Calendar, DollarSign, Target, TrendingUp 
} from "lucide-react";

export default function CRMStudioPage() {
  const [activeTab, setActiveTab] = useState("kanban");

  return (
    <div className="w-full h-full max-w-[1600px] mx-auto text-white pb-12 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Users size={20} />
              </div>
              CRM Studio
            </h1>
            <p className="text-textMuted">Manage your leads, track deals, and close faster with AI insights.</p>
          </div>
          <button className="px-5 py-2.5 bg-primary hover:bg-accent rounded-xl text-sm font-medium transition flex items-center gap-2 shadow-[0_0_15px_rgba(109,91,255,0.3)]">
            <Plus size={16} /> New Deal
          </button>
        </div>
      </div>

      {/* TOP METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-background border border-borders rounded-3xl p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-textMuted mb-1">Total Pipeline</p>
            <h2 className="text-2xl font-bold">$124,500</h2>
          </div>
        </div>
        <div className="bg-background border border-borders rounded-3xl p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Target size={24} />
          </div>
          <div>
            <p className="text-sm text-textMuted mb-1">Active Deals</p>
            <h2 className="text-2xl font-bold">42</h2>
          </div>
        </div>
        <div className="bg-background border border-borders rounded-3xl p-6 flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm text-textMuted mb-1">Win Rate (30d)</p>
            <h2 className="text-2xl font-bold">68%</h2>
          </div>
        </div>
      </div>

      {/* MAIN CRM AREA */}
      <div className="flex-1 bg-background border border-borders rounded-3xl overflow-hidden flex flex-col min-h-[600px]">
        {/* CRM Toolbar */}
        <div className="p-4 border-b border-borders flex items-center justify-between bg-bgDarker/50">
          <div className="flex bg-hoverBg rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('kanban')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition ${activeTab === 'kanban' ? 'bg-white/10 text-white' : 'text-textMuted hover:text-white'}`}
            >
              Kanban Board
            </button>
            <button 
              onClick={() => setActiveTab('list')}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition ${activeTab === 'list' ? 'bg-white/10 text-white' : 'text-textMuted hover:text-white'}`}
            >
              List View
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-hoverBg border border-borders rounded-lg px-3 py-1.5">
              <Search size={14} className="text-textMuted" />
              <input type="text" placeholder="Search deals..." className="bg-transparent border-none text-sm outline-none w-48 placeholder:text-textMuted text-white" />
            </div>
            <button className="p-2 bg-hoverBg border border-borders rounded-lg text-textMuted hover:text-white transition">
              <Filter size={16} />
            </button>
          </div>
        </div>

        {/* KANBAN BOARD */}
        {activeTab === 'kanban' && (
          <div className="flex-1 p-6 overflow-x-auto hide-scrollbar flex items-start gap-6">
            
            {/* Column 1: Leads */}
            <div className="w-[320px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-orange-500/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div> New Leads <span className="text-textMuted font-normal text-sm ml-1">3</span>
                </h3>
                <span className="text-sm font-semibold text-textMuted">$12,500</span>
              </div>
              <KanbanCard company="Acme Corp" contact="John Doe" amount="$4,500" tags={['High Priority']} />
              <KanbanCard company="Stark Industries" contact="Tony S." amount="$8,000" tags={['Enterprise']} />
              <KanbanCard company="Global Tech" contact="Sarah Connor" amount="TBD" tags={[]} />
            </div>

            {/* Column 2: Contacted */}
            <div className="w-[320px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-blue-500/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div> Contacted <span className="text-textMuted font-normal text-sm ml-1">2</span>
                </h3>
                <span className="text-sm font-semibold text-textMuted">$24,000</span>
              </div>
              <KanbanCard company="Wayne Enterprises" contact="Bruce W." amount="$15,000" tags={['Meeting Scheduled']} />
              <KanbanCard company="Daily Planet" contact="Clark K." amount="$9,000" tags={[]} />
            </div>

            {/* Column 3: Proposal */}
            <div className="w-[320px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div> Proposal Sent <span className="text-textMuted font-normal text-sm ml-1">1</span>
                </h3>
                <span className="text-sm font-semibold text-textMuted">$45,000</span>
              </div>
              <KanbanCard company="Oscorp" contact="Norman O." amount="$45,000" tags={['Pending Signature', 'Enterprise']} />
            </div>

            {/* Column 4: Won */}
            <div className="w-[320px] shrink-0 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-green-500/30">
                <h3 className="font-semibold flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Closed Won <span className="text-textMuted font-normal text-sm ml-1">4</span>
                </h3>
                <span className="text-sm font-semibold text-textMuted">$85,000</span>
              </div>
              <KanbanCard company="LexCorp" contact="Lex L." amount="$25,000" tags={['Onboarding']} won />
              <KanbanCard company="Cyberdyne" contact="Miles D." amount="$60,000" tags={[]} won />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

// --- Helper Components ---

function KanbanCard({ company, contact, amount, tags, won }: any) {
  return (
    <div className={`bg-bgDarker border rounded-xl p-4 cursor-grab hover:border-borders transition shadow-lg ${won ? 'border-green-500/20' : 'border-borders'}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-[15px]">{company}</h4>
        <button className="text-textMuted hover:text-white"><MoreHorizontal size={16} /></button>
      </div>
      
      <p className="text-xs text-textMuted flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-white text-[10px]">{contact.charAt(0)}</span>
        {contact}
      </p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag: string, i: number) => (
            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-textMuted">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mt-2 pt-3 border-t border-borders">
        <span className="font-bold text-sm text-foreground">{amount}</span>
        <div className="flex items-center gap-2 text-textMuted">
          <button className="hover:text-white transition"><Mail size={14} /></button>
          <button className="hover:text-white transition"><Calendar size={14} /></button>
        </div>
      </div>
    </div>
  );
}
