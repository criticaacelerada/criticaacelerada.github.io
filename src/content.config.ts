import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";


/* ============================================================
   CRÉDITOS NODALES
============================================================ */

const creditSchema = z.object({
  node: z.string(),
  role: z.string(),
});

const creditsSchema = z.array(creditSchema).optional();


/* ============================================================
   ENSAYOS / EXPEDIENTES
============================================================ */

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

    /*
     * Identidad nodal interna.
     * No sustituye author ni translator.
     */
    credits: creditsSchema,

    language: z.enum(["es", "en"]).default("es"),
    translationKey: z.string().optional(),

    video: z
      .object({
        youtubeId: z.string(),
        title: z.string(),
        context: z.string(),
        label: z.string(),
        date: z.date(),

        /*
         * Créditos específicos del material audiovisual.
         */
        credits: creditsSchema,
      })
      .optional(),
  }),
});


/* ============================================================
   TRANSMISIONES
============================================================ */

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

    credits: creditsSchema,
  }),
});


/* ============================================================
   DESTILADOS
============================================================ */

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

    credits: creditsSchema,

    language: z.enum(["es", "en"]).default("es"),
    translationKey: z.string().optional(),
  }),
});


/* ============================================================
   ALÍCUOTAS
============================================================ */

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

    credits: creditsSchema,

    language: z.enum(["es", "en"]).default("es"),
    translationKey: z.string().optional(),
  }),
});


/* ============================================================
   EXPORTACIÓN
============================================================ */

export const collections = {
  ensayos,
  transmisiones,
  destilados,
  alicuotas,
};