import { JsonLd } from "@/components/seo/json-ld";

type Faq = { q: string; a: string };

/**
 * Sección de Preguntas Frecuentes — acordeón nativo (<details>, sin JS de cliente),
 * estilo editorial de la marca (monocromo, Playfair italic, cuadrícula + asterisco).
 * `dark` adapta los colores para páginas de fondo oscuro (ej. /webdesing).
 * Incluye schema FAQPage (respuestas que la IA cita + rich results en Google).
 */
export function FaqSection({
    items,
    dark = false,
}: {
    items: Faq[];
    dark?: boolean;
}) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
        })),
    };

    // Color de primer plano según el tema (RGB para componer opacidades).
    // La sección es transparente: hereda el fondo de la página (no rompe el sitio).
    const fg = dark ? "255,255,255" : "29,29,31";

    return (
        <section className="relative overflow-hidden py-24 md:py-32" style={{ color: `rgb(${fg})` }}>
            <JsonLd data={schema} />

            {/* Fondo cuadriculado sutil */}
            <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(rgba(${fg},0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(${fg},0.6) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />
            {/* Asterisco girando (CSS puro; respeta reduce-motion) */}
            <span
                aria-hidden
                className="pointer-events-none select-none absolute -top-20 -right-12 text-[16rem] md:text-[26rem] font-light leading-none animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
                style={{ color: `rgba(${fg},0.04)` }}
            >
                *
            </span>

            <div className="relative z-10 container mx-auto px-6 md:px-12 max-w-3xl">
                {/* Eyebrow editorial */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="block w-10 h-px" style={{ background: `rgba(${fg},0.4)` }} />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase" style={{ color: `rgba(${fg},0.5)` }}>
                        FAQ
                    </span>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 md:mb-16">
                    Preguntas{" "}
                    <span className="font-[family-name:var(--font-playfair)] italic font-normal">frecuentes</span>
                </h2>

                {/* Acordeón */}
                <div className="border-t" style={{ borderColor: `rgba(${fg},0.12)` }}>
                    {items.map(({ q, a }, i) => (
                        <details key={i} className="group border-b" style={{ borderColor: `rgba(${fg},0.12)` }}>
                            <summary className="flex items-center justify-between gap-6 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                                <span className="text-lg md:text-2xl font-medium tracking-tight pr-4 transition-opacity group-open:opacity-100 opacity-90">
                                    {q}
                                </span>
                                {/* Icono + que rota a × al abrir */}
                                <span
                                    className="relative flex-shrink-0 w-5 h-5 transition-transform duration-300 group-open:rotate-[135deg]"
                                    style={{ color: `rgba(${fg},0.55)` }}
                                    aria-hidden
                                >
                                    <span className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2 bg-current" />
                                    <span className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-current" />
                                </span>
                            </summary>
                            <p className="pb-7 -mt-1 text-base md:text-lg leading-relaxed font-light max-w-2xl" style={{ color: `rgba(${fg},0.6)` }}>
                                {a}
                            </p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
}
