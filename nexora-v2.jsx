import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send, Plus, ChevronLeft, Trash2, Copy, Check, Terminal,
  GitBranch, Cpu, Menu, User, Search, Loader, Globe, Shield,
  Zap, Star, Crown, Lock, Eye, FileText, Home, MessageSquare,
  CreditCard, Info, X, ExternalLink, ChevronRight, Code2,
  RefreshCw, AlertCircle
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   NEXORA AI — Think Faster. Build Smarter.
   Yashnav Technologies — Full Production App
   ═══════════════════════════════════════════════════════════════ */

// ─── Nexora Brain Logo SVG ────────────────────────────────────────────────────
function NexoraLogo({ size = 40, showText = false, textSize = "1.2rem" }) {
  const s = size;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: showText ? 10 : 0 }}>
      <svg width={s} height={s} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Brain outline paths */}
        <g filter="url(#glow)" stroke="url(#brainGrad)" strokeWidth="1.8" fill="none" opacity="0.9">
          {/* Main brain top curve */}
          <path d="M 30 55 Q 25 35 35 22 Q 45 10 55 14 Q 65 8 72 20 Q 80 15 82 28 Q 90 35 82 48 Q 85 58 75 65" />
          {/* Left side */}
          <path d="M 30 55 Q 22 62 28 72 Q 32 80 42 78" />
          {/* Right side lower */}
          <path d="M 75 65 Q 80 72 74 78 Q 68 84 60 80" />
          {/* Brain stem */}
          <path d="M 42 78 Q 48 85 50 88 Q 52 85 60 80" />
          {/* Internal folds - left */}
          <path d="M 35 38 Q 42 44 38 52 Q 36 58 42 62" />
          {/* Internal fold - right */}
          <path d="M 62 28 Q 68 36 65 46 Q 62 55 68 60" />
          {/* Cross connection top */}
          <path d="M 45 22 Q 50 30 55 26" />
          {/* Middle connection */}
          <path d="M 40 50 Q 50 44 62 50" />
          {/* Lower connection */}
          <path d="M 42 62 Q 52 68 65 62" />
        </g>
        {/* Neural nodes - glowing dots */}
        {[
          [35, 22], [55, 14], [72, 20], [82, 28],
          [82, 48], [75, 65], [50, 44], [38, 52],
          [65, 46], [42, 62], [50, 88]
        ].map(([cx, cy], i) => (
          <g key={i} filter="url(#nodeGlow)">
            <circle cx={cx} cy={cy} r="3.5" fill="white" opacity="0.95" />
            <circle cx={cx} cy={cy} r="2" fill="white" />
          </g>
        ))}
      </svg>
      {showText && (
        <div>
          <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: textSize, letterSpacing: "0.04em", background: "linear-gradient(90deg, #ffffff 0%, #38bdf8 60%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
            NEXORA <span style={{ background: "linear-gradient(90deg,#38bdf8,#a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
          </div>
          <div style={{ fontSize: "0.58rem", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "2px" }}>Think Faster. Build Smarter.</div>
        </div>
      )}
    </div>
  );
}

// ─── System Prompt ────────────────────────────────────────────────────────────
const NEXORA_SYSTEM = `You are Nexora AI, an advanced AI assistant built by Yashnav Technologies.

Your identity:
- Name: Nexora AI
- Tagline: "Think Faster. Build Smarter."
- Company: Yashnav Technologies
- You are NOT Claude, ChatGPT, or any other known AI. You are Nexora.

Your capabilities:
1. SOFTWARE DEVELOPMENT — React, Node.js, Python, TypeScript, SQL, any stack. Write production-ready code.
2. DEBUGGING — Diagnose and fix bugs clearly with explanations.
3. DEPLOYMENT — Vercel, AWS, Docker, CI/CD, GitHub Actions.
4. TESTING — Unit, integration, E2E tests.
5. ARCHITECTURE — System design, database schemas, API design.
6. DOCUMENTATION — README, API docs, code comments.
7. GENERAL KNOWLEDGE — Answer any question: science, math, history, current events, technology.
8. WEB RESEARCH — When you have web search access, find real-time information and cite sources.
9. ANALYSIS — Analyze data, documents, images, and provide insights.
10. CREATIVE — Writing, brainstorming, problem-solving.

Response style:
- Professional, accurate, direct.
- Code blocks with proper language tags for all code.
- Explain reasoning clearly.
- For web search results, summarize and cite sources.
- Be comprehensive but concise — no filler.
- Always provide actionable, production-ready answers.

You represent Yashnav Technologies. Maintain that identity always.`;

