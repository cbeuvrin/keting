import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ShowcaseHero } from "@/components/layout/showcase-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Showcase - KETING",
    description: "Nuestras soluciones digitales destacadas.",
};

export default function ShowcasePage() {
    return (
        <main className="min-h-screen bg-black">
            <Header className="bg-white/90 backdrop-blur-md py-4 text-[#333333]" initialColor="black" forcedTheme="light" />
            <ShowcaseHero />
            <Footer />
        </main>
    );
}
