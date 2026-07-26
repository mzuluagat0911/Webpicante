import type { Destino, Idea, Language } from "../types.js";
import { brandContext, blogStructure } from "../config/context.js";

const IDIOMA: Record<Language, string> = { es: "español", en: "inglés" };

export function writerSystem(destino: Destino, lang: Language): string {
  return [
    `Eres un redactor de blogs experto en SEO y GEO. Escribes en ${IDIOMA[lang]}.`,
    "",
    "== Contexto de marca (territorio + tono obligatorios) ==",
    brandContext(destino),
    "",
    "== Estructura obligatoria ==",
    blogStructure(),
    "",
    "Respeta territorio editorial: no mezcles temas del otro producto/marca.",
    "Respeta el tono de marca. No inventes cifras que no puedas justificar.",
    "Devuelve EXACTAMENTE el esquema JSON pedido. body_html debe ser HTML limpio",
    "(h2/h3/p/ul/ol/strong/em y opcional div.callout), SIN h1, head ni scripts.",
  ].join("\n");
}

export function writerUser(idea: Idea, lang: Language): string {
  const titulo = lang === "es" ? idea.title_es : idea.title_en;
  return [
    `Escribe el blog para esta idea, en ${IDIOMA[lang]}:`,
    "",
    `- Título sugerido: ${titulo}`,
    `- Keyword principal: ${idea.keyword_primary}`,
    `- Keywords secundarias: ${idea.keywords_secondary.join(", ")}`,
    `- Intención: ${idea.search_intent}`,
    `- Ángulo: ${idea.angle}`,
    `- Preguntas para las FAQ: ${idea.related_questions.join(" | ")}`,
    "",
    "Genera title, headline, slug, meta_description, keywords, answer_html, body_html y faq.",
  ].join("\n");
}
