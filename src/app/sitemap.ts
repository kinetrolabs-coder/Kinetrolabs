import type { MetadataRoute } from "next";
import { publicRoutes } from "@/lib/public-routes.generated";
import { siteOrigin } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = new Map(publicRoutes.map((route) => [route.path, route]));

  return [...routes.values()].sort((a, b) => a.path.localeCompare(b.path)).map(({ path }) => {
    const isHome = path === "/";
    const isLegalPage = path === "/privacy-policy" || path === "/terms";

    return {
      url: path === "/" ? siteOrigin : new URL(path, siteOrigin).toString(),
      changeFrequency: isLegalPage ? "yearly" : isHome ? "weekly" : "monthly",
      priority: isHome ? 1 : isLegalPage ? 0.4 : 0.7,
    };
  });
}
