import { log } from "../lib/logger.js";
import { env } from "../config/env.js";
import { loadState, saveState, coveredKeywords, markPublished } from "../lib/state.js";
import type { Destino } from "../lib/state.js";
import { DESTINOS } from "../types.js";
import { searchIdeas } from "./searcher.js";
import { publishIdea, rebuildIndex } from "./publisher.js";

const SEEDS: Record<Destino, string> = {
  picante: env.SEED_PICANTE,
  pulse: env.SEED_PULSE,
};

/** Solo ideación (barato, para validar temas). No escribe ni cambia estado. */
export async function runIdeation(): Promise<void> {
  const state = loadState();
  for (const destino of DESTINOS) {
    const ideas = await searchIdeas(
      destino,
      SEEDS[destino],
      coveredKeywords(state, destino),
      env.MAX_POSTS_PER_RUN,
    );
    for (const idea of ideas) {
      log.info(`[${destino}] ${idea.keyword_primary} → ${idea.title_es}`);
    }
  }
}

/** Flujo completo: idea → redacta → genera HTML → actualiza estado + índice. */
export async function runFull(): Promise<void> {
  const state = loadState();
  for (const destino of DESTINOS) {
    try {
      const ideas = await searchIdeas(
        destino,
        SEEDS[destino],
        coveredKeywords(state, destino),
        env.MAX_POSTS_PER_RUN,
      );
      for (const idea of ideas.slice(0, env.MAX_POSTS_PER_RUN)) {
        const post = await publishIdea(destino, idea);
        markPublished(state, post);
      }
    } catch (err) {
      log.error(`[${destino}] Falló: ${(err as Error).message}`);
    }
  }
  rebuildIndex(state.published);
  saveState(state);
  log.ok(`Total publicado: ${state.published.length} posts (histórico).`);
}

export async function orchestrate(command: string): Promise<void> {
  if (command === "ideas") return runIdeation();
  if (command === "run") return runFull();
  throw new Error(`Comando desconocido: "${command}". Usa: ideas | run`);
}
