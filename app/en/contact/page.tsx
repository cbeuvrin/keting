import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";
import { ContactForm } from "./ContactForm";

// Gemela inglesa de /contacto. hreflang recíproco declarado en ambas.
export const metadata: Metadata = {
    title: { absolute: "Contact · Keting Media" },
    description:
        "Tell us about your web, app, custom software or AI automation project. Nearshore team in Mexico City working with clients across Mexico and the United States.",
    alternates: {
        canonical: "https://ketingmedia.com/en/contact",
        languages: {
            "es-MX": "https://ketingmedia.com/contacto",
            en: "https://ketingmedia.com/en/contact",
            "x-default": "https://ketingmedia.com/contacto",
        },
    },
    openGraph: {
        title: "Contact · Keting Media",
        description: "Tell us about your project. You get a fixed scope and a fixed price.",
        url: "https://ketingmedia.com/en/contact",
        type: "website",
    },
};

const PHONE = "+52 55 4383 0150";
const PHONE_E164 = "+525543830150";
const EMAIL = "info@ketingmedia.com";
const WHATSAPP = "https://wa.me/525543830150";

const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact · Keting Media",
    url: "https://ketingmedia.com/en/contact",
    inLanguage: "en",
    mainEntity: {
        "@id": "https://ketingmedia.com/#organization",
        name: "Keting Media",
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Sales",
            telephone: PHONE_E164,
            email: EMAIL,
            areaServed: ["MX", "US"],
            availableLanguage: ["es", "en"],
        },
    },
};

const CHANNELS = [
    { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
    { label: "Phone", value: PHONE, href: `tel:${PHONE_E164}` },
    { label: "WhatsApp", value: "Message us on WhatsApp", href: WHATSAPP },
];

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black font-heading overflow-hidden">
            <JsonLd data={[contactJsonLd, breadcrumb("Contact", "/en/contact")]} />
            <Header />

            <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-20">
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <span className="absolute top-[10%] right-[4%] text-[8rem] md:text-[16rem] text-black/[0.04] select-none font-light leading-none rotate-12 pointer-events-none">
                    *
                </span>

                <div className="max-w-3xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-black/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                            Contact
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8 text-black">
                        Tell us what you want to{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                            build
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mb-4">
                        Write with whatever you have, even a half-formed idea. The first thing we do
                        is understand the problem; the budget comes after.
                    </p>
                    <p className="text-base text-gray-500 font-light leading-relaxed max-w-2xl mb-16">
                        If our{" "}
                        <Link href="/en/blog/how-much-does-a-custom-web-or-app-cost-in-mexico" className="underline underline-offset-4 hover:text-black transition-colors">
                            price ranges
                        </Link>{" "}
                        don&rsquo;t fit what you need, we&rsquo;ll say so on the first call instead of
                        wasting your time.
                    </p>

                    <ContactForm />

                    <div className="mt-24 pt-12 border-t border-black/10">
                        <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-black/50 font-sans mb-8">
                            Or directly
                        </p>
                        <div className="grid sm:grid-cols-3 gap-8">
                            {CHANNELS.map((c) => (
                                <div key={c.label}>
                                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-black/40 mb-2 font-sans">
                                        {c.label}
                                    </p>
                                    <a
                                        href={c.href}
                                        {...(c.href.startsWith("http")
                                            ? { target: "_blank", rel: "noopener noreferrer" }
                                            : {})}
                                        className="text-base md:text-lg text-black hover:text-black/60 transition-colors break-words"
                                    >
                                        {c.value}
                                    </a>
                                </div>
                            ))}
                        </div>
                        <p className="mt-10 text-sm text-black/45 font-light leading-relaxed max-w-xl">
                            We work remotely from Mexico City, with clients across Mexico and the
                            United States. Same time zones as most of the US, and the price
                            doesn&rsquo;t change with your city.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
