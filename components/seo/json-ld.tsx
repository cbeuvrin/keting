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

/** BreadcrumbList: Inicio › <página actual>. */
export function breadcrumb(name: string, path: string) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
            { "@type": "ListItem", position: 2, name, item: `${SITE}${path}` },
        ],
    };
}

/** Service ofrecido por Keting Media. */
export function service(opts: {
    name: string;
    serviceType: string;
    description: string;
    path: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: opts.name,
        serviceType: opts.serviceType,
        description: opts.description,
        url: `${SITE}${opts.path}`,
        areaServed: { "@type": "Country", name: "México" },
        provider: {
            "@type": "Organization",
            name: "Keting Media",
            url: SITE,
        },
    };
}
