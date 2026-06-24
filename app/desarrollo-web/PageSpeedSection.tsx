"use client";

import { motion } from "framer-motion";

const scores = [
    { label: "Performance", score: 99, color: "#00cc66", bg: "#e6fcf0" },
    { label: "Accessibility", score: 95, color: "#00cc66", bg: "#e6fcf0" },
    { label: "Best Practices", score: 100, color: "#00cc66", bg: "#e6fcf0" },
    { label: "SEO", score: 100, color: "#00cc66", bg: "#e6fcf0" },
];

export default function PageSpeedSection() {
    return (
        <section className="w-full py-24 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center">


                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 justify-items-center">
                    {scores.map((s, i) => (
                        <div key={i} className="flex flex-col items-center gap-6">
                            <div className="relative w-32 h-32 md:w-44 md:h-44">
                                {/* Inner circle background */}
                                <div 
                                    className="absolute inset-[10%] rounded-full z-0" 
                                    style={{ backgroundColor: s.bg }} 
                                />
                                
                                <svg className="w-full h-full transform -rotate-90 relative z-10">
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="42%"
                                        stroke={s.color}
                                        strokeWidth="6"
                                        fill="transparent"
                                        className="opacity-10"
                                    />
                                    <motion.circle
                                        cx="50%"
                                        cy="50%"
                                        r="42%"
                                        stroke={s.color}
                                        strokeWidth="6"
                                        fill="transparent"
                                        strokeDasharray="100 100"
                                        initial={{ strokeDashoffset: 100 }}
                                        whileInView={{ strokeDashoffset: 100 - s.score }}
                                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 + i * 0.1 }}
                                        strokeLinecap="round"
                                        style={{ 
                                            pathLength: s.score / 100,
                                            strokeDasharray: "1, 0"
                                        } as any}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center z-20">
                                    <motion.span 
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5, delay: 1.5 + i * 0.1 }}
                                        className="text-3xl md:text-5xl font-bold" 
                                        style={{ color: s.color }}
                                    >
                                        {s.score}
                                    </motion.span>
                                </div>
                            </div>
                            <motion.span 
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 2 + i * 0.1 }}
                                className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-[0.2em]"
                            >
                                {s.label}
                            </motion.span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
