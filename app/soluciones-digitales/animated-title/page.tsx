import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnimatedTitleHero } from "@/components/layout/animated-title-hero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Soluciones Digitales - Animación - KETING",
    description: "Nuestras soluciones digitales.",
};

export default function AnimatedTitlePage() {
    return (
        <main className="min-h-screen bg-white">
            <Header className="bg-transparent py-4 text-[#333333]" initialColor="black" forcedTheme="light" />
            <AnimatedTitleHero />
            <Footer />
        </main>
    );
}
