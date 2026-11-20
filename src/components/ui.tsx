import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

export function Button({ children, href, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; href?: string; className?: string }) {
  const styles = `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${className}`;
  return href ? <Link className={styles} href={href as any}>{children}</Link> : <button className={styles} {...props}>{children}</button>;
}

export function SectionLabel({ children }: { children: ReactNode }) { return <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[.22em] text-lime md:text-sm">{children}</p>; }
