import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const appDirectory = path.join(projectRoot, "src", "app");
const outputFile = path.join(projectRoot, "src", "lib", "public-routes.generated.ts");
const pageExtensions = new Set([".js", ".jsx", ".ts", ".tsx"]);
const excludedSegments = new Set(["admin", "admin-api", "api"]);

function declaresNoIndex(source) {
  return /\brobots\s*:\s*(?:["'`]noindex\b|\{[^}]*\b(?:index\s*:\s*false|noindex\s*:\s*true)\b)/.test(source);
}

async function hasNoIndexMetadata(pageFile, directory) {
  const filesToCheck = [pageFile];
  let current = directory;
  while (current.startsWith(appDirectory)) {
    filesToCheck.push(...["layout.tsx", "layout.ts", "layout.jsx", "layout.js"].map((name) => path.join(current, name)));
    if (current === appDirectory) break;
    current = path.dirname(current);
  }

  for (const file of filesToCheck) {
    try {
      if (declaresNoIndex(await readFile(file, "utf8"))) return true;
    } catch {
      // Missing layout variants are expected; continue checking the route.
    }
  }
  return false;
}

async function discoverPublicPages(directory = appDirectory, routeSegments = []) {
  const entries = await readdir(directory, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (entry.name.startsWith("@") || excludedSegments.has(entry.name.toLowerCase())) continue;
      if (/^\[.*\]$/.test(entry.name)) continue; // Dynamic routes need concrete data values; none exist in the public route tree yet.
      const segments = entry.name.startsWith("(") && entry.name.endsWith(")") ? [] : [entry.name];
      pages.push(...await discoverPublicPages(path.join(directory, entry.name), [...routeSegments, ...segments]));
      continue;
    }

    if (!entry.isFile() || !entry.name.startsWith("page.")) continue;
    if (!pageExtensions.has(path.extname(entry.name))) continue;

    const pageFile = path.join(directory, entry.name);
    if (await hasNoIndexMetadata(pageFile, directory)) continue;
    const route = routeSegments.length ? `/${routeSegments.join("/")}` : "/";
    pages.push({ path: route });
  }

  return pages;
}

const routes = await discoverPublicPages();
const uniqueRoutes = [...new Map(routes.map((route) => [route.path, route])).values()]
  .sort((a, b) => a.path.localeCompare(b.path));

await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, `// Generated automatically before dev, typecheck, lint, and build.\nexport type PublicRoute = { path: string };\nexport const publicRoutes: PublicRoute[] = ${JSON.stringify(uniqueRoutes, null, 2)};\n`, "utf8");
console.log(`Generated sitemap route manifest with ${uniqueRoutes.length} public static page${uniqueRoutes.length === 1 ? "" : "s"}.`);