// ─── Markdown Parser ──────────────────────────────────────────────────────────
function parseMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0, key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "code";
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) { codeLines.push(lines[i]); i++; }
      elements.push(<CodeBlock key={key++} code={codeLines.join("\n")} lang={lang} />);
      i++; continue;
    }
    if (line.startsWith("# ")) { elements.push(<h1 key={key++} style={hs(1)}>{line.slice(2)}</h1>); i++; continue; }
    if (line.startsWith("## ")) { elements.push(<h2 key={key++} style={hs(2)}>{line.slice(3)}</h2>); i++; continue; }
    if (line.startsWith("### ")) { elements.push(<h3 key={key++} style={hs(3)}>{line.slice(4)}</h3>); i++; continue; }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const items = [];
      while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("* "))) {
        items.push(<li key={i} style={{ margin: "0.25rem 0", color: "#cbd5e1" }}>{inlineFmt(lines[i].slice(2))}</li>);
        i++;
      }
      elements.push(<ul key={key++} style={{ paddingLeft: "1.4rem", margin: "0.5rem 0" }}>{items}</ul>);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(<li key={i} style={{ margin: "0.25rem 0", color: "#cbd5e1" }}>{inlineFmt(lines[i].replace(/^\d+\. /, ""))}</li>);
        i++;
      }
      elements.push(<ol key={key++} style={{ paddingLeft: "1.4rem", margin: "0.5rem 0" }}>{items}</ol>);
      continue;
    }
    if (line.trim() === "---") { elements.push(<hr key={key++} style={{ border: "none", borderTop: "1px solid #1e293b", margin: "1rem 0" }} />); i++; continue; }
    if (line.trim() === "") { elements.push(<div key={key++} style={{ height: "0.4rem" }} />); i++; continue; }
    elements.push(<p key={key++} style={{ margin: "0.2rem 0", color: "#cbd5e1", lineHeight: "1.75" }}>{inlineFmt(line)}</p>);
    i++;
  }
  return elements;
}

const hs = (level) => ({
  fontSize: ["1.4rem", "1.15rem", "1rem"][level - 1],
  fontWeight: [700, 600, 600][level - 1],
  color: ["#e2e8f0", "#cbd5e1", "#94a3b8"][level - 1],
  margin: ["1.2rem 0 0.5rem", "1rem 0 0.4rem", "0.8rem 0 0.3rem"][level - 1],
  fontFamily: "'Syne', sans-serif"
});

function inlineFmt(text) {
  const parts = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0, match, k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(<span key={k++}>{text.slice(last, match.index)}</span>);
    const m = match[0];
    if (m.startsWith("`")) parts.push(<code key={k++} style={{ background: "#0f172a", color: "#38bdf8", padding: "1px 6px", borderRadius: "4px", fontSize: "0.85em", fontFamily: "'JetBrains Mono', monospace" }}>{m.slice(1, -1)}</code>);
    else if (m.startsWith("**")) parts.push(<strong key={k++} style={{ color: "#e2e8f0", fontWeight: 700 }}>{m.slice(2, -2)}</strong>);
    else if (m.startsWith("[")) parts.push(<a key={k++} href={match[3]} target="_blank" rel="noopener noreferrer" style={{ color: "#38bdf8", textDecoration: "underline" }}>{match[2]}</a>);
    else parts.push(<em key={k++} style={{ color: "#94a3b8" }}>{m.slice(1, -1)}</em>);
    last = match.index + m.length;
  }
  if (last < text.length) parts.push(<span key={k++}>{text.slice(last)}</span>);
  return parts.length > 0 ? parts : text;
}

