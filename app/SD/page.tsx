"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { HeaderCentered } from "@/components/layout/header-centered";
import { WavyBackground } from "@/components/ui/wavy-background";
import { cn } from "@/lib/utils";
import { X, Facebook, Linkedin, Instagram, ArrowUpRight } from "lucide-react";

// Menu Items
const menuItems = [
    { label: "Home", href: "/#home" },
    { label: "Diseño web", href: "/webdesing" },
    { label: "Soluciones digitales", href: "/soluciones-digitales" },
    { label: "Portafolio", href: "/#portafolio" },
    { label: "Contacto", href: "/#contacto" },
    { label: "Blog", href: "/#blog" },
];

// Fade-in Section Component
const FadeSection = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default function SDPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [contactFormData, setContactFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });
    const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const scrollTop = e.currentTarget.scrollTop;
        setIsScrolled(scrollTop > 50);
    };

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactStatus("sending");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...contactFormData,
                    source: "Página SD (Hero)"
                }),
            });

            if (response.ok) {
                setContactStatus("success");
                setContactFormData({ name: "", email: "", phone: "" });
                setTimeout(() => {
                    setContactStatus("idle");
                    setIsContactOpen(false);
                }, 3000);
            } else {
                setContactStatus("error");
            }
        } catch (error) {
            console.error("Error submitting contact form:", error);
            setContactStatus("error");
        }
    };

    return (
        // Outer Frame (Fixed, Animated Background)
        <div
            className={cn(
                "fixed inset-0 z-[100] flex items-center justify-center font-montserrat selection:bg-black selection:text-white bg-black transition-all duration-300 ease-in-out",
                isScrolled ? "p-0" : "p-6 md:p-12"
            )}
        >
            {/* Wavy Lights Background (Reference Style) */}
            <WavyBackground className="absolute inset-0 z-0 pointer-events-none" waveWidth={60} blur={5} />

            {/* Layout Wrapper to position Header relative to Card */}
            <div className="relative w-full h-full max-w-[1600px] flex flex-col transition-all duration-300 z-10">

                {/* Header - ONLY LOGO */}
                <HeaderCentered className="absolute top-6 right-2 md:top-8 md:right-12 w-[95%] md:w-auto z-[60] bg-white rounded-full shadow-none" />

                {/* Inner Content Card (Scrollable) */}
                <div className={cn(
                    "bg-white w-full h-full relative shadow-2xl overflow-hidden flex flex-col z-50 transition-all duration-300 ease-in-out",
                    isScrolled ? "rounded-none" : "rounded-2xl"
                )}>

                    {/* Scroll Area */}
                    <div
                        className="flex-1 overflow-y-auto no-scrollbar relative w-full h-full"
                        onScroll={handleScroll}
                    >

                        {/* HERO SECTION */}
                        <section className="min-h-full flex flex-col justify-center px-6 md:px-24 pt-32 pb-16 relative overflow-hidden">
                            <div className="w-full z-10">
                                <motion.h1
                                    initial={{ opacity: 1, y: 0 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="text-4xl md:text-6xl lg:text-[5.5rem] leading-[0.9] font-bold tracking-tight mb-8"
                                >
                                    Diseño y<br />
                                    Desarrollo de<br />
                                    Productos Digitales
                                </motion.h1>

                                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-12 border-t border-black/10 pt-8">
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                        className="text-xl md:text-2xl max-w-2xl font-medium text-black/80"
                                    >
                                        ¡Bienvenidos! Desde el diseño hasta el desarrollo, aquí lo hacemos realidad.
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.6, duration: 0.8 }}
                                        className="flex gap-4 relative" // Added relative for positioning form
                                    >
                                        {/* MENU BUTTON (Formerly Hablemos) */}
                                        <button
                                            onClick={() => setIsMenuOpen(true)}
                                            className="px-6 py-3 bg-black text-white rounded-full text-base font-medium hover:bg-neutral-800 transition-colors"
                                        >
                                            Menú
                                        </button>

                                        {/* CONTACT BUTTON (Formerly Nuestro Trabajo) */}
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsContactOpen(!isContactOpen)}
                                                className="group px-6 py-3 border border-black rounded-full text-base font-medium hover:bg-black hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <span>Contacto</span>
                                                <ArrowUpRight className={cn(
                                                    "w-4 h-4 transition-transform",
                                                    isContactOpen ? "rotate-180" : "group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                )} />
                                            </button>

                                            {/* CONTACT DROP-UP FORM */}
                                            <AnimatePresence>
                                                {isContactOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[320px] bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 z-[9999]"
                                                    >
                                                        <form className="space-y-4 text-left" onSubmit={handleContactSubmit}>
                                                            <input
                                                                type="text"
                                                                required
                                                                value={contactFormData.name}
                                                                onChange={(e) => setContactFormData({ ...contactFormData, name: e.target.value })}
                                                                placeholder="Nombre"
                                                                className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-black placeholder:text-gray-500"
                                                            />
                                                            <input
                                                                type="email"
                                                                required
                                                                value={contactFormData.email}
                                                                onChange={(e) => setContactFormData({ ...contactFormData, email: e.target.value })}
                                                                placeholder="Email"
                                                                className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-black placeholder:text-gray-500"
                                                            />
                                                            <input
                                                                type="tel"
                                                                required
                                                                value={contactFormData.phone}
                                                                onChange={(e) => setContactFormData({ ...contactFormData, phone: e.target.value })}
                                                                placeholder="Teléfono"
                                                                className="w-full px-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all text-black placeholder:text-gray-500"
                                                            />
                                                            <button
                                                                type="submit"
                                                                disabled={contactStatus === "sending"}
                                                                className={cn(
                                                                    "w-full py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50",
                                                                    contactStatus === "success" && "bg-green-600 hover:bg-green-700",
                                                                    contactStatus === "error" && "bg-red-600 hover:bg-red-700"
                                                                )}
                                                            >
                                                                {contactStatus === "idle" && "Enviar"}
                                                                {contactStatus === "sending" && "Enviando..."}
                                                                {contactStatus === "success" && "¡Enviado!"}
                                                                {contactStatus === "error" && "Error"}
                                                            </button>
                                                        </form>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Radial Expanding Animation */}
                            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 flex items-center justify-center z-0 pointer-events-none">
                                {[0, 1, 2].map((i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0.1, opacity: 0 }}
                                        animate={{
                                            scale: [0.1, 2.5],
                                            opacity: [0, 0.4, 0]
                                        }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                            delay: i * 1.3, // Stagger delays to create density
                                        }}
                                        className="absolute w-[60vw] h-[60vw] max-w-[800px] max-h-[800px]"
                                    >
                                        <img
                                            src="/radial-dots.png"
                                            alt=""
                                            className="w-full h-full object-contain"
                                        />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Subtle Background Element (Optional, kept for depth) */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-50 to-transparent -z-0 pointer-events-none opacity-50" />
                        </section>

                        {/* CONTENT SECTIONS */}
                        <div className="px-6 md:px-24 py-24 space-y-32">

                            {/* Section 1 */}
                            <FadeSection>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                        Historias reales,<br />resultados reales.
                                    </h2>
                                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                        <p>
                                            No solo creamos software; construimos negocios. Nuestro enfoque se basa en entender tus objetivos principales y traducirlos en una realidad digital.
                                        </p>
                                        <p>
                                            Desde startups hasta empresas Fortune 500, nuestros socios confían en nosotros para entregar excelencia.
                                        </p>
                                        <a href="#" className="inline-block text-black underline decoration-2 underline-offset-4 text-base font-medium hover:text-gray-600">
                                            Ver Casos de Éxito
                                        </a>
                                    </div>
                                </div>
                            </FadeSection>

                            {/* Section 2 */}
                            <FadeSection>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                        De humanos<br />para humanos.
                                    </h2>
                                    <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                        <p>
                                            La tecnología es mejor cuando une a las personas. Priorizamos el diseño centrado en el usuario que se siente natural, intuitivo y humano.
                                        </p>
                                        <div className="h-64 bg-gray-100 rounded-2xl w-full object-cover grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden">
                                            {/* Placeholder for a "Human" image */}
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                [Human Interaction Image]
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeSection>

                            {/* Section 3 - Founding Principle */}
                            <FadeSection>
                                <div className="border-t border-black/10 pt-24">
                                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-12 text-center">
                                        Siguiendo nuestro<br />principio fundamental.
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="p-8 bg-gray-50 rounded-2xl hover:bg-black hover:text-white transition-colors duration-300 group cursor-default">
                                                <span className="text-sm font-mono opacity-50 mb-4 block">0{i}</span>
                                                <h3 className="text-xl font-bold mb-4">Principio {i}</h3>
                                                <p className="text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                                                    Explicación detallada de este valor fundamental y cómo impulsa nuestro proceso de desarrollo hacia adelante.
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeSection>

                        </div>

                        {/* FOOTER */}
                        <div className="px-6 md:px-24 pb-12">
                        </div>
                    </div>
                </div>

                {/* FULL SCREEEN MENU OVERLAY */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#F5F5F0] z-[200] flex flex-col justify-center items-center"
                        >
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-8 right-8 p-4 hover:bg-black/5 rounded-full transition-colors"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <nav className="flex flex-col items-center gap-6">
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMenuOpen(false)}
                                            className="text-4xl md:text-5xl font-bold tracking-tight hover:text-gray-500 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="absolute bottom-12 flex gap-6">
                                <Facebook className="w-6 h-6 hover:scale-110 transition-transform cursor-pointer" />
                                <Linkedin className="w-6 h-6 hover:scale-110 transition-transform cursor-pointer" />
                                <Instagram className="w-6 h-6 hover:scale-110 transition-transform cursor-pointer" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
