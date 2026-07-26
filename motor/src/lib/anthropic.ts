import Anthropic from "@anthropic-ai/sdk";
import { env } from "../config/env.js";

export const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
export const MODEL = env.MODEL;

export function parseStructured<T>(content: Anthropic.ContentBlock[]): T {
  const texts = content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text.trim())
    .filter(Boolean);
  const jsonLike = texts.find((t) => t.startsWith("{") || t.startsWith("[")) ?? texts.at(-1);
  if (!jsonLike) throw new Error("La respuesta no contiene texto para parsear.");
  return JSON.parse(jsonLike) as T;
}

export function joinText(content: Anthropic.ContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n\n");
}
