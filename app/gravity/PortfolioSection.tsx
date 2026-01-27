"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const projects = [
    { src: "/gravity-portfolio-1.jpg" },
    { src: "/gravity-portfolio-2.jpg" },
    { src: "/gravity-portfolio-3.jpg" },
    { src: "/gravity-portfolio-4.jpg" },
    { src: "/gravity-portfolio-5.jpg" },
    { src: "/gravity-portfolio-6.jpg" },
    { src: "/gravity-portfolio-7.jpg" },
    { src: "/gravity-portfolio-8.png" },
    { src: "/gravity-portfolio-9.png" },
    { src: "/gravity-portfolio-1.jpg" },
    { src: "/gravity-portfolio-2.jpg" },
    { src: "/gravity-portfolio-3.jpg" },
];

export default function PortfolioSection() {
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
        return [...rotated, ...rotated]; // Double it for length
    };

    return (
        <div className="w-full flex justify-center py-10 md:py-20 bg-[#FAFAFA]">
            <motion.section
                ref={containerRef}
                style={{ width, borderRadius }}
                className="relative h-[80vh] bg-black overflow-hidden flex items-center justify-center p-4"
            >
                {/* Background Grid - Rotated for diagonal effect */}
                <div className="absolute inset-[-50%] flex items-center justify-center rotate-12 scale-125">
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 md:gap-4 p-4 w-full opacity-50">

                        {/* Column 1 */}
                        <motion.div style={{ y: y1 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(0).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 2 */}
                        <motion.div style={{ y: y2 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(3).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 3 */}
                        <motion.div style={{ y: y3 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(5).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 4 */}
                        <motion.div style={{ y: y4 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(7).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 5 */}
                        <motion.div style={{ y: y5 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(2).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 6 */}
                        <motion.div style={{ y: y6 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(9).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 7 */}
                        <motion.div style={{ y: y7 }} className="flex flex-col gap-2 md:gap-4">
                            {getProjects(4).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                        {/* Column 8 */}
                        <motion.div style={{ y: y8 }} className="flex flex-col gap-2 md:gap-4 -mt-24">
                            {getProjects(1).map((p, i) => (
                                <div key={i} className="w-full aspect-[3/4] bg-white/10 rounded-xl overflow-hidden shrink-0">
                                    <img src={p.src} alt="Portfolio" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </motion.div>

                    </div>
                </div>

                {/* Overlay Vignette */}
                <div className="absolute inset-0 bg-black/40 pointer-events-none" />

                {/* Center Button */}
                <div className="relative z-10">
                    <Link href="/portafolio">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full text-xl font-medium tracking-tight hover:shadow-2xl hover:shadow-white/20 transition-all"
                        >
                            Portafolio
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </div>

            </motion.section>
        </div>
    );
}
