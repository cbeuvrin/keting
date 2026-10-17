import type { Metadata } from "next";
import { JsonLd, service, breadcrumb } from "@/components/seo/json-ld";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { OG_LOCALE } from "@/lib/seo/site";

const CATALOG = dictionaries.en.eventsPage.catalog.groups.map((g) => ({ name: g.name, items: [...g.items] }));

export const metadata: Metadata = {
    title: { absolute: "Software for live events · Keting Media" },
    description:
        "QR registration and access control, brand activations and live streaming for events. We work with production companies in Mexico: Suzuki, Los DiDis and Apizeal.",
    alternates: {
        canonical: "/en/event-software",
        languages: {
            es: "/software-para-eventos",
            "en": "/en/event-software",
            "x-default": "/software-para-eventos",
        },
    },
    openGraph: {
        ...OG_LOCALE.en,
        title: "Software for live events · Keting Media",
        description: "Registration, access control, activations and streaming. The date doesn't move.",
        url: "/en/event-software",
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
                        path: "/en/event-software",
                        catalog: CATALOG,
                    }),
                    breadcrumb("Event software", "/en/event-software"),
                ]}
            />
            {children}
        </>
    );
}
