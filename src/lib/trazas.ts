import { getCollection } from "astro:content";
import type { NodeProfile } from "../data/nodos";

export type NodeTrace = {
    id: string;
    code: string;
    type: string;
    title: string;
    role: string;
    date: Date;
    href: string;
};

type Credit = {
    node: string;
    role: string;
};


const normalize = (value: unknown) =>
    String(value ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();


const matchesNode = (
    value: unknown,
    node: NodeProfile
) => {
    const target = normalize(value);

    if (!target) {
        return false;
    }

    return node.aliases.some(
        (alias) => normalize(alias) === target
    );
};


const roleLabel = (role: unknown) => {
    const normalized = normalize(role);

    const labels: Record<string, string> = {
        autoria: "AUTORÍA",
        autor: "AUTORÍA",
        coautoria: "COAUTORÍA",
        traduccion: "TRADUCCIÓN",
        edicion: "EDICIÓN",
        curaduria: "CURADURÍA",
        participacion: "PARTICIPACIÓN",
        conversacion: "CONVERSACIÓN",
        produccion: "PRODUCCIÓN",
        coordinacion: "COORDINACIÓN",
        investigacion: "INVESTIGACIÓN",
        entrevista: "ENTREVISTA",
        moderacion: "MODERACIÓN",
        diseno: "DISEÑO",
    };

    return (
        labels[normalized] ??
        String(role ?? "INTERVENCIÓN")
            .replaceAll("-", " ")
            .replaceAll("_", " ")
            .toUpperCase()
    );
};


const getCredits = (value: unknown): Credit[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.filter(
        (credit): credit is Credit =>
            !!credit &&
            typeof credit === "object" &&
            typeof (credit as Credit).node === "string" &&
            typeof (credit as Credit).role === "string"
    );
};


const creditsForNode = (
    value: unknown,
    node: NodeProfile
) =>
    getCredits(value).filter(
        (credit) => credit.node === node.slug
    );


const pushCreditTraces = ({
    traces,
    credits,
    idPrefix,
    code,
    type,
    title,
    date,
    href,
}: {
    traces: NodeTrace[];
    credits: Credit[];
    idPrefix: string;
    code: string;
    type: string;
    title: string;
    date: Date;
    href: string;
}) => {
    credits.forEach((credit, index) => {
        traces.push({
            id: `${idPrefix}-${credit.role}-${index}`,
            code,
            type,
            title,
            role: roleLabel(credit.role),
            date,
            href,
        });
    });
};


export async function getNodeTraces(
    node: NodeProfile
): Promise<NodeTrace[]> {

    const [
        ensayosTodos,
        transmisiones,
        destiladosTodos,
        alicuotasTodos,
    ] = await Promise.all([
        getCollection("ensayos"),
        getCollection("transmisiones"),
        getCollection("destilados"),
        getCollection("alicuotas"),
    ]);


    // Una sola versión visible por pieza bilingüe.
    const ensayos = ensayosTodos.filter(
        (entry) => (entry.data as any).language !== "en"
    );

    const destilados = destiladosTodos.filter(
        (entry) => (entry.data as any).language !== "en"
    );

    const alicuotas = alicuotasTodos.filter(
        (entry) => (entry.data as any).language !== "en"
    );


    const traces: NodeTrace[] = [];


    /* ============================================================
       EXPEDIENTES
    ============================================================ */

    for (const entry of ensayos) {

        const data = entry.data as any;

        const mainCredits = getCredits(data.credits);
        const nodeMainCredits = creditsForNode(
            data.credits,
            node
        );


        /*
         * NUEVO SISTEMA:
         * Si la publicación ya tiene credits, éstos son la fuente
         * de verdad para la pieza textual.
         */
        if (mainCredits.length > 0) {

            pushCreditTraces({
                traces,
                credits: nodeMainCredits,
                idPrefix: `ensayo-${entry.id}`,
                code: `EXPEDIENTE ${String(data.expediente).padStart(3, "0")}`,
                type: "ARCHIVO TEXTUAL",
                title: data.title,
                date: data.date,
                href: `/expedientes/${entry.id}`,
            });

        } else {

            /*
             * COMPATIBILIDAD:
             * Los archivos antiguos siguen funcionando con author
             * y translator mientras los migramos.
             */
            if (matchesNode(data.author, node)) {
                traces.push({
                    id: `ensayo-${entry.id}-autor`,
                    code: `EXPEDIENTE ${String(data.expediente).padStart(3, "0")}`,
                    type: "ARCHIVO TEXTUAL",
                    title: data.title,
                    role: "AUTORÍA",
                    date: data.date,
                    href: `/expedientes/${entry.id}`,
                });
            }


            if (matchesNode(data.translator, node)) {
                traces.push({
                    id: `ensayo-${entry.id}-traduccion`,
                    code: `EXPEDIENTE ${String(data.expediente).padStart(3, "0")}`,
                    type: "ARCHIVO TEXTUAL",
                    title: data.title,
                    role: "TRADUCCIÓN",
                    date: data.date,
                    href: `/expedientes/${entry.id}`,
                });
            }

        }


        /* MATERIAL AUDIOVISUAL ASOCIADO */

        if (data.video) {

            const videoCredits = getCredits(
                data.video.credits
            );

            const nodeVideoCredits = creditsForNode(
                data.video.credits,
                node
            );


            if (videoCredits.length > 0) {

                pushCreditTraces({
                    traces,
                    credits: nodeVideoCredits,
                    idPrefix: `ensayo-${entry.id}-video`,
                    code: `ARCHIVO AUDIOVISUAL / ${String(data.expediente).padStart(3, "0")}`,
                    type: "MATERIAL ASOCIADO",
                    title: data.video.title,
                    date: data.video.date ?? data.date,
                    href: `/expedientes/${entry.id}`,
                });

            } else if (matchesNode(data.author, node)) {

                /*
                 * Compatibilidad temporal con el comportamiento anterior.
                 * Una vez migrados los videos a video.credits, esta
                 * inferencia dejará de ser necesaria.
                 */
                traces.push({
                    id: `ensayo-${entry.id}-video-legacy`,
                    code: `ARCHIVO AUDIOVISUAL / ${String(data.expediente).padStart(3, "0")}`,
                    type: "MATERIAL ASOCIADO",
                    title: data.video.title,
                    role: "PARTICIPACIÓN AUDIOVISUAL",
                    date: data.video.date ?? data.date,
                    href: `/expedientes/${entry.id}`,
                });

            }

        }

    }


    /* ============================================================
       TRANSMISIONES
    ============================================================ */

    for (const entry of transmisiones) {

        const data = entry.data as any;

        const credits = getCredits(data.credits);
        const nodeCredits = creditsForNode(
            data.credits,
            node
        );


        if (credits.length > 0) {

            pushCreditTraces({
                traces,
                credits: nodeCredits,
                idPrefix: `transmision-${entry.id}`,
                code: `TRANSMISIÓN ${String(data.numero).padStart(3, "0")}`,
                type: "ARCHIVO AUDIOVISUAL",
                title: data.title,
                date: data.pubDate,
                href: `/transmisiones/${entry.id}`,
            });

        } else {

            const possiblePeople = [
                ["author", "AUTORÍA"],
                ["autor", "AUTORÍA"],
                ["participant", "PARTICIPACIÓN"],
                ["participante", "PARTICIPACIÓN"],
            ] as const;


            for (const [field, role] of possiblePeople) {

                const value = data[field];

                if (Array.isArray(value)) {

                    if (
                        value.some(
                            (person) =>
                                matchesNode(person, node)
                        )
                    ) {
                        traces.push({
                            id: `transmision-${entry.id}-${field}`,
                            code: `TRANSMISIÓN ${String(data.numero).padStart(3, "0")}`,
                            type: "ARCHIVO AUDIOVISUAL",
                            title: data.title,
                            role,
                            date: data.pubDate,
                            href: `/transmisiones/${entry.id}`,
                        });
                    }

                } else if (matchesNode(value, node)) {

                    traces.push({
                        id: `transmision-${entry.id}-${field}`,
                        code: `TRANSMISIÓN ${String(data.numero).padStart(3, "0")}`,
                        type: "ARCHIVO AUDIOVISUAL",
                        title: data.title,
                        role,
                        date: data.pubDate,
                        href: `/transmisiones/${entry.id}`,
                    });

                }

            }

        }

    }


    /* ============================================================
       DESTILADOS
    ============================================================ */

    for (const entry of destilados) {

        const data = entry.data as any;

        const credits = getCredits(data.credits);
        const nodeCredits = creditsForNode(
            data.credits,
            node
        );


        if (credits.length > 0) {

            pushCreditTraces({
                traces,
                credits: nodeCredits,
                idPrefix: `destilado-${entry.id}`,
                code: `DESTILADO ${String(data.numero).padStart(3, "0")}`,
                type: "ARCHIVO DESTILADO",
                title: data.title,
                date: data.pubDate,
                href: `/destilados/${entry.id}`,
            });

        } else {

            if (
                matchesNode(data.autor, node) ||
                matchesNode(data.author, node)
            ) {
                traces.push({
                    id: `destilado-${entry.id}-autor`,
                    code: `DESTILADO ${String(data.numero).padStart(3, "0")}`,
                    type: "ARCHIVO DESTILADO",
                    title: data.title,
                    role: "AUTORÍA",
                    date: data.pubDate,
                    href: `/destilados/${entry.id}`,
                });
            }


            if (matchesNode(data.translator, node)) {
                traces.push({
                    id: `destilado-${entry.id}-traduccion`,
                    code: `DESTILADO ${String(data.numero).padStart(3, "0")}`,
                    type: "ARCHIVO DESTILADO",
                    title: data.title,
                    role: "TRADUCCIÓN",
                    date: data.pubDate,
                    href: `/destilados/${entry.id}`,
                });
            }

        }

    }


    /* ============================================================
       ALÍCUOTAS
    ============================================================ */

    for (const entry of alicuotas) {

        const data = entry.data as any;

        const credits = getCredits(data.credits);
        const nodeCredits = creditsForNode(
            data.credits,
            node
        );


        if (credits.length > 0) {

            pushCreditTraces({
                traces,
                credits: nodeCredits,
                idPrefix: `alicuota-${entry.id}`,
                code: `AE—${String(data.numero).padStart(3, "0")}`,
                type: "ARCHIVO EXPERIMENTAL",
                title: data.title,
                date: data.pubDate,
                href: `/alicuotas/${entry.id}`,
            });

        } else {

            if (
                matchesNode(data.autor, node) ||
                matchesNode(data.author, node)
            ) {
                traces.push({
                    id: `alicuota-${entry.id}-autor`,
                    code: `AE—${String(data.numero).padStart(3, "0")}`,
                    type: "ARCHIVO EXPERIMENTAL",
                    title: data.title,
                    role: "AUTORÍA",
                    date: data.pubDate,
                    href: `/alicuotas/${entry.id}`,
                });
            }


            if (matchesNode(data.translator, node)) {
                traces.push({
                    id: `alicuota-${entry.id}-traduccion`,
                    code: `AE—${String(data.numero).padStart(3, "0")}`,
                    type: "ARCHIVO EXPERIMENTAL",
                    title: data.title,
                    role: "TRADUCCIÓN",
                    date: data.pubDate,
                    href: `/alicuotas/${entry.id}`,
                });
            }

        }

    }


    return traces.sort(
        (a, b) =>
            b.date.getTime() - a.date.getTime()
    );
}