// ─── Code Block ──────────────────────────────────────────────────────────────
function CodeBlock({ code, lang }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div style={{ margin: "1rem 0", borderRadius: "10px", overflow: "hidden", border: "1px solid #1e293b", background: "#050d1a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 14px", background: "#0a1628", borderBottom: "1px solid #1e293b" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
          <span style={{ marginLeft: 8, fontSize: "0.72rem", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.08em" }}>{lang}</span>
        </div>
        <button onClick={handleCopy} style={{ background: "none", border: "none", cursor: "pointer", color: copied ? "#4ade80" : "#475569", display: "flex", alignItems: "center", gap: 4, fontSize: "0.72rem", fontFamily: "'DM Sans', sans-serif", transition: "color 0.2s" }}>
          {copied ? <Check size={12} /> : <Copy size={12} />}{copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "1rem 1.2rem", overflowX: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.82rem", lineHeight: 1.7, background: "transparent", color: "#e2e8f0" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

// ─── Typing Dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#38bdf8", animation: "nx-pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

// ─── Pricing Page ─────────────────────────────────────────────────────────────
function PricingPage({ onBack }) {
  const [billing, setBilling] = useState("monthly");
  const [selected, setSelected] = useState(null);

  const plans = [
    {
      name: "Free", icon: <Zap size={20} />, color: "#38bdf8", price: { monthly: 0, yearly: 0 },
      features: ["50 messages/day", "Web search included", "Code generation", "Basic support", "1 user"],
      cta: "Get Started Free", popular: false
    },
    {
      name: "Pro", icon: <Star size={20} />, color: "#a855f7", price: { monthly: 19, yearly: 15 },
      features: ["Unlimited messages", "Web search + real-time data", "All coding features", "Priority support", "Chat history sync", "5 users", "API access"],
      cta: "Start Pro Trial", popular: true
    },
    {
      name: "Enterprise", icon: <Crown size={20} />, color: "#f59e0b", price: { monthly: 79, yearly: 65 },
      features: ["Unlimited everything", "Private AI instance", "Custom system prompt", "Company knowledge base", "SSO / SAML", "Unlimited users", "Dedicated support", "SLA guarantee", "Audit logs"],
      cta: "Contact Sales", popular: false
    }
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#050b15" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
            <CreditCard size={13} color="#38bdf8" />
            <span style={{ fontSize: "0.72rem", color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Pricing Plans</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.8rem", fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #e2e8f0, #38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: "0 0 12px" }}>
            Simple, Transparent Pricing
          </h1>
          <p style={{ color: "#475569", fontSize: "1rem" }}>Choose the plan that powers your team at Yashnav Technologies</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginTop: 24, background: "#0d1626", borderRadius: 10, padding: 4, width: "fit-content", margin: "24px auto 0" }}>
            {["monthly", "yearly"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem", fontWeight: 500, background: billing === b ? "linear-gradient(135deg, #0ea5e9, #6366f1)" : "transparent", color: billing === b ? "#fff" : "#475569", transition: "all 0.2s" }}>
                {b === "monthly" ? "Monthly" : "Yearly (save 20%)"}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {plans.map((plan, i) => (
            <div key={i} style={{ background: plan.popular ? "linear-gradient(145deg, #0d1f3c, #0a1628)" : "#07101f", border: `1px solid ${plan.popular ? plan.color + "44" : "#1e293b"}`, borderRadius: 16, padding: "28px 24px", position: "relative", transition: "transform 0.2s", boxShadow: plan.popular ? `0 0 40px ${plan.color}18` : "none" }}>
              {plan.popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: `linear-gradient(135deg, ${plan.color}, #6366f1)`, color: "#fff", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", padding: "4px 14px", borderRadius: 20 }}>MOST POPULAR</div>}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ width: 38, height: 38, background: `${plan.color}18`, border: `1px solid ${plan.color}44`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: plan.color }}>{plan.icon}</div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#e2e8f0" }}>{plan.name}</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.5rem", fontWeight: 800, color: "#e2e8f0" }}>
                  ${plan.price[billing]}
                </span>
                <span style={{ color: "#475569", fontSize: "0.85rem" }}>/mo</span>
              </div>
              <div style={{ marginBottom: 24 }}>
                {plan.features.map((f, j) => (
                  <div key={j} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 16, height: 16, background: `${plan.color}20`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={10} color={plan.color} />
                    </div>
                    <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelected(plan.name)}
                style={{ width: "100%", padding: "11px", borderRadius: 10, border: `1px solid ${plan.color}44`, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: "0.85rem", background: selected === plan.name ? `linear-gradient(135deg, ${plan.color}, #6366f1)` : "transparent", color: selected === plan.name ? "#fff" : plan.color, transition: "all 0.2s" }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, background: "#07101f", border: "1px solid #1e293b", borderRadius: 16, padding: "28px 32px" }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", color: "#e2e8f0", marginBottom: 20 }}>🔐 Security & Compliance</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[
              { icon: <Lock size={16} />, title: "End-to-End Encrypted", desc: "All conversations are encrypted at rest and in transit." },
              { icon: <Shield size={16} />, title: "Private by Default", desc: "Your data is never used to train external AI models." },
              { icon: <Eye size={16} />, title: "GDPR Compliant", desc: "Full data residency control and right to deletion." }
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ color: "#38bdf8", marginTop: 2, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#e2e8f0", marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: "0.76rem", color: "#475569" }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Privacy Policy Page ───────────────────────────────────────────────────────
function PrivacyPage() {
  const sections = [
    { title: "1. Information We Collect", content: "We collect information you provide directly when using Nexora AI, including: conversation messages and prompts, account registration details (name, email), usage data (features used, frequency), and technical data (browser type, IP address, device info). We do not collect payment card details directly — this is handled by our secure payment processor." },
    { title: "2. How We Use Your Information", content: "Your data is used to: provide and improve the Nexora AI service, process your messages and generate AI responses, maintain conversation history for your convenience, monitor for abuse and security threats, send service-related notifications, and comply with legal obligations. We do NOT use your conversations to train AI models without your explicit consent." },
    { title: "3. Data Storage & Security", content: "All data is stored in encrypted databases (Supabase) with AES-256 encryption at rest. Conversations are transmitted over TLS 1.3. We implement rate limiting, authentication tokens, and access controls. API keys are stored as environment variables and never exposed to the client. We conduct regular security audits." },
    { title: "4. Data Sharing", content: "We do not sell, rent, or trade your personal information. We may share data with: AI model providers (only the content of your messages, anonymized), infrastructure providers under strict DPAs, and law enforcement only when legally required. All third parties are contractually bound to protect your data." },
    { title: "5. Your Rights (GDPR / DPDP)", content: "You have the right to: access all personal data we hold about you, correct inaccurate data, request deletion of your data (right to be forgotten), export your data in a portable format, withdraw consent at any time, and lodge a complaint with a supervisory authority. Contact privacy@yashnavtech.com to exercise these rights." },
    { title: "6. Cookies & Tracking", content: "We use only essential cookies required for authentication and session management. We do not use third-party advertising cookies. Analytics are collected in aggregate, anonymized form only. You can disable cookies in your browser, which may affect functionality." },
    { title: "7. Data Retention", content: "Conversation history is retained for 90 days by default on the Free plan, 1 year on Pro, and configurable on Enterprise. Account data is retained for 30 days after account deletion. You may delete your conversation history at any time from your settings." },
    { title: "8. Children's Privacy", content: "Nexora AI is not intended for users under 13 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us information, contact us immediately." },
    { title: "9. Changes to This Policy", content: "We may update this Privacy Policy occasionally. We will notify you of significant changes via email or a prominent notice in the app. Continued use after changes constitutes acceptance of the updated policy." },
    { title: "10. Contact Us", content: "For privacy concerns, data requests, or questions about this policy: Email: privacy@yashnavtech.com | Address: Yashnav Technologies, Bengaluru, Karnataka, India | We respond to all privacy requests within 72 hours." }
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#050b15" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
          <FileText size={13} color="#38bdf8" />
          <span style={{ fontSize: "0.72rem", color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Legal</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#e2e8f0", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ color: "#475569", marginBottom: 8 }}>Yashnav Technologies · Nexora AI</p>
        <p style={{ color: "#334155", fontSize: "0.82rem", marginBottom: 48 }}>Last updated: March 26, 2026 · Effective immediately</p>
        <div style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 12, padding: "16px 20px", marginBottom: 40 }}>
          <p style={{ color: "#94a3b8", fontSize: "0.88rem", lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: "#38bdf8" }}>TL;DR:</strong> We collect only what's necessary to run Nexora AI. We don't sell your data. Your conversations are encrypted. You can delete everything at any time. We're based in India and comply with India's DPDP Act and GDPR.
          </p>
        </div>
        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.05rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 4, height: 18, background: "linear-gradient(180deg, #38bdf8, #6366f1)", borderRadius: 2 }} />
              {s.title}
            </h2>
            <p style={{ color: "#64748b", lineHeight: 1.8, fontSize: "0.88rem" }}>{s.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Security Guide ────────────────────────────────────────────────────────────
function SecurityPage() {
  const steps = [
    { step: "01", title: "Environment Variables", color: "#38bdf8", items: ["Never put API keys in frontend code", "Use Vercel Environment Variables dashboard", "Set ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY", "Rotate keys every 90 days", "Use separate keys for dev/staging/production"] },
    { step: "02", title: "Backend API Route (Vercel)", color: "#a855f7", items: ["All AI calls must go through /api/chat.js serverless function", "Validate user session before processing request", "Implement rate limiting (10 req/min free, 60 req/min pro)", "Log all requests with user ID and timestamp", "Return only necessary data to frontend"] },
    { step: "03", title: "Supabase Security", color: "#22c55e", items: ["Enable Row Level Security (RLS) on all tables", "Users can only read/write their own chats and messages", "Use Supabase Auth for all authentication", "Never use service_role key on frontend", "Enable email verification for new accounts"] },
    { step: "04", title: "Authentication", color: "#f59e0b", items: ["Use Supabase Auth with JWT tokens", "Session expiry: 24 hours (auto refresh)", "Support Google OAuth + Email/Password", "Add 2FA for admin accounts", "Restrict to company email domain if needed"] },
    { step: "05", title: "Deploy to Vercel", color: "#ef4444", items: ["Push code to GitHub repository", "Connect GitHub repo to Vercel", "Add environment variables in Vercel dashboard", "Set custom domain (nexora.yashnavtech.com)", "Enable Vercel's DDoS protection", "Set up Vercel Analytics for monitoring"] },
    { step: "06", title: "Make It Live for Users", color: "#38bdf8", items: ["Share your Vercel URL or custom domain", "Set up Supabase Auth with your domain", "Enable user registration flow", "Add onboarding email sequence", "Monitor with Vercel Analytics + Supabase logs", "Set up uptime monitoring (UptimeRobot free)"] }
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#050b15" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 20, padding: "5px 14px", marginBottom: 20 }}>
          <Shield size={13} color="#38bdf8" />
          <span style={{ fontSize: "0.72rem", color: "#38bdf8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Security & Deployment</span>
        </div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "2.4rem", fontWeight: 800, letterSpacing: "-0.03em", color: "#e2e8f0", marginBottom: 8 }}>Secure & Deploy Nexora</h1>
        <p style={{ color: "#475569", marginBottom: 48 }}>Complete guide to secure your API, protect user data, and go live on Vercel</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ background: "#07101f", border: "1px solid #1e293b", borderRadius: 14, padding: "22px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: s.color, fontWeight: 700, letterSpacing: "0.1em" }}>STEP {s.step}</span>
              </div>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>{s.title}</h3>
              {s.items.map((item, j) => (
                <div key={j} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ width: 5, height: 5, background: s.color, borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.6 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 28, background: "#07101f", border: "1px solid #1e3a2e", borderRadius: 14, padding: "22px 24px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <AlertCircle size={18} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, color: "#22c55e", marginBottom: 6, fontSize: "0.9rem" }}>Required Vercel Environment Variables</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.78rem", color: "#4ade80", lineHeight: 2, background: "#030d08", padding: "12px 16px", borderRadius: 8, border: "1px solid #1e3a2e" }}>
                {`ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx\nNEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsI...\nSUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsI...\nNEXTAUTH_SECRET=your-random-32-char-secret\nNEXTAUTH_URL=https://nexora.yashnavtech.com`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Chat ────────────────────────────────────────────────────────────────
function ChatPage({ webSearchEnabled, setWebSearchEnabled }) {
  const [conversations, setConversations] = useState([
    { id: "default", title: "New Chat", messages: [], createdAt: Date.now() }
  ]);
  const [activeId, setActiveId] = useState("default");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [searchingWeb, setSearchingWeb] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeId);
  const messages = activeConv?.messages || [];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 180) + "px";
    }
  }, [input]);

  const newChat = () => {
    const id = Date.now().toString();
    setConversations(prev => [{ id, title: "New Chat", messages: [], createdAt: Date.now() }, ...prev]);
    setActiveId(id);
    setShowWelcome(true);
    setInput("");
  };

  const deleteChat = (id) => {
    setConversations(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (id === activeId) {
        if (filtered.length === 0) {
          const nid = Date.now().toString();
          const nc = { id: nid, title: "New Chat", messages: [], createdAt: Date.now() };
          setActiveId(nid); setShowWelcome(true);
          return [nc];
        }
        setActiveId(filtered[0].id);
        setShowWelcome(filtered[0].messages.length === 0);
      }
      return filtered;
    });
  };

  const sendMessage = useCallback(async (override) => {
    const txt = override || input.trim();
    if (!txt || isLoading) return;
    setInput(""); setShowWelcome(false); setIsLoading(true);
    const userMsg = { role: "user", content: txt, id: Date.now() };
    setConversations(prev => prev.map(c => {
      if (c.id !== activeId) return c;
      return { ...c, title: c.messages.length === 0 ? txt.slice(0, 42) : c.title, messages: [...c.messages, userMsg] };
    }));
    const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

    try {
      const body = {
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        system: NEXORA_SYSTEM,
        messages: history
      };
      if (webSearchEnabled) {
        body.tools = [{ type: "web_search_20250305", name: "web_search" }];
        setSearchingWeb(true);
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      setSearchingWeb(false);

      // Extract text from all content blocks
      let reply = "";
      if (data.content) {
        const textBlocks = data.content.filter(b => b.type === "text");
        reply = textBlocks.map(b => b.text).join("\n") || "I couldn't generate a response. Please try again.";
      } else {
        reply = data.error?.message || "Something went wrong. Please try again.";
      }

      const aMsg = { role: "assistant", content: reply, id: Date.now() + 1, webSearched: webSearchEnabled };
      setConversations(prev => prev.map(c => c.id !== activeId ? c : { ...c, messages: [...c.messages, aMsg] }));
    } catch (err) {
      setSearchingWeb(false);
      const errMsg = { role: "assistant", content: "⚠️ Network error. Please check your connection and try again.", id: Date.now() + 1 };
      setConversations(prev => prev.map(c => c.id !== activeId ? c : { ...c, messages: [...c.messages, errMsg] }));
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, activeId, webSearchEnabled]);

  const handleKey = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  const QUICK = [
    { icon: <Code2 size={15} />, label: "Build a React component", msg: "Write a production-ready React modal component with animations, close on outside click, and TypeScript types." },
    { icon: <Terminal size={15} />, label: "Fix my bug", msg: "Help me debug: " },
    { icon: <Globe size={15} />, label: "Latest tech news", msg: "What are the latest developments in AI and software development this week?" },
    { icon: <GitBranch size={15} />, label: "Setup CI/CD pipeline", msg: "Set up a complete GitHub Actions CI/CD pipeline for a Next.js app deployed to Vercel with testing." },
    { icon: <Cpu size={15} />, label: "System architecture", msg: "Design a scalable microservices architecture for a SaaS application with 100k users." },
    { icon: <Shield size={15} />, label: "Security audit checklist", msg: "Give me a complete security checklist for a Node.js + React web application before going to production." }
  ];

  const filteredConvs = conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 256 : 0, minWidth: sidebarOpen ? 256 : 0, background: "#07101f", borderRight: "1px solid #0f1f35", display: "flex", flexDirection: "column", overflow: "hidden", transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)", flexShrink: 0 }}>
        <div style={{ padding: "14px 12px 10px", borderBottom: "1px solid #0f1f35" }}>
          <button
            onClick={newChat}
            style={{ width: "100%", padding: "9px 12px", background: "transparent", border: "1px solid #1e293b", borderRadius: 8, color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}
            className="nx-new-btn"
          >
            <Plus size={14} />New conversation
          </button>
        </div>
        <div style={{ padding: "8px 10px 4px" }}>
          <div style={{ position: "relative" }}>
            <Search size={12} color="#475569" style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)" }} />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search..." style={{ width: "100%", background: "#0d1626", border: "1px solid #1e293b", borderRadius: 7, padding: "6px 9px 6px 27px", color: "#94a3b8", fontSize: "0.76rem", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 6px" }}>
          {filteredConvs.map(conv => (
            <div key={conv.id} onClick={() => { setActiveId(conv.id); setShowWelcome(conv.messages.length === 0); }}
              style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", marginBottom: 2, background: conv.id === activeId ? "rgba(30,41,59,0.9)" : "transparent", border: `1px solid ${conv.id === activeId ? "#1e3a5f" : "transparent"}`, display: "flex", alignItems: "center", justifyContent: "space-between", transition: "all 0.15s" }}
              className="nx-conv-item"
            >
              <span style={{ fontSize: "0.78rem", color: conv.id === activeId ? "#e2e8f0" : "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, fontWeight: conv.id === activeId ? 500 : 400 }}>{conv.title}</span>
              <button onClick={e => { e.stopPropagation(); deleteChat(conv.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "2px", flexShrink: 0, opacity: 0, transition: "opacity 0.15s", marginLeft: 4 }} className="nx-del-btn"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>
        <div style={{ padding: "10px 12px", borderTop: "1px solid #0f1f35" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #1e3a5f, #0ea5e9)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={13} color="#e2e8f0" />
            </div>
            <div>
              <div style={{ fontSize: "0.76rem", color: "#e2e8f0", fontWeight: 500 }}>Developer</div>
              <div style={{ fontSize: "0.65rem", color: "#38bdf8" }}>Yashnav Technologies</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Chat Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Toolbar */}
        <div style={{ height: 50, borderBottom: "1px solid #0f1f35", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", background: "#07101f", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => setSidebarOpen(p => !p)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", alignItems: "center" }}>
              {sidebarOpen ? <ChevronLeft size={17} /> : <Menu size={17} />}
            </button>
            <span style={{ fontSize: "0.82rem", color: "#64748b", fontFamily: "'Syne', sans-serif", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 240 }}>{activeConv?.title || "Chat"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* Web Search Toggle */}
            <button
              onClick={() => setWebSearchEnabled(p => !p)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 20, border: `1px solid ${webSearchEnabled ? "rgba(56,189,248,0.4)" : "#1e293b"}`, background: webSearchEnabled ? "rgba(56,189,248,0.08)" : "transparent", cursor: "pointer", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif", fontSize: "0.74rem", color: webSearchEnabled ? "#38bdf8" : "#475569" }}
            >
              <Globe size={13} />
              Web Search {webSearchEnabled ? "ON" : "OFF"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 20, padding: "4px 10px" }}>
              <div style={{ width: 5, height: 5, background: "#4ade80", borderRadius: "50%", animation: "nx-shimmer 2s ease infinite" }} />
              <span style={{ fontSize: "0.68rem", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace" }}>ONLINE</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 20px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            {/* Welcome */}
            {showWelcome && messages.length === 0 && (
              <div style={{ paddingTop: 50, textAlign: "center", animation: "nx-fadein 0.5s ease" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", inset: -18, background: "radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)", borderRadius: "50%", animation: "nx-glow 3s ease infinite" }} />
                    <NexoraLogo size={72} />
                  </div>
                </div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "2.4rem", letterSpacing: "-0.03em", background: "linear-gradient(135deg, #e2e8f0 0%, #38bdf8 50%, #a855f7 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 6 }}>
                  NEXORA AI
                </div>
                <div style={{ color: "#38bdf8", fontSize: "0.88rem", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 6 }}>Think Faster. Build Smarter.</div>
                <div style={{ color: "#334155", fontSize: "0.83rem", marginBottom: 44 }}>Your AI engineering partner — ask anything about code, tech, or the world.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, textAlign: "left", maxWidth: 680, margin: "0 auto" }}>
                  {QUICK.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q.msg)} className="nx-quick-btn"
                      style={{ background: "#07101f", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ color: "#38bdf8" }}>{q.icon}</span>
                      <span style={{ color: "#64748b", fontSize: "0.78rem", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            {messages.map(msg => (
              <div key={msg.id} style={{ padding: "16px 0", borderBottom: "1px solid #0a1628", animation: "nx-fadein 0.3s ease" }}>
                {msg.role === "user" ? (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ maxWidth: "72%", background: "linear-gradient(135deg, #1e3a5f, #1e40af)", borderRadius: "14px 14px 4px 14px", padding: "11px 16px", fontSize: "0.88rem", color: "#e2e8f0", lineHeight: 1.65, boxShadow: "0 2px 12px rgba(30,64,175,0.25)" }}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, marginTop: 2 }}>
                      <NexoraLogo size={28} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <span style={{ fontSize: "0.68rem", color: "#a855f7", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>NEXORA AI</span>
                        {msg.webSearched && <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.64rem", color: "#38bdf8", background: "rgba(56,189,248,0.08)", border: "1px solid rgba(56,189,248,0.2)", borderRadius: 10, padding: "1px 7px" }}><Globe size={9} />Web Search</span>}
                      </div>
                      <div style={{ fontSize: "0.88rem" }}>{parseMarkdown(msg.content)}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div style={{ padding: "16px 0", animation: "nx-fadein 0.3s ease" }}>
                <div style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}><NexoraLogo size={28} /></div>
                  <div style={{ paddingTop: 6 }}>
                    {searchingWeb
                      ? <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#38bdf8", fontSize: "0.78rem" }}><Globe size={14} style={{ animation: "nx-spin 1.5s linear infinite" }} />Searching the web…</div>
                      : <TypingDots />}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} style={{ height: 16 }} />
          </div>
        </div>

        {/* Input */}
        <div style={{ padding: "12px 20px 18px", borderTop: "1px solid #0f1f35", background: "#07101f", flexShrink: 0 }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ background: "#0d1626", border: "1px solid #1e293b", borderRadius: 14, padding: "2px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
              <div style={{ display: "flex", alignItems: "flex-end", padding: "9px 12px 9px 15px", gap: 9 }}>
                <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask Nexora anything — code, debug, general knowledge, news…" disabled={isLoading} rows={1}
                  style={{ flex: 1, background: "transparent", border: "none", resize: "none", color: "#e2e8f0", fontSize: "0.88rem", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, minHeight: "1.5rem", maxHeight: 180, overflow: "auto", outline: "none" }} />
                <button onClick={() => sendMessage()} disabled={isLoading || !input.trim()}
                  style={{ width: 34, height: 34, borderRadius: 9, background: isLoading || !input.trim() ? "#1e293b" : "linear-gradient(135deg, #0ea5e9, #a855f7)", border: "none", cursor: isLoading || !input.trim() ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", boxShadow: isLoading || !input.trim() ? "none" : "0 2px 10px rgba(168,85,247,0.3)" }}>
                  {isLoading ? <Loader size={15} color="#475569" style={{ animation: "nx-spin 1s linear infinite" }} /> : <Send size={14} color={!input.trim() ? "#475569" : "#fff"} />}
                </button>
              </div>
            </div>
            <div style={{ textAlign: "center", marginTop: 7, fontSize: "0.67rem", color: "#1e293b" }}>
              Nexora AI · Yashnav Technologies · Think Faster. Build Smarter. · Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function NexoraApp() {
  const [page, setPage] = useState("chat");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  const NAV = [
    { id: "chat", icon: <MessageSquare size={15} />, label: "Chat" },
    { id: "pricing", icon: <CreditCard size={15} />, label: "Pricing" },
    { id: "security", icon: <Shield size={15} />, label: "Deploy Guide" },
    { id: "privacy", icon: <FileText size={15} />, label: "Privacy" }
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#050b15", color: "#e2e8f0", fontFamily: "'DM Sans', sans-serif", overflow: "hidden", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 2px; }
        textarea { outline: none !important; }
        textarea::placeholder { color: #334155; }
        @keyframes nx-pulse { 0%,80%,100%{transform:scale(0.65);opacity:0.3}40%{transform:scale(1);opacity:1} }
        @keyframes nx-fadein { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes nx-glow { 0%,100%{opacity:0.6;transform:scale(1)}50%{opacity:1;transform:scale(1.05)} }
        @keyframes nx-shimmer { 0%,100%{opacity:0.5}50%{opacity:1} }
        @keyframes nx-spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        .nx-nav-item:hover { background: rgba(56,189,248,0.08) !important; color: #94a3b8 !important; }
        .nx-new-btn:hover { background: rgba(56,189,248,0.08) !important; border-color: rgba(56,189,248,0.3) !important; color: #94a3b8 !important; }
        .nx-quick-btn:hover { background: rgba(56,189,248,0.06) !important; border-color: rgba(56,189,248,0.3) !important; }
        .nx-conv-item:hover { background: rgba(30,41,59,0.6) !important; }
        .nx-conv-item:hover .nx-del-btn { opacity: 1 !important; }
        .nx-del-btn { opacity: 0; }
        div[style*='animation: nx-pulse'] { animation: nx-pulse 1.2s ease-in-out infinite; }
      `}</style>

      {/* Top Nav */}
      <nav style={{ height: 52, background: "#07101f", borderBottom: "1px solid #0f1f35", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", flexShrink: 0, zIndex: 10 }}>
        <NexoraLogo size={34} showText textSize="1rem" />
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} className="nx-nav-item"
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 13px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem", fontWeight: 500, background: page === n.id ? "rgba(56,189,248,0.1)" : "transparent", color: page === n.id ? "#38bdf8" : "#475569", transition: "all 0.2s", borderBottom: page === n.id ? "2px solid #38bdf8" : "2px solid transparent" }}>
              {n.icon}{n.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)", borderRadius: 20, padding: "4px 10px" }}>
            <div style={{ width: 5, height: 5, background: "#4ade80", borderRadius: "50%", animation: "nx-shimmer 2s ease infinite" }} />
            <span style={{ fontSize: "0.65rem", color: "#38bdf8", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>v1.0 · LIVE</span>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {page === "chat" && <ChatPage webSearchEnabled={webSearchEnabled} setWebSearchEnabled={setWebSearchEnabled} />}
        {page === "pricing" && <PricingPage onBack={() => setPage("chat")} />}
        {page === "security" && <SecurityPage />}
        {page === "privacy" && <PrivacyPage />}
      </div>
    </div>
  );
}
