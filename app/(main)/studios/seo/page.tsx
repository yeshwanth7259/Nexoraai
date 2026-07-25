import { StudioLayout } from "@/components/studios/studio-layout";
import { LineChart, Search, Target, Link as LinkIcon, BarChart, FileSearch } from "lucide-react";

export const metadata = { title: "SEO Studio | Nexora AI" };

export default function SEOStudioPage() {
  return (
    <StudioLayout 
      title="SEO Studio"
      description="Analyze websites, track rankings, and generate SEO-optimized content."
      placeholder="Enter your website URL for a full SEO audit..."
      icon={LineChart}
      templates={[
        { title: "Site Audit", icon: FileSearch },
        { title: "Keyword Research", icon: Search },
        { title: "Competitor Analysis", icon: Target },
        { title: "Backlink Planner", icon: LinkIcon },
        { title: "Rank Tracker", icon: BarChart },
        { title: "On-Page SEO", icon: LineChart },
      ]}
    />
  );
}
