import { ClientLayout } from "@/components/layout/client-layout";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
