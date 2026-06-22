import { JsonLd } from "@/components/seo/json-ld";

type Faq = { q: string; a: string };

/**
 * Sección de Preguntas Frecuentes con schema FAQPage.
 * Las respuestas directas son lo que los motores de IA citan textualmente,
 * y el FAQPage habilita resultados enriquecidos en Google.
 */
export function FaqSection({ items, title = "Preguntas frecuentes" }: { items: Faq[]; title?: string }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
        })),
    };

    return (
        <section className="bg-[#FAFAFA] text-black py-24 md:py-32">
            <JsonLd data={schema} />
            <div className="container mx-auto px-6 md:px-12 max-w-3xl">
                <div className="flex items-center gap-3 mb-8">
                    <span className="block w-10 h-px bg-black/40" />
                    <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                        FAQ
                    </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-12">{title}</h2>
                <div className="divide-y divide-gray-200 border-t border-gray-200">
                    {items.map(({ q, a }, i) => (
                        <div key={i} className="py-6">
                            <h3 className="text-lg md:text-xl font-bold mb-2">{q}</h3>
                            <p className="text-gray-600 font-light leading-relaxed">{a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
