import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { log } from "../lib/logger.js";
import { env } from "../config/env.js";
import { renderArticle, type ArticleDraft } from "../render/template.js";
import { renderBlogIndex, renderBlogTeaserCards } from "../render/blogIndex.js";
import { renderSitemap } from "../render/sitemap.js";
import type { Destino, Idea, Language, WriterOutput } from "../types.js";
import type { PublishedPost } from "../lib/state.js";
import { writeDraft } from "./writer.js";

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(here, "..", "..", "..");

function words(html: string): number {
  return html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
}

function readingTime(w: WriterOutput): number {
  return Math.max(3, Math.round((words(w.body_html) + words(w.answer_html)) / 220));
}

function brandName(destino: Destino): string {
  return destino === "pulse" ? "Pulse" : "Picante Studio";
}

function byline(destino: Destino, lang: Language, min: number, date: string): string {
  const brand = brandName(destino);
  return lang === "es"
    ? `Por ${brand} · ${date} · ${min} min de lectura`
    : `By ${brand} · ${date} · ${min} min read`;
}

function toArticle(destino: Destino, lang: Language, w: WriterOutput, date: string): ArticleDraft {
  return {
    destino,
    lang,
    slug: w.slug,
    title: w.title,
    headline: w.headline,
    metaDescription: w.meta_description,
    keywords: w.keywords,
    eyebrow: destino === "pulse" ? "Pulse · Local SEO" : "SEO & GEO",
    answerHtml: w.answer_html,
    byline: byline(destino, lang, readingTime(w), date),
    bodyHtml: w.body_html,
    faq: w.faq,
    datePublished: date,
  };
}

export async function publishIdea(destino: Destino, idea: Idea): Promise<PublishedPost> {
  const date = new Date().toISOString().slice(0, 10);

  const [es, en] = await Promise.all([
    writeDraft(destino, idea, "es"),
    writeDraft(destino, idea, "en"),
  ]);

  const esPath = `/blog/${es.slug}`;
  const enPath = `/en/blog/${en.slug}`;
  const ctx = { siteUrl: env.SITE_URL, esPath, enPath };

  const esHtml = renderArticle(toArticle(destino, "es", es, date), ctx);
  const enHtml = renderArticle(toArticle(destino, "en", en, date), ctx);

  mkdirSync(join(REPO_ROOT, "blog"), { recursive: true });
  mkdirSync(join(REPO_ROOT, "en", "blog"), { recursive: true });
  writeFileSync(join(REPO_ROOT, "blog", `${es.slug}.html`), esHtml, "utf8");
  writeFileSync(join(REPO_ROOT, "en", "blog", `${en.slug}.html`), enHtml, "utf8");
  log.ok(`[${destino}] Publicado: ${esPath} + ${enPath}`);

  return {
    slug: es.slug,
    destino,
    keyword: idea.keyword_primary,
    date,
    title: es.title,
    description: es.meta_description,
    path: esPath,
    pathEn: enPath,
    titleEn: en.title,
    descriptionEn: en.meta_description,
  };
}

function patchTeaser(filePath: string, destino: Destino, cardsHtml: string): void {
  if (!existsSync(filePath)) {
    log.warn(`No existe ${filePath}; teaser ${destino} omitido.`);
    return;
  }
  const start = `<!-- BLOG_TEASER:${destino} -->`;
  const end = `<!-- /BLOG_TEASER:${destino} -->`;
  const raw = readFileSync(filePath, "utf8");
  const i = raw.indexOf(start);
  const j = raw.indexOf(end);
  if (i === -1 || j === -1 || j < i) {
    log.warn(`Marcadores ${destino} no encontrados en ${filePath}`);
    return;
  }
  const next = raw.slice(0, i + start.length) + "\n" + cardsHtml + "\n          " + raw.slice(j);
  writeFileSync(filePath, next, "utf8");
  log.ok(`Teaser ${destino} actualizado en ${filePath}`);
}

/** Regenera índices ES/EN por carril, sitemap y teasers en landings. */
export function rebuildIndex(posts: PublishedPost[]): void {
  mkdirSync(join(REPO_ROOT, "blog"), { recursive: true });
  mkdirSync(join(REPO_ROOT, "en", "blog"), { recursive: true });

  writeFileSync(join(REPO_ROOT, "blog", "index.html"), renderBlogIndex(posts, env.SITE_URL, "picante", "es"), "utf8");
  writeFileSync(join(REPO_ROOT, "en", "blog", "index.html"), renderBlogIndex(posts, env.SITE_URL, "picante", "en"), "utf8");
  // Archivo plano blog/pulse.html (no carpeta): en Vercel /blog/:slug → .html
  // y además no crea /pulse/ que tapa la landing.
  writeFileSync(join(REPO_ROOT, "blog", "pulse.html"), renderBlogIndex(posts, env.SITE_URL, "pulse", "es"), "utf8");
  writeFileSync(join(REPO_ROOT, "en", "blog", "pulse.html"), renderBlogIndex(posts, env.SITE_URL, "pulse", "en"), "utf8");
  writeFileSync(join(REPO_ROOT, "sitemap.xml"), renderSitemap(posts, env.SITE_URL), "utf8");

  patchTeaser(join(REPO_ROOT, "index.html"), "picante", renderBlogTeaserCards(posts, "picante", "es", 3));
  patchTeaser(join(REPO_ROOT, "pulse.html"), "pulse", renderBlogTeaserCards(posts, "pulse", "es", 3));

  log.ok("Índices Picante/Pulse + teasers + sitemap regenerados.");
}
