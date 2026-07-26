import { anthropic, MODEL, parseStructured, joinText } from "../lib/anthropic.js";
import { log } from "../lib/logger.js";
import { IDEAS_SCHEMA } from "../schemas.js";
import type { Destino, Idea } from "../types.js";
import { researchSystem, researchUser, structureSystem } from "../prompts/searcher.js";

/** BUSCADOR: investiga con búsqueda web y estructura ideas en JSON. */
export async function searchIdeas(
  destino: Destino,
  seed: string,
  covered: string[],
  n: number,
): Promise<Idea[]> {
  log.step(`[${destino}] Investigando en la web…`);
  const research = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 6 }],
    system: researchSystem(destino),
    messages: [{ role: "user", content: researchUser(seed, covered, n) }],
  });

  log.step(`[${destino}] Estructurando ideas…`);
  const structured = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "high", format: { type: "json_schema", schema: IDEAS_SCHEMA } },
    system: structureSystem(),
    messages: [
      {
        role: "user",
        content: `Hallazgos:\n\n${joinText(research.content)}\n\nEstructura hasta ${n} ideas en el esquema JSON.`,
      },
    ],
  });

  const { ideas } = parseStructured<{ ideas: Idea[] }>(structured.content);
  log.ok(`[${destino}] ${ideas.length} ideas.`);
  return ideas.slice(0, n);
}
