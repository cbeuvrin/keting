// Contenido de las páginas "Nosotros" (/nosotros, /en/about) y "Autor"
// (/nosotros/carlos-beuvrin, /en/about/carlos-beuvrin).
//
// Reglas del proyecto (no violar): CERO datos biográficos inventados —sin
// universidad, títulos, premios, certificaciones o "años de experiencia"
// concretos que no consten en `lib/author.ts`, `public/llms.txt` o
// `lib/case-studies.ts`—. Todo lo que aparece aquí es una redacción nueva
// sobre hechos ya verificados en esas fuentes; nada se rellena.
//
// Este módulo NO lleva "use client": lo importan solo los page.tsx de
// servidor, que separan el idioma y pasan como prop SOLO el bloque que
// corresponde al componente de presentación (ver `splitCaseStudy` en
// lib/case-studies.ts para el mismo patrón). Así se evita que Next serialice
// ambos idiomas en el payload RSC del HTML.

export type AboutLangContent = {
    heroEyebrow: string;
    heroTitleLead: string;
    heroTitleAccent: string;
    heroSubtitle: string;
    storyEyebrow: string;
    storyTitle: string;
    storyParagraphs: string[];
    pillarsEyebrow: string;
    pillarsTitle: string;
    pillars: { title: string; body: string }[];
    founderEyebrow: string;
    founderTitle: string;
    founderBody: string;
    founderCta: string;
    founderImageAlt: string;
    workEyebrow: string;
    workTitle: string;
    workBody: string;
    workCta: string;
    ctaHeading: string;
    ctaHeadingAccent: string;
    ctaBody: string;
    ctaButton: string;
};

