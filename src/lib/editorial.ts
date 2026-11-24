import { nodes, getNodeBySlug, type NodeProfile } from "../data/nodos";

const normalizeText = (value: unknown): string =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export function findNodeByName(name?: string | null): NodeProfile | undefined {
  const target = normalizeText(name);
  if (!target) return undefined;

  return nodes.find(
    (node) =>
      normalizeText(node.name) === target ||
      node.aliases.some((alias) => normalizeText(alias) === target)
  );
}

export function resolveVideoAuthor(
  credits?: Array<{ node: string; role: string; trace?: boolean }>,
  fallback?: string
): string {
  if (Array.isArray(credits) && credits.length > 0) {
    const names = credits
      .map((credit) => {
        const node = getNodeBySlug(credit.node);
        return node ? node.aliases[0] ?? node.name : credit.node;
      })
      .filter(Boolean);

    if (names.length > 0) {
      return Array.from(new Set(names)).join(" · ");
    }
  }

  return fallback ?? "Crítica Acelerada";
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  })
    .format(date)
    .replaceAll("/", ".");
}

export function formatEditorialDate(
  date: Date,
  lang: "es" | "en" = "es"
): string {
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function estimateReadingTime(
  body: string | undefined,
  lang: "es" | "en" = "es"
): string {
  if (!body) {
    return lang === "en" ? "1 min read" : "1 min de lectura";
  }

  const plain = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`[\]()]/g, " ")
    .trim();

  const words = plain ? plain.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.round(words / 210));

  return lang === "en"
    ? `${minutes} min read`
    : `${minutes} min de lectura`;
}

export function hasMathContent(body: string | undefined): boolean {
  if (!body) return false;
  return /\$\$|\\\[|\\\(|(?<!\\)\$[^\s$][^$\n]*[^\s$]\$/.test(body);
}

export function buildCitation(params: {
  author: string;
  date: Date;
  title: string;
  seriesLabel: string;
  url: string;
  translator?: string;
  extractor?: string;
  sourceWork?: string;
  lang?: "es" | "en";
}): string {
  const {
    author,
    date,
    title,
    seriesLabel,
    url,
    translator,
    extractor,
    sourceWork,
    lang = "es",
  } = params;

  const year = date.getUTCFullYear();
  const quotedTitle = lang === "en" ? `“${title}”` : `«${title}»`;

  const extras: string[] = [];
  if (translator) {
    extras.push(lang === "en" ? `Trans. ${translator}` : `Trad. ${translator}`);
  }
  if (sourceWork) {
    extras.push(lang === "en" ? `On ${sourceWork}` : `Sobre ${sourceWork}`);
  }
  if (extractor) {
    extras.push(
      lang === "en" ? `Distilled by ${extractor}` : `Destilado por ${extractor}`
    );
  }

  const extraPart = extras.length > 0 ? ` (${extras.join("; ")})` : "";
  return `${author} (${year}). ${quotedTitle}${extraPart}. Crítica Acelerada, ${seriesLabel}. ${url}`;
}
