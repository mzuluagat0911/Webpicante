import type { Destino } from "../lib/state.js";
import { brandContext } from "../config/context.js";

const GOAL: Record<Destino, string> = {
  picante:
    "posicionar la AGENCIA Picante Studio ante marcas LATAM/USA que escalan: " +
    "growth, paid media, redes con sistema, storytelling, cronogramas de contenido, " +
    "IA en marketing y SEO/GEO para marcas. " +
    "PROHIBIDO: Google Maps, reseñas locales, GBP, ranking de zona, ops de local (eso es Pulse).",
  pulse:
    "posicionar PULSE ante negocios con local físico en ciudades principales " +
    "USA y LATAM (restaurantes multi-sucursal, retail, directores de ops): " +
    "Google Maps, reseñas, reputación local, GBP, competencia de zona y tips de " +
    "operaciones de reputación. " +
    "PROHIBIDO: ads/ROAS/CAC digital, storytelling/cronogramas de agencia, " +
    "GEO/ChatGPT para marcas (eso es Picante).",
};

export function researchSystem(destino: Destino): string {
  return [
    `Eres un estratega de contenidos SEO/GEO. Objetivo: ${GOAL[destino]}`,
    "",
    "Contexto de marca (respeta territorio editorial y tono):",
    brandContext(destino),
    "",
    "Usa la búsqueda web para ver qué se busca y qué ya rankea. Prioriza huecos y",
    "ángulos con respuesta clara y citable (GEO = ser citado por ChatGPT/Perplexity/AI Overviews).",
    "Elige temas dentro de los PILARES de la marca; no cruces territorio con el otro carril.",
  ].join("\n");
}

export function researchUser(seed: string, covered: string[], n: number): string {
  const semilla = seed
    ? `Tema semilla: "${seed}".`
    : "Sin semilla: propón tú los temas más valiosos según la marca.";
  const yaHecho =
    covered.length > 0
      ? `Keywords YA cubiertas (NO repitas ni variantes casi idénticas):\n- ${covered.join("\n- ")}`
      : "Aún no hay keywords cubiertas.";
  return [
    semilla,
    "",
    yaHecho,
    "",
    `Investiga material para ${n} ideas de blog fuertes en SEO y GEO. Para cada una:`,
    "keyword principal, variantes long-tail, intención, preguntas relacionadas (PAA),",
    "un ángulo diferenciador y por qué vale la pena. Responde en texto (aún no JSON).",
  ].join("\n");
}

export function structureSystem(): string {
  return [
    "Convierte los hallazgos en ideas estructuradas. Devuelve EXACTAMENTE el esquema JSON.",
    "title_es en español y title_en en inglés, atractivos y con la keyword.",
  ].join("\n");
}
