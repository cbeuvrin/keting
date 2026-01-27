import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SolucionesDigitalesV2 } from "@/components/layout/soluciones-digitales-v2";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Soluciones Digitales V2 - KETING",
    description: "Creatividad Digital.",
};

export default function SolucionesDigitalesV2Page() {
    return (
        <main className="min-h-screen bg-white">
            <Header className="bg-transparent py-4 text-[#333333]" initialColor="black" forcedTheme="light" />
            <SolucionesDigitalesV2 />
            <Footer />
        </main>
    );
}
