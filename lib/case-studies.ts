// Fuente única de verdad para las páginas de casos de éxito (/casos/[slug] y
// /en/case-studies/[slug]). Los datos vienen de tres fuentes ya revisadas —
// no se inventa nada aquí:
//   1. case-studies.md (raíz del repo)      — reto/solución/resultado detallados
//      de Toogo, Iudex y Gobernia; métrica + URL de los otros 6.
//   2. app/portafolio/Sections.tsx           — badge, tags (stack), url, image.
//   3. lib/i18n/dictionaries.ts → portfolioPage.cases — prosa ES/EN ya
//      redactada y revisada (eyebrow, body, tags, metricLabel, imageAlt).
//
// Reglas del proyecto (no violar): sin testimonios inventados, sin cifras de
// inversión/duración de proyecto inventadas, sin números de "línea base" que
// no tengamos. `quote`, `investment` y `duration` son opcionales y se dejan
// SIN DEFINIR en los 9 casos — Carlos los añadirá cuando tenga los datos.

export type CaseStudyMetric = {
    value: string;
    label: string;
};

export type CaseStudyQuote = {
    text: string;
    name: string;
    role: string;
    company: string;
};

export type CaseStudyLangContent = {
    /** Título editorial del caso (H1 de la página). */
    title: string;
    /** Industria / categoría, se usa en el eyebrow. */
    industry: string;
    /** Respuesta directa (~40 palabras): problema → qué construimos → resultado. */
    summary: string;
    challenge: string;
    solution: string;
    result: string;
    /** Stack/servicios visibles, tomados de los tags de Sections.tsx. */
    stack: string[];
    imageAlt: string;
    metricLabel: string;
};

export type CaseStudy = {
    slug: string;
    /** Valor de la métrica destacada — idéntico en ES/EN (ej. "100+", "↑ 8x"). */
    metricValue: string;
    /** Sitio del cliente. Suzuki no tiene URL pública (app de evento en iPad). */
    url?: string;
    image: string;
    /** Suzuki se muestra sin marco de navegador (render de iPad). */
    bareImage?: boolean;
    es: CaseStudyLangContent;
    en: CaseStudyLangContent;
    // Opcionales — pendientes de datos reales, NO rellenar con placeholders.
    quote?: CaseStudyQuote;
    investment?: string;
    duration?: string;
};

/**
 * El caso SIN los bloques de idioma. Es lo que se pasa al componente de
 * presentación (que es "use client"): si le pasáramos el CaseStudy entero,
 * Next serializaría AMBOS idiomas en el payload RSC del HTML, dejando prosa
 * española dentro de la página inglesa (y viceversa) — señal mezclada para los
 * rastreadores de IA, que leen el HTML crudo, y peso duplicado en 18 páginas.
 */
export type CaseStudyBase = Omit<CaseStudy, "es" | "en">;

/**
 * Separa el caso en su parte común y el contenido del idioma pedido.
 * Pensado para hacer spread directo: <CaseStudyPage {...splitCaseStudy(x,"en")} lang="en" />
 */
export function splitCaseStudy(study: CaseStudy, lang: "es" | "en"): {
    study: CaseStudyBase;
    copy: CaseStudyLangContent;
} {
    const { es, en, ...base } = study;
    return { study: base, copy: lang === "en" ? en : es };
}

