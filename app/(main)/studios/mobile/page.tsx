import { StudioLayout } from "@/components/studios/studio-layout";
import { Smartphone, ShoppingBag, Utensils, HeartPulse, Video, MapPin } from "lucide-react";

export const metadata = { title: "Mobile Apps Studio | Nexora AI" };

export default function MobileAppStudioPage() {
  return (
    <StudioLayout 
      title="Mobile Apps Studio"
      description="Generate React Native and Expo apps with backend APIs instantly."
      placeholder="Build a food delivery app with real-time tracking..."
      icon={Smartphone}
      templates={[
        { title: "Food Delivery", icon: Utensils },
        { title: "Fitness Tracker", icon: HeartPulse },
        { title: "E-Commerce App", icon: ShoppingBag },
        { title: "Social Media", icon: Video },
        { title: "Travel Guide", icon: MapPin },
        { title: "SaaS Dashboard", icon: Smartphone },
      ]}
    />
  );
}
