# 🔄 Conectar el círculo virtuoso — Search Console → el motor

El código ya está listo. Cuando conectes Search Console, el **buscador** deja de
adivinar y prioriza con **datos reales**:
- **Ganadores:** temas que ya te traen clics → los profundiza / hace clusters.
- **Quick wins:** keywords donde rankeas en posición 5–20 (a un empujón de página 1)
  → escribe un artículo dedicado para empujarte arriba.

Si **no** haces esto, el motor sigue funcionando igual que hoy (búsqueda web).
Es 100% opcional y no rompe nada.

## Lo que tienes que hacer (una vez, ~10 min)

### 1. Crear un "service account" en Google Cloud (lectura de Search Console)
1. Entra a **console.cloud.google.com** (misma cuenta Google que Search Console).
2. Crea o elige un proyecto.
3. **APIs & Services → Library** → busca **"Google Search Console API"** → **Enable**.
4. **APIs & Services → Credentials → Create credentials → Service account**.
   - Nombre: `motor-blog-gsc` (o el que quieras) → Create → Done.
5. Abre ese service account → pestaña **Keys → Add key → Create new key → JSON** →
   se descarga un archivo `.json`. **Guárdalo, no lo subas a ningún repo ni chat.**
6. Copia el **email** del service account (algo como
   `motor-blog-gsc@tu-proyecto.iam.gserviceaccount.com`).

### 2. Darle acceso de lectura en Search Console
1. Entra a **search.google.com/search-console** → propiedad **`https://wearepicante.com/`**.
2. **Ajustes (⚙) → Usuarios y permisos → Añadir usuario**.
3. Pega el **email del service account** → permiso **"Restringido"** (lectura basta) → Añadir.

### 3. Guardar el JSON como Secret en GitHub
1. Abre el archivo `.json` que descargaste y **copia TODO su contenido**.
2. GitHub → repo `Webpicante` → **Settings → Secrets and variables → Actions →
   New repository secret**.
3. **Name:** `GSC_SERVICE_ACCOUNT_JSON`
4. **Secret:** pega el contenido completo del JSON.
5. **Add secret**.

¡Listo! En la próxima corrida (o dispárala a mano) el motor leerá Search Console
y verás en los logs: `Feedback GSC: N ganadores, M quick-wins.`

## Notas
- La propiedad debe ser la **URL-prefix** `https://wearepicante.com/` (con `/` final).
  Si usas otra, ajusta `GSC_SITE_URL` en el workflow.
- Necesita ~2–4 semanas de datos para que los insights sean útiles (el sitio es nuevo).
- Para probar en local: pon el JSON (en una sola línea o con `\n` escapados) en
  `.env` como `GSC_SERVICE_ACCOUNT_JSON='{...}'` y corre `npm run ideas`.
- **Siguiente nivel (después):** sumar **GA4** (engagement/conversiones) con otro
  service account, para priorizar no solo por clics sino por lo que convierte.