export const COMPANY_ABOUT: { es: AboutLangContent; en: AboutLangContent } = {
    es: {
        heroEyebrow: "Nosotros",
        heroTitleLead: "Construimos",
        heroTitleAccent: "software",
        heroSubtitle:
            "Keting Media es una empresa mexicana de desarrollo de software, web y apps a medida, con sede en Ciudad de México. Diseñamos y programamos productos digitales desde cero, combinando ingeniería de software, diseño de producto e inteligencia artificial aplicada en un mismo equipo.",
        storyEyebrow: "Desde 2019",
        storyTitle: "Nuestra historia",
        storyParagraphs: [
            "Keting Media nace en 2019 en Ciudad de México como empresa de desarrollo de software, web y apps a medida. Desde entonces construimos productos digitales de extremo a extremo —sitios web, e-commerce, aplicaciones móviles, plataformas SaaS y sistemas internos— para marcas y empresas en México y Latinoamérica.",
            "Trabajamos con marcas que buscan escalar su negocio mediante soluciones innovadoras y un diseño que realmente conecta con sus clientes. No subcontratamos piezas sueltas del proyecto: ingeniería, diseño de producto e inteligencia artificial aplicada viven bajo un mismo techo.",
            "Más del 80% de nuestros proyectos llegan por referido: el resultado de un trabajo anterior habla antes que cualquier propuesta.",
        ],
        pillarsEyebrow: "Cómo trabajamos",
        pillarsTitle: "Nuestro enfoque",
        pillars: [
            {
                title: "Ingeniería primero",
                body: "Cada proyecto se construye sobre una arquitectura sólida, no sobre una plantilla. El código llega a producción — no se queda en un prototipo bonito.",
            },
            {
                title: "IA en el núcleo del producto",
                body: "No añadimos inteligencia artificial como una capa superficial: la integramos en la arquitectura del producto, desde agentes conversacionales hasta sistemas multi-agente.",
            },
            {
                title: "Un equipo, todo el proceso",
                body: "Diseño de producto, ingeniería de software e IA aplicada en un mismo equipo, dirigido a nivel de arquitectura por su fundador — sin intermediarios.",
            },
        ],
        founderEyebrow: "Fundador",
        founderTitle: "Dirigido por Carlos Beuvrin",
        founderBody:
            "Keting Media fue fundada por Carlos Beuvrin, Ingeniero de IA, quien dirige el desarrollo de cada proyecto a nivel de arquitectura. Cada caso de éxito que aparece en este sitio se construyó bajo esa dirección.",
        founderCta: "Conoce a Carlos Beuvrin",
        founderImageAlt: "Carlos Beuvrin — Ingeniero de IA y Fundador de Keting Media",
        workEyebrow: "Trabajo real",
        workTitle: "9 marcas, 9 retos distintos",
        workBody:
            "Legal-tech, gobierno corporativo, salud dental, blindaje automotriz, e-commerce, SaaS y más. Cada caso documenta el reto, la solución y el resultado — con métricas reales, sin relleno.",
        workCta: "Ver los 9 casos de éxito",
        ctaHeading: "¿Tu marca necesita",
        ctaHeadingAccent: "algo así?",
        ctaBody: "Un café de 30 minutos es suficiente para entender si encajamos. Sin compromiso.",
        ctaButton: "Hablemos",
    },
    en: {
        heroEyebrow: "About us",
        heroTitleLead: "We build",
        heroTitleAccent: "software",
        heroSubtitle:
            "Keting Media is a Mexican custom software, web and app development company based in Mexico City. We design and build digital products from scratch, combining software engineering, product design, and applied AI in one team.",
        storyEyebrow: "Since 2019",
        storyTitle: "Our story",
        storyParagraphs: [
            "Keting Media was founded in 2019 in Mexico City as a custom software, web and app development company. Since then we've built end-to-end digital products —websites, e-commerce, mobile apps, SaaS platforms, and internal systems— for brands and companies across Mexico and Latin America.",
            "We work with brands looking to scale their business through innovative solutions and design that truly connects with their customers. We don't outsource pieces of a project: engineering, product design, and applied AI live under one roof.",
            "More than 80% of our projects come from referrals: the result of a previous project speaks before any pitch does.",
        ],
        pillarsEyebrow: "How we work",
        pillarsTitle: "Our approach",
        pillars: [
            {
                title: "Engineering first",
                body: "Every project is built on a solid architecture, not a template. The code reaches production — it doesn't stay a nice-looking prototype.",
            },
            {
                title: "AI at the core of the product",
                body: "We don't bolt AI on as a surface layer: we integrate it into the product's architecture, from conversational agents to multi-agent systems.",
            },
            {
                title: "One team, the whole process",
                body: "Product design, software engineering, and applied AI in one team, led at the architecture level by its founder — no middlemen.",
            },
        ],
        founderEyebrow: "Founder",
        founderTitle: "Led by Carlos Beuvrin",
        founderBody:
            "Keting Media was founded by Carlos Beuvrin, an AI Engineer who leads the development of every project at the architecture level. Every case study on this site was built under that direction.",
        founderCta: "Meet Carlos Beuvrin",
        founderImageAlt: "Carlos Beuvrin — AI Engineer and Founder of Keting Media",
        workEyebrow: "Real work",
        workTitle: "9 brands, 9 different challenges",
        workBody:
            "Legal tech, corporate governance, dental health, vehicle armoring, e-commerce, SaaS, and more. Every case documents the challenge, the solution, and the result — real metrics, no filler.",
        workCta: "See the 9 case studies",
        ctaHeading: "Does your brand need",
        ctaHeadingAccent: "something like this?",
        ctaBody: "A 30-minute coffee is enough to see if we're a fit. No commitment.",
        ctaButton: "Let's talk",
    },
};

export type AuthorAboutLangContent = {
    eyebrow: string;
    roleLabel: string;
    /** Frase de posicionamiento, tipografía grande — no un párrafo más. */
    positioning: string;
    /** Bio partida en bloques con subtítulo — reorganiza AUTHOR.bio, no la reescribe. */
    bioSections: { title: string; body: string }[];
    linkedinLabel: string;
    githubLabel: string;
    companyLabel: string;
    metricsEyebrow: string;
    metricsTitle: string;
    projectsEyebrow: string;
    projectsTitle: string;
    projectsBody: string;
    blogEyebrow: string;
    blogHeading: string;
    blogBody: string;
    blogCta: string;
    ctaHeading: string;
    ctaHeadingAccent: string;
    ctaBody: string;
    ctaButton: string;
};

