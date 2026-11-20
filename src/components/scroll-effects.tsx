"use client";

import { motion, useReducedMotion, useScroll } from "framer-motion";
import type { ReactNode } from "react";

export function ScrollReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion();
  return <motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .18 }} transition={{ duration: .65, ease: [.2, .75, .2, 1] }}>{children}</motion.div>;
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  return <motion.div className="scroll-progress" style={{ scaleX: reduceMotion ? 0 : scrollYProgress }} aria-hidden="true" />;
}

export function CapabilitiesTicker() {
  const items = ["Web experiences", "Artificial intelligence", "Brand systems", "Digital growth", "Creative technology"];
  return <div className="capability-ticker" aria-label={items.join(" · ")}><div className="capability-ticker__track" aria-hidden="true">{[0, 1].map((copy) => <div className="capability-ticker__group" key={copy}>{items.map((item) => <span key={`${copy}-${item}`}><i />{item}</span>)}</div>)}</div></div>;
}
