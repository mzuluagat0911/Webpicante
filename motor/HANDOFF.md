# 🌶️ Motor de blog Picante — Handoff para continuar en Cursor

Documento de contexto completo. Ábrelo en Cursor; su IA puede leerlo para
entender todo el proyecto sin re-explicar.

---

## 0. Plan por fases (estado actual)

### Fase 1 — Infraestructura del blog ✅ (lista para commit)
- SEO home: canonical/OG/JSON-LD → `https://wearepicante.com`
- Link **Blog** en nav desktop, drawer móvil, footer + i18n ES/EN
- Rewrites Vercel: `/blog`, `/blog/:slug`, `/en/blog`, `/en/blog/:slug`
- `robots.txt` + `sitemap.xml`
- `blog/index.html` + `en/blog/index.html` (con demo GEO)
- `motor/data/state.json` registra `que-es-geo` (evita duplicar tema)
- Brand Pulse enriquecido desde `pulse.html`
- Byline por carril (Picante Studio vs Pulse)
- Publicador regenera índices ES/EN + sitemap
- Workflow también commitea `sitemap.xml` y `robots.txt`

### Fase 2 — Tu lado (bloquea el cron) ⏳
1. GitHub → Settings → Actions → General → **Workflow permissions → Read and write** → Save
2. Confirmar secret `ANTHROPIC_API_KEY` (dijiste que ya está ✅)
3. (Opcional) `.env` local si quieres correr `npm run ideas|run` en tu máquina

### Fase 3 — Primera publicación real
- Run workflow manual (`ideas` primero, luego `run`) **o** esperar cron lunes 13:00 UTC
- Resultado esperado: **1 post Picante + 1 post Pulse** (cada uno ES + EN)
- Revisar en `https://wearepicante.com/blog`

### Fase 4 — Calidad / upgrades (después de 1–2 posts)
- Decidir keywords **A** (web search, actual) vs **B** (DataForSEO)
- Ajuste fino de tono / temas off-limits si hace falta
- (Opcional) gate PR en vez de full-auto a main
- Completar EN del demo `que-es-geo` (hreflang apunta a `/en/blog/what-is-geo` que aún no existe)

---

## 1. Objetivo

Blog **automático** optimizado para **SEO + GEO** (Generative Engine
Optimization = que ChatGPT / Perplexity / AI Overviews citen la marca), que
posicione:
- **Picante Studio** (la agencia: growth, performance, IA).
- **Pulse** (la herramienta de reseñas / Google Maps).

Bilingüe **ES + EN**. Cero trabajo manual recurrente: idea, redacta y publica solo.

**Cadencia:** 1 post Picante + 1 post Pulse por semana (cron lunes).

---

## 2. Stack — dónde vive todo

- **Web:** sitio **HTML estático puro** (sin CMS ni base de datos). Repo
  `github.com/mzuluagat0911/Webpicante`, rama `main`.
- **Deploy:** **Vercel** → producción en `https://wearepicante.com`
  (y `https://webpicante.vercel.app`). Cada push a `main` redespliega.
- **Analytics:** **GTM** `GTM-M9Z9WLK4` en las 4 páginas; **GA4** `G-M2WQ17S7FQ`
  conectado vía GTM (tag "Etiqueta de Google" → All Pages). ✅ Verificado en producción.
- **Motor:** carpeta `/motor` (Node + TypeScript, ESM). Corre en **GitHub Actions**
  (cron) o en local. **NO usa Supabase.**

---

## 3. Arquitectura de los agentes

```
GitHub Actions (cron lunes)  ó  local (npm run run)
        │  usa ANTHROPIC_API_KEY (Claude claude-opus-4-8)
        ▼
   Orquestador  ── por cada carril (picante / pulse):
        │
        ├─► Buscador   (2 pasos: web_search → JSON estructurado de ideas)
        │      · estima qué keywords tienen más demanda (opción A, ver §6)
        │      · no repite temas (lee motor/data/state.json)
        │
        ├─► Redactor   (streaming, salida estructurada, ES + EN)
        │      · devuelve: title, headline, slug, meta, keywords, answer_html, body_html, faq
        │
        ├─► Renderizador (src/render/template.ts)
        │      · envuelve el contenido en el molde HTML validado:
        │        GTM + schema Article/FAQ/Breadcrumb + hreflang + estilo Picante
        │        (Inter + Instrument Serif, rojo #c31c1e)
        │
        └─► Publicador
               · escribe /blog/<slug>.html (ES) y /en/blog/<slug>.html (EN)
               · regenera /blog/index.html + /en/blog/index.html + sitemap.xml
               · actualiza motor/data/state.json
        ▼
   git commit + push a main  →  Vercel despliega  →  en vivo
```

