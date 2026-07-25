import { StudioLayout } from "@/components/studios/studio-layout";
import { Users, Mail, Phone, FileText, Calendar, Building2 } from "lucide-react";

export const metadata = { title: "CRM Studio | Nexora AI" };

export default function CRMStudioPage() {
  return (
    <StudioLayout 
      title="CRM Studio"
      description="Manage clients, automate follow-ups, and track your sales pipeline."
      placeholder="Create a new project pipeline for my marketing agency..."
      icon={Users}
      templates={[
        { title: "Lead Tracking", icon: Users },
        { title: "Email Sequences", icon: Mail },
        { title: "Client Portal", icon: Building2 },
        { title: "Proposals", icon: FileText },
        { title: "Call Scripts", icon: Phone },
        { title: "Meeting Scheduler", icon: Calendar },
      ]}
    />
  );
}
