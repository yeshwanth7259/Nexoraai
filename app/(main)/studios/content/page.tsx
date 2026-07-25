"use client";
import { StudioLayout } from "@/components/studios/studio-layout";
import { Edit3, FileText, Twitter, Linkedin, Instagram, Video } from "lucide-react";


export default function ContentStudioPage() {
  return (
    <StudioLayout 
      title="Content Studio"
      description="Generate high-converting copy, blog posts, and social media content."
      placeholder="Write a 1000-word blog post about the future of AI in marketing..."
      icon={Edit3}
      templates={[
        { title: "Blog Post", icon: FileText },
        { title: "Twitter Thread", icon: Twitter },
        { title: "LinkedIn Post", icon: Linkedin },
        { title: "Instagram Captions", icon: Instagram },
        { title: "YouTube Script", icon: Video },
        { title: "Copywriting", icon: Edit3 },
      ]}
    />
  );
}
