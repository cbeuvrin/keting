import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";
import { dictionaries } from "@/lib/i18n/dictionaries";

const CATALOG = dictionaries.es.eventsPage.catalog.groups.map((g) => ({ name: g.name, items: [...g.items] }));

export const metadata: Metadata = {
    title: "Software para eventos en vivo en México",
    description:
        "Registro y control de acceso con QR, activaciones de marca y transmisión en vivo para eventos. Trabajamos con productoras en México: Suzuki, Los DiDis y Apizeal.",
    keywords: [
        "software para eventos",
        "app para eventos",
        "control de acceso para eventos",
        "registro de asistentes evento",
        "lector qr eventos",
        "activaciones de marca",
        "streaming de eventos",
    ],
    alternates: {
        canonical: "/software-para-eventos",
        languages: {
            "es-MX": "/software-para-eventos",
            "en": "/en/software-para-eventos",
            "x-default": "/software-para-eventos",
        },
    },
    openGraph: {
        title: "Software para eventos en vivo · Keting Media",
        description: "Registro, control de acceso, activaciones y transmisión. La fecha no se mueve.",
        url: "/software-para-eventos",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Software para eventos en vivo · Keting Media",
        description: "Registro, control de acceso, activaciones y transmisión para productoras.",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Software para eventos en vivo",
                        serviceType: "Desarrollo de software para eventos",
                        description:
                            "Registro y control de acceso con QR, paneles en vivo, activaciones de marca y plataformas de transmisión para eventos presenciales, desarrollados para productoras y marcas.",
                        path: "/software-para-eventos",
                        catalog: CATALOG,
                    }),
                    breadcrumb("Software para eventos", "/software-para-eventos"),
                ]}
            />
            {children}
        </>
    );
}
