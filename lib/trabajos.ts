// Catálogo completo del trabajo, agrupado por tipo de proyecto.
//
// Es la fuente de /portafolio/trabajos. A diferencia de lib/case-studies.ts
// —que guarda el relato largo de los diez proyectos con caso propio— aquí
// cabe todo, incluido lo que no tiene caso escrito: la idea es que se pueda
// ver de un vistazo qué se ha hecho, no leer cada historia.
//
// `caseSlug` solo lo llevan los que sí tienen página de caso; el resto enlaza
// únicamente al sitio del cliente.

export type CategoriaTrabajo = "web" | "ecommerce" | "saas" | "medida";

export type Trabajo = {
    nombre: string;
    /** Una línea: qué es, no qué hicimos. */
    linea: string;
    tags: string[];
    /** Sitio público del cliente. Sin él, la tarjeta lleva al caso. */
    url?: string;
    image: string;
    /** Los renders de app (iPad) van sin marco de navegador: no son webs. */
    bareImage?: boolean;
    caseSlug?: string;
};

export const CATEGORIAS: {
    id: CategoriaTrabajo;
    badge: string;
    eyebrow: string;
    tituloTop: string;
    tituloItalic: string;
    intro: string;
}[] = [
    {
        id: "web",
        badge: "01",
        eyebrow: "Sitios web",
        tituloTop: "Sitios que",
        tituloItalic: "sostienen una firma",
        intro: "Despachos, clínicas y marcas donde el sitio es la primera prueba de seriedad que ve un cliente.",
    },
    {
        id: "ecommerce",
        badge: "02",
        eyebrow: "E-commerce",
        tituloTop: "Tiendas que",
        tituloItalic: "venden de verdad",
        intro: "Catálogo, inventario y cobro. Desde joyería de autor hasta distribución mayorista.",
    },
    {
        id: "saas",
        badge: "03",
        eyebrow: "SaaS y plataformas",
        tituloTop: "Producto",
        tituloItalic: "con usuarios dentro",
        intro: "Plataformas multiusuario que se cobran por suscripción y crecen sin que crezca el equipo.",
    },
    {
        id: "medida",
        badge: "04",
        eyebrow: "Software a la medida",
        tituloTop: "Cuando no",
        tituloItalic: "existe la herramienta",
        intro: "Lo que no se compra hecho: agentes de IA, apps de evento y control de acceso en vivo.",
    },
];

