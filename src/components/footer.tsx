import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail } from "lucide-react";
import { getPublicContent } from "@/lib/content";

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/kinetro_labs?gwpx=anIzdGYxMjU4a24=", Icon: Instagram },
  { label: "LinkedIn (demo)", href: "https://www.linkedin.com/", Icon: Linkedin },
  { label: "Facebook (demo)", href: "https://www.facebook.com/", Icon: Facebook }
];

export async function Footer() {
  const { content } = await getPublicContent();
  return <footer className="border-t border-white/10 px-6 py-10">
    <div className="grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-4">
      <div><Image src="/images/kinetro-labs-dp.png" alt="Kinetro Labs logo" width={64} height={64} className="h-14 w-14 object-contain" /><p className="mt-3 font-display text-sm font-bold tracking-[.12em]">KINETRO <span className="text-lime">LABS</span></p><p className="mt-2 text-sm text-paper/50">{content.footerText}</p></div>
      <div><p className="mb-3 text-sm font-semibold">Explore</p><div className="grid gap-2 text-sm text-paper/60"><Link className="transition hover:text-lime" href="/#about">About</Link><Link className="transition hover:text-lime" href="/#services">Services</Link><Link className="transition hover:text-lime" href="/register">Registration</Link></div></div>
      <div><p className="mb-3 text-sm font-semibold">Help</p><a href="mailto:contact@kinetrolabs.com?subject=Website%20support%20request" className="inline-flex items-center gap-2 text-sm text-paper/60 transition hover:text-lime"><Mail className="h-4 w-4 text-lime" />contact@kinetrolabs.com</a><p className="mt-2 max-w-xs text-xs leading-5 text-paper/40">Email us if you need help or want to report an issue.</p></div>
      <div><p className="mb-3 text-sm font-semibold">Follow Kinetro</p><div className="flex flex-wrap gap-2">{socials.map(({ label, href, Icon }) => <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} title={label} className="group inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[.03] text-paper/60 transition hover:-translate-y-1 hover:border-lime/40 hover:bg-lime/10 hover:text-lime"><Icon className="h-[18px] w-[18px]" /></a>)}</div><p className="mt-2 text-xs text-paper/40">LinkedIn and Facebook links are demos.</p></div>
    </div>
    <div className="mt-8 w-full border-t border-white/10 pt-5 text-xs text-paper/40">Copyright {new Date().getFullYear()} Kinetro Labs. All rights reserved.</div>
  </footer>;
}
