import type { Metadata } from "next";

// Metadata y datos de entidad compartidos por las raíces del sitio.
//
// El sitio tiene varios layouts raíz —español (app/(es) y app/halloween),
// inglés (app/en) y el panel (app/admin)— porque `<html lang>` solo se puede
// poner en un layout raíz, y una sola raíz no sabe en qué idioma está la ruta
// sin volver dinámico todo el sitio. Lo que antes vivía en el único
// app/layout.tsx está aquí para que las raíces no lo dupliquen.

export const SITE_URL = "https://ketingmedia.com";
export const SITE_NAME = "Keting Media";

export type SiteLang = "es" | "en";

// Países que atiende Keting: México y EE. UU., Centroamérica y toda
// Latinoamérica (decisión de Carlos, 17 oct 2026). Cuba queda fuera porque no
// hay forma práctica de cobrarle a un cliente de allí. El código ISO es para
// el ContactPoint; el nombre, para los nodos Country del schema.
export const AREA_SERVED: readonly { code: string; name: string }[] = [
    { code: "MX", name: "Mexico" },
    { code: "US", name: "United States" },
    // Centroamérica
    { code: "GT", name: "Guatemala" },
    { code: "BZ", name: "Belize" },
    { code: "HN", name: "Honduras" },
    { code: "SV", name: "El Salvador" },
    { code: "NI", name: "Nicaragua" },
    { code: "CR", name: "Costa Rica" },
    { code: "PA", name: "Panama" },
    // Caribe hispanohablante
    { code: "DO", name: "Dominican Republic" },
    { code: "PR", name: "Puerto Rico" },
    // Sudamérica
    { code: "CO", name: "Colombia" },
    { code: "VE", name: "Venezuela" },
    { code: "EC", name: "Ecuador" },
    { code: "PE", name: "Peru" },
    { code: "BO", name: "Bolivia" },
    { code: "CL", name: "Chile" },
    { code: "AR", name: "Argentina" },
    { code: "UY", name: "Uruguay" },
    { code: "PY", name: "Paraguay" },
    { code: "BR", name: "Brazil" },
];

export const AREA_SERVED_JSON_LD = AREA_SERVED.map((c) => ({ "@type": "Country", name: c.name }));

// og:locale de cada idioma con el otro como alternativo. Va en TODOS los
// bloques `openGraph`: Next no fusiona ese objeto con el del layout, lo
// reemplaza entero, así que una página que define su propio openGraph perdía
// el locale del layout.
export const OG_LOCALE: Record<SiteLang, { locale: string; alternateLocale: string[] }> = {
    es: { locale: "es_MX", alternateLocale: ["en_US"] },
    en: { locale: "en_US", alternateLocale: ["es_MX"] },
};

// Lo que no depende del idioma.
const BASE: Metadata = {
    metadataBase: new URL(SITE_URL),
    authors: [{ name: "Carlos Beuvrin", url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    applicationName: SITE_NAME,
    // `category` se retira: no es un meta estándar (ningún buscador lo usa) y
    // metía una cadena en español en las páginas /en/*. El tema de la entidad
    // ya lo describe knowsAbout del schema.
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
};

// hreflang "es" y no "es-MX": la versión en español sirve a México y a toda
// Latinoamérica. "en" y no "en-US": no hay otra versión en inglés de la cual
// distinguirse, y "en" incluye a EE. UU. x-default apunta al español, el
// mercado principal.
export const esRootMetadata: Metadata = {
    ...BASE,
    title: {
        default: "Desarrollo de software, web y apps en México · Keting Media",
        template: "%s · Keting Media",
    },
    description:
        "Empresa mexicana de desarrollo de software, aplicaciones web y móviles a medida. Del sitio web al sistema interno que opera tu negocio. Diseño, ingeniería e IA.",
    keywords: [
        "desarrollo de software",
        "empresa de desarrollo de software",
        "fábrica de software",
        "desarrollo web méxico",
        "desarrollo de aplicaciones móviles",
        "desarrollo de apps",
        "aplicaciones web",
        "e-commerce a medida",
        "plataformas saas",
        "desarrollo web next.js",
        "software a medida",
        "soluciones digitales con ia",
        "keting media",
        "carlos beuvrin",
    ],
    alternates: {
        canonical: "/",
        languages: {
            es: "/",
            en: "/en",
            "x-default": "/",
        },
    },
    openGraph: {
        title: "Keting Media · Desarrollo de software, web y apps en México",
        description: "Desarrollo de software, aplicaciones web y móviles a medida en México. Diseño, ingeniería e IA aplicada.",
        url: SITE_URL,
        siteName: SITE_NAME,
        ...OG_LOCALE.es,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Desarrollo de software, web y apps · México · IA",
        description: "Software, e-commerce, plataformas y apps a medida con IA para negocios ambiciosos.",
        creator: "@ketingmedia",
    },
};

export const enRootMetadata: Metadata = {
    ...BASE,
    // Sin plantilla, a propósito: las páginas inglesas ya traen su título
    // completo ("… - Keting Media Blog") y así salían antes de tener raíz
    // propia. Con plantilla se duplicaba la marca.
    title: { absolute: "Custom Software, Web & App Development in Mexico · Keting Media" },
    description:
        "Mexican software development company: custom software, web and mobile apps. From your website to the internal system that runs your business. Design, engineering and AI in one team.",
    keywords: [
        "software development",
        "software development company",
        "custom software development",
        "web development mexico",
        "mobile app development",
        "app development",
        "web applications",
        "custom e-commerce",
        "saas platforms",
        "next.js web development",
        "custom software",
        "ai-powered digital solutions",
        "keting media",
        "carlos beuvrin",
    ],
    alternates: {
        canonical: "/en",
        languages: {
            es: "/",
            en: "/en",
            "x-default": "/",
        },
    },
    openGraph: {
        title: "Keting Media · Custom Software, Web & App Development in Mexico",
        description:
            "Custom software, web and mobile app development in Mexico. Design, engineering and applied AI in one team.",
        url: "/en",
        siteName: SITE_NAME,
        ...OG_LOCALE.en,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Software, Web & Apps Development · Mexico · AI",
        description: "Custom software, e-commerce, platforms and apps powered by AI for ambitious businesses.",
        creator: "@ketingmedia",
    },
};
