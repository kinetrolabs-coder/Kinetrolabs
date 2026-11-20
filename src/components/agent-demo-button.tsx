import { Bot, ExternalLink } from "lucide-react";

const demoUrl = "https://elevenlabs.io/app/talk-to?agent_id=agent_4701m7srw328f8vt5ez8g1h7bak9";

export function AgentDemoButton() {
  return <a href={demoUrl} target="_blank" rel="noopener noreferrer" aria-label="Try our agent demo, opens in a new tab" className="agent-demo-button group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border border-blue-200/30 bg-white/[.06] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20 transition duration-300 hover:-translate-y-0.5 hover:border-blue-200/60 hover:bg-blue-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200">
    <Bot className="h-5 w-5 text-blue-200 transition group-hover:scale-110" />
    <span>Try our agent</span>
    <ExternalLink className="h-4 w-4 text-white/65 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
  </a>;
}
