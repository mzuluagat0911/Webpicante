import type { PublishedPost } from "../lib/state.js";

const GTM_ID = "GTM-M9Z9WLK4";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

type IndexLang = "es" | "en";

function copy(lang: IndexLang) {
  if (lang === "en") {
    return {
      title: "Blog | Picante Studio",
      description: "Ideas on growth, performance, AI, and SEO/GEO for brands that scale.",
      h1: "Growth, performance & AI",
      eyebrow: "Blog",
      cta: "Book a call",
      empty: "First articles coming soon.",
      pathPrefix: "/en/blog",
      home: "/",
      agenda: "/#agenda-calendario",
      langSwitch: { es: "/blog", en: "/en/blog" },
    };
  }
  return {
    title: "Blog | Picante Studio",
    description: "Ideas sobre growth, performance, IA y SEO/GEO para marcas que escalan.",
    h1: "Growth, performance e IA",
    eyebrow: "Blog",
    cta: "Agendar",
    empty: "Pronto, los primeros artículos.",
    pathPrefix: "/blog",
    home: "/",
    agenda: "/#agenda-calendario",
    langSwitch: { es: "/blog", en: "/en/blog" },
  };
}

function cardsFor(posts: PublishedPost[], lang: IndexLang): string {
  const list =
    lang === "en"
      ? posts
          .filter((p) => p.pathEn)
          .slice()
          .reverse()
          .map((p) => ({
            href: p.pathEn!,
            title: p.titleEn ?? p.title,
            description: p.descriptionEn ?? p.description,
            date: p.date,
          }))
      : posts
          .filter((p) => p.path.startsWith("/blog/"))
          .slice()
          .reverse()
          .map((p) => ({
            href: p.path,
            title: p.title,
            description: p.description,
            date: p.date,
          }));

  return list
    .map(
      (p) => `          <a class="post" href="${p.href}">
            <h2>${esc(p.title)}</h2>
            <p>${esc(p.description)}</p>
            <span class="meta">${esc(p.date)}</span>
          </a>`,
    )
    .join("\n");
}

/** Genera /blog/index.html o /en/blog/index.html. */
export function renderBlogIndex(posts: PublishedPost[], siteUrl: string, lang: IndexLang = "es"): string {
  const c = copy(lang);
  const cards = cardsFor(posts, lang);
  const canonical = `${siteUrl}${c.pathPrefix === "/blog" ? "/blog" : "/en/blog"}`;

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- End Google Tag Manager -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${c.title}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="es" href="${siteUrl}/blog" />
    <link rel="alternate" hreflang="en" href="${siteUrl}/en/blog" />
    <link rel="alternate" hreflang="x-default" href="${siteUrl}/blog" />
    <link rel="icon" type="image/png" href="/assets/picante-red.png" />
    <meta name="theme-color" content="#c31c1e" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
    <style>
      :root { --red:#c31c1e; --ink:#14110f; --muted:#6a635d; --line:#e7e2db; --bg:#faf8f5; }
      * { box-sizing:border-box; }
      body { margin:0; font-family:"Inter",system-ui,sans-serif; color:var(--ink); background:var(--bg); }
      a { color:inherit; text-decoration:none; }
      .topbar { position:sticky; top:0; background:rgba(250,248,245,.85); backdrop-filter:blur(10px); border-bottom:1px solid var(--line); }
      .topbar-inner { max-width:1120px; margin:0 auto; padding:14px 24px; display:flex; justify-content:space-between; align-items:center; gap:16px; }
      .brand img { height:26px; display:block; }
      .top-actions { display:flex; align-items:center; gap:18px; font-size:14px; font-weight:500; }
      .lang a { opacity:.55; }
      .lang a.active { opacity:1; }
      .wrap { max-width:900px; margin:0 auto; padding:56px 24px 80px; }
      .eyebrow { color:var(--red); font-weight:700; font-size:12px; letter-spacing:.12em; text-transform:uppercase; }
      h1 { font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:clamp(2.4rem,6vw,3.4rem); margin:14px 0 40px; }
      .post { display:block; padding:26px 0; border-top:1px solid var(--line); transition:opacity .2s; }
      .post:hover { opacity:.7; }
      .post h2 { font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:1.6rem; margin:0 0 8px; }
      .post p { color:var(--muted); margin:0 0 8px; line-height:1.6; }
      .post .meta { color:var(--muted); font-size:13px; }
      .empty { color:var(--muted); }
    </style>
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="${c.home}" aria-label="Picante Studio"><img src="/assets/picante-black.png" alt="Picante" /></a>
        <div class="top-actions">
          <span class="lang">
            <a href="${c.langSwitch.es}" hreflang="es" class="${lang === "es" ? "active" : ""}">ES</a>
            ·
            <a href="${c.langSwitch.en}" hreflang="en" class="${lang === "en" ? "active" : ""}">EN</a>
          </span>
          <a href="${c.agenda}">${c.cta}</a>
        </div>
      </div>
    </header>
    <main class="wrap">
      <p class="eyebrow">${c.eyebrow}</p>
      <h1>${c.h1}</h1>
${cards || `          <p class="empty">${c.empty}</p>`}
    </main>
  </body>
</html>
`;
}
