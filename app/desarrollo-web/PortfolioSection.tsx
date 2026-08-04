"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";

// El dominio de cada captura está impreso DENTRO de la propia imagen (barra de
// direcciones del móvil), así que `url` no es una suposición: es lo que el
// visitante lee en la miniatura. Si abre algo distinto a lo que ve, es un fallo.
//
// Sin `url` a propósito:
//   · 4-6 (aersport.com) — el dominio ya no responde; enlazar a un sitio caído
//     es peor que no enlazar.
//   · 8-9 — no son webs, son maquetas de camiseta con un logo. No hay destino.
//
// `alt` describe lo que se ve; antes las doce decían "Portfolio".
const projects = [
    { src: "/gravity-portfolio-1.jpg", url: "https://ponguinguiola.org", alt: "Ponguinguiola — sitio de la organización ambiental" },
    { src: "/gravity-portfolio-2.jpg", url: "https://smilebetterclinics.com", alt: "Smile Better Clinics — sitio de la clínica dental" },
    { src: "/gravity-portfolio-3.jpg", url: "https://ivanivanovich.com", alt: "Ivan Ivanovich Executive Protection Academy — sitio del curso" },
    { src: "/gravity-portfolio-4.jpg", alt: "AERS — tienda en línea de ropa deportiva" },
    { src: "/gravity-portfolio-5.jpg", alt: "AERS — tienda en línea vista en móvil" },
    { src: "/gravity-portfolio-6.jpg", alt: "AERS — tienda en línea vista en móvil" },
    { src: "/gravity-portfolio-7.jpg", url: "https://basham.com.mx", alt: "Basham — sitio del despacho legal" },
    { src: "/gravity-portfolio-8.png", alt: "Etiqueta de marca aplicada a prenda" },
    { src: "/gravity-portfolio-9.png", alt: "Etiqueta de marca aplicada a prenda" },
    { src: "/gravity-portfolio-1.jpg", url: "https://ponguinguiola.org", alt: "Ponguinguiola — sitio de la organización ambiental" },
    { src: "/gravity-portfolio-2.jpg", url: "https://smilebetterclinics.com", alt: "Smile Better Clinics — sitio de la clínica dental" },
    { src: "/gravity-portfolio-3.jpg", url: "https://ivanivanovich.com", alt: "Ivan Ivanovich Executive Protection Academy — sitio del curso" },
];

/** Miniatura del muro: enlace al sitio real cuando existe, imagen suelta cuando no. */
function Miniatura({ p }: { p: { src: string; url?: string; alt: string } }) {
    const img = (
        <img src={p.src} alt={p.alt} className="w-full h-full object-cover" loading="lazy" decoding="async" />
    );
    const caja = "w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0";
    if (!p.url) return <div className={caja}>{img}</div>;
    return (
        <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${caja} block transition-transform duration-500 hover:scale-[1.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white`}
        >
            {img}
        </a>
    );
}

export default function PortfolioSection() {
    const { t } = useLang();
    const p = t.webPage.portfolio;
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "center center"]
    });

    // Container Shrink Effect (Full width -> 90%)
    const width = useTransform(scrollYProgress, [0, 1], ["100%", "90%"]);
    const borderRadius = useTransform(scrollYProgress, [0, 1], ["0rem", "2rem"]);

    // Parallax logic for columns (we need a separate scale for the content scroll)
    const { scrollYProgress: contentScroll } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Alternating directions for 6 columns
    // Alternating directions for 8 columns with increased range
    const y1 = useTransform(contentScroll, [0, 1], [0, -400]);
    const y2 = useTransform(contentScroll, [0, 1], [-400, 0]);
    const y3 = useTransform(contentScroll, [0, 1], [0, -400]);
    const y4 = useTransform(contentScroll, [0, 1], [-400, 0]);
    const y5 = useTransform(contentScroll, [0, 1], [0, -400]);
    const y6 = useTransform(contentScroll, [0, 1], [-400, 0]);
    const y7 = useTransform(contentScroll, [0, 1], [0, -400]);
    const y8 = useTransform(contentScroll, [0, 1], [-400, 0]);

    // Helper to randomize/rotate array deterministicly
    const getProjects = (offset: number) => {
        const rotated = [...projects.slice(offset), ...projects.slice(0, offset)];
        return rotated; // Removed double doubling to save rendering ~100 elements
    };

    return (
        <div className="w-full flex justify-center py-6 md:py-20 bg-[#FAFAFA]">
            <motion.section
                ref={containerRef}
                style={{ width, borderRadius }}
                className="relative h-[55vh] md:h-[80vh] bg-black overflow-hidden flex items-center justify-center p-4"
            >
                {/* Background Grid - Rotated for diagonal effect */}
                <div className="absolute inset-[-50%] flex items-center justify-center rotate-12 scale-125">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4 p-4 w-full opacity-50">

                        {/* Column 1 */}
                        <motion.div style={{ y: y1 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(0).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                        {/* Column 2 */}
                        <motion.div style={{ y: y2 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(3).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                        {/* Column 3 */}
                        <motion.div style={{ y: y3 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(5).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                        {/* Column 4 */}
                        <motion.div style={{ y: y4 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(7).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                        {/* Column 5 */}
                        <motion.div style={{ y: y5 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(2).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                        {/* Column 6 */}
                        <motion.div style={{ y: y6 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(9).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                        {/* Column 7 */}
                        <motion.div style={{ y: y7 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(4).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                        {/* Column 8 */}
                        <motion.div style={{ y: y8 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(1).map((p, i) => (
                                <Miniatura key={i} p={p} />
                            ))}
                        </motion.div>

                    </div>
                </div>

                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                {/* Center Button con eyebrow editorial */}
                <div className="relative z-10 flex flex-col items-center gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3"
                    >
                        <span className="block w-10 h-px bg-white/50" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-white/70 font-sans">
                            {p.eyebrow}
                        </span>
                        <span className="block w-10 h-px bg-white/50" />
                    </motion.div>
                    <Link href={enHref("/portafolio", isEn)}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-xl font-medium tracking-tight hover:shadow-2xl hover:shadow-white/20 transition-all"
                        >
                            {p.ctaPre}<span className="font-[family-name:var(--font-playfair)] italic font-normal">{p.ctaAccent}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </div>

            </motion.section>
        </div>
    );
}