export const TRABAJOS: Record<CategoriaTrabajo, Trabajo[]> = {
    web: [
        {
            nombre: "Basham",
            linea: "Representante exclusivo de Lex Mundi en México. Despacho legal desde 1912.",
            tags: ["Corporativo", "Legal", "Multiidioma"],
            url: "https://basham.com.mx/",
            image: "/portafolio/screenshots/basham.jpg",
        },
        {
            nombre: "Uhthoff",
            linea: "Propiedad intelectual e industrial. Una firma que lleva desde 1905.",
            tags: ["Corporativo", "Legal", "Publicaciones"],
            url: "https://uhthoff.com.mx/",
            image: "/portafolio/screenshots/uhthoff.jpg",
        },
        {
            nombre: "Serficor IMAP",
            linea: "Banca de inversión y M&A. Socio exclusivo de IMAP en México.",
            tags: ["Corporativo", "Finanzas", "Bilingüe"],
            url: "https://serficor.com",
            image: "/portafolio/screenshots/serficor.jpg",
        },
        {
            nombre: "Happtek",
            linea: "Showroom digital de audio de alta gama y automatización de lujo.",
            tags: ["Showroom", "Editorial", "Next.js"],
            url: "https://www.happtek.com.mx/",
            image: "/portafolio/screenshots/audiofive.jpg",
            caseSlug: "happtek",
        },
        {
            nombre: "Barmored Security",
            linea: "Blindaje automotriz de alto perfil, con certificaciones internacionales.",
            tags: ["Corporativo", "Cotizador", "Next.js"],
            url: "https://www.barmoredsecurity.com/",
            image: "/portafolio/screenshots/barmored.jpg",
            caseSlug: "barmored",
        },
        {
            nombre: "Smile Better Clinics",
            linea: "Red de clínicas dentales con agendado inmediato en varias sedes.",
            tags: ["Multi-sede", "CMS headless", "Citas"],
            url: "https://smilebetterclinics.com/",
            image: "/portafolio/screenshots/smilebetter.jpg",
            caseSlug: "smile-better-clinics",
        },
        {
            nombre: "Ivan Ivanovich Academy",
            linea: "La academia de protección ejecutiva más reconocida de México.",
            tags: ["Cursos", "Eventos", "Afiliados"],
            url: "https://ivanivanovich.com/",
            image: "/portafolio/screenshots/ivanivanovich-lms.webp",
            caseSlug: "ivan-ivanovich-academy",
        },
    ],
    ecommerce: [
        {
            nombre: "Re Dress",
            linea: "Marketplace de vestidos pre-loved con membresías, panel de vendedoras y showroom.",
            tags: ["Marketplace", "Desarrollo integral", "Stripe"],
            url: "https://www.redressmx.com/",
            image: "/portafolio/screenshots/redress.jpg",
            caseSlug: "re-dress",
        },
        {
            nombre: "El Arca de Noé",
            linea: "Distribuidora mayorista de carnes selectas. Cotización por WhatsApp.",
            tags: ["Catálogo", "Mayoreo", "WhatsApp"],
            url: "https://elarcadenoe.mx/",
            image: "/portafolio/screenshots/elarcadenoe.jpg",
        },
        {
            nombre: "Rosymar González",
            linea: "Joyería en oro de 18 y 24 quilates, con catálogo curado pieza a pieza.",
            tags: ["Tienda", "Catálogo", "Marca de autor"],
            url: "https://rosymargonzalez.com/",
            image: "/portafolio/screenshots/rosymargonzalez.jpg",
            caseSlug: "rosymar-gonzalez",
        },
    ],
    saas: [
        {
            nombre: "Toogo",
            linea: "Cualquier vendedor lanza su tienda en minutos y la maneja por WhatsApp.",
            tags: ["SaaS", "Multi-tenant", "LATAM"],
            url: "https://www.toogo.store/",
            image: "/portafolio/screenshots/toogo.jpg",
            caseSlug: "toogo",
        },
        {
            nombre: "Iudex",
            linea: "La primera IA jurídica de México, con criterio legal real.",
            tags: ["IA", "Legal", "Plataforma"],
            url: "https://iudex.mx/",
            image: "/portafolio/screenshots/iudex.jpg",
            caseSlug: "iudex",
        },
    ],
    medida: [
        {
            nombre: "Gobernia",
            linea: "Un consejo de administración de cuatro agentes de IA: CFO, CSO, CRO y Auditor.",
            tags: ["IA", "Agentes", "Gobierno corporativo"],
            url: "https://www.gobernia.ai/",
            image: "/portafolio/screenshots/gobernia.jpg",
            caseSlug: "gobernia",
        },
        {
            nombre: "Suzuki",
            linea: "App de quiz en iPad que sugería el modelo ideal según tu personalidad.",
            tags: ["App de evento", "iPad", "Activación"],
            image: "/soluciones/suzuki-ipad.png",
            bareImage: true,
            caseSlug: "suzuki",
        },
        {
            nombre: "Los DiDis 2024 · Control de acceso",
            linea: "Lector QR y panel en vivo para la edición 2024, con 1,800 asistentes esperados.",
            tags: ["Evento", "QR", "Control de acceso"],
            image: "/soluciones/ipad-didis-3.png",
            bareImage: true,
            caseSlug: "los-didis",
        },
        {
            nombre: "Los DiDis 2026",
            url: "https://losdidis2026.com/",
            linea: "Backend de registro, QR, acceso y métricas. Diseño proporcionado por el cliente.",
            tags: ["Desarrollo backend", "Registro", "QR", "Asistencia"],
            image: "/portafolio/screenshots/los-didis-registro.webp",
            caseSlug: "los-didis-2026",
        },
    ],
};

export const TOTAL_TRABAJOS = Object.values(TRABAJOS).reduce((n, l) => n + l.length, 0);
