import { BarChart3, Cloud, Blocks, Store } from "lucide-react";

export default function AnalyticsPage() { return <ComingSoon title="Analytics" icon={BarChart3} />; }

export function ComingSoon({ title, icon: Icon }: any) {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <Icon size={32} className="text-slate-400" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">{title}</h1>
      <p className="text-slate-400 max-w-md">
        This module of the Nexora OS is currently under development. Check back soon for updates!
      </p>
    </div>
  );
}
