import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { Destino } from "../lib/state.js";

const here = dirname(fileURLToPath(import.meta.url));
const read = (p: string) => readFileSync(join(here, p), "utf8");

export const brandContext = (destino: Destino): string => read(`brand/${destino}.md`);
export const blogStructure = (): string => read("blog-structure.md");
