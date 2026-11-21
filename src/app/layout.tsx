import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-effects";
import { brandName, siteOrigin } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "KinetroLabs | Code the Future", template: `%s | ${brandName}` },
  description: "Kinetro Labs delivers IT solutions, AI integration and digital growth services to help businesses build smarter workflows and stronger digital experiences.",
  keywords: ["IT solutions", "AI integration", "social media services", "Kinetro Labs"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: brandName,
    title: "KinetroLabs | Code the Future",
    description: "Technology and digital solutions that move businesses forward.",
    images: [{ url: "/images/kinetro-labs-logo.png", alt: "KinetroLabs logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "KinetroLabs | Code the Future",
    description: "Technology and digital solutions that move businesses forward.",
    images: ["/images/kinetro-labs-logo.png"],
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${inter.variable} ${space.variable}`}><ScrollProgress /><Navbar />{children}<Footer /></body></html>; }
