"use client";

import { useState } from "react";
import Link from "next/link";
import { Rocket, Plus, Trash2, X, Bot, FileText, ArrowRight, Folder } from "lucide-react";
import { createWorkspaceAction, deleteWorkspaceAction } from "@/app/actions/workspaces";

export function WorkspaceList({ initialWorkspaces }: { initialWorkspaces: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // We use optimistic updates or rely on revalidatePath
  // revalidatePath will refresh the server data, so we don't strictly need complex state
  // But for better UX, we'll just handle loading state

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    
    await createWorkspaceAction(formData);
    
    setIsLoading(false);
    setIsModalOpen(false);
    setName("");
    setDescription("");
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // prevent link navigation
    if (confirm("Are you sure you want to delete this workspace?")) {
      await deleteWorkspaceAction(id);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">Your Workspaces</h1>
          <p className="text-textMuted">Manage your distinct AI environments, contexts, and agents.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-accent text-white font-medium transition shadow-[0_0_20px_rgba(109,91,255,0.3)] hover:shadow-[0_0_25px_rgba(109,91,255,0.5)]"
        >
          <Plus size={18} />
          <span>New Workspace</span>
        </button>
      </div>

      {initialWorkspaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border border-borders rounded-2xl bg-bgDarker">
          <Folder size={48} className="text-textMuted mb-4" />
          <h3 className="text-xl font-bold text-foreground mb-2">No workspaces found</h3>
          <p className="text-textMuted mb-6 max-w-sm">Create your first workspace to start organizing your AI agents, knowledge bases, and team context.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-foreground font-medium transition border border-borders"
          >
            Create Workspace
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialWorkspaces.map((ws) => (
            <Link key={ws.id} href={`/workspaces/${ws.id}`} className="group block">
              <div className="glass-panel h-full p-6 rounded-2xl border border-borders hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(109,91,255,0.1)] hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-borders flex items-center justify-center shadow-[inset_0_0_12px_rgba(255,255,255,0.05)]">
                    <Rocket className="text-primary group-hover:text-accent transition-colors" size={24} />
                  </div>
                  <button 
                    onClick={(e) => handleDelete(e, ws.id)}
                    className="p-2 rounded-lg text-textMuted hover:text-red-400 hover:bg-red-400/10 transition opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 relative z-10 group-hover:text-primary transition-colors">{ws.name}</h3>
                <p className="text-sm text-textMuted relative z-10 line-clamp-2 min-h-[40px]">
                  {ws.description || "No description provided for this workspace."}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-textMuted relative z-10 pt-4 border-t border-borders">
                  <div className="flex items-center gap-1.5"><Bot size={14} /> <span>0 Agents</span></div>
                  <div className="flex items-center gap-1.5"><FileText size={14} /> <span>0 Docs</span></div>
                  <div className="ml-auto text-primary opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 transform translate-x-2 group-hover:translate-x-0">
                    <span>Enter</span> <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Workspace Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel border border-borders rounded-2xl shadow-[0_16px_64px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-borders bg-hoverBg">
              <h2 className="text-xl font-bold">Create New Workspace</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-hoverBg text-textMuted hover:text-foreground transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-2">Workspace Name</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background border border-borders rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-textMuted"
                    placeholder="E.g., Personal Blog, SaaS Startup"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-textMuted mb-2">Description <span className="text-slate-600 font-normal">(Optional)</span></label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-background border border-borders rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-textMuted min-h-[100px] resize-none"
                    placeholder="What are you building in this workspace?"
                  />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-hoverBg hover:bg-hoverBg border border-borders transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 rounded-xl font-medium text-white bg-primary hover:bg-accent transition-colors shadow-[0_0_15px_rgba(109,91,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Create Workspace"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
