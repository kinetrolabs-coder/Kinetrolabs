"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui";

const links = [["Home", "/"], ["About", "/#about"], ["Services", "/#services"], ["Why Us", "/#why-us"], ["Contact", "/#contact"]];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return <header className="site-header fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 md:px-6 md:pt-4">
    <div className="site-header__bar relative mx-auto flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 sm:px-4 md:px-6 md:py-3.5">
      <Link href="/" className="site-header__brand flex min-w-0 items-center gap-2.5 md:gap-3" aria-label="Kinetro Labs home">
        <span className="site-header__logo-wrap grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-blue-200/15 bg-gradient-to-br from-blue-400/15 to-transparent md:h-[52px] md:w-[52px]"><Image src="/images/kinetro-labs-dp.png" alt="Kinetro Labs logo" width={64} height={64} className="site-header__logo h-10 w-10 object-contain md:h-11 md:w-11" priority /></span>
        <span className="whitespace-nowrap font-display text-sm font-bold tracking-[.1em] text-paper sm:text-base md:text-lg md:tracking-[.12em]">KINETRO <span className="text-lime">LABS</span></span>
      </Link>
      <nav className="site-header__nav absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-white/[.07] bg-gradient-to-b from-white/[.055] to-white/[.015] p-1 lg:flex" aria-label="Main navigation">
        {links.map(([label, href]) => <a key={href} href={href} className="site-header__link rounded-full px-5 py-2.5 text-sm font-medium text-paper/70 transition-colors hover:text-white">{label}</a>)}
      </nav>
      <div className="hidden lg:block"><Button href="/register" className="site-header__cta bg-lime px-5 py-3 text-ink shadow-lg shadow-lime/25">Register here</Button></div>
      <button className="site-header__menu rounded-xl border border-white/10 p-2.5 text-paper transition hover:border-lime/50 hover:bg-lime/10 hover:text-lime lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
    </div>
    {open && <nav className="site-header__mobile mx-auto mt-2 w-full rounded-2xl border border-white/10 p-4 lg:hidden" aria-label="Mobile navigation">{links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)} className="block rounded-xl px-3 py-3 text-sm font-medium text-paper/80 transition hover:bg-white/[.06] hover:text-white">{label}</a>)}<Button href="/register" className="mt-3 w-full bg-lime text-ink">Register here</Button></nav>}
  </header>;
}
