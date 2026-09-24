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
            "Investigador independiente radicado en México. Es ingeniero químico y economista, y actualmente cursa la Maestría en Ciencias Económicas. Forma parte del Laboratorio de Estudios sobre Empresas Transnacionales del Instituto de Investigaciones Económicas (IIEc) de la Universidad Nacional Autónoma de México (UNAM) y participa como nodo semilla de Crítica Acelerada. Sus líneas de investigación se articulan en torno a la colapsología, el aceleracionismo crítico, la economía política de los datos y el ecomarxismo, con particular interés en las transformaciones contemporáneas del capitalismo y sus dimensiones tecnológicas, ecológicas y sociales.",



        parallel: {
            title: "CRÍTICA ACELERADA",
            description:
                "Es miembro del Laboratorio de Estudios sobre Empresas Transnacionales (LET), que a su vez forma parte del Observatorio Latinoamericano de Geopolítica (OLAG) de la UNAM. Actualmente realiza una investigación colectiva sobre la participación de las empresas transnacionales (energía, agua y alimentos) en el colapso civilizatorio. En su tiempo libre disocia a través de la escritura experimental.",
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
            "Diego Giménez Vila (Daga) es doctorando en Filosofía por la Universidad de Valencia, España. Es creador del canal de YouTube Indagando, un espacio en el que comparte análisis, reflexiones y comentarios sobre las lecturas que acompañan su proceso de formación e investigación. Su trabajo se caracteriza por una defensa del eclecticismo y la libertad de pensamiento, entendidos como herramientas fundamentales frente al dogmatismo y como vías para una búsqueda abierta de sentido.",

        parallel: {
            title: "INDAGANDO",
            description:
                "Proyecto audiovisual de investigación, conversación y experimentación filosófica.",
        },
    },
];

export const getNodeBySlug = (slug: string) =>
    nodes.find((node) => node.slug === slug);