- **Modelo:** `claude-opus-4-8` vía API de Anthropic.
- **Carriles:** `picante` (agencia) y `pulse` (reseñas), cada uno con su contexto
  de marca en `src/config/brand/`.
- **Estado:** `motor/data/state.json` recuerda keywords cubiertas y posts publicados
  (evita duplicados).
- **Gate:** actualmente **full-auto** (commit directo a `main`).

---

## 4. Mapa de archivos (`/motor`)

```
motor/
├── package.json · tsconfig.json · .env.example · README.md · HANDOFF.md (este)
├── data/state.json            ← memoria
└── src/
    ├── index.ts               ← entrada CLI (ideas | run)
    ├── config/
    │   ├── env.ts
    │   ├── context.ts
    │   ├── blog-structure.md
    │   └── brand/
    │       ├── picante.md
    │       └── pulse.md       ← enriquecido desde pulse.html
    ├── lib/
    ├── prompts/
    ├── schemas.ts · types.ts
    ├── agents/
    │   ├── searcher.ts · writer.ts · publisher.ts · orchestrator.ts
    └── render/
        ├── template.ts · blogIndex.ts · sitemap.ts
```

`.github/workflows/blog.yml` — cron + run manual (full-auto a main)

---

## 5. Cómo correr

### Local
```bash
cd ~/Webpicante/motor
printf 'ANTHROPIC_API_KEY=TU_KEY\n' > .env
npm install && npm i @anthropic-ai/sdk@latest
npm run ideas    # solo ideación
npm run run      # genera HTML en ../blog y ../en/blog
cd ~/Webpicante && git add blog en motor/data sitemap.xml && git commit -m "blogs" && git push
```

### Automático (GitHub Actions)
1. **Toggle una vez:** GitHub → repo → Settings → Actions → General →
   **Workflow permissions → "Read and write permissions" → Save**
2. Actions → **"Motor de blog"** → Run workflow (o cron: lunes 13:00 UTC).

---

## 6. Qué falta / decisiones pendientes

- [ ] **Toggle de permisos** (§5, paso 1) — sin esto el Action no puede publicar. ← TÚ
- [x] Secret `ANTHROPIC_API_KEY` en GitHub
- [ ] **Fuente de keywords:** A (actual, gratis) vs B (DataForSEO). Default = A hasta decidir.
- [x] SEO home + link Blog + rewrites + robots/sitemap
- [x] Afinar `brand/pulse.md` desde el sitio (puede refinarse más)
- [ ] EN del demo `que-es-geo` (`/en/blog/what-is-geo`) — opcional / lo genera el motor en otra corrida si se pide

---

## 7. Info opcional de Mateo (mejora calidad, no bloquea Fase 3)

1. Temas off-limits o prioritarios Picante.
2. ¿Casos/números reales en el blog o solo educativo?
3. Si quieres DataForSEO (opción B).
4. Preferencia full-auto vs revisar las primeras 1–2 semanas.

---

## 8. Ya resuelto — NO rehacer

- ✅ GTM + GA4 vía GTM
- ✅ Motor de agentes en el repo
- ✅ Secret Anthropic en GitHub
- ✅ Molde HTML validado (`blog/que-es-geo.html`)
- ✅ Brand Picante + Pulse (base)
- ✅ Fase 1 infraestructura blog

---

## 9. Notas técnicas

- **SDK Anthropic:** `@latest`. Features: `output_config`, tool `web_search_20260209`,
  `thinking: {type:"adaptive"}`, `messages.stream(...).finalMessage()`.
- **tsx** transpila sin type-check.
- **ESM + Node 22:** imports con `.js`, `moduleResolution: bundler`.
- Publicador: `motor/src/agents → ../../.. = repo root`.
- Scaffold viejo con Supabase: **descartado**.
