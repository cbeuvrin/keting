"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ZoomSection() {
    const containerRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    return (
        <section
            ref={containerRef}
            className="h-screen w-full flex items-center justify-center overflow-hidden relative"
        >
            <motion.div
                style={{ scale, opacity }}
                className="w-[90%] h-full relative rounded-[30px] overflow-hidden"
            >
                <img
                    src="/gravity-zoom.jpg"
                    alt="Zooming Image"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />

                {/* Overlay Text */}
                <div className="absolute inset-0 flex items-center justify-end px-6 md:pr-48 pointer-events-none">
                    <div className="text-right">
                        <h2 className="text-5xl md:text-7xl lg:text-[6.5rem] font-heading font-bold leading-[1.05] tracking-tight text-black">
                            <span className="block">
                                <span className="font-[family-name:var(--font-playfair)] italic font-black mr-1">V</span>
                                ibe
                            </span>
                            <span className="block">Coder</span>
                        </h2>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
