"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ArrowUp, Facebook, Instagram, Linkedin } from "lucide-react";
import { useRef } from "react";
import { useLang } from "@/lib/i18n/lang-context";
import { SOCIAL } from "@/lib/social";
import { enHref, toEn, toEs } from "@/lib/i18n/routes";

export function Footer() {
    const { t } = useLang();
    const router = useRouter();
    const pathname = usePathname();
    const isEn = pathname?.startsWith("/en") ?? false;
    const ref = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end end"],
    });
    const smooth = useSpring(scrollYProgress, { stiffness: 50, damping: 22, mass: 0.6 });
    const rotateAst = useTransform(smooth, [0, 1], [0, 540]);
    const watermarkX = useTransform(smooth, [0, 1], ["-8%", "8%"]);

    return (
        <footer ref={ref} className="relative bg-[#0a0a0a] text-white overflow-hidden">
            {/* Grid background sutil */}
            <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />
            {/* Asterisco gigante girando con scroll */}
            <motion.span
                style={{ rotate: rotateAst }}
                className="absolute top-[8%] right-[4%] text-[8rem] sm:text-[12rem] md:text-[20rem] text-white/[0.04] select-none font-light leading-none inline-block origin-center pointer-events-none"
            >*</motion.span>

            <div className="relative container mx-auto px-6 md:px-12 lg:px-20 pt-20 md:pt-28 pb-12">

                {/* Logo grande centrado con logo gigante semi-transparente detrás */}
                <div className="relative flex items-center justify-center mb-14 md:mb-20 overflow-hidden">
                    {/* Logo gigante de fondo, tipo About Us watermark */}
                    <motion.img
                        style={{ x: watermarkX }}
                        src="/keting-logo-white.png"
                        alt=""
                        aria-hidden
                        className="absolute pointer-events-none select-none w-[200%] md:w-[180%] lg:w-[160%] max-w-none h-auto object-contain opacity-[0.05]"
                        draggable={false}
                    />

                    {/* Logo en primer plano */}
                    <motion.img
                        initial={{ opacity: 0, scale: 0.92 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        src="/keting-logo-white.png"
                        alt="Keting Media"
                        width={1024}
                        height={585}
                        className="relative w-[80%] md:w-[70%] lg:w-[60%] max-w-[900px] h-auto object-contain"
                        draggable={false}
                    />
                </div>

                {/* Línea separadora */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px bg-white/15 w-full origin-left mb-10 md:mb-14"
                />

                {/* Grid de 4 columnas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-14 md:mb-20">
                    {/* Servicios */}
                    <div>
                        <div className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/40 mb-5">
                            {t.footer.servicesTitle}
                        </div>
                        <ul className="space-y-3">
                            <li><Link href={enHref("/desarrollo-web", isEn)} className="text-white/80 hover:text-white transition-colors text-sm">{t.nav.webdesign}</Link></li>
                            <li><Link href={enHref("/desarrollo-de-software", isEn)} className="text-white/80 hover:text-white transition-colors text-sm">{t.nav.digital}</Link></li>
                            <li><Link href={enHref("/automatizacion-de-procesos", isEn)} className="text-white/80 hover:text-white transition-colors text-sm">{t.nav.automation}</Link></li>
                        </ul>
                    </div>

                    {/* Recursos */}
                    <div>
                        <div className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/40 mb-5">
                            {t.footer.resourcesTitle}
                        </div>
                        <ul className="space-y-3">
                            <li><Link href={enHref("/portafolio", isEn)} className="text-white/80 hover:text-white transition-colors text-sm">{t.nav.portfolio}</Link></li>
                            {!isEn && (
                                <li><Link href="/blog" className="text-white/80 hover:text-white transition-colors text-sm">{t.nav.blog}</Link></li>
                            )}
                            <li><Link href={enHref("/", isEn)} className="text-white/80 hover:text-white transition-colors text-sm">{t.nav.home}</Link></li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <div className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/40 mb-5">
                            {t.footer.contactTitle}
                        </div>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <span className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">{t.footer.emailLabel}</span>
                                <Link href="mailto:info@ketingmedia.com" className="group inline-flex items-center gap-1 text-white/85 hover:text-white">
                                    info@ketingmedia.com
                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </Link>
                            </li>
                            <li>
                                <span className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">{t.footer.phoneLabel}</span>
                                <Link href="tel:5543830150" className="text-white/85 hover:text-white">
                                    +52 55 4383 0150
                                </Link>
                            </li>
                            <li>
                                <span className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">{t.footer.cityLabel}</span>
                                <span className="text-white/85">{t.footer.cityValue}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Síguenos + idioma */}
                    <div>
                        <div className="text-[10px] font-medium tracking-[0.3em] uppercase text-white/40 mb-5">
                            {t.footer.followTitle}
                        </div>
                        <div className="flex gap-3 mb-8">
                            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                            <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                        </div>

                        {/* Disponibilidad */}
                        <div className="mb-6">
                            <span className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">{t.footer.availability}</span>
                            <span className="text-white/85 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                {t.footer.availabilityValue}
                            </span>
                        </div>

                        {/* Toggle idioma */}
                        <div>
                            <span className="block text-white/40 text-[10px] uppercase tracking-wider mb-2">{t.nav.idiom}</span>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => router.push(toEs(pathname ?? "/"))}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase transition-all ${
                                        !isEn ? "bg-white text-black" : "text-white/50 hover:text-white"
                                    }`}
                                >
                                    ES
                                </button>
                                <span className="text-white/20">·</span>
                                <button
                                    onClick={() => router.push(toEn(pathname ?? "/"))}
                                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase transition-all ${
                                        isEn ? "bg-white text-black" : "text-white/50 hover:text-white"
                                    }`}
                                >
                                    EN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Línea inferior */}
                <div className="h-px bg-white/10 w-full mb-8" />

                {/* Bottom legal line */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs text-white/40 font-mono uppercase tracking-[0.15em]">
                    <p>&copy; {new Date().getFullYear()} Keting Media · {t.footer.rights}</p>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link href={enHref("/aviso-de-privacidad", isEn)} className="hover:text-white transition-colors">{t.footer.privacy}</Link>
                        <Link href={enHref("/terminos-y-condiciones", isEn)} className="hover:text-white transition-colors">{t.footer.terms}</Link>
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="inline-flex items-center gap-2 hover:text-white transition-colors"
                            aria-label={t.footer.backToTop}
                        >
                            {t.footer.backToTop}
                            <ArrowUp className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
