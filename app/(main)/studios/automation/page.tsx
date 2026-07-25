import { StudioLayout } from "@/components/studios/studio-layout";
import { Zap, Workflow, Mail, CalendarClock, Webhook, Bot, ServerCog } from "lucide-react";

export const metadata = { title: "Automation Studio | Nexora AI" };

export default function AutomationStudioPage() {
  return (
    <StudioLayout 
      title="Automation Studio"
      description="Build complex workflows using plain English."
      placeholder="When a new client signs up, create a project and notify me..."
      icon={Zap}
      templates={[
        { title: "Client Onboarding", icon: Workflow },
        { title: "Email Autoresponder", icon: Mail },
        { title: "Scheduled Tasks", icon: CalendarClock },
        { title: "Webhook Trigger", icon: Webhook },
        { title: "AI Agent Routing", icon: Bot },
        { title: "Database Sync", icon: ServerCog },
      ]}
    />
  );
}
