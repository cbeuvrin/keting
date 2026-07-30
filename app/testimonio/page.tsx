import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TestimonioForm } from "./TestimonioForm";

// Página utilitaria: se le pasa el enlace a un cliente para que deje su
// testimonio. NO debe indexarse — no es contenido, y en los buscadores solo
// competiría con las páginas que sí importan.
export const metadata: Metadata = {
    title: { absolute: "Deja tu testimonio · Keting Media" },
    description: "Comparte tu experiencia trabajando con Keting Media.",
    robots: { index: false, follow: false },
};

export default function TestimonioPage() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-black font-heading overflow-hidden">
            <Header />

            <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-20">
                {/* Cuadrícula sutil, como en el resto del sitio */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(0,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.6) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <span className="absolute top-[10%] right-[4%] text-[8rem] md:text-[16rem] text-black/[0.04] select-none font-light leading-none rotate-12 pointer-events-none">
                    *
                </span>

                <div className="max-w-3xl mx-auto relative">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="block w-10 h-px bg-black/40" />
                        <span className="text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-black/50 font-sans">
                            Testimonio
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] mb-8 text-black">
                        Cuéntanos cómo fue{" "}
                        <span className="font-[family-name:var(--font-playfair)] italic font-normal">
                            trabajar juntos
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mb-4">
                        Si el proyecto te sirvió, contarlo en dos minutos nos ayuda más que cualquier
                        anuncio. Lo publicaremos en la página de tu proyecto, con tu nombre.
                    </p>
                    <p className="text-base text-gray-500 font-light leading-relaxed max-w-2xl mb-16">
                        Y si algo no salió como esperabas, dilo también — preferimos saberlo.
                    </p>

                    <TestimonioForm />
                </div>
            </section>

            <Footer />
        </main>
    );
}
