import type { Metadata } from "next";

export const siteOrigin = "https://www.kinetrolabs.com";
export const brandName = "KinetroLabs";
export const alternateBrandName = "Kinetro Labs";
export const brandLogoUrl = `${siteOrigin}/images/kinetro-labs-logo.png`;

export function homepageStructuredData(description: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteOrigin}/#website`,
        name: brandName,
        alternateName: alternateBrandName,
        url: `${siteOrigin}/`,
        publisher: { "@id": `${siteOrigin}/#organization` },
      },
      {
        "@type": "Organization",
        "@id": `${siteOrigin}/#organization`,
        name: brandName,
        alternateName: alternateBrandName,
        url: `${siteOrigin}/`,
        logo: { "@type": "ImageObject", url: brandLogoUrl },
        description,
        email: "contact@kinetrolabs.com",
        sameAs: [
          "https://www.linkedin.com/company/kinetro-labs/",
          "https://www.instagram.com/kinetro_labs/",
        ],
      },
    ],
  };
}

export function pageMetadata(title: string, description: string, pathname: string): Metadata {
  const canonicalUrl = new URL(pathname, siteOrigin);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: brandName,
      title,
      description,
      url: canonicalUrl,
      images: [{ url: "/images/kinetro-labs-logo.png", alt: "KinetroLabs logo" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/kinetro-labs-logo.png"],
    },
  };
}
