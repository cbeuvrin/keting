"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import GravityHero from "./GravityHero";
import { Header } from "@/components/layout/header";
import ZoomSection from "./ZoomSection";
import TextSection from "./TextSection";
import PortfolioSection from "./PortfolioSection";
import { Footer } from "@/components/layout/footer";

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
            <Header initialColor="white" className="text-white mix-blend-difference z-50 pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto" />
            <GravityHero />
            <ZoomSection />
            <TextSection />
            <PortfolioSection />
            <Footer />
        </motion.main>
    );
}
