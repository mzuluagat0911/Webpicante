import { anthropic, MODEL, parseStructured } from "../lib/anthropic.js";
import { log } from "../lib/logger.js";
import { DRAFT_SCHEMA } from "../schemas.js";
import type { Destino, Idea, Language, WriterOutput } from "../types.js";
import { writerSystem, writerUser } from "../prompts/writer.js";

/** REDACTOR: escribe un blog (una idea, un idioma) con streaming. */
export async function writeDraft(
  destino: Destino,
  idea: Idea,
  lang: Language,
): Promise<WriterOutput> {
  log.step(`[${destino}] Redactando "${idea.keyword_primary}" (${lang})…`);
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 32000,
    thinking: { type: "adaptive" },
    output_config: { effort: "high", format: { type: "json_schema", schema: DRAFT_SCHEMA } },
    system: writerSystem(destino, lang),
    messages: [{ role: "user", content: writerUser(idea, lang) }],
  });
  const message = await stream.finalMessage();
  const draft = parseStructured<WriterOutput>(message.content);
  log.ok(`[${destino}] Borrador (${lang}): ${draft.slug}`);
  return draft;
}