// La bio reorganiza AUTHOR.bio (lib/author.ts) y los hechos ya aprobados en
// la versión anterior de este archivo — no se inventa nada nuevo. Las cifras
// (100k+, ↑8x, 100+, ↑4x) salen de lib/case-studies.ts → metricValue, no de
// aquí: el componente arma la franja de métricas a partir de esa fuente.
export const AUTHOR_ABOUT: { es: AuthorAboutLangContent; en: AuthorAboutLangContent } = {
    es: {
        eyebrow: "Fundador · Keting Media",
        roleLabel: "Ingeniero de IA y Fundador",
        positioning:
            "Construyo software que llega a producción — no maquetas ni prototipos que se quedan ahí.",
        bioSections: [
            {
                title: "Qué hago",
                body: "Ingeniero IA y fundador, especializado en el diseño y desarrollo de productos digitales de extremo a extremo: aplicaciones web, plataformas SaaS y soluciones de comercio. Integro modelos de IA en el núcleo del producto y dirijo el desarrollo a nivel de arquitectura — desde plataformas de comercio nativas en WhatsApp para PyMEs de LATAM hasta SaaS B2B con sistemas multi-agente para consejos corporativos.",
            },
            {
                title: "Los proyectos que dirijo",
                body: "Fundé Keting Media en 2019 y lidero el desarrollo de sus proyectos más destacados: Iudex (IA jurídica), Gobernia (agentes de IA para consejos corporativos), Toogo (SaaS de e-commerce) e Ivan Ivanovich Academy (plataforma de cursos multi-idioma). Las cifras, abajo.",
            },
            {
                title: "También escribo",
                body: "Todos los artículos del blog de Keting Media sobre desarrollo de software, web, apps e IA aplicada los escribo yo.",
            },
            {
                title: "Formación",
                body: "Licenciado en Administración con mención en Gerencia y T.S.U. en Organización Empresarial. Formación en marketing digital por Neetwork Business School y en mercadeo y negocios por la Universidad Metropolitana. La ingeniería la aprendí construyendo: hoy desarrollo con Claude, de Anthropic, integrado en todo el proceso — de la arquitectura al código que llega a producción.",
            },
        ],
        linkedinLabel: "LinkedIn",
        githubLabel: "GitHub",
        companyLabel: "Keting Media",
        metricsEyebrow: "En números",
        metricsTitle: "Resultados, no promesas",
        projectsEyebrow: "Portafolio",
        projectsTitle: "9 marcas, 9 retos distintos",
        projectsBody: "Legal-tech, gobierno corporativo, SaaS, e-commerce y más — cada proyecto, dirigido de principio a fin.",
        blogEyebrow: "Blog",
        blogHeading: "Artículos de Carlos",
        blogBody: "Todos los artículos del blog de Keting Media están escritos por Carlos Beuvrin.",
        blogCta: "Ver todos los artículos",
        ctaHeading: "¿Tu marca necesita",
        ctaHeadingAccent: "algo así?",
        ctaBody: "Un café de 30 minutos es suficiente para entender si encajamos. Sin compromiso.",
        ctaButton: "Hablemos",
    },
    en: {
        eyebrow: "Founder · Keting Media",
        roleLabel: "AI Engineer and Founder",
        positioning:
            "I build software that reaches production — not mockups or prototypes that stay there.",
        bioSections: [
            {
                title: "What I do",
                body: "AI Engineer and founder, specialized in designing and building end-to-end digital products: web applications, SaaS platforms, and commerce solutions. I integrate AI models into the core of the product and lead development at the architecture level — from WhatsApp-native commerce platforms for LATAM SMBs to B2B SaaS with multi-agent systems for corporate boards.",
            },
            {
                title: "The projects I lead",
                body: "I founded Keting Media in 2019 and I lead the development of its most notable projects: Iudex (legal AI), Gobernia (AI agents for corporate boards), Toogo (e-commerce SaaS), and Ivan Ivanovich Academy (multilingual course platform). The numbers, below.",
            },
            {
                title: "I also write",
                body: "Every article on the Keting Media blog about software, web and app development, and applied AI is written by me.",
            },
            {
                title: "Education",
                body: "Bachelor's degree in Business Administration (Management) and an advanced technical degree in Business Organization. Trained in digital marketing at Neetwork Business School and in marketing and business at Universidad Metropolitana. I learned engineering by building: today I develop with Claude, by Anthropic, integrated across the entire process — from architecture to the code that ships.",
            },
        ],
        linkedinLabel: "LinkedIn",
        githubLabel: "GitHub",
        companyLabel: "Keting Media",
        metricsEyebrow: "By the numbers",
        metricsTitle: "Results, not promises",
        projectsEyebrow: "Portfolio",
        projectsTitle: "9 brands, 9 different challenges",
        projectsBody: "Legal tech, corporate governance, SaaS, e-commerce, and more — every project, led start to finish.",
        blogEyebrow: "Blog",
        blogHeading: "Carlos's articles",
        blogBody: "Every article on the Keting Media blog is written by Carlos Beuvrin.",
        blogCta: "See all articles",
        ctaHeading: "Does your brand need",
        ctaHeadingAccent: "something like this?",
        ctaBody: "A 30-minute coffee is enough to see if we're a fit. No commitment.",
        ctaButton: "Let's talk",
    },
};
