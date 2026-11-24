import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const [ensayos, transmisiones, destilados, alicuotas] = await Promise.all([
    getCollection("ensayos"),
    getCollection("transmisiones"),
    getCollection("destilados"),
    getCollection("alicuotas"),
  ]);

  const items = [
    ...ensayos
      .filter((entry) => entry.data.language === "es")
      .map((entry) => ({
        title: `Expediente ${String(entry.data.expediente).padStart(3, "0")} — ${entry.data.title}`,
        description: entry.data.descripcion,
        pubDate: entry.data.date,
        link: `/expedientes/${entry.id}/`,
        author: entry.data.author ?? "Crítica Acelerada",
        categories: ["Expedientes"],
      })),

    ...destilados
      .filter((entry) => entry.data.language === "es")
      .map((entry) => ({
        title: `Destilado ${String(entry.data.numero).padStart(3, "0")} — ${entry.data.title}`,
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        link: `/destilados/${entry.id}/`,
        author: entry.data.autor,
        categories: ["Destilados"],
      })),

    ...alicuotas
      .filter((entry) => entry.data.language === "es")
      .map((entry) => ({
        title: `AE—${String(entry.data.numero).padStart(3, "0")} — ${entry.data.title}`,
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        link: `/alicuotas/${entry.id}/`,
        author: entry.data.autor,
        categories: ["Alícuotas Experimentales"],
      })),

    ...transmisiones.map((entry) => ({
      title: `Transmisión ${String(entry.data.numero).padStart(3, "0")} — ${entry.data.title}`,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/transmisiones/${entry.id}/`,
      author: "Crítica Acelerada",
      categories: ["Transmisiones"],
    })),
  ].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime());

  return rss({
    title: "Crítica Acelerada",
    description:
      "Laboratorio de Economía Política y Filosofía del Capitalismo Contemporáneo.",
    site: context.site ?? "https://criticaacelerada.com",
    items,
    customData: `<language>es-mx</language>`,
  });
}
