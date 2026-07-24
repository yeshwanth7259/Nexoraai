import { getUserChats } from "@/utils/supabase/queries";
import { MessageSquare, Clock, Search, ChevronRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function ChatsPage() {
  const chats = await getUserChats();

  return (
    <div className="p-8 max-w-5xl mx-auto w-full pb-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquare className="text-primary" />
          Chat History
        </h1>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search chats..." 
            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 transition-colors w-64"
          />
        </div>
      </div>

      {chats.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center text-slate-400 border border-white/5">
          <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg">No chats found.</p>
          <p className="text-sm opacity-60 mt-2">Start a new conversation on the Home page!</p>
          <Link href="/home" className="mt-6 px-6 py-2 bg-primary hover:bg-accent text-white rounded-full text-sm font-medium transition shadow-[0_0_15px_rgba(109,91,255,0.3)]">
            Start Chat
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {chats.map((chat) => (
            <Link href={`/chats/${chat.id}`} key={chat.id}>
              <div className="glass-panel p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 hover:border-primary/30 transition-all cursor-pointer group border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-slate-200 font-medium text-[15px] group-hover:text-white transition-colors">
                      {chat.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDistanceToNow(new Date(chat.updated_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 group-hover:text-highlight transition-colors transform group-hover:translate-x-1">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
