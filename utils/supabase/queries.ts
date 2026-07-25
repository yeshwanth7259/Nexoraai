import { createClient } from "./server";
import { cookies } from "next/headers";

export async function getUserChats() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: chats, error } = await supabase
    .from("chats")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching chats:", error);
    return [];
  }

  return chats;
}

export async function getChatMessages(chatId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }

  return messages;
}

export async function getChatById(chatId: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: chat, error } = await supabase
    .from("chats")
    .select("*")
    .eq("id", chatId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Error fetching chat:", error);
    return null;
  }

  return chat;
}

export async function getWorkspaces() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: workspaces, error } = await supabase
    .from("workspaces")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching workspaces:", error);
    return [];
  }

  return workspaces;
}
