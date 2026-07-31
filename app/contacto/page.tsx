import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd, breadcrumb } from "@/components/seo/json-ld";
import { ContactoForm } from "./ContactoForm";

// Hasta julio de 2026 esta ruta era un 308 al home y el único modo de escribir
// era un modal. Quien buscaba "keting media contacto" aterrizaba en la portada
// sin nada evidente que pulsar, y ninguna IA tenía una URL que citar al
// responder "cómo contacto con ellos". Por eso es una página real e indexable.
export const metadata: Metadata = {
    title: "Contacto",
    description:
        "Cuéntanos tu proyecto de web, app, software a medida o automatización con IA. Te damos alcance y precio fijo. Escríbenos por formulario, correo o WhatsApp.",
    alternates: { canonical: "https://ketingmedia.com/contacto" },
    openGraph: {
        title: "Contacto · Keting Media",
        description:
            "Cuéntanos tu proyecto y te damos alcance y precio fijo, sin sorpresas.",
        url: "https://ketingmedia.com/contacto",
        type: "website",
    },
};

const TELEFONO = "+52 55 4383 0150";
const TELEFONO_E164 = "+525543830150";
const EMAIL = "info@ketingmedia.com";
const WHATSAPP = "https://wa.me/525543830150";

// ContactPage con el ContactPoint dentro: le da a Google y a los modelos una
// dirección, un teléfono y un correo asociados a una URL concreta. El @id apunta
// al nodo Organization del layout raíz para que se lea como la misma entidad y
// no como un negocio nuevo.
const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contacto · Keting Media",
    url: "https://ketingmedia.com/contacto",
    mainEntity: {
        "@id": "https://ketingmedia.com/#organization",
        name: "Keting Media",
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "Sales",
            telephone: TELEFONO_E164,
            email: EMAIL,
            areaServed: ["MX", "US"],
            availableLanguage: ["es", "en"],
        },
    },
};

const CANALES = [
    { etiqueta: "Correo", valor: EMAIL, href: `mailto:${EMAIL}` },
    { etiqueta: "Teléfono", valor: TELEFONO, href: `tel:${TELEFONO_E164}` },
    { etiqueta: "WhatsApp", valor: "Escribir por WhatsApp", href: WHATSAPP },
];

export default function ContactoPage() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black font-heading overflow-hidden">
            <JsonLd data={[contactJsonLd, breadcrumb("Contacto", "/contacto")]} />
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
                            Contacto
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8 text-black">
                        Cuéntanos qué quieres{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                            construir
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mb-4">
                        Escríbenos con lo que tengas, aunque sea una idea a medio formar. Lo primero
                        que hacemos es entender el problema; el presupuesto viene después.
                    </p>
                    <p className="text-base text-gray-500 font-light leading-relaxed max-w-2xl mb-16">
                        Si nuestros{" "}
                        <Link href="/blog/cuanto-cuesta-una-web-o-app-a-medida-en-mexico-2026" className="underline underline-offset-4 hover:text-black transition-colors">
                            rangos de precio
                        </Link>{" "}
                        no encajan con lo tuyo, te lo decimos en la primera llamada en vez de
                        hacerte perder el tiempo.
                    </p>

                    <ContactoForm />

                    {/* Un formulario no le sirve a todo el mundo: hay quien prefiere
                        escribir directamente, y una IA necesita datos literales que
                        citar. Por eso los canales van en texto plano, no dentro del
                        formulario. */}
                    <div className="mt-24 pt-12 border-t border-black/10">
                        <p className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-black/50 font-sans mb-8">
                            O directamente
                        </p>
                        <div className="grid sm:grid-cols-3 gap-8">
                            {CANALES.map((c) => (
                                <div key={c.etiqueta}>
                                    <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-black/40 mb-2 font-sans">
                                        {c.etiqueta}
                                    </p>
                                    <a
                                        href={c.href}
                                        {...(c.href.startsWith("http")
                                            ? { target: "_blank", rel: "noopener noreferrer" }
                                            : {})}
                                        className="text-base md:text-lg text-black hover:text-black/60 transition-colors break-words"
                                    >
                                        {c.valor}
                                    </a>
                                </div>
                            ))}
                        </div>
                        <p className="mt-10 text-sm text-black/45 font-light leading-relaxed max-w-xl">
                            Trabajamos en remoto desde Ciudad de México, con clientes en México y
                            Estados Unidos. El precio no cambia por la ciudad en la que estés.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
