import { getWorkspaces } from "@/utils/supabase/queries";
import { WorkspaceList } from "@/components/workspaces/workspace-list";

export const metadata = {
  title: "Workspaces | Nexora AI",
};

export default async function WorkspacesPage() {
  const workspaces = await getWorkspaces();
  
  return (
    <div className="max-w-6xl mx-auto w-full">
      <WorkspaceList initialWorkspaces={workspaces} />
    </div>
  );
}
