// JSON Schemas para salida estructurada (output_config.format).

export const IDEAS_SCHEMA = {
  type: "object",
  properties: {
    ideas: {
      type: "array",
      items: {
        type: "object",
        properties: {
          keyword_primary: { type: "string" },
          keywords_secondary: { type: "array", items: { type: "string" } },
          search_intent: {
            type: "string",
            enum: ["informacional", "comercial", "transaccional", "navegacional"],
          },
          angle: { type: "string" },
          title_es: { type: "string" },
          title_en: { type: "string" },
          related_questions: { type: "array", items: { type: "string" } },
          difficulty: { type: "string", enum: ["baja", "media", "alta"] },
          rationale: { type: "string" },
        },
        required: [
          "keyword_primary", "keywords_secondary", "search_intent", "angle",
          "title_es", "title_en", "related_questions", "difficulty", "rationale",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["ideas"],
  additionalProperties: false,
} as const;

export const DRAFT_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    headline: { type: "string" },
    slug: { type: "string" },
    meta_description: { type: "string" },
    keywords: { type: "array", items: { type: "string" } },
    answer_html: { type: "string" },
    body_html: { type: "string" },
    faq: {
      type: "array",
      items: {
        type: "object",
        properties: { q: { type: "string" }, a: { type: "string" } },
        required: ["q", "a"],
        additionalProperties: false,
      },
    },
  },
  required: [
    "title", "headline", "slug", "meta_description",
    "keywords", "answer_html", "body_html", "faq",
  ],
  additionalProperties: false,
} as const;
