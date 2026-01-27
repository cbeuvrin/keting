"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function HeaderCentered({ className }: { className?: string }) {

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={cn(
                "fixed top-8 z-50",
                // Mobile: Centered
                "left-1/2 -translate-x-1/2 w-[90%]",
                // Desktop: Right aligned
                "md:left-auto md:translate-x-0 md:right-12 md:w-[40%]",
                "bg-white/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-full",
                "flex items-center justify-between px-1 py-1",
                className
            )}
        >
            {/* Logo Section */}
            <div className="pl-4">
                <Link href="/">
                    <img
                        src="/keting-logo-black.png"
                        alt="Keting Media"
                        className="h-10 w-auto object-contain"
                    />
                </Link>
            </div>
        </motion.header>
    );
}
