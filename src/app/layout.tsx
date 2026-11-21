import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-effects";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space", display: "swap" });

export const metadata: Metadata = { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), title: { default: "Kinetro Labs | Code the Future", template: "%s | Kinetro Labs" }, description: "Kinetro Labs helps businesses grow through IT solutions, AI technologies and social media services.", keywords: ["IT solutions", "AI technologies", "social media services", "Kinetro Labs"], openGraph: { title: "Kinetro Labs", description: "Code the Future.", type: "website" }, twitter: { card: "summary_large_image", title: "Kinetro Labs", description: "Code the Future." } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${inter.variable} ${space.variable}`}><ScrollProgress /><Navbar />{children}<Footer /></body></html>; }
