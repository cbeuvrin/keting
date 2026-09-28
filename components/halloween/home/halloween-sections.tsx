"use client";

import dynamic from "next/dynamic";
import { HwServices } from "./services";
import { HwDigitalSolutions } from "./digital-solutions";
import { HwAutomationHome } from "./automation-home";
import { HwEventsHome } from "./events-home";
import { HwToogo } from "./toogo";
import { HwTestimonials } from "./testimonials";
import { HwAboutUs } from "./about-us";
import { HwFooter } from "./footer";

// El resto del home, en el mismo orden que components/layout/home-shell.tsx,
// cada sección en su versión Halloween. Igual que en el home, el carrusel del
// blog y el muro de marcas se cargan diferidos: van al final y no aportan nada
// al primer pintado.
const HwBlogCarousel = dynamic(() => import("./blog-carousel").then((m) => m.HwBlogCarousel), { ssr: false });
const HwBrandsConstellation = dynamic(() => import("./brands-constellation").then((m) => m.HwBrandsConstellation), { ssr: false });

export function HalloweenSections() {
    return (
        <>
            <HwServices />
            <HwDigitalSolutions />
            <HwAutomationHome />
            <HwEventsHome />
            <HwToogo />
            <HwTestimonials />
            <HwAboutUs />
            <HwBlogCarousel />
            <HwBrandsConstellation />
            <HwFooter />
        </>
    );
}
