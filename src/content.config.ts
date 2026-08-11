import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const ensayos = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/ensayos",
  }),

  schema: z.object({
    title: z.string(),
    date: z.date(),
    expediente: z.number(),
    descripcion: z.string(),

    author: z.string().optional(),
    role: z.string().optional(),
    translator: z.string().optional(),

    language: z.enum(["es", "en"]).default("es"),
    translationKey: z.string().optional(),
  }),
});

const transmisiones = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/transmisiones",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    numero: z.number(),
  }),
});

const destilados = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/destilados",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    numero: z.number(),
    autor: z.string(),
    obra: z.string(),

    language: z.enum(["es", "en"]).default("es"),
    translationKey: z.string().optional(),
  }),
});

const alicuotas = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/alicuotas",
  }),

  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    numero: z.number(),

    autor: z.string(),
    translator: z.string().optional(),
    tipo: z.string().optional(),

    language: z.enum(["es", "en"]).default("es"),
    translationKey: z.string().optional(),
  }),
});

export const collections = {
  ensayos,
  transmisiones,
  destilados,
  alicuotas,
};