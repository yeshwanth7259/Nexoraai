"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function createWorkspaceAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    return { error: "Name is required" };
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      name,
      description,
      user_id: user.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating workspace:", error);
    return { error: "Failed to create workspace" };
  }

  revalidatePath("/workspaces");
  revalidatePath("/");
  
  return { data };
}

export async function deleteWorkspaceAction(id: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase
    .from("workspaces")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting workspace:", error);
    return { error: "Failed to delete workspace" };
  }

  revalidatePath("/workspaces");
  revalidatePath("/");

  return { success: true };
}
