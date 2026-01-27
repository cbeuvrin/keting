"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface PreloaderProps {
    onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [animationStep, setAnimationStep] = useState("visible");

    useEffect(() => {
        const rotateTimer = setTimeout(() => {
            setAnimationStep("rotating");
        }, 1200);

        const exitTimer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 600);
        }, 2200);

        return () => {
            clearTimeout(rotateTimer);
            clearTimeout(exitTimer);
        };
    }, [onComplete]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.1,
            },
        },
        rotating: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            }
        },
        exit: {
            opacity: 0,
            transition: {
                when: "afterChildren",
                staggerChildren: 0.05,
                staggerDirection: -1,
                duration: 0.5,
            }
        }
    };

    const squareVariants: Variants = {
        hidden: {
            scale: 0,
            opacity: 0,
            rotate: 45
        },
        visible: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
            }
        },
        rotating: {
            scale: 1,
            opacity: 1,
            rotate: 90,
            transition: {
                type: "spring",
                stiffness: 200,
                damping: 20,
            }
        },
        exit: {
            scale: 0,
            opacity: 0,
            rotate: 135,
            transition: {
                duration: 0.4
            }
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[100] bg-[#FAFAFA] flex items-center justify-center pointer-events-none"
                    initial="hidden"
                    animate={animationStep}
                    exit="exit"
                    variants={containerVariants}
                >
                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {[...Array(4)].map((_, index) => (
                            <motion.div
                                key={index}
                                variants={squareVariants}
                                className="w-12 h-12 md:w-16 md:h-16 bg-black rounded-2xl md:rounded-3xl shadow-lg"
                            />
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
