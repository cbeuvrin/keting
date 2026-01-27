"use client";

import { motion } from "framer-motion";

export default function TextSection() {
    return (
        <section className="w-full py-24 px-6 md:px-12 text-black bg-[#FAFAFA]">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">

                {/* Left Column: Service Tag */}
                <div className="md:col-span-4">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        viewport={{ once: true }}
                        className="text-lg md:text-xl font-light text-[#333333]"
                    >
                        Servicio de diseño web.
                    </motion.p>
                </div>

                {/* Right Column: Heading & Description */}
                <div className="md:col-span-8 flex flex-col gap-8">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold leading-tight tracking-tight text-black"
                    >
                        Expertos en diseño y desarrollo web.<br />
                        Creamos páginas ideales para potenciar su negocio.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        viewport={{ once: true }}
                        className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-3xl"
                    >
                        Nos dedicamos a proporcionar servicios digitales para impulsar el crecimiento de su negocio. Especializados en diseño y desarrollo web, tiendas virtuales, SEO, optimización de velocidad, hospedaje web y diseño de identidad de marca.
                    </motion.p>
                </div>

            </div>
        </section>
    );
}
