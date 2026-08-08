"use client";

import { useEffect, useState } from "react";

export function Greeting({ firstName }: { firstName: string }) {
  const [greeting, setGreeting] = useState("Good evening");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <h1 suppressHydrationWarning className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
      {greeting}, <br className="block sm:hidden" />
      <span className="capitalize text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent dark:from-white dark:to-slate-400">
        {firstName}
      </span>! <span className="animate-wave inline-block origin-bottom-right">👋</span>
    </h1>
  );
}
