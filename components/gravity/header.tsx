"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { ContactModal } from "@/components/pricing/contact-modal";

export function GravityHeader() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <>
            {/* Mobile Header - Top */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-0 right-0 z-50 flex justify-center items-center pointer-events-none px-4 md:hidden"
            >
                <div className="w-full max-w-sm bg-white text-black rounded-xl p-3 flex items-center justify-between shadow-2xl pointer-events-auto border border-black/10">
                    <button className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                        <Menu className="w-5 h-5" />
                    </button>
                    <Link href="/" className="flex items-center">
                        <img
                            src="/keting-logo-black.png"
                            alt="Keting Media"
                            className="h-6 w-auto object-contain"
                        />
                    </Link>
                    <button className="p-1 hover:bg-black/5 rounded-lg transition-colors relative">
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </motion.header>

            {/* Desktop Header - Top Left */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-6 left-6 z-50 items-center pointer-events-none hidden md:flex"
            >
                <div className="flex items-center gap-2 pointer-events-auto">
                    <div className="bg-white border border-black/10 p-1.5 pl-6 pr-2 rounded-2xl flex items-center gap-1 shadow-2xl">
                        <Link href="/" className="hover:opacity-70 transition-opacity flex items-center mr-4">
                            <img
                                src="/keting-logo-black.png"
                                alt="Keting Media"
                                className="h-8 md:h-9 w-auto object-contain"
                            />
                        </Link>
                        <nav className="flex items-center gap-6 px-2">
                            <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors">Inicio</Link>
                            <Link href="/#portafolio" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors">Portafolio</Link>
                            <Link href="#" className="text-sm font-medium text-zinc-600 hover:text-black transition-colors">App</Link>
                        </nav>
                        <button
                            onClick={() => setIsContactOpen(true)}
                            className="bg-black text-white px-6 h-10 rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors ml-4"
                        >
                            Let&apos;s Talk
                        </button>
                    </div>
                    <button className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-black/10 hover:bg-zinc-50 transition-colors group shadow-2xl">
                        <ShoppingCart className="w-5 h-5 text-zinc-600 group-hover:text-black transition-colors" />
                    </button>
                </div>
            </motion.header>

            <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
        </>
    );
}
