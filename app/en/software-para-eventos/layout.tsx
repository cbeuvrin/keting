import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";
import { dictionaries } from "@/lib/i18n/dictionaries";

const CATALOG = dictionaries.en.eventsPage.catalog.groups.map((g) => ({ name: g.name, items: [...g.items] }));

export const metadata: Metadata = {
    title: { absolute: "Software for live events · Keting Media" },
    description:
        "QR registration and access control, brand activations and live streaming for events. We work with production companies in Mexico: Suzuki, Los DiDis and Apizeal.",
    alternates: {
        canonical: "/en/software-para-eventos",
        languages: {
            "es-MX": "/software-para-eventos",
            "en": "/en/software-para-eventos",
            "x-default": "/software-para-eventos",
        },
    },
    openGraph: {
        title: "Software for live events · Keting Media",
        description: "Registration, access control, activations and streaming. The date doesn't move.",
        url: "/en/software-para-eventos",
        type: "website",
    },
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <JsonLd
                data={[
                    service({
                        name: "Software for live events",
                        serviceType: "Event software development",
                        description:
                            "QR registration and access control, live dashboards, brand activations and streaming platforms for in-person events, built for production companies and brands.",
                        path: "/en/software-para-eventos",
                        catalog: CATALOG,
                    }),
                    breadcrumb("Event software", "/en/software-para-eventos"),
                ]}
            />
            {children}
        </>
    );
}
