import type { Destino } from "../lib/state.js";
import { brandContext } from "../config/context.js";

const GOAL: Record<Destino, string> = {
  picante:
    "posicionar la AGENCIA Picante Studio como autoridad en growth marketing, " +
    "performance e IA aplicada al marketing.",
  pulse:
    "posicionar PULSE en reputación online, gestión de reseñas de Google y " +
    "posicionamiento en Google Maps (local SEO).",
};

export function researchSystem(destino: Destino): string {
  return [
    `Eres un estratega de contenidos SEO/GEO. Objetivo: ${GOAL[destino]}`,
    "",
    "Contexto de marca:",
    brandContext(destino),
    "",
    "Usa la búsqueda web para ver qué se busca y qué ya rankea. Prioriza huecos y",
    "ángulos con respuesta clara y citable (GEO = ser citado por ChatGPT/Perplexity/AI Overviews).",
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
