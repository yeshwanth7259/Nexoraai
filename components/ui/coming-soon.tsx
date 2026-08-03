import { LucideIcon } from "lucide-react";

export function ComingSoon({ title, icon: Icon }: { title: string, icon: LucideIcon }) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <Icon size={32} className="text-textMuted" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
      <p className="text-textMuted max-w-md">
        This module of the Nexora OS is currently under development. Check back soon for updates!
      </p>
    </div>
  );
}
