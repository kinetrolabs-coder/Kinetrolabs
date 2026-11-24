import { ArrowRight, MoveUpRight, Target, Workflow, Handshake } from "lucide-react";
import { getPublicContent } from "@/lib/content";
import { Button, SectionLabel } from "@/components/ui";
import { ServiceCards } from "@/components/service-cards";
import { CapabilitiesTicker, ScrollReveal } from "@/components/scroll-effects";
import { brandName, homepageStructuredData, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  `${brandName} | Code the Future`,
  "Kinetro Labs delivers IT solutions, AI integration and digital growth services to help businesses build smarter workflows and stronger digital experiences.",
  "/",
);

export default async function Home() {
  const { content, services } = await getPublicContent();
  const contact = [content.contactEmail, content.whatsapp, content.address].filter(Boolean);
  const structuredData = homepageStructuredData(content.about);
  return <main>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
    />
    <section className={`grid-bg relative isolate px-4 pb-5 pt-24 sm:px-6 md:pt-28 xl:px-10 ${content.heroBackgroundImage ? "hero-has-background" : ""}`}>
      {content.heroBackgroundImage && <div aria-hidden="true" className="hero-background-photo" style={{ backgroundImage: `url("${content.heroBackgroundImage}")` }} />}
      <div className="hero-layout relative z-10 mx-auto flex w-full items-center">
        <div className="animate-float-in max-w-3xl">
          <h1 className="hero-title font-display font-bold tracking-[-.025em]"><span>Code</span><span className="hero-title__future">The Future</span></h1>
          <p className="mt-6 max-w-2xl text-sm leading-6 text-paper/70 sm:text-base sm:leading-7">{content.heroDescription}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3"><Button href="/register" className="min-h-12 bg-lime text-ink shadow-xl shadow-lime/25">Start a Project <ArrowRight className="ml-2 h-4 w-4" /></Button></div>
        </div>
      </div>
    </section>
    <section id="about" className="about-section w-full px-3 pb-8 pt-4 sm:px-4 md:px-6 md:pb-10 md:pt-4">
      <ScrollReveal className="about-panel grid gap-8 rounded-[2rem] border border-white/10 p-7 md:grid-cols-[.7fr_1fr] md:p-12">
        <div><SectionLabel>About Kinetro Labs</SectionLabel><h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">Good ideas deserve <span className="text-gradient">great execution</span></h2></div>
        <p className="max-w-2xl self-end text-lg leading-8 text-paper/65 md:text-xl">{content.about}</p>
      </ScrollReveal>
    </section>
    <CapabilitiesTicker />
    <section id="services" className="w-full px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <div className="services-panel w-full rounded-[2rem] border border-white/10 p-7 md:p-12"><ScrollReveal><SectionLabel>What we do</SectionLabel><div className="mb-8 flex items-end justify-between gap-6"><h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Make your next move <span className="text-lime">count</span></h2><MoveUpRight className="hidden h-10 w-10 text-lime md:block" /></div></ScrollReveal>
        <ServiceCards services={services} />
      </div>
    </section>
    <section id="why-us" className="w-full px-3 py-8 sm:px-4 md:px-6 md:py-10">
      <div className="about-panel w-full rounded-[2rem] border border-white/10 p-7 md:p-12">
        <ScrollReveal>
          <SectionLabel>Why Kinetro Labs</SectionLabel>
          <div className="mb-8 max-w-3xl">
            <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Good work starts with <span className="text-gradient">the right partner</span></h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-paper/60 md:text-lg">We bring technology, creativity and a practical understanding of your goals together to help your business move forward.</p>
          </div>
        </ScrollReveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Built around your goals", text: "We start by understanding your needs, audience and priorities, then shape the work around what matters to your business.", Icon: Target },
            { title: "Practical by design", text: "From AI integrations to digital experiences, we focus on useful solutions that fit the way your team works.", Icon: Workflow },
            { title: "A partner throughout", text: "Clear communication and thoughtful support keep you informed from the first conversation through delivery.", Icon: Handshake },
          ].map(({ title, text, Icon }, index) => <ScrollReveal key={title} delay={index * 0.1} className="service-card rounded-3xl border border-white/10 p-6 md:p-7">
            <div className="mb-5 inline-flex rounded-2xl border border-lime/25 bg-lime/10 p-3.5 text-lime"><Icon className="h-6 w-6" /></div>
            <h3 className="font-display text-xl font-semibold tracking-tight">{title}</h3>
            <p className="mt-3 leading-7 text-paper/60">{text}</p>
          </ScrollReveal>)}
        </div>
      </div>
    </section>
    <section id="contact" className="w-full px-3 py-8 sm:px-4 md:px-6 md:py-10"><ScrollReveal><div className="contact-panel w-full overflow-hidden rounded-[2rem] border border-blue-200/30 bg-gradient-to-br from-blue-400 via-blue-600 to-blue-800 p-8 text-white shadow-2xl shadow-blue-950/30 md:p-12"><div className="grid gap-6 md:max-w-[58rem] md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:gap-8"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.24em] text-white/75">Your next move starts here</p><h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.12] tracking-tight md:text-6xl">Let's make something meaningful</h2></div><Button href="/register" className="bg-white text-blue-950 shadow-lg shadow-blue-950/20">Start a conversation <ArrowRight className="ml-2 h-4 w-4" /></Button></div>{contact.length > 0 && <div className="mt-8 border-t border-white/20 pt-5 text-sm text-white/80">{contact.join(" / ")}</div>}</div></ScrollReveal></section>
  </main>;
}
