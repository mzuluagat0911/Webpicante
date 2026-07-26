// Renderizador: convierte un borrador estructurado (lo que produce el redactor)
// en la página HTML final, idéntica en estructura al molde validado.
// El agente escribe el CONTENIDO; este módulo pone el "chrome" (head, nav,
// footer, GTM, schema, hreflang) para que todas las páginas sean consistentes.

import type { Destino } from "../lib/state.js";

const GTM_ID = "GTM-M9Z9WLK4";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ArticleDraft {
  destino: Destino;
  lang: "es" | "en";
  slug: string;
  title: string; // para <title> y og:title
  headline: string; // el H1 visible
  metaDescription: string;
  keywords: string[];
  eyebrow: string; // p.ej. "SEO & GEO"
  answerHtml: string; // párrafo respuesta-primero (HTML inline permitido)
  byline: string; // "Por Picante Studio · fecha · 6 min"
  bodyHtml: string; // secciones del cuerpo (h2/p/ul/ol/callout) como HTML
  faq: FaqItem[];
  datePublished: string; // ISO YYYY-MM-DD
}

export interface RenderContext {
  siteUrl: string; // https://wearepicante.com
  esPath: string; // /blog/<slug>
  enPath: string; // /en/blog/<slug>
  ogImage?: string;
}

const T = {
  es: {
    nav: { services: "Servicios", blog: "Blog", schedule: "Agendar" },
    ctaTitle: "¿Quieres que la IA cite a tu marca?",
    ctaText:
      "Conversemos 30 minutos. Sales con un diagnóstico claro de SEO + GEO y los próximos pasos por impacto.",
    ctaLabel: "Agendar diagnóstico",
    ctaHref: "/#agenda-calendario",
    faqTitle: "Preguntas frecuentes",
    footerLinks: '<a href="/">Inicio</a> · <a href="/blog">Blog</a> · <a href="/#agenda-calendario">Agendar</a>',
  },
  en: {
    nav: { services: "Services", blog: "Blog", schedule: "Book a call" },
    ctaTitle: "Want AI to cite your brand?",
    ctaText:
      "Let's talk for 30 minutes. You'll leave with a clear SEO + GEO diagnosis and prioritized next steps.",
    ctaLabel: "Book a diagnosis",
    ctaHref: "/#agenda-calendario",
    faqTitle: "Frequently asked questions",
    footerLinks: '<a href="/">Home</a> · <a href="/blog">Blog</a> · <a href="/#agenda-calendario">Book a call</a>',
  },
} as const;

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function faqAccordion(faq: FaqItem[]): string {
  return faq
    .map(
      (f) => `            <details>
              <summary>${esc(f.q)}</summary>
              <p>${esc(f.a)}</p>
            </details>`,
    )
    .join("\n");
}

