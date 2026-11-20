import { ArrowRight, MoveUpRight } from "lucide-react";
import { getPublicContent } from "@/lib/content";
import { Button, SectionLabel } from "@/components/ui";
import { ServiceCards } from "@/components/service-cards";
import { CapabilitiesTicker, ScrollReveal } from "@/components/scroll-effects";
import { AgentDemoButton } from "@/components/agent-demo-button";

export default async function Home() {
  const { content, services } = await getPublicContent();
  const contact = [content.contactEmail, content.whatsapp, content.address].filter(Boolean);
  return <main>
    <section className={`grid-bg relative isolate min-h-[min(760px,92svh)] overflow-hidden px-4 pb-4 pt-24 sm:px-6 md:pb-6 md:pt-28 xl:px-10 ${content.heroBackgroundImage ? "hero-has-background" : ""}`}>
      {content.heroBackgroundImage && <div aria-hidden="true" className="hero-background-photo" style={{ backgroundImage: `url("${content.heroBackgroundImage}")` }} />}
      <div className="hero-layout relative z-10 mx-auto flex w-full items-center">
        <div className="animate-float-in">
          <h1 className="hero-title font-display font-bold tracking-[-.075em]"><span>Code</span><span className="hero-title__future">The Future</span></h1>
          <div className="mt-8 flex flex-wrap items-center gap-3"><Button href="/register" className="min-h-12 bg-lime text-ink shadow-xl shadow-lime/25">Start a project <ArrowRight className="ml-2 h-4 w-4" /></Button><AgentDemoButton /></div>
        </div>
      </div>
    </section>
    <section id="about" className="about-section w-full px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <ScrollReveal className="about-panel grid gap-8 rounded-[2rem] border border-white/10 p-7 md:grid-cols-[.7fr_1fr] md:p-12">
        <div><SectionLabel>About Kinetro</SectionLabel><h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Good ideas deserve <span className="text-gradient">great execution</span></h2></div>
        <p className="max-w-2xl self-end text-lg leading-8 text-paper/65 md:text-xl">{content.about}</p>
      </ScrollReveal>
    </section>
    <CapabilitiesTicker />
    <section id="services" className="w-full px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <div className="services-panel w-full rounded-[2rem] border border-white/10 p-7 md:p-12"><ScrollReveal><SectionLabel>What we do</SectionLabel><div className="mb-8 flex items-end justify-between gap-6"><h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Make your next move <span className="text-lime">count</span></h2><MoveUpRight className="hidden h-10 w-10 text-lime md:block" /></div></ScrollReveal>
        <ServiceCards services={services} />
      </div>
    </section>
    <section id="contact" className="w-full px-3 py-8 sm:px-4 md:px-6 md:py-10"><ScrollReveal><div className="contact-panel w-full overflow-hidden rounded-[2rem] border border-blue-200/30 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 p-8 text-white shadow-2xl shadow-blue-950/30 md:p-12"><div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-end"><div><p className="text-xs font-bold uppercase tracking-[.24em] text-white/75">Your next move starts here</p><h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-6xl">Let's make something meaningful</h2></div><Button href="/register" className="bg-white text-blue-950 shadow-lg shadow-blue-950/20">Start a conversation <ArrowRight className="ml-2 h-4 w-4" /></Button></div>{contact.length > 0 && <div className="mt-8 border-t border-white/20 pt-5 text-sm text-white/80">{contact.join(" / ")}</div>}</div></ScrollReveal></section>
  </main>;
}
