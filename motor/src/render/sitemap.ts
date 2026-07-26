import type { PublishedPost } from "../lib/state.js";

const STATIC_PATHS = [
  "/",
  "/pulse",
  "/blog",
  "/en/blog",
  "/pulse/blog",
  "/en/pulse/blog",
  "/pulse/privacidad",
  "/pulse/terminos",
];

/** Genera sitemap.xml con páginas estáticas + posts ES/EN. */
export function renderSitemap(posts: PublishedPost[], siteUrl: string): string {
  const urls = new Set<string>(STATIC_PATHS.map((p) => `${siteUrl}${p === "/" ? "/" : p}`));

  for (const post of posts) {
    urls.add(`${siteUrl}${post.path}`);
    if (post.pathEn) urls.add(`${siteUrl}${post.pathEn}`);
  }

  const today = new Date().toISOString().slice(0, 10);
  const body = [...urls]
    .sort()
    .map(
      (loc) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}
