# Motor de blog — Picante (SEO/GEO, automático)

Sistema de agentes que **idea, redacta y publica** blogs bilingües (ES/EN) en la
web de Picante. Corre solo con **GitHub Actions**, usa la **API de Anthropic** y
publica generando HTML estático (Vercel despliega). **No usa Supabase.**

## Cómo funciona

```
GitHub Actions (cron) → Buscador (web search + JSON) → Redactor (Claude, ES+EN)
→ Renderizador (HTML con el molde de Picante) → /blog/*.html → Pull Request → merge → Vercel
```

- **Estado:** `motor/data/state.json` recuerda qué keywords ya se cubrieron (no repite).
- **Molde:** `src/render/template.ts` — genera el HTML idéntico al artículo validado
  (GTM, schema Article/FAQ/Breadcrumb, hreflang, estilo Picante).
- **Carriles:** `picante` (agencia) y `pulse` (reseñas), con su propio contexto de marca
  en `src/config/brand/`.

## Puesta en marcha

1. **API key como Secret:** en GitHub → Settings → Secrets and variables → Actions →
   `New repository secret` → nombre `ANTHROPIC_API_KEY`.
2. **Correr:** pestaña **Actions → "Motor de blog" → Run workflow** (o espera al cron
   de los lunes). Genera los blogs y abre un **Pull Request**.
3. **Publicar:** revisa el PR y haz **merge** → Vercel despliega.

### 100% automático (sin merge)
En `.github/workflows/blog.yml`, reemplaza el paso del Pull Request por un commit
directo a `main`, o activa auto-merge en el PR.

## Correr en local (opcional)

```bash
cd motor
cp .env.example .env   # pon tu ANTHROPIC_API_KEY
npm install
npm i @anthropic-ai/sdk@latest   # asegura tipos de output_config/web_search
npm run ideas          # solo ideación (barato)
npm run run            # flujo completo (genera HTML en ../blog)
```

## Ajustes
- Temas: `MAX_POSTS_PER_RUN`, `SEED_PICANTE`, `SEED_PULSE` (env).
- Tono/posicionamiento: `src/config/brand/picante.md` y `pulse.md`.
- Estructura del artículo: `src/config/blog-structure.md`.
