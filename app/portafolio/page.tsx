"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
    PortafolioHeroV2,
    CaseIvanIvanovich,
    CaseIudex,
    CaseGobernia,
    CaseSmileBetter,
    CaseBarmored,
    CaseToogo,
    CaseRosymar,
    CaseHapptek,
    PortafolioCierre,
} from "./Sections";

export default function PortafolioPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] text-white">
            <Header />

            <PortafolioHeroV2 />

            <CaseIudex />
            <CaseSmileBetter />
            <CaseGobernia />
            <CaseHapptek />
            <CaseBarmored />
            <CaseToogo />
            <CaseRosymar />
            <CaseIvanIvanovich />

            <PortafolioCierre />

            <Footer />
        </main>
    );
}
