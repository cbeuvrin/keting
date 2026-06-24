"use client";

import dynamic from 'next/dynamic';
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GravityHero from "./GravityHero";
import TextSection from "./TextSection"; // SSR: su prosa debe estar en el HTML (SEO)
import { WebDesignServices } from "@/components/layout/web-design-services"; // SSR: lista de servicios crawlable (e-commerce, UX/UI, SEO...)
import { EcommerceSection } from "./EcommerceSection"; // SSR: sección dedicada de e-commerce (caso Rosymar)
import { LandingSection } from "./LandingSection"; // SSR: sección de landing pages (caso Iudex)
import { GravityHeader } from "@/components/gravity/header";
import { FaqSection } from "@/components/seo/faq-section";

const ZoomSection = dynamic(() => import("./ZoomSection"), { ssr: false });
const PortfolioSection = dynamic(() => import("./PortfolioSection"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/layout/testimonials").then(mod => mod.Testimonials), { ssr: false });

const ClientsShowcase = dynamic(() => import("./ClientsShowcase"), { ssr: false });
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer), { ssr: false });

export default function GravityPage() {
    const pageRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: pageRef,
        offset: ["start start", "end end"]
    });

    const backgroundColor = useTransform(
        scrollYProgress,
        [0, 0.2, 0.4], // Adjusted range for smoother transition
        ["#242424", "#242424", "#FAFAFA"]
    );

    return (
        <motion.main
            ref={pageRef}
            style={{ backgroundColor }}
            className="min-h-screen"
        >
            <GravityHeader position="left" />
            <GravityHero />
            <TextSection />
            <ZoomSection />
            <PortfolioSection />
            <EcommerceSection />
            <LandingSection />
            <ClientsShowcase />
            <Testimonials />

            <WebDesignServices />
            <FaqSection
                items={[
                    { q: "¿Cuánto cuesta una página web a medida en México?", a: "En 2026, una landing a medida arranca desde $12,500 MXN y un sitio corporativo con gestor de contenido va de $25,000 a $70,000 MXN. El precio depende del alcance, las integraciones y el nivel de diseño e ingeniería." },
                    { q: "¿Cuánto tarda en desarrollarse?", a: "Una landing puede estar lista en 1 a 2 semanas y un sitio corporativo en 3 a 6 semanas, según el alcance y la rapidez con la que se aprueban contenidos." },
                    { q: "¿Hacen el diseño desde cero o usan plantillas?", a: "Trabajamos a medida, sin plantillas: diseñamos la experiencia (UX/UI) desde cero para que tu marca se diferencie y el sitio convierta mejor." },
                    { q: "¿El sitio incluye SEO?", a: "Sí. Cada proyecto incluye SEO técnico, estructura semántica y optimización de velocidad (Core Web Vitals) para que el sitio realmente atraiga clientes." },
                    { q: "¿Con qué tecnología desarrollan?", a: "Usamos tecnología moderna como Next.js y React, con renderizado en servidor para máxima velocidad, seguridad y posicionamiento." },
                    { q: "¿Desarrollan tiendas en línea (e-commerce)?", a: "Sí. Construimos e-commerce a medida —catálogo, carrito, pagos en línea e inventario— integrado con tu operación. También migramos tiendas existentes a una base más rápida y escalable." },
                    { q: "¿Puedo actualizar el contenido yo mismo?", a: "Sí. Entregamos el sitio con un gestor de contenido (CMS) para que edites textos, imágenes, blog y productos sin depender de un programador." },
                    { q: "¿El sitio funciona bien en celular?", a: "Siempre. Diseñamos mobile-first y optimizamos el rendimiento en móvil (Core Web Vitals), donde ocurre la mayoría del tráfico y las conversiones en México." },
                    { q: "¿Qué incluye después del lanzamiento?", a: "Ofrecemos mantenimiento, monitoreo de rendimiento, respaldos y mejoras continuas desde $2,500 MXN al mes, para que tu sitio siga rápido, seguro y actualizado." },
                    { q: "¿También desarrollan aplicaciones web a medida?", a: "Sí. Más allá de sitios, desarrollamos aplicaciones web y plataformas a medida —paneles, portales y SaaS— con la misma base de ingeniería: Next.js, React y APIs propias." },
                ]}
            />
            <Footer />
        </motion.main>
    );
}
