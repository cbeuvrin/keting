"use client";

import { motion, useScroll, useTransform, cubicBezier } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { useLang } from "@/lib/i18n/lang-context";
import type { Dictionary } from "@/lib/i18n/dictionaries";

// Helpers para resaltar texto en las citas
const Chip = ({ children }: { children: ReactNode }) => (
    <span className="not-italic bg-black text-white px-2 py-0.5 font-medium">{children}</span>
);
const Italic = ({ children }: { children: ReactNode }) => (
    <span className="font-[family-name:var(--font-playfair)] italic font-normal text-black">{children}</span>
);
const Under = ({ children }: { children: ReactNode }) => (
    <span className="not-italic relative inline-block text-black font-medium">
        {children}
        <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-black/80" />
    </span>
);
const Bold = ({ children }: { children: ReactNode }) => (
    <span className="not-italic text-black font-semibold">{children}</span>
);

type Testimonial = {
    stat: string;
    subtitle: string;
    quote: ReactNode;
    name: string;
    role: string;
    tags: readonly string[];
};

function buildTestimonials(t: Dictionary): Testimonial[] {
    const { item1, item2, item3 } = t.testimonials;

    return [
        {
            stat: item1.stat,
            subtitle: item1.subtitle,
            quote: (
                <>
                    <span className="text-3xl text-black/30 leading-none align-top mr-1">&ldquo;</span>
                    {item1.quotePre}<Under>{item1.quoteUnder1}</Under>{item1.quoteMid1}<Italic>{item1.quoteItalic1}</Italic>{item1.quoteMid2}<Chip>{item1.quoteChip1}</Chip>{item1.quoteMid3}<Bold>{item1.quoteBold1}</Bold>{item1.quoteMid4}<Italic>{item1.quoteItalic2}</Italic>{item1.quotePost}
                    <span className="text-3xl text-black/30 leading-none align-top ml-1">&rdquo;</span>
                </>
            ),
            name: item1.name,
            role: item1.role,
            tags: item1.tags
        },
        {
            stat: item2.stat,
            subtitle: item2.subtitle,
            quote: (
                <>
                    <span className="text-3xl text-black/30 leading-none align-top mr-1">&ldquo;</span>
                    {item2.quotePre}<Italic>{item2.quoteItalic1}</Italic>{item2.quoteMid1}<Bold>{item2.quoteBold1}</Bold>{item2.quoteMid2}<Under>{item2.quoteUnder1}</Under>{item2.quoteMid3}<Chip>{item2.quoteChip1}</Chip>{item2.quoteMid4}<Italic>{item2.quoteItalic2}</Italic>{item2.quotePost}
                    <span className="text-3xl text-black/30 leading-none align-top ml-1">&rdquo;</span>
                </>
            ),
            name: item2.name,
            role: item2.role,
            tags: item2.tags
        },
        {
            stat: item3.stat,
            subtitle: item3.subtitle,
            quote: (
                <>
                    <span className="text-3xl text-black/30 leading-none align-top mr-1">&ldquo;</span>
                    {item3.quotePre}<Italic>{item3.quoteItalic1}</Italic>{item3.quoteMid1}<Chip>{item3.quoteChip1}</Chip>{item3.quoteMid2}<Under>{item3.quoteUnder1}</Under>{item3.quoteMid3}<Bold>{item3.quoteBold1}</Bold>{item3.quoteMid4}<Italic>{item3.quoteItalic2}</Italic>{item3.quotePost}
                    <span className="text-3xl text-black/30 leading-none align-top ml-1">&rdquo;</span>
                </>
            ),
            name: item3.name,
            role: item3.role,
            tags: item3.tags
        }
    ];
}

export function Testimonials() {
    const { t } = useLang();
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const testimonials = buildTestimonials(t);

    return (
        <section ref={containerRef} className="relative z-20 py-32 bg-[#FAFAFA] text-[#111111] overflow-hidden">
            <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                <div className="mb-20 text-center md:text-left">
                    {/* Eyebrow editorial */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6"
                    >
                        <span className="block w-10 h-px bg-black/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                            {t.common.testimonials}
                        </span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="text-3xl md:text-5xl font-normal tracking-tight mb-4 font-heading text-[#111]"
                    >
                        {t.webdesign.testimonialsTitle1}{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">{t.webdesign.testimonialsItalic}</span>{" "}
                        {t.webdesign.testimonialsTitle2}
                        <span className="inline-block ml-2 text-xl md:text-3xl align-top rotate-12 text-black/30">*</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10%" }}
                        transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="text-gray-500 text-lg md:text-xl font-light"
                    >
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal text-black">{t.webdesign.testimonialsSubtitleResults}</span>{" "}
                        {t.webdesign.testimonialsSubtitle1}{" "}
                        <span className="relative inline-block text-black font-medium">
                            {t.webdesign.testimonialsSubtitleBrands}
                            <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-black/70" />
                        </span>{t.webdesign.testimonialsSubtitle2}
                    </motion.p>
                </div>

                <div className="flex flex-col">
                    {testimonials.map((item, index) => {
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const yStat = useTransform(scrollYProgress, [0, 1], [40 + index * 20, -40 - index * 20], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });
                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const yQuote = useTransform(scrollYProgress, [0, 1], [20 + index * 10, -20 - index * 10], { ease: cubicBezier(0.1, 0.5, 0.5, 1) });

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.8, delay: index * 0.2, ease: "easeOut" }}
                                className={`py-12 flex flex-col md:flex-row gap-8 md:gap-16 border-t border-dashed border-[#d5d5d5] ${index === testimonials.length - 1 ? 'border-b' : ''}`}
                            >
                                {/* Stat Column */}
                                <motion.div
                                    style={{ y: yStat }}
                                    className="md:w-1/4 flex flex-col items-start text-left pt-2"
                                >
                                    <span className="text-[5rem] md:text-[6.5rem] font-normal tracking-tighter leading-[0.8] mb-4 text-[#111]">
                                        {item.stat}
                                    </span>
                                    <span className="text-[10px] md:text-[11px] text-[#666] uppercase tracking-[0.2em] font-mono font-medium">
                                        {item.subtitle}
                                    </span>
                                </motion.div>

                                {/* Quote Column */}
                                <motion.div
                                    style={{ y: yQuote }}
                                    className="md:w-1/2 flex items-start pt-4"
                                >
                                    <p className="text-lg md:text-[1.125rem] leading-[1.8] text-[#333] font-medium tracking-tight italic text-justify md:text-left">
                                        {item.quote}
                                    </p>
                                </motion.div>

                                {/* Client Info Column */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: index * 0.3 }}
                                    className="md:w-1/4 flex flex-col md:items-start justify-start pt-4"
                                >
                                    <h4 className="text-sm font-bold uppercase tracking-widest mb-1 text-[#111]">{item.name}</h4>
                                    <p className="text-[13px] text-[#888] mb-6 font-light">{item.role}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.tags.map((tag, tagIndex) => (
                                            <span
                                                key={tagIndex}
                                                className="text-[10px] md:text-[11px] px-3 py-1.5 rounded-full border border-[rgba(0,0,0,0.15)] text-[#555] uppercase font-mono tracking-wider bg-white/50"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
