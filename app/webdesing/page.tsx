"use client";

import dynamic from 'next/dynamic';
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GravityHero from "./GravityHero";
import { GravityHeader } from "@/components/gravity/header";

const ZoomSection = dynamic(() => import("./ZoomSection"), { ssr: false });
const TextSection = dynamic(() => import("./TextSection"), { ssr: false });
const PortfolioSection = dynamic(() => import("./PortfolioSection"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/layout/testimonials").then(mod => mod.Testimonials), { ssr: false });
const WebDesignServices = dynamic(() => import("@/components/layout/web-design-services").then(mod => mod.WebDesignServices), { ssr: false });
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
        ["#000000", "#000000", "#FAFAFA"]
    );

    return (
        <motion.main
            ref={pageRef}
            style={{ backgroundColor }}
            className="min-h-screen overflow-x-hidden"
        >
            <GravityHeader />
            <GravityHero />
            <ZoomSection />
            <TextSection />
            <PortfolioSection />
            <Testimonials />
            <WebDesignServices />
            <Footer />
        </motion.main>
    );
}
