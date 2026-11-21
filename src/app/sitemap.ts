import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/public-routes.generated";
import { siteOrigin } from "@/lib/seo";

export const dynamic = "force-static";

// Dates are based on the latest Git commit that changed each page's content.
// If a future discovered route has no entry here, use the last verified public
// content date instead of implying that it was modified at build time.
const lastModifiedByPath: Record<string, Date> = {
  "/": new Date("2026-11-21T00:00:00.000Z"),
  "/privacy-policy": new Date("2026-11-21T00:00:00.000Z"),
  "/register": new Date("2026-11-21T00:00:00.000Z"),
  "/terms": new Date("2026-11-21T00:00:00.000Z"),
};
const lastVerifiedPublicContentDate = new Date("2026-11-21T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = new Map(publicRoutes.map((route) => [route.path, route]));

  return [...routes.values()].sort((a, b) => a.path.localeCompare(b.path)).map(({ path }) => {
    const isHome = path === "/";
    const isLegalPage = path === "/privacy-policy" || path === "/terms";

    return {
      url: path === "/" ? siteOrigin : new URL(path, siteOrigin).toString(),
      lastModified: lastModifiedByPath[path] ?? lastVerifiedPublicContentDate,
      changeFrequency: isLegalPage ? "yearly" : isHome ? "weekly" : "monthly",
      priority: isHome ? 1 : isLegalPage ? 0.4 : 0.7,
    };
  });
}
