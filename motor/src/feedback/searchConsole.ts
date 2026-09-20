import { env } from "../config/env.js";
import { log } from "../lib/logger.js";
import type { Destino } from "../lib/state.js";

// Lee Google Search Console (API) y arma un "digest" de rendimiento real para
// que el buscador priorice con datos, no a ciegas. 100% opcional y a prueba de
// fallos: si no hay credenciales o la API falla, devuelve null y el motor sigue
// funcionando exactamente como hoy (búsqueda web + estimación).

interface Row {
  keys: string[]; // [query, page]
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
}

/** ¿La página pertenece a este carril? Pulse vive bajo /pulse; el resto es Picante. */
function inCarril(page: string, destino: Destino): boolean {
  const path = page.replace(env.SITE_URL, "").replace(/^https?:\/\/[^/]+/, "");
  const isPulse = path.startsWith("/pulse") || path.startsWith("/en/pulse");
  return destino === "pulse" ? isPulse : !isPulse;
}

async function queryGsc(): Promise<Row[] | null> {
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!raw || !raw.trim()) return null; // sin credenciales → feedback desactivado
  try {
    const creds = JSON.parse(raw);
    // Import dinámico: si la dependencia no está instalada, no rompe el motor.
    const { JWT } = await import("google-auth-library");
    const client = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
    });
    const { token } = await client.getAccessToken();
    if (!token) return null;

    const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(env.GSC_SITE_URL)}/searchAnalytics/query`;
    const res = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: daysAgo(90),
        endDate: daysAgo(2), // SC tiene ~2 días de retraso
        dimensions: ["query", "page"],
        rowLimit: 250,
      }),
    });
    if (!res.ok) {
      log.warn(`Search Console API ${res.status}: ${(await res.text().catch(() => "")).slice(0, 160)}`);
      return null;
    }
    const data = (await res.json()) as { rows?: Row[] };
    return data.rows ?? [];
  } catch (err) {
    log.warn(`Feedback de Search Console omitido: ${(err as Error).message}`);
    return null;
  }
}

/**
 * Digest de rendimiento para inyectar al buscador. Devuelve null si no hay
 * credenciales, no hay datos, o algo falla (el motor sigue igual).
 */
export async function getGscDigest(destino: Destino): Promise<string | null> {
  const rows = await queryGsc();
  if (!rows || rows.length === 0) return null;

  const mine = rows.filter((r) => inCarril(r.keys[1] ?? "", destino));
  if (mine.length === 0) return null;

  // GANADORES: ya te traen clics → profundizar / hacer clusters.
  const winners = mine
    .filter((r) => r.clicks > 0)
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 8)
    .map((r) => `· "${r.keys[0]}" — ${r.clicks} clic(s), ${r.impressions} impr., pos ${r.position.toFixed(1)}`);

  // QUICK WINS: rankeas cerca de página 1 (pos 5–20) con impresiones → un
  // artículo dedicado/mejorado puede empujarte a la primera página.
  const quickWins = mine
    .filter((r) => r.position >= 5 && r.position <= 20 && r.impressions >= 8)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 8)
    .map((r) => `· "${r.keys[0]}" — pos ${r.position.toFixed(1)}, ${r.impressions} impr. (a un empujón de página 1)`);

  if (winners.length === 0 && quickWins.length === 0) return null;

  const parts = ["== DATOS REALES de Google Search Console (últimos ~90 días) =="];
  if (winners.length)
    parts.push("GANADORES (ya te traen clics — profundiza el tema o haz un cluster):\n" + winners.join("\n"));
  if (quickWins.length)
    parts.push("QUICK WINS (rankeas cerca de página 1 — escribe/mejora un artículo dedicado):\n" + quickWins.join("\n"));
  log.info(`Feedback GSC: ${winners.length} ganadores, ${quickWins.length} quick-wins.`);
  return parts.join("\n\n");
}
