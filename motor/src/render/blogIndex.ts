import type { PublishedPost } from "../lib/state.js";

const GTM_ID = "GTM-M9Z9WLK4";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Genera /blog/index.html con la lista de posts publicados (ES). */
export function renderBlogIndex(posts: PublishedPost[], siteUrl: string): string {
  const es = posts.filter((p) => p.path.startsWith("/blog/")).slice().reverse();
  const cards = es
    .map(
      (p) => `          <a class="post" href="${p.path}">
            <h2>${esc(p.title)}</h2>
            <p>${esc(p.description)}</p>
            <span class="meta">${esc(p.date)}</span>
          </a>`,
    )
    .join("\n");

  return `<!doctype html>
<html lang="es">
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
    <title>Blog | Picante Studio</title>
    <meta name="description" content="Ideas sobre growth, performance, IA y SEO/GEO para marcas que escalan." />
    <link rel="canonical" href="${siteUrl}/blog" />
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
      .topbar-inner { max-width:1120px; margin:0 auto; padding:14px 24px; display:flex; justify-content:space-between; align-items:center; }
      .brand img { height:26px; display:block; }
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
        <a class="brand" href="/" aria-label="Picante Studio"><img src="/assets/picante-black.png" alt="Picante" /></a>
        <a href="/#agenda-calendario" style="font-weight:500;font-size:14px;">Agendar</a>
      </div>
    </header>
    <main class="wrap">
      <p class="eyebrow">Blog</p>
      <h1>Growth, performance e IA</h1>
${cards || '          <p class="empty">Pronto, los primeros artículos.</p>'}
    </main>
  </body>
</html>
`;
}
