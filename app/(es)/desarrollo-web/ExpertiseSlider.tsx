"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const slides = [
    {
        id: 1,
        title: "Engineering Excellence",
        subtitle: "Scalable Systems, Exceptional Experiences",
        description: "WE DESIGN AND ENGINEER SCALABLE, COST-EFFICIENT SYSTEMS THAT ELEVATE USER EXPERIENCE THROUGH PRECISE, RELIABLE TACTILE FEEDBACK.",
        image: "/images/expertise/eng.png",
        range: [0, 0.25, 0.35] // [appear, full, disappear]
    },
    {
        id: 2,
        title: "Digital Innovation",
        subtitle: "Future-Proof Solutions for Global Brands",
        description: "TRANSFORMING IDEAS INTO SEAMLESS DIGITAL PRODUCTS THROUGH CUTTING-EDGE TECHNOLOGY AND INTUITIVE INTERFACES.",
        image: "/images/expertise/digital.png",
        range: [0.35, 0.5, 0.65]
    },
    {
        id: 3,
        title: "Creative Strategy",
        subtitle: "Meaningful Design, Lasting Impact",
        description: "OUR MULTIDISCIPLINARY APPROACH BLENDS ART AND STRATEGY TO CREATE BRAND IDENTITIES THAT RESONATE AND CONVERT.",
        image: "/images/expertise/design.png",
        range: [0.65, 0.8, 1]
    }
];

export function ExpertiseSlider() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Progress bar linked to the entire section scroll
    const progressBarScaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <section 
            ref={containerRef} 
            className="relative bg-[#FAFAFA] h-[400vh] z-30"
            style={{ position: 'relative' }} // Explicitly ensure non-static
        >
            <div className="sticky top-0 h-screen flex flex-col justify-center items-center overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 max-w-[1100px] w-full relative">
                    
                    {/* Top Progress Bar */}
                    <div className="w-full h-[1px] bg-gray-300 mb-16 relative overflow-hidden">
                        <motion.div 
                            style={{ scaleX: progressBarScaleX, originX: 0 }}
                            className="absolute top-0 left-0 w-full h-full bg-[#242424]"
                        />
                    </div>

                    <div className="relative flex items-center justify-center w-full min-h-[500px] md:min-h-[600px]">
                        
                        {/* Side Numbers (Animated based on scroll) */}
                        <div className="absolute left-[-60px] md:left-[-80px] flex flex-col gap-8 z-40">
                            {slides.map((slide, index) => {
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                const opacity = useTransform(
                                    scrollYProgress,
                                    [slide.range[0], slide.range[1], slide.range[2]],
                                    [0.3, 1, 0.3]
                                );
                                // eslint-disable-next-line react-hooks/rules-of-hooks
                                const bgOpacity = useTransform(
                                    scrollYProgress,
                                    [slide.range[0], slide.range[1], slide.range[2]],
                                    [0, 1, 0]
                                );

                                return (
                                    <div key={slide.id} className="relative flex items-center justify-center w-10 h-10">
                                        <motion.div
                                            style={{ opacity: bgOpacity }}
                                            className="absolute inset-0 bg-[#242424] rounded-full"
                                        />
                                        <motion.span
                                            style={{ 
                                                opacity,
                                                color: useTransform(opacity, [0.3, 1], ["#888", "#FFF"])
                                            }}
                                            className="text-[14px] font-bold z-10"
                                        >
                                            {slide.id}
                                        </motion.span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cards Stack */}
                        {slides.map((slide, index) => {
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const opacity = useTransform(
                                scrollYProgress,
                                [slide.range[0] - 0.05, slide.range[0], slide.range[1], slide.range[2], slide.range[2] + 0.05],
                                [0, 1, 1, 1, 0]
                            );
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const y = useTransform(
                                scrollYProgress,
                                [slide.range[0] - 0.05, slide.range[0], slide.range[2], slide.range[2] + 0.05],
                                [20, 0, 0, -20]
                            );
                            // eslint-disable-next-line react-hooks/rules-of-hooks
                            const scale = useTransform(
                                scrollYProgress,
                                [slide.range[0] - 0.05, slide.range[0], slide.range[2], slide.range[2] + 0.05],
                                [0.95, 1, 1, 0.95]
                            );

                            return (
                                <motion.div
                                    key={slide.id}
                                    style={{ opacity, y, scale, zIndex: index + 10 }}
                                    className="absolute inset-0 bg-[#242424] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col md:flex-row"
                                >
                                    {/* Content Side */}
                                    <div className="w-full md:w-[55%] p-8 md:p-16 flex flex-col justify-between h-full">
                                        <div>
                                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8">
                                                {slide.title}
                                            </h2>
                                        </div>

                                        <div className="space-y-6 max-w-sm">
                                            <h4 className="text-sm font-bold text-gray-300 uppercase">
                                                {slide.subtitle}
                                            </h4>
                                            <p className="text-[11px] leading-relaxed text-gray-400 font-mono tracking-wider uppercase">
                                                {slide.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image Side */}
                                    <div className="w-full md:w-[45%] relative h-full p-4">
                                        <div className="relative w-full h-full rounded-xl md:rounded-[1.5rem] overflow-hidden">
                                            <Image
                                                src={slide.image}
                                                alt={slide.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, 45vw"
                                                priority
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
