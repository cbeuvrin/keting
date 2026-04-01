"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ShoppingCart, Menu } from "lucide-react";
import Link from "next/link";
import { PricingCard } from "@/components/pricing/pricing-card";
import { pricingData } from "@/components/pricing/data";
import { ContactModal } from "@/components/pricing/contact-modal";

export default function PricingPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">

            {/* Mobile Header - Top */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center items-center pointer-events-none px-4 md:hidden"
            >
                <div className="w-full max-w-sm bg-[#111111] text-white rounded-xl p-3 flex items-center justify-between shadow-2xl pointer-events-auto border border-white/10">
                    {/* Menu Icon */}
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>

                    {/* Centered Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="font-heading font-black text-lg tracking-wider uppercase">KETING</span>
                    </Link>

                    {/* Cart Icon */}
                    <button className="p-1 hover:bg-white/10 rounded-lg transition-colors relative">
                        <ShoppingCart className="w-5 h-5" />
                        {/* Dot indicator if needed */}
                        {/* <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span> */}
                    </button>
                </div>
            </motion.header>

            {/* Desktop Header - Bottom */}
            <motion.header
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-6 left-0 right-0 z-50 justify-center items-center pointer-events-none px-4 hidden md:flex"
            >
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div className="bg-[#111111] border border-white/10 p-1.5 pl-6 pr-2 rounded-2xl flex items-center gap-1 shadow-2xl">
                        {/* Logo Area */}
                        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center mr-4">
                            <img src="/keting-logo-white.png" alt="Keting" className="h-7 w-auto object-contain" />
                        </Link>

                        {/* Nav Items */}
                        <nav className="flex items-center gap-6 px-2">
                            <Link href="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Inicio</Link>
                            <Link href="/#portafolio" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Portafolio</Link>
                            <Link href="#" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">App</Link>
                        </nav>

                        {/* CTA */}
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="bg-[#222222] text-white px-6 h-10 rounded-xl text-sm font-medium hover:bg-[#333333] transition-colors ml-4 border border-white/5"
                        >
                            Let&apos;s Talk
                        </button>
                    </div>

                    {/* Cart Icon - Separated */}
                    <button className="w-14 h-14 bg-[#111111] rounded-2xl flex items-center justify-center border border-white/10 hover:bg-[#222222] transition-colors group shadow-2xl">
                        <ShoppingCart className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                    </button>
                </div>
            </motion.header>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

            <main>
                {/* Hero Section - Black Background - Exactly 70vh */}
                <section className="relative h-[70vh] min-h-[400px] flex flex-col items-center justify-center pt-20 px-6 bg-black text-white">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center max-w-5xl mx-auto space-y-8 mb-20 md:mb-8"
                    >
                        {/* Eyebrow Removed as it is now the header */}

                        {/* Main Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-heading font-light uppercase leading-[1.1] tracking-tight text-white text-balance">
                            Compra hoy <span className="font-bold">la <em className="italic">web</em> que <br className="hidden md:block" />
                                tu negocio necesita</span> mañana
                        </h1>

                        {/* Subtitle with Icons - Desktop Only */}
                        <div className="hidden md:flex flex-wrap items-center justify-center gap-4 text-zinc-400 text-sm md:text-base font-medium">
                            <span className="flex items-center gap-2">
                                <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">1</span>
                                Elige el tipo de web
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">2</span>
                                Selecciona los detalles
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">3</span>
                                Agrega al carrito y procedemos a contactarte
                            </span>
                        </div>
                    </motion.div>

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="absolute bottom-24 md:bottom-6 left-1/2 -translate-x-1/2"
                    >
                        <div className="bg-white text-black rounded-full w-12 h-12 flex items-center justify-center animate-bounce">
                            <ArrowDown className="w-5 h-5" />
                        </div>
                    </motion.div>

                    {/* Subtitle with Icons (Steps) - Mobile Only (Absolute Bottom) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                        className="md:hidden absolute bottom-6 left-0 right-0 w-full flex flex-wrap items-center justify-center gap-4 text-zinc-400 text-xs font-medium px-4"
                    >
                        <span className="flex items-center gap-2">
                            <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">1</span>
                            Elige el tipo de web
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">2</span>
                            Selecciona los detalles
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="bg-white text-black rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">3</span>
                            Agrega al carrito y procedemos a contactarte
                        </span>
                    </motion.div>
                </section>

                {/* Pricing Grid Section - White Background */}
                <section className="container mx-auto px-6 py-24 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8">
                        {pricingData.map((product, index) => (
                            <PricingCard key={product.id} product={product} index={index} />
                        ))}
                    </div>
                </section>

                {/* Custom Projects Section - Responsive Layout */}
                <section className="container mx-auto px-6 mt-12 mb-24">

                    {/* Mobile Layout (Stacked) */}
                    <div className="md:hidden flex flex-col gap-6">
                        {/* Image Container */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-[#F5F5F0] p-6">
                            <img
                                src="/images/movil-proyecto.png"
                                alt="Proyectos digitales personalizados"
                                className="h-full w-full object-contain"
                            />
                        </div>

                        {/* Text Content (Below Image) */}
                        <div className="px-2">
                            <h2 className="text-3xl font-heading font-black uppercase leading-none tracking-tight text-black mb-4">
                                Proyectos<br />digitales<br />personalizados
                            </h2>
                            <p className="text-zinc-500 text-sm font-medium mb-6">
                                Si tienes algo específico en mente, somos todo oídos. Conecta con nuestro equipo para crear un enfoque a medida.
                            </p>

                            <button
                                onClick={() => setIsContactOpen(true)}
                                className="inline-flex h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-bold text-white transition-all hover:bg-zinc-800 shadow-xl w-full"
                            >
                                Contactar equipo
                            </button>
                        </div>
                    </div>

                    {/* Desktop Layout (Framed Background) */}
                    <div className="hidden md:block relative w-full rounded-[2rem] bg-[#F5F5F0] p-3 md:p-6 min-h-[350px]">
                        <div className="relative w-full h-full rounded-[1.5rem] overflow-hidden flex items-center min-h-[350px]">

                            {/* Background Image */}
                            <div className="absolute inset-0 z-0">
                                <img
                                    src="/images/sotww.png"
                                    alt="Proyectos digitales personalizados"
                                    className="w-full h-full object-cover object-[center_95%]"
                                />
                            </div>

                            {/* Text Content - Overlay */}
                            <div className="relative z-10 p-8 md:p-12 max-w-xl">
                                <h2 className="text-3xl md:text-5xl font-heading font-black uppercase leading-[0.9] tracking-tight text-black mb-4">
                                    Proyectos<br />digitales<br />personalizados
                                </h2>
                                <p className="text-zinc-800 text-sm md:text-base font-medium mb-6 max-w-sm">
                                    Si tienes algo específico en mente, somos todo oídos. Conecta con nuestro equipo para crear un enfoque a medida.
                                </p>

                                <button
                                    onClick={() => setIsContactOpen(true)}
                                    className="inline-flex h-10 md:h-12 items-center justify-center rounded-full bg-black px-6 text-sm font-bold text-white transition-all hover:bg-zinc-800 hover:scale-105 shadow-xl"
                                >
                                    Contactar equipo
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Simplified - Dark Text */}
                <footer className="py-12 border-t border-gray-100 text-center text-zinc-400 text-sm bg-white">
                    <p>&copy; {new Date().getFullYear()} Keting Media. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
}
