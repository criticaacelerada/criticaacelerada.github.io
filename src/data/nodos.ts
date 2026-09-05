export type NodeProfile = {
    slug: string;
    code: string;
    name: string;
    role: string;
    status: "ACTIVO";
    location?: string;
    fields: string[];
    professional: string;

    // Nombres con los que este nodo puede aparecer en los metadatos de CA.
    aliases: string[];

    youtube?: {
        handle: string;
        label: string;
        url: string;
    };

    parallel?: {
        title: string;
        description: string;
        url?: string;
        label?: string;
    };
};

export const nodes: NodeProfile[] = [
    {
        // Se conserva el slug original para no romper
        // perfiles, enlaces, créditos ni trazas existentes.
        slug: "oliver-ferran",

        code: "CA / NODO 001",
        name: "SAMUEL OLIVER (ferracianuro)",
        role: "NODO SEMILLA",
        status: "ACTIVO",

        aliases: [
            "Oliver Ferran",
            "Samuel Oliver",
            "SAMUEL OLIVER",
            "SAMUEL OLIVER (ferracianuro)",
        ],

        fields: [
            "ECONOMÍA POLÍTICA DE LOS DATOS",
            "TECNOLOGÍA Y SISTEMAS COMPLEJOS",
            "TRAYECTORIA DEL CAPITALISMO",
            "ACELERACIONISMO Y COLAPSOLOGÍA",
            "ECONOMÍA ECOLÓGICA Y ECOLOGÍA POLÍTICA",
        ],

        professional:
            "Investigador radicado en México. Maestrando en Ciencias Económicas. Forma parte del Laboratorio de Estudios sobre Empresas Transnacionales (LET) del Instituto de Investigaciones Económicas de la UNAM. Investigación crítica sobre las transformaciones contemporáneas del capitalismo, la tecnología y los procesos de digitalización.",

        parallel: {
            title: "CRÍTICA ACELERADA",
            description:
                "Nodo semilla del laboratorio y punto inicial de articulación de sus archivos, transmisiones y procesos editoriales.",
        },
    },

    {
        slug: "diego-gimenez-vila",

        code: "CA / NODO 002",
        name: "DIEGO GIMÉNEZ VILA (DAGA)",
        role: "NODO DE CO-AGENCIAMIENTO",
        status: "ACTIVO",
        location: "VALENCIA · ESPAÑA",

        aliases: [
            "Diego Giménez Vila",
            "Daga",
            "DAGA",
            "Diego Giménez Vila (Daga)",
            "DIEGO GIMÉNEZ VILA (DAGA)",
        ],

        youtube: {
            handle: "in-dagando",
            label: "INDAGANDO",
            url: "https://www.youtube.com/@in-dagando",
        },

        fields: [
            "FILOSOFÍA DE LA TECNOLOGÍA",
            "CIBERNÉTICA",
            "CAPITALISMO",
            "ECONOMÍA",
            "SISTEMAS COMPLEJOS",
            "ONTOLOGÍA",
        ],

        professional:
            "Doctorando en Filosofía en la Universitat de València. Su trabajo explora problemas de ontología, capitalismo y técnica desde una perspectiva filosófica y experimental.",

        parallel: {
            title: "INDAGANDO",
            description:
                "Proyecto audiovisual de investigación, conversación y experimentación filosófica.",
        },
    },
];

export const getNodeBySlug = (slug: string) =>
    nodes.find((node) => node.slug === slug);