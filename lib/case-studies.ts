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
// no tengamos. `investment` y `duration` son opcionales y siguen SIN DEFINIR en
// los 9 casos — Carlos los añadirá cuando tenga los datos.
//
// Los testimonios se movieron a lib/testimonials.ts (agosto 2026): había que
// poder publicar el de un cliente cuyo proyecto todavía no tiene página de caso.

export type CaseStudyMetric = {
    value: string;
    label: string;
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
    /** Crédito específico cuando el diseño y el desarrollo tienen autores distintos. */
    imageCredit?: string;
    metricLabel: string;
    /** Alcance detallado cuando el caso necesita explicar varios flujos. */
    details?: {
        title: string;
        body: string;
        screenshot?: {
            src: string;
            alt: string;
            caption: string;
            width: number;
            height: number;
        };
    }[];
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
    // Los testimonios YA NO viven aquí: fuente única en lib/testimonials.ts, que
    // admite testimonios de proyectos sin página de caso. Ver la nota de ese
    // fichero antes de reintroducir un campo `quote`.
    // Opcionales — pendientes de datos reales, NO rellenar con placeholders.
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
        slug: "re-dress",
        metricValue: "Full stack",
        url: "https://www.redressmx.com/",
        image: "/portafolio/screenshots/redress.jpg",
        es: {
            title: "Re Dress — marketplace de vestidos pre-loved",
            industry: "Marketplace · Moda circular",
            summary:
                "Desarrollamos el sistema completo de Re Dress: marketplace de vestidos de diseñador pre-loved, panel de vendedoras, administración, showroom y cobros recurrentes. Unificamos la operación en una plataforma propia y migramos las suscripciones de Stripe sin interrumpir los cobros.",
            challenge:
                "La operación estaba repartida entre una tienda heredada, Airtable y Zapier. El inventario, los cobros y las citas no coincidían, y las suscripciones activas de Stripe debían seguir funcionando durante toda la migración.",
            solution:
                "Construimos una plataforma propia de principio a fin: catálogo, carrito, publicación de vestidos, panel de vendedoras, agenda del showroom, administración y cobros. Reconciliamos los registros de cada herramienta antes de migrarlos, con scripts que simulan los cambios y solo escriben después de verificar el resultado.",
            result:
                "La tienda en línea y el showroom operan desde el mismo sistema, con inventario, membresías, ventas y citas conectados. Las suscripciones se conservaron sin interrupciones ni cobros perdidos, sobre una base de pruebas automatizadas y despliegue continuo.",
            stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Vercel"],
            imageAlt: "Re Dress · Marketplace de vestidos de diseñador pre-loved",
            metricLabel: "Desarrollo integral",
            details: [
                {
                    title: "El negocio",
                    body: "Re Dress compra y vende vestidos de diseñador de segunda mano en México. Combina una tienda en línea con un showroom en Ciudad de México, donde las clientas agendan cita para probarse. Las vendedoras pagan una membresía mientras su vestido está publicado y una comisión solo cuando se vende.",
                },
                {
                    title: "Para quien vende",
                    body: "Un formulario por pasos permite publicar el vestido, elegir entre showroom o venta solo en línea y pagar en el mismo flujo. Desde su panel, cada vendedora sigue el estado de sus prendas, contrata servicios adicionales, cambia de plan o da de baja su membresía.",
                    screenshot: {
                        src: "/portafolio/screenshots/redress-vendedora.png",
                        alt: "Panel de vendedora de Re Dress: publicación de vestidos y selección de membresía para showroom o venta en línea",
                        caption: "Panel de vendedora · Publicación y membresía por vestido. Captura editada para ocultar cifras.",
                        width: 1657,
                        height: 949,
                    },
                },
                {
                    title: "Para quien compra",
                    body: "Catálogo con filtros por talla, color, silueta y diseñador, carrito de compras y agenda de citas con disponibilidad real del showroom.",
                },
                {
                    title: "Para quien administra",
                    body: "Un panel cubre el ciclo completo: moderación de publicaciones, inventario físico del showroom, agenda en calendario, ventas con desglose de comisiones, pagos a vendedoras, cobranza de membresías vencidas, envíos, reportes y bitácora de correos enviados.",
                    screenshot: {
                        src: "/portafolio/screenshots/redress-supra-admin.png",
                        alt: "Panel supra-admin de Re Dress: módulos de operación y gestión de vestidos donados, con datos personales y cifras ocultos",
                        caption: "Supra-admin · Gestión de vestidos donados y acceso a la operación. Captura editada para ocultar cifras y datos personales.",
                        width: 1614,
                        height: 975,
                    },
                },
                {
                    title: "Cobros y comunicación",
                    body: "Membresía por vestido, mensual para showroom y anual para venta en línea, con servicios opcionales de fotografía destacada, tintorería y guía de paquetería. Los correos transaccionales acompañan cada paso de la operación.",
                },
                {
                    title: "Una migración con cobros en marcha",
                    body: "El reto fue reconciliar fuentes que habían dejado de coincidir: suscripciones sin dueño identificable, vestidos vendidos que seguían cobrando y vendedoras con distintos correos para su registro y sus pagos. Cruzamos las fuentes registro por registro, verificando cada cambio antes de aplicarlo para preservar las suscripciones activas.",
                },
            ],
        },
        en: {
            title: "Re Dress — a pre-loved dress marketplace",
            industry: "Marketplace · Circular fashion",
            summary:
                "We built the complete Re Dress system: a pre-loved designer dress marketplace, seller dashboard, administration, showroom scheduling, and recurring billing. We unified operations on a custom platform and migrated Stripe subscriptions without interrupting payments.",
            challenge:
                "Operations were spread across a legacy store, Airtable, and Zapier. Inventory, billing, and appointments did not match, while active Stripe subscriptions had to keep running throughout the migration.",
            solution:
                "We built the platform from start to finish: catalog, cart, dress listings, seller dashboard, showroom scheduling, administration, and billing. We reconciled records across the existing tools before migrating them, using scripts that simulate changes and only write after the results have been verified.",
            result:
                "The online store and showroom now run on the same system, with connected inventory, memberships, sales, and appointments. Subscriptions were preserved without interruptions or lost payments, supported by automated testing and continuous deployment.",
            stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Vercel"],
            imageAlt: "Re Dress · Pre-loved designer dress marketplace",
            metricLabel: "Complete platform development",
            details: [
                {
                    title: "The business",
                    body: "Re Dress buys and sells pre-loved designer dresses in Mexico. It combines an online store with a Mexico City showroom where customers book appointments to try on dresses. Sellers pay a membership while their dress is listed and a commission only when it sells.",
                },
                {
                    title: "For sellers",
                    body: "A step-by-step form lets sellers list a dress, choose showroom or online-only selling, and pay within the same flow. Their dashboard lets them track each garment, purchase additional services, change plans, or cancel their membership.",
                    screenshot: {
                        src: "/portafolio/screenshots/redress-vendedora.png",
                        alt: "Re Dress seller dashboard: dress listing and membership selection for showroom or online sales",
                        caption: "Seller dashboard · Dress listings and per-dress memberships. Screenshot edited to hide figures.",
                        width: 1657,
                        height: 949,
                    },
                },
                {
                    title: "For buyers",
                    body: "A catalog with filters for size, color, silhouette, and designer, a shopping cart, and appointment booking with real showroom availability.",
                },
                {
                    title: "For administrators",
                    body: "An administration panel covers the full cycle: listing moderation, physical showroom inventory, appointment calendars, sales with commission breakdowns, seller payouts, overdue membership collection, shipping, reports, and sent-email logs.",
                    screenshot: {
                        src: "/portafolio/screenshots/redress-supra-admin.png",
                        alt: "Re Dress super-admin dashboard: operational modules and donated dress management, with personal data and figures hidden",
                        caption: "Super-admin · Donated dress management and operational modules. Screenshot edited to hide figures and personal data.",
                        width: 1614,
                        height: 975,
                    },
                },
                {
                    title: "Billing and communication",
                    body: "Each dress has a membership: monthly for the showroom and annual for online-only sales. Optional services include featured photography, dry cleaning, and shipping labels. Transactional emails accompany each step of the operation.",
                },
                {
                    title: "Migrating while payments kept running",
                    body: "The challenge was reconciling sources that no longer agreed: subscriptions without an identifiable owner, sold dresses that were still being billed, and sellers using different emails for registration and payments. We cross-checked the sources record by record, verifying each change before applying it to preserve active subscriptions.",
                },
            ],
        },
    },
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
        url: "https://www.gobernia.ai/",
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
        url: "https://www.happtek.com.mx/",
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
        // Edición 2026: registro, selección de evento, QR y métricas de asistencia.
        slug: "los-didis-2026",
        url: "https://losdidis2026.com/",
        metricValue: "QR",
        image: "/portafolio/screenshots/los-didis-registro.webp",
        es: {
            title: "Los DiDis 2026 — del registro al acceso con QR",
            industry: "Software para eventos",
            summary:
                "El cliente proporcionó el diseño de Los DiDis 2026. KETING desarrolló todo el backend: registro, selección de evento, envío de QR, control de acceso y métricas para consultar quién asistió y quién no.",
            challenge:
                "Conectar el registro de cada persona con el evento elegido, su pase de acceso y el seguimiento de asistencia, para que el equipo organizador pueda distinguir entre personas registradas y personas que realmente llegaron.",
            solution:
                "Desarrollo del backend que procesa los registros, vincula a cada persona con el evento elegido, genera y envía su QR, valida el acceso y reúne las métricas de asistencia. El diseño visual fue proporcionado por el cliente.",
            result: "Registro, acceso y seguimiento de asistencia conectados: el equipo puede consultar quién ingresó y quién no, y comparar los registros con la asistencia al evento.",
            stack: ["Desarrollo backend", "Registro web", "Selección de evento", "Envío de QR", "Control de acceso", "Métricas de asistencia"],
            imageAlt: "Los DiDis 2026 · Página de registro y selección de evento",
            imageCredit: "Diseño proporcionado por el cliente. Desarrollo backend: KETING Media.",
            metricLabel: "Registro y acceso",
            details: [
                {
                    title: "Antes del evento: registro y QR",
                    body: "Cada persona completa su registro, elige el evento al que quiere asistir y recibe el código QR que utilizará para ingresar.",
                    screenshot: {
                        src: "/portafolio/screenshots/los-didis-2026-formulario.webp",
                        alt: "Los DiDis 2026 · Formulario de registro vacío con selección de evento",
                        caption: "Diseño proporcionado por el cliente; backend desarrollado por KETING. Formulario sin datos personales.",
                        width: 1920,
                        height: 982,
                    },
                },
                {
                    title: "El pase de acceso",
                    body: "Al completar el registro, la persona recibe su pase con un QR para ingresar al evento. Esta muestra conserva el diseño del gafete; se retiraron los datos del asistente, el folio y el código original.",
                    screenshot: {
                        src: "/portafolio/screenshots/los-didis-2026-pase-muestra.webp",
                        alt: "Los DiDis 2026 · Pase de muestra anonimizado, sin QR ni folio originales",
                        caption: "Diseño proporcionado por el cliente. Muestra anonimizada para el portafolio, sin datos ni QR originales y sin validez para acceso.",
                        width: 1060,
                        height: 1484,
                    },
                },
                {
                    title: "El día del evento: acceso y seguimiento",
                    body: "El equipo de acceso escanea el QR y registra la entrada. El panel permite consultar quién accedió y quién sigue pendiente de llegar.",
                },
                {
                    title: "Después: registrados frente a asistentes",
                    body: "Las métricas permiten comparar los registros con los accesos y distinguir a las personas que asistieron de quienes no llegaron.",
                },
            ],
        },
        en: {
            title: "Los DiDis 2026 — from registration to QR check-in",
            industry: "Event software",
            summary:
                "The client provided the design for Los DiDis 2026. KETING developed the entire backend: registration, event selection, QR delivery, access control and metrics showing who attended and who did not.",
            challenge:
                "Connect each person's registration with their chosen event, entry pass and attendance record, so organizers can distinguish registrations from people who actually arrived.",
            solution:
                "Backend development to process registrations, associate each person with their chosen event, generate and deliver QR passes, validate entry and compile attendance metrics. The client provided the visual design.",
            result: "Connected registration, entry and attendance tracking: organizers can see who checked in and who did not, and compare registrations with event attendance.",
            stack: ["Backend development", "Web registration", "Event selection", "QR delivery", "Access control", "Attendance metrics"],
            imageAlt: "Los DiDis 2026 · Registration and event selection page",
            imageCredit: "Design provided by the client. Backend development: KETING Media.",
            metricLabel: "Registration and entry",
            details: [
                {
                    title: "Before the event: registration and QR",
                    body: "Each person registers, chooses their event and receives the QR code they will use for entry.",
                    screenshot: {
                        src: "/portafolio/screenshots/los-didis-2026-formulario.webp",
                        alt: "Los DiDis 2026 · Empty registration form with event selection",
                        caption: "Design provided by the client; backend developed by KETING. Form with no personal data.",
                        width: 1920,
                        height: 982,
                    },
                },
                {
                    title: "The entry pass",
                    body: "After registration, the attendee receives a pass with a QR code for event entry. This sample preserves the badge design; attendee details, the reference number and the original code have been removed.",
                    screenshot: {
                        src: "/portafolio/screenshots/los-didis-2026-pase-muestra.webp",
                        alt: "Los DiDis 2026 · Anonymized sample pass without the original QR or reference number",
                        caption: "Design provided by the client. Anonymized portfolio sample with original details and QR removed; not valid for entry.",
                        width: 1060,
                        height: 1484,
                    },
                },
                {
                    title: "On the day: check-in and tracking",
                    body: "Staff scan each QR code and log the arrival. The dashboard shows who has checked in and who has yet to arrive.",
                },
                {
                    title: "Afterwards: registrations versus attendance",
                    body: "Metrics compare registrations with check-ins, identifying the people who attended and those who did not arrive.",
                },
            ],
        },
    },
    {
        // Cliente: Enso Media (productora), marca del evento: Los DiDis. Misma
        // relación que Suzuki — se acredita la alianza, como allí.
        //
        // Sin `url`: es una app de evento que corrió en un iPad en la puerta, no
        // un sitio público. La imagen cae al caso, no a un destino inventado.
        //
        // ⚠️ La métrica son asistentes ESPERADOS, que es el dato que existe (sale
        // del propio panel de la app). NO se convierte en "1,800 personas
        // entraron": eso sería afirmar un resultado que nadie midió. Si Carlos
        // consigue el número real de accesos, se cambia aquí y en
        // lib/testimonials.ts si algún día tiene testimonio.
        slug: "los-didis",
        metricValue: "1,800",
        image: "/soluciones/ipad-didis-3.png",
        bareImage: true,
        es: {
            title: "Los DiDis 2024 — cada QR contado",
            industry: "Control de acceso · Evento en vivo",
            summary:
                "Los DiDis 2024 necesitaba saber en tiempo real quién había entrado al evento y quién no, sobre 1,800 asistentes esperados. Construimos, en alianza con Enso Media, un lector de QR con panel en vivo que corre desde un iPad en la puerta.",
            challenge:
                "Saber durante el evento, y no al día siguiente, quién había accedido y quién seguía sin llegar — sobre 1,800 asistentes esperados y con el control hecho en la propia puerta.",
            solution:
                "Lector de QR con panel en vivo para iPad, en alianza con Enso Media: cada acceso queda registrado al instante y el panel muestra cuántos han entrado y cuántos faltan.",
            result: "Control de acceso y conteo en vivo para un evento de 1,800 asistentes esperados.",
            stack: ["Lector QR", "Panel en vivo", "iPad", "Control de acceso"],
            imageAlt: "Los DiDis 2024 · Lector de QR y panel en vivo, en alianza con Enso Media",
            metricLabel: "Asistentes esperados",
        },
        en: {
            title: "Los DiDis 2024 — every QR accounted for",
            industry: "Access control · Live event",
            summary:
                "Los DiDis 2024 needed to know in real time who had entered the event and who hadn't, across 1,800 expected attendees. In partnership with Enso Media, we built a QR reader with a live dashboard running from an iPad at the door.",
            challenge:
                "Knowing during the event — not the next day — who had checked in and who still hadn't, across 1,800 expected attendees, with the control happening right at the door.",
            solution:
                "A QR reader with a live dashboard for iPad, built in partnership with Enso Media: every check-in is logged instantly and the dashboard shows how many are in and how many are still missing.",
            result: "Access control and live headcount for an event with 1,800 expected attendees.",
            stack: ["QR reader", "Live dashboard", "iPad", "Access control"],
            imageAlt: "Los DiDis 2024 · QR reader and live dashboard, in partnership with Enso Media",
            metricLabel: "Expected attendees",
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
    },
    {
        slug: "ivan-ivanovich-academy",
        metricValue: "↑ 4x",
        url: "https://ivanivanovich.com/",
        image: "/portafolio/screenshots/ivanivanovich-lms.webp",
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
