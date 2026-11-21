import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-effects";
import { siteOrigin } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: { default: "Kinetro Labs | Code the Future", template: "%s | Kinetro Labs" },
  description: "Kinetro Labs delivers IT solutions, AI integration and digital growth services to help businesses build smarter workflows and stronger digital experiences.",
  keywords: ["IT solutions", "AI integration", "social media services", "Kinetro Labs"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Kinetro Labs",
    title: "Kinetro Labs | Code the Future",
    description: "Technology and digital solutions that move businesses forward.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kinetro Labs | Code the Future",
    description: "Technology and digital solutions that move businesses forward.",
  },
  robots: { index: true, follow: true },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${inter.variable} ${space.variable}`}><ScrollProgress /><Navbar />{children}<Footer /></body></html>; }
