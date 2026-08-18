/**
 * Renderiza datos estructurados (JSON-LD) en el <head>/cuerpo del documento.
 * Acepta un objeto o un arreglo de objetos schema.org.
 */
export function JsonLd({ data }: { data: object | object[] }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}

const SITE = "https://ketingmedia.com";

/** BreadcrumbList: Inicio/Home › <página actual> (según el idioma de `path`). */
export function breadcrumb(name: string, path: string) {
    const isEn = path.startsWith("/en");
    const rootName = isEn ? "Home" : "Inicio";
    const rootPath = isEn ? "/en" : "/";
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: rootName, item: `${SITE}${rootPath}` },
            { "@type": "ListItem", position: 2, name, item: `${SITE}${path}` },
        ],
    };
}

/** BreadcrumbList con más de 2 niveles (ej. Inicio › Casos de éxito › Caso). */
export function breadcrumbTrail(items: { name: string; path: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE}${item.path}`,
        })),
    };
}

/** Person: usado en la página de autor (/nosotros/carlos-beuvrin, /en/about/carlos-beuvrin). */
export function person(opts: {
    name: string;
    jobTitle: string;
    description?: string;
    image: string;
    /** Ruta (no absoluta) de la página de autor — se usa como url/@id de la persona. */
    path: string;
    sameAs: string[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: opts.name,
        jobTitle: opts.jobTitle,
        ...(opts.description ? { description: opts.description } : {}),
        image: `${SITE}${opts.image}`,
        url: `${SITE}${opts.path}`,
        sameAs: opts.sameAs,
        worksFor: {
            "@type": "Organization",
            name: "Keting Media",
            url: SITE,
        },
    };
}

/** Service ofrecido por Keting Media. */
export function service(opts: {
    name: string;
    serviceType: string;
    description: string;
    path: string;
    /** Catálogo de capacidades agrupadas. Opcional: las páginas de servicio que
     *  no publican una lista de prestaciones lo omiten y el nodo sale igual que
     *  antes. Cuando existe, los buscadores (y los de IA) leen la lista como
     *  datos y no solo como texto suelto de la página. */
    catalog?: { name: string; items: string[] }[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: opts.name,
        serviceType: opts.serviceType,
        description: opts.description,
        url: `${SITE}${opts.path}`,
        ...(opts.catalog?.length
            ? {
                  hasOfferCatalog: {
                      "@type": "OfferCatalog",
                      name: opts.name,
                      itemListElement: opts.catalog.map((group) => ({
                          "@type": "OfferCatalog",
                          name: group.name,
                          itemListElement: group.items.map((item) => ({
                              "@type": "Offer",
                              itemOffered: { "@type": "Service", name: item },
                          })),
                      })),
                  },
              }
            : {}),
        areaServed: { "@type": "Country", name: "México" },
        provider: {
            "@type": "Organization",
            name: "Keting Media",
            url: SITE,
        },
    };
}
