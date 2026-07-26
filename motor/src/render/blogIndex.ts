import type { Destino, PublishedPost } from "../lib/state.js";

type IndexLang = "es" | "en";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatDate(iso: string, lang: IndexLang): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(lang === "es" ? "es-ES" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const COPY = {
  picante: {
    es: {
      title: "Blog | Picante Studio",
      description: "Growth, performance e IA aplicada al marketing. Guías citables para marcas que escalan.",
      eyebrow: "Blog Picante",
      h1: "Ideas que escalan marcas",
      lead: "SEO, GEO, performance e IA — sin humo. Criterio para equipos que ya venden y quieren crecer.",
      cta: "Agendar",
      empty: "Pronto, los primeros artículos.",
      path: "/blog",
      agenda: "/#agenda-calendario",
      brandHref: "/",
      brandAlt: "Picante",
      logo: "/assets/picante-black.png",
    },
    en: {
      title: "Blog | Picante Studio",
      description: "Growth, performance, and AI for marketing. Citable guides for brands that scale.",
      eyebrow: "Picante Blog",
      h1: "Ideas that scale brands",
      lead: "SEO, GEO, performance & AI — no fluff. For teams that already sell and want to grow.",
      cta: "Book a call",
      empty: "First articles coming soon.",
      path: "/en/blog",
      agenda: "/#agenda-calendario",
      brandHref: "/",
      brandAlt: "Picante",
      logo: "/assets/picante-black.png",
    },
  },
  pulse: {
    es: {
      title: "Blog Pulse | Google Maps y reseñas",
      description: "Guías de reputación local, Google Maps y reseñas para negocios que no quieren perder clientes.",
      eyebrow: "Blog Pulse",
      h1: "Deja de perder clientes en Maps",
      lead: "Competencia, reseñas, rating y acciones concretas — para dueños y operadores de negocios locales.",
      cta: "Agendar demo",
      empty: "Pronto, guías de reputación local.",
      path: "/pulse/blog",
      agenda: "/pulse#agendar",
      brandHref: "/pulse",
      brandAlt: "Pulse by Picante",
      logo: "/assets/picante-black.png",
    },
    en: {
      title: "Pulse Blog | Google Maps & reviews",
      description: "Local reputation, Google Maps, and reviews — guides for businesses that won't lose customers.",
      eyebrow: "Pulse Blog",
      h1: "Stop losing customers on Maps",
      lead: "Competitors, reviews, ratings, and concrete actions for local operators.",
      cta: "Book a demo",
      empty: "Local reputation guides coming soon.",
      path: "/en/pulse/blog",
      agenda: "/pulse#agendar",
      brandHref: "/pulse",
      brandAlt: "Pulse by Picante",
      logo: "/assets/picante-black.png",
    },
  },
} as const;

function postsFor(posts: PublishedPost[], destino: Destino, lang: IndexLang) {
  return posts
    .filter((p) => p.destino === destino)
    .slice()
    .reverse()
    .map((p) => {
      if (lang === "en" && p.pathEn) {
        return {
          href: p.pathEn,
          title: p.titleEn ?? p.title,
          description: p.descriptionEn ?? p.description,
          date: p.date,
        };
      }
      return {
        href: p.path,
        title: p.title,
        description: p.description,
        date: p.date,
      };
    });
}

/** Índice completo /blog o /pulse/blog (y versiones EN). */
export function renderBlogIndex(
  posts: PublishedPost[],
  siteUrl: string,
  destino: Destino = "picante",
  lang: IndexLang = "es",
): string {
  const c = COPY[destino][lang];
  const list = postsFor(posts, destino, lang);
  const canonical = `${siteUrl}${c.path}`;
  const altEs = `${siteUrl}${COPY[destino].es.path}`;
  const altEn = `${siteUrl}${COPY[destino].en.path}`;
  const theme = destino === "pulse" ? "theme-pulse" : "theme-picante";

  const cards = list
    .map(
      (p, i) => `        <a class="post-card${i === 0 ? " post-card--featured" : ""}" href="${p.href}">
          <div class="post-card-meta">
            <time datetime="${esc(p.date)}">${esc(formatDate(p.date, lang))}</time>
          </div>
          <h2>${esc(p.title)}</h2>
          <p>${esc(p.description)}</p>
          <span class="post-card-more" aria-hidden="true">${lang === "es" ? "Leer" : "Read"} →</span>
        </a>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-M9Z9WLK4');</script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="es" href="${altEs}" />
    <link rel="alternate" hreflang="en" href="${altEn}" />
    <link rel="alternate" hreflang="x-default" href="${altEs}" />
    <link rel="icon" type="image/png" href="/assets/picante-red.png" />
    <meta name="theme-color" content="#c31c1e" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
    <style>
      :root {
        --red:#c31c1e; --ink:#14110f; --muted:#6a635d; --line:#e7e2db;
        --bg:#f7f4ef; --card:#fffcf8; --topbar:rgba(247,244,239,.88);
      }
      .theme-pulse {
        --ink:#f4f1ec; --muted:rgba(244,241,236,.62); --line:rgba(255,255,255,.1);
        --bg:#0c0b0a; --card:#161412; --topbar:rgba(12,11,10,.88);
      }
      * { box-sizing:border-box; }
      body { margin:0; font-family:"Inter",system-ui,sans-serif; color:var(--ink); background:var(--bg); -webkit-font-smoothing:antialiased; }
      a { color:inherit; text-decoration:none; }
      .topbar { position:sticky; top:0; z-index:20; background:var(--topbar); backdrop-filter:blur(12px); border-bottom:1px solid var(--line); }
      .topbar-inner { max-width:1120px; margin:0 auto; padding:14px 24px; display:flex; justify-content:space-between; align-items:center; gap:16px; }
      .brand img { height:26px; display:block; }
      .theme-pulse .brand img { filter: invert(1); }
      .top-actions { display:flex; align-items:center; gap:18px; font-size:14px; font-weight:500; }
      .lang a { opacity:.5; }
      .lang a.active { opacity:1; }
      .btn-cta { font-weight:600; }
      .theme-pulse .btn-cta { color:#fff; border:1px solid rgba(255,255,255,.35); padding:8px 14px; border-radius:999px; }
      .hero { max-width:1120px; margin:0 auto; padding:64px 24px 28px; }
      .eyebrow { color:var(--red); font-weight:700; font-size:12px; letter-spacing:.14em; text-transform:uppercase; display:inline-flex; align-items:center; gap:8px; }
      .eyebrow::before { content:""; width:6px; height:6px; border-radius:50%; background:var(--red); }
      h1 { font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:clamp(2.6rem,6.5vw,3.8rem); line-height:1.05; margin:16px 0 14px; letter-spacing:-.01em; max-width:16ch; }
      .lead { color:var(--muted); font-size:1.08rem; line-height:1.6; max-width:48ch; margin:0; }
      .grid { max-width:1120px; margin:0 auto; padding:24px 24px 96px; display:grid; gap:18px; }
      @media (min-width:820px) {
        .grid { grid-template-columns:1.2fr 1fr; align-items:stretch; }
        .post-card--featured { grid-row: span 2; }
      }
      .post-card {
        display:flex; flex-direction:column; gap:12px;
        background:var(--card); border:1px solid var(--line);
        border-radius:18px; padding:28px 26px 24px;
        transition: transform .2s ease, border-color .2s ease;
      }
      .post-card:hover { transform:translateY(-2px); border-color:rgba(195,28,30,.45); }
      .post-card-meta { font-size:13px; color:var(--muted); font-weight:500; }
      .post-card h2 {
        font-family:"Instrument Serif",Georgia,serif; font-weight:400;
        font-size:clamp(1.45rem,2.6vw,1.85rem); line-height:1.15; margin:0; letter-spacing:-.01em;
      }
      .post-card--featured h2 { font-size:clamp(1.85rem,3.4vw,2.35rem); }
      .post-card p { color:var(--muted); margin:0; line-height:1.6; flex:1; }
      .post-card-more { margin-top:8px; font-size:14px; font-weight:600; color:var(--red); }
      .empty { color:var(--muted); padding:40px 0; }
    </style>
  </head>
  <body class="${theme}">
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M9Z9WLK4" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="${c.brandHref}" aria-label="${esc(c.brandAlt)}"><img src="${c.logo}" alt="${esc(c.brandAlt)}" /></a>
        <div class="top-actions">
          <span class="lang">
            <a href="${COPY[destino].es.path}" hreflang="es" class="${lang === "es" ? "active" : ""}">ES</a>
            ·
            <a href="${COPY[destino].en.path}" hreflang="en" class="${lang === "en" ? "active" : ""}">EN</a>
          </span>
          <a class="btn-cta" href="${c.agenda}">${c.cta}</a>
        </div>
      </div>
    </header>
    <header class="hero">
      <p class="eyebrow">${c.eyebrow}</p>
      <h1>${c.h1}</h1>
      <p class="lead">${c.lead}</p>
    </header>
    <main class="grid">
${cards || `      <p class="empty">${c.empty}</p>`}
    </main>
  </body>
</html>
`;
}

/** Cards HTML para incrustar en landings (sin documento completo). */
export function renderBlogTeaserCards(
  posts: PublishedPost[],
  destino: Destino,
  lang: IndexLang = "es",
  limit = 3,
): string {
  const list = postsFor(posts, destino, lang).slice(0, limit);
  if (!list.length) {
    return lang === "es"
      ? `<p class="blog-teaser-empty">Pronto publicamos las primeras guías.</p>`
      : `<p class="blog-teaser-empty">First guides coming soon.</p>`;
  }
  return list
    .map(
      (p) => `<a class="blog-teaser-card" href="${p.href}">
  <time datetime="${esc(p.date)}">${esc(formatDate(p.date, lang))}</time>
  <h3>${esc(p.title)}</h3>
  <p>${esc(p.description)}</p>
  <span class="blog-teaser-more">${lang === "es" ? "Leer artículo" : "Read article"} →</span>
</a>`,
    )
    .join("\n");
}
