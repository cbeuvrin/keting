import { Inter, Montserrat, Playfair_Display, Sulphur_Point } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import { SiteWidgets } from "@/components/ui/site-widgets";
import { LangProvider } from "@/lib/i18n/lang-context";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { AREA_SERVED, AREA_SERVED_JSON_LD, SITE_NAME, SITE_URL, type SiteLang } from "@/lib/seo/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sulphur = Sulphur_Point({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-sulphur" });

// <html>, <body> y el schema de la entidad, comunes a todas las raíces del sitio
// (app/(es), app/halloween, app/en y app/admin; ver lib/seo/site.ts). Cada raíz pasa su
// idioma, y así el `lang` sale correcto en el HTML del servidor: antes era
// "es-MX" en todas las páginas, también en las inglesas. Google detecta el
// idioma por el texto, pero Bing y los lectores de pantalla sí leen `lang`.
//
// "en-US" y no "en" a propósito: aquí se declara la variante del texto (inglés
// de EE. UU.), no a qué mercados se ofrece la página — eso lo dice hreflang.

// JSON-LD de la entidad Keting Media.
//
// Doble tipo a propósito: `ProfessionalService` desciende de LocalBusiness, así
// que aporta la señal de negocio local, y `Organization` mantiene todo lo que ya
// dependía de ese tipo. Van en UN SOLO nodo con un `@id` compartido; si se
// partieran en dos bloques JSON-LD, Google podría leerlos como dos negocios
// distintos en la misma dirección y la señal se diluye en vez de sumar.
//
// ⚠️ El domicilio de Roma Norte que aparece en el aviso de privacidad es
// FISCAL, no una oficina visitable (confirmado por Carlos el 2026-07-30). Por
// eso `address` lleva localidad, estado y país pero NO `streetAddress`: declarar
// una calle equivale a decirle a Google que un cliente puede presentarse allí, y
// cuando eso no se sostiene el desajuste con el perfil de Google Business
// perjudica en lugar de ayudar. Si algún día hay oficina de verdad, se añade
// `streetAddress`, `postalCode`, `geo` y `openingHoursSpecification` — y deben
// coincidir EXACTAMENTE con lo que muestre el perfil de Google Business.
function organizationJsonLd(lang: SiteLang) {
    return {
        "@context": "https://schema.org",
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        // "Keting" a secas es como se busca la marca, y Google no siempre lo ligaba a
        // Keting Media: fuera de México lo lee como otra cosa o como error de
        // "marketing". La razón social es la del aviso de privacidad.
        alternateName: "Keting",
        legalName: "Keting Media, S.A. de C.V.",
        url: SITE_URL,
        logo: `${SITE_URL}/keting-logo.png`,
        // LocalBusiness espera `image`; sin ella Google descarta parte del bloque.
        image: `${SITE_URL}/keting-logo.png`,
        telephone: "+52-55-4383-0150",
        email: "info@ketingmedia.com",
        // Texto libre. Los importes concretos viven en la guía de precios; aquí basta
        // la banda para que un motor sepa en qué rango se mueve el servicio.
        priceRange: "$$",
        // Ahora que cada raíz sabe su idioma, la descripción va en el de la página.
        description:
            lang === "en"
                ? "Custom software, web and app development company based in Mexico City: websites, e-commerce, SaaS platforms and applied AI. Engineering, product design and artificial intelligence in one team."
                : "Empresa de desarrollo de software, web y apps a medida en México: sitios, e-commerce, plataformas/SaaS e IA aplicada. Ingeniería, diseño de producto e inteligencia artificial en un mismo equipo.",
        // Bilingüe a propósito: es la descripción temática de la entidad, y la
        // misma entidad se sirve en los dos idiomas.
        knowsAbout: [
            "Diseño y desarrollo web",
            "Desarrollo de software a medida",
            "Aplicaciones móviles y multiplataforma",
            "E-commerce",
            "Plataformas SaaS",
            "Inteligencia artificial aplicada",
            "Web design and development",
            "Custom software development",
            "Mobile and cross-platform apps",
            "SaaS platforms",
            "Applied artificial intelligence",
            "Nearshore software development",
        ],
        // Aquí va solo lo que no depende del idioma: el nombre, la URL de su
        // página de autor y los sameAs. El cargo y la biografía localizados los
        // aporta el schema Person de /nosotros/carlos-beuvrin y
        // /en/about/carlos-beuvrin.
        founder: {
            "@type": "Person",
            name: "Carlos Beuvrin",
            url: "https://ketingmedia.com/nosotros/carlos-beuvrin",
            sameAs: [
                "https://www.linkedin.com/in/carlos-fernando-beuvrin-rodriguez-520526222/",
                "https://github.com/KetingMedia",
            ],
        },
        foundingDate: "2019",
        address: {
            "@type": "PostalAddress",
            addressCountry: "MX",
            addressLocality: lang === "en" ? "Mexico City" : "Ciudad de México",
            addressRegion: "CDMX",
        },
        // Negocio con área de servicio, no con local: el trabajo es remoto y el
        // precio no cambia por la ciudad del cliente (así se dice también en la
        // guía de precios). La lista vive en lib/seo/site.ts.
        areaServed: AREA_SERVED_JSON_LD,
        contactPoint: {
            "@type": "ContactPoint",
            telephone: "+52-55-4383-0150",
            email: "info@ketingmedia.com",
            contactType: "Sales",
            areaServed: AREA_SERVED.map((c) => c.code),
            // El sitio es bilingüe desde julio de 2026 (/en indexable).
            availableLanguage: ["es", "en"],
        },
        // Perfiles que confirman que son la misma entidad. El de Google va con su
        // `cid` (forma estable; el enlace corto de "Compartir" puede cambiar), y el
        // GitHub es el de la organización, no el personal de Carlos.
        sameAs: [
            "https://www.linkedin.com/company/ketingmedia",
            "https://www.instagram.com/keting_media/",
            "https://www.facebook.com/ketingmedia/",
            "https://www.google.com/maps?cid=10744026976244037767",
            "https://clutch.co/profile/keting-media",
            "https://www.sortlist.com/es/agency/keting-media",
            "https://github.com/KetingMedia",
        ],
    };
}

const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Keting",
    url: SITE_URL,
    inLanguage: ["es", "en"],
    potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/blog?q={search_term_string}`,
        "query-input": "required name=search_term_string",
    },
};

export function RootDocument({ lang, children }: { lang: SiteLang; children: React.ReactNode }) {
    return (
        <html lang={lang === "en" ? "en-US" : "es"}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(lang)) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
            </head>
            <body
                className={cn(inter.variable, montserrat.variable, playfair.variable, sulphur.variable, "font-sans antialiased bg-[#FAFAFA] text-[#333333]")}
                suppressHydrationWarning
            >
                <GoogleTagManager />
                <LangProvider>
                    {children}
                    <SiteWidgets />
                </LangProvider>
            </body>
        </html>
    );
}
