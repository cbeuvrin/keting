"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KetingLogoProps {
    className?: string;
    isCollapsed?: boolean;
    layoutId?: string;
}

export function KetingLogo({ className, isCollapsed = false, layoutId }: KetingLogoProps) {
    // We animate the letterSpacing to "squish" the text into a dot-like shape
    // "keting" has 6 letters + dot = 7 chars. 
    // If we reduce spacing enough, they overlap.
    // Ideally we want them to overlap on the dot position? 
    // Or just overlap centrally. The "." is the first char.

    // To make it look like they merge into a DOT, we can scale down the container 
    // and reduce spacing?
    // User wants: "Juantan las letras y forman un circulo negro"

    return (
        <motion.div
            layoutId={layoutId} // The magic shared layout prop
            className={cn(
                "relative flex items-center justify-center font-[family-name:var(--font-sulphur)] font-bold text-black",
                className
            )}
            initial={false}
            animate={{
                letterSpacing: isCollapsed ? "-0.45em" : "-0.05em", // Collapse letters
                scale: isCollapsed ? 0.2 : 1, // Shrink to look like a dot
                opacity: 1
            }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1] // Apple-like ease
            }}
        >
            <span className="relative z-10 transition-colors">.keting</span>

            {/* Optional: Actual "Dot" overlay that appears when collapsed to make it perfect circle? 
                If the text overlap is messy, we might fade in a circle.
            */}
            <motion.div
                className="absolute inset-0 bg-black rounded-full"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: isCollapsed ? 1 : 0,
                    scale: isCollapsed ? 1 : 0.5
                }}
                transition={{ duration: 0.4 }}
            />
        </motion.div>
    );
}
