import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Register for a Consultation | Kinetro Labs",
  "Share your goals with Kinetro Labs. Our team will review your registration and follow up with the right next step.",
  "/register",
);

export default function RegisterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