function jsonLd(draft: ArticleDraft, ctx: RenderContext, canonical: string, ogImage: string): string {
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: draft.headline,
    description: draft.metaDescription,
    inLanguage: draft.lang,
    author: { "@type": "Organization", name: "Picante Studio", url: `${ctx.siteUrl}/` },
    publisher: {
      "@type": "Organization",
      name: "Picante Studio",
      logo: { "@type": "ImageObject", url: ogImage },
    },
    datePublished: draft.datePublished,
    dateModified: draft.datePublished,
    mainEntityOfPage: canonical,
    image: ogImage,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: draft.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: draft.lang === "es" ? "Inicio" : "Home", item: `${ctx.siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${ctx.siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: draft.headline, item: canonical },
    ],
  };
  return [article, faqLd, breadcrumb]
    .map((o) => `    <script type="application/ld+json">\n${JSON.stringify(o, null, 6)}\n    </script>`)
    .join("\n");
}

export function renderArticle(draft: ArticleDraft, ctx: RenderContext): string {
  const t = T[draft.lang];
  const ogImage = ctx.ogImage ?? `${ctx.siteUrl}/assets/picante-red.png`;
  const esUrl = `${ctx.siteUrl}${ctx.esPath}`;
  const enUrl = `${ctx.siteUrl}${ctx.enPath}`;
  const canonical = draft.lang === "es" ? esUrl : enUrl;

  return `<!doctype html>
<html lang="${draft.lang}">
  <head>
    <meta charset="UTF-8" />
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');</script>
    <!-- End Google Tag Manager -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>${esc(draft.title)}</title>
    <meta name="description" content="${esc(draft.metaDescription)}" />
    <meta name="keywords" content="${esc(draft.keywords.join(", "))}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="es" href="${esUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${esUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${esc(draft.title)}" />
    <meta property="og:description" content="${esc(draft.metaDescription)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${ogImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(draft.title)}" />
    <meta name="twitter:description" content="${esc(draft.metaDescription)}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="theme-color" content="#c31c1e" />
    <link rel="icon" type="image/png" href="/assets/picante-red.png" />
    <link rel="apple-touch-icon" href="/assets/picante-red.png" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap"
      rel="stylesheet"
    />
${jsonLd(draft, ctx, canonical, ogImage)}
    <style>
      :root { --red:#c31c1e; --ink:#14110f; --muted:#6a635d; --line:#e7e2db; --bg:#faf8f5; --card:#fff; --measure:720px; }
      * { box-sizing:border-box; }
      html { scroll-behavior:smooth; }
      body { margin:0; font-family:"Inter",system-ui,sans-serif; color:var(--ink); background:var(--bg); line-height:1.7; -webkit-font-smoothing:antialiased; }
      a { color:inherit; }
      .wrap { max-width:var(--measure); margin:0 auto; padding:0 24px; }
      .topbar { position:sticky; top:0; z-index:50; background:rgba(250,248,245,.85); backdrop-filter:saturate(150%) blur(10px); border-bottom:1px solid var(--line); }
      .topbar-inner { max-width:1120px; margin:0 auto; padding:14px 24px; display:flex; align-items:center; justify-content:space-between; gap:16px; }
      .brand img { height:26px; width:auto; display:block; }
      .topnav { display:flex; align-items:center; gap:22px; font-size:14px; font-weight:500; }
      .topnav a { text-decoration:none; color:var(--muted); transition:color .2s; }
      .topnav a:hover { color:var(--ink); }
      .lang { display:inline-flex; border:1px solid var(--line); border-radius:999px; overflow:hidden; }
      .lang a { padding:4px 10px; font-size:12px; font-weight:600; text-decoration:none; color:var(--muted); }
      .lang a.active { background:var(--ink); color:#fff; }
      @media (max-width:640px){ .topnav .hide-sm{ display:none; } }
      article { padding:56px 0 40px; }
      .eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:12px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--red); }
      .eyebrow::before { content:""; width:6px; height:6px; border-radius:50%; background:var(--red); }
      h1 { font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:clamp(2.4rem,6vw,3.6rem); line-height:1.05; letter-spacing:-.01em; margin:18px 0 20px; }
      .lead-answer { font-size:1.22rem; line-height:1.6; color:var(--ink); border-left:3px solid var(--red); padding:4px 0 4px 20px; margin:0 0 12px; font-weight:500; }
      .byline { color:var(--muted); font-size:14px; margin-bottom:28px; }
      article h2 { font-family:"Instrument Serif",Georgia,serif; font-weight:400; font-size:clamp(1.7rem,3.6vw,2.1rem); line-height:1.15; margin:44px 0 12px; letter-spacing:-.01em; }
      article h3 { font-size:1.08rem; font-weight:700; margin:26px 0 6px; }
      article p { margin:0 0 18px; }
      article ul, article ol { margin:0 0 18px; padding-left:22px; }
      article li { margin:8px 0; }
      article strong { font-weight:700; }
      .callout { background:var(--card); border:1px solid var(--line); border-radius:14px; padding:22px 24px; margin:28px 0; }
      .callout p:last-child { margin-bottom:0; }
      .faq details { border-bottom:1px solid var(--line); padding:6px 0; }
      .faq summary { cursor:pointer; font-weight:600; padding:14px 0; list-style:none; display:flex; justify-content:space-between; align-items:center; gap:16px; }
      .faq summary::-webkit-details-marker { display:none; }
      .faq summary::after { content:"+"; color:var(--red); font-size:1.4rem; line-height:1; }
      .faq details[open] summary::after { content:"–"; }
      .faq details p { margin:0 0 16px; color:var(--muted); }
      .cta { margin:48px 0 8px; background:var(--ink); color:#fff; border-radius:18px; padding:34px 30px; text-align:center; }
      .cta h2 { font-family:"Instrument Serif",Georgia,serif; color:#fff; margin:0 0 10px; }
      .cta p { color:rgba(255,255,255,.75); margin:0 auto 22px; max-width:46ch; }
      .btn { display:inline-block; background:var(--red); color:#fff; text-decoration:none; font-weight:600; padding:14px 26px; border-radius:999px; transition:transform .15s,opacity .2s; }
      .btn:hover { transform:translateY(-1px); opacity:.95; }
      footer { border-top:1px solid var(--line); margin-top:40px; padding:30px 0 50px; }
      .foot { max-width:1120px; margin:0 auto; padding:0 24px; display:flex; flex-wrap:wrap; gap:12px; justify-content:space-between; align-items:center; color:var(--muted); font-size:14px; }
      .foot a { color:var(--muted); text-decoration:none; }
      .foot a:hover { color:var(--ink); }
    </style>
  </head>
  <body>
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
    <header class="topbar">
      <div class="topbar-inner">
        <a class="brand" href="/" aria-label="Picante Studio">
          <img src="/assets/picante-black.png" alt="Picante" width="1639" height="507" />
        </a>
        <nav class="topnav" aria-label="Principal">
          <a class="hide-sm" href="/#servicios">${t.nav.services}</a>
          <a href="/blog">${t.nav.blog}</a>
          <a class="hide-sm" href="/#agenda-calendario">${t.nav.schedule}</a>
          <span class="lang" role="group" aria-label="Idioma">
            <a class="${draft.lang === "es" ? "active" : ""}" href="${ctx.esPath}" hreflang="es">ES</a>
            <a class="${draft.lang === "en" ? "active" : ""}" href="${ctx.enPath}" hreflang="en">EN</a>
          </span>
        </nav>
      </div>
    </header>
    <main>
      <div class="wrap">
        <article>
          <p class="eyebrow">${esc(draft.eyebrow)}</p>
          <h1>${esc(draft.headline)}</h1>
          <p class="lead-answer">${draft.answerHtml}</p>
          <p class="byline">${esc(draft.byline)}</p>
${draft.bodyHtml}
          <h2 id="faq">${t.faqTitle}</h2>
          <div class="faq">
${faqAccordion(draft.faq)}
          </div>
          <div class="cta">
            <h2>${esc(t.ctaTitle)}</h2>
            <p>${esc(t.ctaText)}</p>
            <a class="btn" href="${t.ctaHref}">${esc(t.ctaLabel)}</a>
          </div>
        </article>
      </div>
    </main>
    <footer>
      <div class="foot">
        <p>© 2026 Picante Studio</p>
        <p>${t.footerLinks}</p>
      </div>
    </footer>
  </body>
</html>
`;
}
