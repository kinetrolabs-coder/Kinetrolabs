import { Bot } from "lucide-react";

const demoUrl = "https://elevenlabs.io/app/talk-to?agent_id=agent_4701m7srw328f8vt5ez8g1h7bak9";

export function AgentDemoButton() {
  return <a href={demoUrl} target="_blank" rel="noopener noreferrer" aria-label="Try Our Agent, opens in a new tab" title="Try Our Agent" className="agent-demo-button group fixed right-4 top-1/2 z-[60] inline-flex min-h-12 min-w-12 -translate-y-1/2 items-center justify-center gap-2.5 rounded-full border border-blue-200/40 bg-gradient-to-r from-blue-500 to-blue-700 px-3.5 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-950/50 transition duration-300 hover:scale-[1.02] hover:border-blue-100/70 hover:shadow-blue-900/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-200 sm:right-6 sm:px-5">
    <Bot aria-hidden="true" className="h-5 w-5 shrink-0 text-blue-100 transition-transform duration-300 group-hover:scale-110" />
    <span className="hidden sm:inline">Try Our Agent</span>
  </a>;
}
