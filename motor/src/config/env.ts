import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v || !v.trim()) {
    throw new Error(`Falta la variable ${name} (ponla en .env local o como GitHub Secret).`);
  }
  return v;
}

function int(name: string, fallback: number): number {
  const n = Number.parseInt(process.env[name] ?? "", 10);
  return Number.isFinite(n) ? n : fallback;
}

export const env = {
  ANTHROPIC_API_KEY: required("ANTHROPIC_API_KEY"),
  MODEL: process.env.MODEL ?? "claude-opus-4-8",
  // Cuántas ideas se redactan por carril y por corrida.
  MAX_POSTS_PER_RUN: int("MAX_POSTS_PER_RUN", 1),
  // Dominio real del sitio (para canonical, hreflang, schema).
  SITE_URL: (process.env.SITE_URL ?? "https://wearepicante.com").replace(/\/$/, ""),
  // Semillas opcionales por carril.
  SEED_PICANTE: process.env.SEED_PICANTE ?? "",
  SEED_PULSE: process.env.SEED_PULSE ?? "",
} as const;
