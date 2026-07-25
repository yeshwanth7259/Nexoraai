import { ClientLayout } from "@/components/layout/client-layout";
import { getWorkspaces } from "@/utils/supabase/queries";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const workspaces = await getWorkspaces();
  
  return (
    <ClientLayout workspaces={workspaces}>
      {children}
    </ClientLayout>
  );
}
