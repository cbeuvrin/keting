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
import { useLang } from "@/lib/i18n/lang-context";

const ZoomSection = dynamic(() => import("./ZoomSection"), { ssr: false });
const PortfolioSection = dynamic(() => import("./PortfolioSection"), { ssr: false });
// Antes iba con ssr:false, y por eso los testimonios inventados que había aquí
// no aparecían en ninguna auditoría del HTML aunque el visitante sí los leía.
// Ahora es un import normal: lo que se publica, se puede comprobar.
import { Testimonials } from "@/components/layout/testimonials";

const ClientsShowcase = dynamic(() => import("./ClientsShowcase"), { ssr: false });
const Footer = dynamic(() => import("@/components/layout/footer").then(mod => mod.Footer), { ssr: false });

export default function GravityPage() {
    const { t } = useLang();
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
                items={t.webPage.faq}
                eyebrow={t.webPage.faqEyebrow}
                titleLead={t.webPage.faqTitleLead}
                titleAccent={t.webPage.faqTitleAccent}
            />
            <Footer />
        </motion.main>
    );
}
