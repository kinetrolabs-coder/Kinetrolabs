import type { Metadata } from "next";

export const siteOrigin = "https://www.kinetrolabs.com";

export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  const canonicalUrl = new URL(pathname, siteOrigin);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Kinetro Labs",
      title,
      description,
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
