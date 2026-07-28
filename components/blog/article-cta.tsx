"use client";

import { useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { ContactModal } from "@/components/pricing/contact-modal";
import { useLang } from "@/lib/i18n/lang-context";

// Líneas de la cuadrícula (mismas que el resto del sitio, en blanco para fondo oscuro).
const GRID_LINES =
    "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)";

/**
 * Banner de conversión al pie de cada artículo: abre el formulario de contacto
 * (ContactModal) o lleva a WhatsApp con un mensaje pre-rellenado que cita el
 * título del artículo. Estilo editorial oscuro para contrastar con el contenido.
 */
export function ArticleCTA({ title }: { title?: string }) {
    const { t } = useLang();
    const [open, setOpen] = useState(false);
    const cardRef = useRef<HTMLElement>(null);

    // Efecto "linterna": mueve el foco de luz/cuadrícula hacia el cursor.
    // Escribe variables CSS directamente en el nodo (sin re-render).
    const handleMove = (e: React.MouseEvent) => {
        const el = cardRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };

    const waMessage = encodeURIComponent(
        title
            ? t.blogArticle.waWithTitle.replace("{title}", title)
            : t.blogArticle.waNoTitle
    );
    const waHref = `https://wa.me/525543830150?text=${waMessage}`;

    return (
        <>
            <aside
                ref={cardRef}
                onMouseMove={handleMove}
                style={{ "--mx": "50%", "--my": "50%" } as React.CSSProperties}
                className="group/cta not-prose relative overflow-hidden rounded-[2rem] bg-[#0A0A0A] text-white my-16 px-8 py-12 md:px-12 md:py-14"
            >
                {/* Cuadrícula base — siempre visible, sutil (como el resto del sitio) */}
                <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{ backgroundImage: GRID_LINES, backgroundSize: "60px 60px" }}
                />
                {/* Cuadrícula iluminada — solo se revela alrededor del cursor (linterna) */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: GRID_LINES,
                        backgroundSize: "60px 60px",
                        opacity: 0.35,
                        WebkitMaskImage:
                            "radial-gradient(circle 170px at var(--mx) var(--my), #000 0%, transparent 72%)",
                        maskImage:
                            "radial-gradient(circle 170px at var(--mx) var(--my), #000 0%, transparent 72%)",
                    }}
                />
                {/* Resplandor suave que sigue al cursor */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(circle 220px at var(--mx) var(--my), rgba(255,255,255,0.07), transparent 70%)",
                    }}
                />
                {/* Asterisco girando (respeta reduce-motion) */}
                <span
                    aria-hidden
                    className="pointer-events-none select-none absolute -top-20 -right-10 text-[14rem] md:text-[18rem] font-light leading-none text-white/[0.06] animate-[spin_90s_linear_infinite] motion-reduce:animate-none transition-colors duration-500 group-hover/cta:text-white/[0.10]"
                >
                    *
                </span>

                <div className="relative z-10 max-w-2xl">
                    {/* Eyebrow editorial */}
                    <div className="flex items-center gap-3 mb-5">
                        <span className="block w-10 h-px bg-white/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/50">
                            {t.blogArticle.ctaEyebrow}
                        </span>
                    </div>

                    <h3 className="text-white text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] mb-4">
                        {t.blogArticle.ctaTitlePre}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal text-white">
                            {t.blogArticle.ctaTitleItalic}
                        </span>
                        .
                    </h3>

                    <p className="text-base md:text-lg text-white/60 font-light mb-8 max-w-xl">
                        {t.blogArticle.ctaParagraph}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setOpen(true)}
                            className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-white text-black rounded-full text-sm font-bold hover:bg-white/90 transition-colors"
                        >
                            {t.blogArticle.ctaButton}
                            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </button>
                        <a
                            href={waHref}
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#25D366] text-white rounded-full text-sm font-bold hover:bg-[#1ebe5a] transition-colors"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="w-5 h-5">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                            WhatsApp
                        </a>
                    </div>
                </div>
            </aside>
            <ContactModal isOpen={open} onClose={() => setOpen(false)} />
        </>
    );
}
