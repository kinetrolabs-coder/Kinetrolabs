import { createElement } from "react";
import Script from "next/script";

const agentId = "agent_4701m7srw328f8vt5ez8g1h7bak9";

export function ElevenLabsWidget() {
  return <>
    {createElement("elevenlabs-convai", {
      "agent-id": agentId,
      variant: "expanded",
      dismissible: "true",
      "action-text": "Talk to Kinetro",
      "expand-text": "Open the demo",
      "start-call-text": "Start the demo",
      "avatar-orb-color-1": "#3878F8",
      "avatar-orb-color-2": "#9CC2FF"
    })}
    <Script src="https://unpkg.com/@elevenlabs/convai-widget-embed" strategy="afterInteractive" />
  </>;
}
