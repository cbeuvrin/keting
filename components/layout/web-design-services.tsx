"use client";

import { motion } from "framer-motion";

interface ServiceItemProps {
  title: string;
  delay: number;
}

const ServiceItem = ({ title, delay }: ServiceItemProps) => {
  return (
    <div className="relative py-6 md:py-8 lg:py-10 group cursor-default">
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
    </div>
  );
};

export function WebDesignServices() {
  const designServices = [
    "Dirección de arte",
    "Diseño UX/UI",
    "Diseño de movimiento",
    "Sistema de diseño",
    "Estrategia de contenido",
    "Pruebas de usabilidad",
  ];

  const developmentServices = [
    "Desarrollo Front-end/back-end",
    "Sitios web WordPress a medida",
    "E-Commerce Shopify personalizado",
    "Desarrollo web creativo",
    "Gamificación",
    "SEO",
  ];

  return (
    <section className="bg-[#F5F5F7] text-[#1d1d1f] py-32 md:py-48 lg:py-56 px-6 sm:px-10 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 mb-24 md:mb-40">
          <div className="space-y-8">
             <span className="text-[#d8ff00] text-lg font-bold tracking-tight font-sulphur">
              Keting®
            </span>
            <p className="text-sm md:text-base text-[#1d1d1f]/50 uppercase tracking-[0.2em] font-medium font-sans">
              ES SIMPLE, HACEMOS 2 COSAS.
            </p>
          </div>
          <div className="max-w-xl self-start">
            <p className="text-xl md:text-2xl lg:text-[28px] font-light leading-[1.4] text-[#1d1d1f]/90 font-sans">
              Como agencia digital experta en creación de sitios web, <span className="text-[#1d1d1f] font-bold underline decoration-black/10 underline-offset-8">Keting</span> le ofrece servicios a medida para potenciar su presencia online. Combinamos creatividad, pensamiento estratégico y tecnología para crear soluciones personalizadas que contribuirán a su éxito.
            </p>
          </div>
        </div>

        {/* Services Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 lg:gap-x-48">
          {/* Design Column */}
          <div className="flex flex-col">
            <h2 className="text-6xl md:text-7xl lg:text-[100px] font-bold tracking-tight mb-16 md:mb-24 text-[#1d1d1f] font-sulphur">
              Diseño
            </h2>
            <div className="relative border-b border-black/10">
              {designServices.map((service, index) => (
                <ServiceItem 
                  key={service} 
                  title={service} 
                  delay={index * 0.12} 
                />
              ))}
            </div>
          </div>

          {/* Development Column */}
          <div className="flex flex-col mt-32 md:mt-0">
            <h2 className="text-6xl md:text-7xl lg:text-[100px] font-bold tracking-tight mb-16 md:mb-24 text-[#1d1d1f] font-sulphur">
              Desarrollo
            </h2>
            <div className="relative border-b border-black/10">
              {developmentServices.map((service, index) => (
                <ServiceItem 
                  key={service} 
                  title={service} 
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
