import { getChatById, getChatMessages } from "@/utils/supabase/queries";
import { ChatInterface } from "@/components/chat/chat-interface";
import { redirect } from "next/navigation";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const chat = await getChatById(params.id);
  
  if (!chat) {
    redirect("/home");
  }

  const messages = await getChatMessages(params.id);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
      
      <div className="pt-6 px-8 flex items-center justify-between z-20 relative max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-slate-200">{chat.title}</h1>
        <div className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Saved in History
        </div>
      </div>

      <ChatInterface chatId={chat.id} initialMessages={messages} />
    </div>
  );
}
