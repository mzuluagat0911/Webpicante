import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { log } from "../lib/logger.js";
import { env } from "../config/env.js";
import { renderArticle, type ArticleDraft } from "../render/template.js";
import { renderBlogIndex } from "../render/blogIndex.js";
import { renderSitemap } from "../render/sitemap.js";
import type { Destino, Idea, Language, WriterOutput } from "../types.js";
import type { PublishedPost } from "../lib/state.js";
import { writeDraft } from "./writer.js";

const here = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(here, "..", "..", ".."); // .../Webpicante

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
    eyebrow: "SEO & GEO",
    answerHtml: w.answer_html,
    byline: byline(destino, lang, readingTime(w), date),
    bodyHtml: w.body_html,
    faq: w.faq,
    datePublished: date,
  };
}

/**
 * PUBLICADOR: para una idea genera ES + EN, renderiza el HTML con el molde y
 * lo escribe en /blog y /en/blog. Devuelve el registro para el estado.
 */
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

/** Regenera índices ES/EN + sitemap a partir de los posts publicados. */
export function rebuildIndex(posts: PublishedPost[]): void {
  mkdirSync(join(REPO_ROOT, "blog"), { recursive: true });
  mkdirSync(join(REPO_ROOT, "en", "blog"), { recursive: true });
  writeFileSync(join(REPO_ROOT, "blog", "index.html"), renderBlogIndex(posts, env.SITE_URL, "es"), "utf8");
  writeFileSync(join(REPO_ROOT, "en", "blog", "index.html"), renderBlogIndex(posts, env.SITE_URL, "en"), "utf8");
  writeFileSync(join(REPO_ROOT, "sitemap.xml"), renderSitemap(posts, env.SITE_URL), "utf8");
  log.ok("Índices /blog + /en/blog + sitemap.xml regenerados.");
}
