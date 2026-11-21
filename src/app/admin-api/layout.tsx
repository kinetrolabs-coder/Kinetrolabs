import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Admin | Kinetro Labs" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminApiLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
