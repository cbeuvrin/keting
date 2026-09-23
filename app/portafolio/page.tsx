"use client";

import { GravityHeader } from "@/components/gravity/header";
import { ProjectAccordion } from "./ProjectAccordion";
import { Footer } from "@/components/layout/footer";
import {
    PortafolioHeroV2,
    CaseReDress,
    CaseIvanIvanovich,
    CaseIudex,
    CaseGobernia,
    CaseSmileBetter,
    CaseBarmored,
    CaseToogo,
    CaseSuzuki,
    CaseLosDidis,
    CaseLosDidisAcceso,
    CaseRosymar,
    CaseHapptek,
    PortafolioCierre,
} from "./Sections";

export default function PortafolioPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <GravityHeader />

            <PortafolioHeroV2 />

            <ProjectAccordion>
                <CaseReDress />
                <CaseIudex />
                <CaseSmileBetter />
                <CaseGobernia />
                <CaseHapptek />
                <CaseBarmored />
                <CaseToogo />
                <CaseLosDidis />
                <CaseLosDidisAcceso />
                <CaseSuzuki />
                <CaseRosymar />
                <CaseIvanIvanovich />
            </ProjectAccordion>

            <PortafolioCierre />

            <Footer />
        </main>
    );
}
