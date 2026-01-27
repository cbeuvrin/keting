"use client";

import { motion, Variants } from "framer-motion";

export function HeroGrid() {
    // Animation variants for the container to stagger children
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    // Animation for individual squares
    const squareVariants: Variants = {
        hidden: {
            scale: 0.5,
            opacity: 0,
            y: 20
        },
        visible: {
            scale: 1,
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 260,
                damping: 20,
            }
        },
    };

    return (
        <section className="h-screen flex items-center justify-center bg-[#efeff1]">
            <motion.div
                className="grid grid-cols-2 gap-4 md:gap-8 lg:gap-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {[...Array(4)].map((_, index) => (
                    <motion.div
                        key={index}
                        variants={squareVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-32 h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-black rounded-3xl shadow-2xl"
                    />
                ))}
            </motion.div>
        </section>
    );
}