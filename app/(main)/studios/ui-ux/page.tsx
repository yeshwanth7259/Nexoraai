"use client";
import { StudioLayout } from "@/components/studios/studio-layout";
import { Palette, MousePointerClick, Type, Component, Image as ImageIcon, LayoutGrid } from "lucide-react";


export default function UIUXStudioPage() {
  return (
    <StudioLayout 
      title="UI / UX Studio"
      description="Generate design systems, React components, and full Figma layouts."
      placeholder="Generate a dark mode pricing table component..."
      icon={Palette}
      templates={[
        { title: "Design System", icon: LayoutGrid },
        { title: "Component Library", icon: Component },
        { title: "Landing Page UI", icon: MousePointerClick },
        { title: "Brand Kit", icon: Palette },
        { title: "Typography", icon: Type },
        { title: "Icon Set", icon: ImageIcon },
      ]}
    />
  );
}