export const CASE_STUDIES: CaseStudy[] = [
    {
        slug: "iudex",
        metricValue: "100k+",
        url: "https://www.iudex.mx/",
        image: "/portafolio/screenshots/iudex.jpg",
        es: {
            title: "Iudex — la primera IA jurídica de México",
            industry: "Legal Tech · IA",
            summary:
                "Iudex necesitaba llevar la primera IA jurídica de México —con criterio legal real— a una plataforma que transmitiera autoridad. Construimos un sitio con integración de IA y diseño brutalista premium en blanco y negro. Resultado: más de 100,000 sesiones al mes.",
            challenge:
                "Llevar la primera IA jurídica de México (con criterio legal real) a una plataforma con autoridad y confianza.",
            solution:
                "Plataforma web con integración de IA y diseño brutalista premium en blanco y negro.",
            result: "100,000+ sesiones al mes.",
            stack: ["Next.js", "IA Integration", "Dark mode", "Editorial"],
            imageAlt: "Iudex · Legal AI",
            metricLabel: "Sesiones mes",
        },
        en: {
            title: "Iudex — Mexico's first legal AI",
            industry: "Legal Tech · AI",
            summary:
                "Iudex needed to bring Mexico's first legal AI —with real legal reasoning— onto a platform that conveyed authority and trust. We built a web platform with AI integration and a premium black-and-white brutalist design. Result: 100,000+ monthly sessions.",
            challenge:
                "Bring Mexico's first legal AI (with real legal reasoning) to a platform that conveys authority and trust.",
            solution:
                "Web platform with AI integration and a premium black-and-white brutalist design.",
            result: "100,000+ monthly sessions.",
            stack: ["Next.js", "AI Integration", "Dark mode", "Editorial"],
            imageAlt: "Iudex · Legal AI",
            metricLabel: "Sessions/mo",
        },
        // Recibido por /testimonio el 2026-07-30, con la casilla de autorización
        // marcada. El texto va literal, sin tocar una coma.
        //
        // En el formulario escribió "Sebastián" como nombre y "Moncayo" como
        // empresa, pero su correo es moncayo@iudex.mx: puso el apellido en la
        // casilla equivocada. Carlos, que lo conoce, confirmó el 2026-07-30 que
        // es Sebastián Moncayo, CEO de Iudex. Se publica así.
        quote: {
            text: "Un cambio necesario para nuestra imagen de marca. Nuestra página web cubrió exactamente lo que necesitábamos.",
            name: "Sebastián Moncayo",
            role: "CEO",
            company: "Iudex",
        },
    },
    {
        slug: "smile-better-clinics",
        metricValue: "↑ 3x",
        url: "https://smilebetterclinics.com/",
        image: "/portafolio/screenshots/smilebetter.jpg",
        es: {
            title: "Smile Better Clinics — cercanía y tecnología",
            industry: "Salud dental",
            summary:
                "Smile Better Clinics necesitaba comunicar cercanía y tecnología a partes iguales, con un agendado de citas inmediato en varias sedes. Construimos un sitio multi-clínica con CMS headless, reservas a un tap y SEO local. Resultado: triplicamos las citas mensuales.",
            challenge:
                "Smile Better Clinics, una red de clínicas dentales con enfoque holístico, necesitaba comunicar cercanía y tecnología a partes iguales, y que agendar una cita fuera inmediato.",
            solution:
                "Sitio multi-clínica con CMS headless, sistema de reservas a un tap y SEO local para cada sede.",
            result: "↑3x citas mensuales.",
            stack: ["Headless CMS", "Booking", "Multi-clinic", "SEO local"],
            imageAlt: "Smile Better · Clínica dental",
            metricLabel: "Citas mensuales",
        },
        en: {
            title: "Smile Better Clinics — warmth and technology",
            industry: "Dental health",
            summary:
                "Smile Better Clinics needed to communicate warmth and technology in equal measure, with instant appointment booking across multiple locations. We built a multi-clinic site with a headless CMS, one-tap booking, and local SEO. Result: 3x more monthly bookings.",
            challenge:
                "Smile Better Clinics, a holistic dental clinic network, needed to communicate warmth and technology in equal measure, and make booking an appointment instant.",
            solution:
                "Multi-clinic site with a headless CMS, one-tap booking, and local SEO for each location.",
            result: "3x more monthly bookings.",
            stack: ["Headless CMS", "Booking", "Multi-clinic", "Local SEO"],
            imageAlt: "Smile Better · Dental clinic",
            metricLabel: "Monthly bookings",
        },
    },
    {
        slug: "gobernia",
        metricValue: "↑ 8x",
        url: "https://gobernia-liard.vercel.app/",
        image: "/portafolio/screenshots/gobernia.jpg",
        es: {
            title: "Gobernia — un consejo de 4 agentes de IA",
            industry: "SaaS · Gobierno corporativo",
            summary:
                "Gobernia quería dar a las empresas acceso a un consejo experto —CFO, CSO, CRO y Auditor— sin contratar consultores caros. Construimos una plataforma SaaS con 4 agentes de IA que sesionan cada mes y entregan decisiones accionables, con un dashboard ejecutivo. Resultado: conversión multiplicada por 8.",
            challenge:
                "Dar a empresas acceso a un consejo experto (CFO, CSO, CRO, Auditor) sin contratar consultores caros.",
            solution:
                "Plataforma SaaS con 4 agentes de IA que sesionan cada mes y entregan decisiones accionables; dashboard ejecutivo.",
            result: "↑8x conversión.",
            stack: ["Next.js", "IA Agents", "SaaS", "Dashboard"],
            imageAlt: "Gobernia · 4 agentes IA",
            metricLabel: "Conversión",
        },
        en: {
            title: "Gobernia — a board of 4 AI agents",
            industry: "SaaS · Corporate governance",
            summary:
                "Gobernia wanted to give companies access to an expert board —CFO, CSO, CRO and Auditor— without hiring expensive consultants. We built a SaaS platform with 4 AI agents that meet monthly and deliver actionable decisions, with an executive dashboard. Result: an 8x increase in conversion.",
            challenge:
                "Give companies access to an expert board (CFO, CSO, CRO, Auditor) without hiring expensive consultants.",
            solution:
                "SaaS platform with 4 AI agents that meet monthly and deliver actionable decisions; executive dashboard.",
            result: "8x increase in conversion.",
            stack: ["Next.js", "AI Agents", "SaaS", "Dashboard"],
            imageAlt: "Gobernia · 4 AI agents",
            metricLabel: "Conversion",
        },
    },
    {
        slug: "happtek",
        metricValue: "↑ 6x",
        url: "https://audio-five-blue.vercel.app/",
        image: "/portafolio/screenshots/audiofive.jpg",
        es: {
            title: "Happtek — la voz de la elegancia",
            industry: "Audio premium",
            summary:
                "Happtek necesitaba un showroom digital para audio de gama alta que transmitiera la misma calidez analógica de sus productos. Construimos una experiencia con tipografía editorial, fotografía cinematográfica y soporte multi-idioma. Resultado: el tiempo en sitio se multiplicó por 6.",
            challenge:
                "Happtek necesitaba un showroom digital para equipos de audio de gama alta que transmitiera la misma calidez analógica de sus productos.",
            solution:
                "Showroom con tipografía editorial, fotografía cinematográfica y una experiencia multi-idioma que se siente como un disco de vinilo girando.",
            result: "↑6x tiempo en sitio.",
            stack: ["Next.js", "WebGL", "Hi-end", "Multi-idioma"],
            imageAlt: "Happtek · Audio premium",
            metricLabel: "Tiempo en sitio",
        },
        en: {
            title: "Happtek — the voice of elegance",
            industry: "Premium audio",
            summary:
                "Happtek needed a digital showroom for high-end audio that conveyed the same analog warmth as its products. We built an experience with editorial typography, cinematic photography, and multilingual support. Result: a 6x increase in time on site.",
            challenge:
                "Happtek needed a digital showroom for high-end audio equipment that conveyed the same analog warmth as its products.",
            solution:
                "A showroom with editorial typography, cinematic photography, and a multilingual experience that feels like a vinyl record spinning.",
            result: "6x increase in time on site.",
            stack: ["Next.js", "WebGL", "Hi-end", "Multilingual"],
            imageAlt: "Happtek · Premium audio",
            metricLabel: "Time on site",
        },
    },
    {
        slug: "barmored",
        metricValue: "↑ 7x",
        url: "https://www.barmoredsecurity.com/",
        image: "/portafolio/screenshots/barmored.jpg",
        es: {
            title: "Barmored Security — blindaje perfecto",
            industry: "Blindaje automotriz",
            summary:
                "Barmored Security, firma líder en blindaje automotriz de alto perfil, necesitaba un sitio que transmitiera la seriedad de sus certificaciones internacionales y facilitara pedir una cotización. Construimos un sitio de estética cinematográfica con video hero, certificaciones visibles y un flujo de cotización directo. Resultado: 7 veces más cotizaciones.",
            challenge:
                "Una firma líder en blindaje automotriz de alto perfil necesitaba una presencia web que transmitiera la seriedad de sus certificaciones internacionales y redujera la fricción para pedir una cotización.",
            solution:
                "Sitio con estética cinematográfica, video hero, certificaciones internacionales visibles y un flujo de cotización directo — porque cuando se trata de seguridad, no hay tiempo para fricciones.",
            result: "↑7x cotizaciones.",
            stack: ["Web Design · Custom", "Video hero", "Cotización", "B2B"],
            imageAlt: "Barmored Security · Blindaje automotriz",
            metricLabel: "Cotizaciones",
        },
        en: {
            title: "Barmored Security — flawless armoring",
            industry: "Vehicle armoring",
            summary:
                "Barmored Security, a leading high-profile vehicle-armoring firm, needed a site that conveyed the seriousness of its international certifications and made requesting a quote effortless. We built a cinematic site with a hero video, visible certifications, and a direct quote flow. Result: 7x more quote requests.",
            challenge:
                "A leading high-profile vehicle-armoring firm needed a web presence that conveyed the seriousness of its international certifications and removed friction from requesting a quote.",
            solution:
                "A site with a cinematic aesthetic, hero video, visible international certifications and a direct quote flow — because when it comes to security, there's no time for friction.",
            result: "7x more quote requests.",
            stack: ["Web Design · Custom", "Video hero", "Quote", "B2B"],
            imageAlt: "Barmored Security · Vehicle armoring",
            metricLabel: "Quote requests",
        },
    },
    {
        slug: "toogo",
        metricValue: "100+",
        url: "https://www.toogo.store/",
        image: "/portafolio/screenshots/toogo.jpg",
        es: {
            title: "Toogo — tu tienda, lista en minutos",
            industry: "SaaS · E-commerce",
            summary:
                "Toogo necesitaba que cualquier vendedor de PyMEs en LATAM pudiera lanzar su tienda en línea en minutos, sin programador ni diseñador. Construimos una plataforma SaaS multi-tenant con arquitectura aislada por inquilino, onboarding asistido por IA y cobro por suscripción vía Stripe. Resultado: más de 100 tiendas activas.",
            challenge:
                "Que cualquier vendedor (PyMEs de LATAM) pudiera lanzar su tienda en línea en minutos, sin programador ni diseñador.",
            solution:
                "Plataforma SaaS multi-tenant con arquitectura aislada por inquilino, onboarding asistido por IA, dashboard del comerciante y cobro por suscripción (Stripe Billing).",
            result: "100+ tiendas activas.",
            stack: ["Next.js · Multi-tenant", "Stripe Billing", "AI Onboarding", "SaaS"],
            imageAlt: "Toogo · SaaS E-commerce multi-tenant",
            metricLabel: "Tiendas activas",
        },
        en: {
            title: "Toogo — your store, live in minutes",
            industry: "SaaS · E-commerce",
            summary:
                "Toogo needed to let any LATAM SMB seller launch an online store in minutes — no developer, no designer required. We built a multi-tenant SaaS platform with tenant-isolated architecture, AI-assisted onboarding, and Stripe subscription billing. Result: 100+ active stores.",
            challenge:
                "Let any seller (LATAM SMBs) launch an online store in minutes — no developer, no designer.",
            solution:
                "Multi-tenant SaaS platform with tenant-isolated architecture, AI-assisted onboarding, merchant dashboard, and subscription billing (Stripe).",
            result: "100+ active stores.",
            stack: ["Next.js · Multi-tenant", "Stripe Billing", "AI Onboarding", "SaaS"],
            imageAlt: "Toogo · SaaS E-commerce multi-tenant",
            metricLabel: "Active stores",
        },
    },
    {
        slug: "suzuki",
        metricValue: "500+",
        image: "/soluciones/suzuki-ipad.png",
        bareImage: true,
        es: {
            title: "Suzuki — ¿qué coche eres?",
            industry: "Activación de evento",
            summary:
                "Suzuki necesitaba una activación de marca memorable para un evento en vivo. Construimos, en alianza con Enso Media, una app de quiz interactivo para iPad que sugería el modelo Suzuki ideal según la personalidad de cada asistente. Resultado: más de 500 personas vivieron la experiencia.",
            challenge:
                "Suzuki necesitaba una activación de marca memorable para un evento en vivo, que conectara la personalidad del asistente con un modelo Suzuki de forma interactiva.",
            solution:
                "App de quiz interactivo para iPad, en alianza con Enso Media: los asistentes respondían un test de personalidad y la app les sugería el modelo Suzuki ideal.",
            result: "Más de 500 personas vivieron la experiencia en el evento.",
            stack: ["App de evento", "Quiz interactivo", "iPad", "Activación de marca"],
            imageAlt: "Suzuki · App de quiz para evento, en alianza con Enso Media",
            metricLabel: "Quizzes en el evento",
        },
        en: {
            title: "Suzuki — which car are you?",
            industry: "Event activation",
            summary:
                "Suzuki needed a memorable brand activation for a live event. In partnership with Enso Media, we built an interactive iPad quiz app that suggested each attendee's ideal Suzuki model based on their personality. Result: more than 500 people experienced it.",
            challenge:
                "Suzuki needed a memorable brand activation for a live event that connected each attendee's personality to a Suzuki model in an interactive way.",
            solution:
                "An interactive quiz app for iPad, built in partnership with Enso Media: attendees took a personality test and the app suggested their ideal Suzuki model.",
            result: "More than 500 people experienced it at the event.",
            stack: ["Event app", "Interactive quiz", "iPad", "Brand activation"],
            imageAlt: "Suzuki · Event quiz app, in partnership with Enso Media",
            metricLabel: "Quizzes at the event",
        },
        // Recibido por /testimonio el 2026-07-30, con la casilla de autorización
        // marcada. Del original solo se corrigieron dos erratas evidentes
        // ("siemore" -> "siempre", "como" -> "cómo") y el punto final; ni una
        // palabra más. Va sin traducir en la página inglesa a propósito: son las
        // palabras de una persona real, no copy nuestro.
        quote: {
            text: "Todo perfecto, los cambios y las propuestas de cómo hacer las cosas siempre fueron en pro del evento y de hacerlo mejor.",
            name: "Rodrigo Juárez",
            role: "Productor",
            company: "Enso Media",
        },
    },
    {
        slug: "rosymar-gonzalez",
        metricValue: "↑ 5x",
        url: "https://rosymargonzalez.com/",
        image: "/portafolio/screenshots/rosymargonzalez.jpg",
        es: {
            title: "Rosymar González — joyería con manifiesto",
            industry: "Joyería",
            summary:
                "Rosymar González necesitaba un e-commerce para su joyería en oro 18k y 24k que reflejara el cuidado al detalle de cada pieza. Construimos una tienda con catálogo curado, manifiesto de marca y una experiencia de compra cuidada al detalle. Resultado: las ventas online se multiplicaron por 5.",
            challenge:
                "Rosymar González necesitaba un e-commerce para su joyería con baño en oro 18k y 24k que transmitiera el cuidado al detalle de cada pieza.",
            solution:
                "Tienda con catálogo curado, manifiesto de marca y una experiencia de compra cuidada al detalle — para que cada pieza llegue como debe llegar.",
            result: "↑5x ventas online.",
            stack: ["E-Commerce", "Custom theme", "Manifiesto", "Tienda"],
            imageAlt: "Rosymar González · Joyería",
            metricLabel: "Ventas online",
        },
        en: {
            title: "Rosymar González — jewelry with a manifesto",
            industry: "Jewelry",
            summary:
                "Rosymar González needed an e-commerce site for her 18k and 24k gold jewelry that reflected the care behind every piece. We built a store with a curated catalog, brand manifesto, and a shopping experience crafted to the detail. Result: online sales grew 5x.",
            challenge:
                "Rosymar González needed an e-commerce site for jewelry plated in 18k and 24k gold that conveyed the care behind every piece.",
            solution:
                "A store with a curated catalog, brand manifesto, and a shopping experience crafted to the detail — so every piece arrives as it should.",
            result: "5x online sales.",
            stack: ["E-Commerce", "Custom theme", "Manifesto", "Store"],
            imageAlt: "Rosymar González · Jewelry",
            metricLabel: "Online sales",
        },
        // Recibido por /testimonio el 2026-07-31, con la casilla de autorización
        // marcada. Del original solo se añadió el punto final; el resto va literal,
        // incluida la frase que arranca con "Y" — es su forma de hablar, no una errata.
        quote: {
            text: "No teníamos un sitio web para comercializar nuestros productos en línea. Y el equipo de Keting Media nos asesoró y nos apoyó en la construcción del sitio, de manera profesional y rápida. Luego también nos ofreció su soporte de mantenimiento. Muy contentos.",
            name: "Andrés Bustillos",
            role: "Director comercial",
            company: "Rosymar González Joyas",
        },
    },
    {
        slug: "ivan-ivanovich-academy",
        metricValue: "↑ 4x",
        url: "https://ivanivanovich.com/",
        image: "/portafolio/screenshots/ivanivanovich.jpg",
        es: {
            title: "Ivan Ivanovich Academy — autoridad y precisión",
            industry: "Protección ejecutiva",
            summary:
                "Ivan Ivanovich Academy, la academia de protección ejecutiva más reconocida de México, necesitaba unificar cursos en vivo, eventos, blog y un sistema de afiliados bajo una sola identidad. Construimos una plataforma multi-idioma con e-commerce integrado. Resultado: el tráfico anual se multiplicó por 4.",
            challenge:
                "La academia de protección ejecutiva más reconocida de México necesitaba una plataforma que unificara cursos en vivo, eventos, blog y un sistema de afiliados bajo una sola identidad de autoridad.",
            solution:
                "Plataforma multi-idioma con cursos en vivo, eventos, blog y sistema de afiliados, con e-commerce integrado — todo bajo una identidad de precisión.",
            result: "↑4x tráfico anual.",
            stack: ["Web Design · Custom", "Multi-idioma", "E-Commerce", "Eventos"],
            imageAlt: "Ivan Ivanovich · Academia de Protección Ejecutiva",
            metricLabel: "Tráfico anual",
        },
        en: {
            title: "Ivan Ivanovich Academy — authority and precision",
            industry: "Executive protection",
            summary:
                "Ivan Ivanovich Academy, Mexico's most recognized executive-protection academy, needed to unify live courses, events, a blog, and an affiliate system under one identity. We built a multilingual platform with integrated e-commerce. Result: a 4x increase in annual traffic.",
            challenge:
                "Mexico's most recognized executive-protection academy needed a platform that unified live courses, events, a blog, and an affiliate system under one identity of authority.",
            solution:
                "Multilingual platform with live courses, events, a blog, and an affiliate system, with integrated e-commerce — all under an identity of precision.",
            result: "4x annual traffic.",
            stack: ["Web Design · Custom", "Multilingual", "E-Commerce", "Events"],
            imageAlt: "Ivan Ivanovich · Executive Protection Academy",
            metricLabel: "Annual traffic",
        },
    },
];

// Fecha de publicación de las páginas de caso (hoy). NO es la fecha real del
// proyecto — esa no la tenemos y no se inventa.
export const CASE_STUDIES_PUBLISHED_DATE = "2026-07-27";

export const CASE_STUDY_SLUGS = CASE_STUDIES.map((c) => c.slug);

export function getCaseStudy(slug: string): CaseStudy | undefined {
    return CASE_STUDIES.find((c) => c.slug === slug);
}
