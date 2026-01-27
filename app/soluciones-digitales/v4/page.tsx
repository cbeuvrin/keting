import { cn } from "@/lib/utils";

export default function SolucionesDigitalesV4() {
    return (
        <div className="min-h-screen w-full bg-black text-white relative overflow-hidden font-sans selection:bg-orange-500/30" style={{ backgroundColor: "#000000" }}>
            {/* Navigation Placeholder */}
            <nav className="fixed top-0 right-0 p-8 z-50 flex gap-8 text-sm font-medium tracking-wide text-gray-400 mix-blend-difference">
                <a href="#" className="hover:text-white transition-colors">Works</a>
                <a href="#" className="hover:text-white transition-colors">About</a>
                <a href="#" className="hover:text-white transition-colors">Contacts</a>
            </nav>

            {/* Grid Background Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none opacity-20" />

            {/* Main Content */}
            <div className="flex flex-col justify-center min-h-screen px-6 md:px-24 pt-20 relative z-10 w-full">

                {/* Floating Number 01 */}
                <div className="absolute top-[25%] left-6 md:left-[15%] font-serif italic text-4xl md:text-5xl text-white/90">
                    01
                </div>

                {/* Main Title Group */}
                <div className="flex flex-col justify-center h-full mt-20 md:mt-0 md:ml-[25%] w-fit">
                    <h1 className="flex flex-col text-6xl md:text-[8vw] leading-none tracking-tight font-light !text-white text-left max-w-4xl gap-1 uppercase">
                        <span className="block">Experiencias</span>
                        <span className="block"><span className="font-bold italic">digitales</span> únicas</span>
                        <span className="block">e innovadoras</span>
                    </h1>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-8 md:left-12 flex items-center gap-4 text-xs font-semibold tracking-[0.2em] uppercase text-gray-500">
                    <span>Scroll</span>
                </div>


            </div>
        </div>
    );
}
