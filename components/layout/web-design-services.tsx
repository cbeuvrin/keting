"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface ServiceItemProps {
  title: string;
  description: string;
  delay: number;
}

const ServiceItem = ({ title, description, delay }: ServiceItemProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative py-6 md:py-8 lg:py-10 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Animated Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 w-full h-px bg-black/10 origin-left group-hover:bg-black/40 transition-colors duration-500"
      />

      <motion.p
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: delay + 0.2 }}
        className="text-lg md:text-xl lg:text-2xl font-light text-[#1d1d1f]/60 group-hover:text-[#1d1d1f] group-hover:translate-x-4 transition-all duration-500 font-sans"
      >
        {title}
      </motion.p>

      {/* Popover informativo en hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full mt-3 max-w-sm bg-white rounded-2xl shadow-2xl shadow-black/10 border border-black/5 p-5 z-30 pointer-events-none"
          >
            <p className="text-sm md:text-base font-light text-[#1d1d1f]/70 leading-relaxed font-sans">
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export function WebDesignServices() {
  const designServices = [
    {
      title: "Dirección de arte",
      description: "Definimos la voz visual de su marca con composiciones que comunican intención en cada detalle.",
    },
    {
      title: "Diseño UX/UI",
      description: "Interfaces claras y funcionales, optimizadas para convertir y deleitar al usuario en cada interacción.",
    },
    {
      title: "Diseño de movimiento",
      description: "Animaciones precisas que dan vida al producto y guían la atención sin distraer.",
    },
    {
      title: "Sistema de diseño",
      description: "Componentes y reglas reutilizables para escalar el producto con consistencia y velocidad.",
    },
    {
      title: "Estrategia de contenido",
      description: "Mensajes con jerarquía y propósito que conectan con su audiencia en cada touchpoint.",
    },
    {
      title: "Pruebas de usabilidad",
      description: "Validamos decisiones con usuarios reales para reducir riesgos antes del lanzamiento.",
    },
  ];

  const developmentServices = [
    {
      title: "Desarrollo Front-end/back-end",
      description: "Stack moderno y arquitectura sólida para productos rápidos, estables y escalables.",
    },
    {
      title: "Sitios web WordPress a medida",
      description: "WordPress optimizado al milímetro, sin plantillas, con la flexibilidad de un desarrollo a medida.",
    },
    {
      title: "E-Commerce personalizado",
      description: "Tiendas en línea diseñadas para vender: UX impecable, performance excepcional y conversión arriba.",
    },
    {
      title: "Desarrollo web creativo",
      description: "Experiencias web con identidad: WebGL, scroll narrativo e interacciones que distinguen su marca.",
    },
    {
      title: "Gamificación",
      description: "Mecánicas de juego que aumentan engagement, retención y lealtad sin sentirse forzadas.",
    },
    {
      title: "SEO",
      description: "Optimización técnica y de contenido para que Google entienda su propuesta y la posicione arriba.",
    },
  ];

  return (
    <section className="bg-[#F5F5F7] text-[#1d1d1f] py-32 md:py-48 lg:py-56 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Services Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 lg:gap-x-48">
          {/* Design Column */}
          <div className="flex flex-col">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl md:text-7xl lg:text-[100px] font-normal tracking-tight mb-16 md:mb-24 text-[#1d1d1f] font-sulphur"
            >
              Diseño
            </motion.h2>
            <div className="relative border-b border-black/10">
              {designServices.map((service, index) => (
                <ServiceItem
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  delay={index * 0.12}
                />
              ))}
            </div>
          </div>

          {/* Development Column */}
          <div className="flex flex-col mt-32 md:mt-0">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="text-6xl md:text-7xl lg:text-[100px] font-normal tracking-tight mb-16 md:mb-24 text-[#1d1d1f] font-sulphur"
            >
              Desarrollo
            </motion.h2>
            <div className="relative border-b border-black/10">
              {developmentServices.map((service, index) => (
                <ServiceItem
                  key={service.title}
                  title={service.title}
                  description={service.description}
                  delay={index * 0.12 + 0.4}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
