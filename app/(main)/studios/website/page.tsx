import { StudioLayout } from "@/components/studios/studio-layout";
import { Globe, LayoutTemplate, Briefcase, ShoppingCart, Activity, GraduationCap, Building } from "lucide-react";

export const metadata = { title: "Website Studio | Nexora AI" };

export default function WebsiteStudioPage() {
  return (
    <StudioLayout 
      title="Website Studio"
      description="Design, build, and deploy high-converting websites in seconds."
      placeholder="Build an ecommerce website for a modern coffee brand..."
      icon={Globe}
      templates={[
        { title: "Landing Page", icon: LayoutTemplate },
        { title: "Portfolio", icon: Briefcase },
        { title: "Agency", icon: Building },
        { title: "E-Commerce", icon: ShoppingCart },
        { title: "Dashboard", icon: Activity },
        { title: "School", icon: GraduationCap },
      ]}
    />
  );
}
