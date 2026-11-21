"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Bot, Code2, Megaphone, Sparkles, Zap } from "lucide-react";
import type { Service } from "@/types";
import { AgentDemoButton } from "@/components/agent-demo-button";

const icons = { Code2, Sparkles, Megaphone };

export function ServiceCards({ services }: { services: Service[] }) {
  const reduceMotion = useReducedMotion();
  return <div className="grid gap-4 md:grid-cols-3">
    {services.filter((service) => service.is_active).sort((a, b) => a.sort_order - b.sort_order).map((service, index) => {
      const isAiService = service.id === "ai" || service.title.toLowerCase() === "ai technologies" || service.title.toLowerCase() === "ai integration";
      const Icon = isAiService ? Bot : icons[service.icon as keyof typeof icons] ?? Zap;
      const title = isAiService ? "AI Integration" : service.title;
      return <motion.article
        key={service.id}
        className="service-card group relative overflow-hidden rounded-3xl border border-white/10 p-6 md:p-7"
        initial={reduceMotion ? false : { opacity: 0, y: 34, scale: .97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: .2 }}
        transition={{ duration: .65, delay: reduceMotion ? 0 : index * .13, ease: [.2, .75, .2, 1] }}
        whileHover={reduceMotion ? undefined : { y: -9, scale: 1.018, rotateX: 1.5 }}
        whileTap={reduceMotion ? undefined : { scale: .985 }}
        style={{ transformPerspective: 900 }}
        onMouseMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          event.currentTarget.style.setProperty("--pointer-x", `${event.clientX - bounds.left}px`);
          event.currentTarget.style.setProperty("--pointer-y", `${event.clientY - bounds.top}px`);
        }}
      >
        <div className="service-card__shine pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="relative z-10 mb-8 flex items-start justify-between">
          <div className="rounded-2xl border border-lime/25 bg-lime/10 p-3.5 text-lime transition duration-300 group-hover:rotate-6 group-hover:scale-110"><Icon className="h-6 w-6" /></div>
        </div>
        <div className="relative z-10"><h3 className="font-display text-2xl font-semibold tracking-tight">{title}</h3><p className="mt-3 min-h-14 leading-7 text-paper/60">{service.description}</p></div>
        <div className="relative z-10 mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          {isAiService && <AgentDemoButton />}
          <a href="/register" className="inline-flex items-center text-sm font-semibold text-lime">Let's build it <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1.5" /></a>
        </div>
        <span aria-hidden="true" className="service-card__accent pointer-events-none absolute -bottom-10 -right-8 h-40 w-40 rounded-full border border-lime/10 transition duration-500 group-hover:scale-125 group-hover:border-lime/30" />
      </motion.article>;
    })}
  </div>;
}
