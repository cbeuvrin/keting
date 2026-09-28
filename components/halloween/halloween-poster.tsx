import Link from "next/link";
import "./halloween.css";
import { HalloweenLogo } from "./halloween-logo";
import { Scene, type Layout } from "./scene";

/**
 * El póster: la primera pantalla de la versión Halloween del home. La escena
 * de monstruos y el texto encima, que deja pasar el mouse hacia los
 * monstruos salvo en los enlaces. La letra (gluten.variable) y el
 * seguimiento de mirada/toques (PosterStage) los pone la página que lo usa.
 *
 * Hay dos composiciones, una apaisada y una vertical, y se elige por la
 * FORMA de la pantalla, no por su ancho: una tablet en vertical mide más de
 * 768 px pero con la composición apaisada recortada vería solo la franja
 * central. Solo se pinta la que corresponde (la otra queda display:none).
 */
export function HalloweenPoster({ desktop, mobile }: { desktop: Layout; mobile: Layout }) {
    return (
        <section className="relative isolate min-h-[100svh] overflow-hidden bg-[#141216] text-[#f3ecd9]">
            <div className="absolute inset-0">
                <Scene layout={desktop} className="hidden h-full w-full [@media(min-aspect-ratio:1/1)]:block" />
                <Scene layout={mobile} className="h-full w-full [@media(min-aspect-ratio:1/1)]:hidden" />
            </div>

            {/* Velo arriba y abajo para que el texto se lea aunque haya un monstruo detrás. */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[#141216]/85 to-transparent md:h-48" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#141216]/80 to-transparent" />

            <div className="pointer-events-none relative z-10 flex min-h-[100svh] flex-col justify-between p-5 md:p-10">
                <header className="flex flex-col gap-3 md:flex-row-reverse md:items-start md:justify-between md:gap-5">
                    <h1 className="font-[family-name:var(--font-gluten)] leading-[0.85] text-[#d8b36a] md:text-right">
                        <span className="block text-[clamp(2.6rem,11vw,7.5rem)] font-bold tracking-tight md:text-[clamp(3.2rem,9vw,7.5rem)]">
                            Software
                        </span>
                        <span className="mt-1 block text-[clamp(1.4rem,3.2vw,2.75rem)] font-medium text-[#f3ecd9]">monstruosamente increíble</span>
                    </h1>

                    {/* En móvil, logo e info van lado a lado para dejar la pantalla a los monstruos. */}
                    <div className="pointer-events-auto relative flex items-center gap-4 font-[family-name:var(--font-gluten)] text-[12px] uppercase leading-relaxed tracking-[0.12em] md:block md:text-[15px]">
                        <Shade className="-inset-x-14 -inset-y-12" />
                        <Link href="/" aria-label="Keting Media, volver al home" className="-ml-1 shrink-0 md:mb-2 md:inline-block">
                            <HalloweenLogo className="h-auto w-[112px] md:w-[190px]" />
                        </Link>
                        <div>
                            <p>Versión Halloween · 2026</p>
                            <p className="hidden md:block">Diseño web · Apps · Software</p>
                            <p className="text-[#d8b36a]">
                                <span className="hidden [@media(hover:hover)]:inline">Pásales el mouse, si te atreves</span>
                                <span className="[@media(hover:hover)]:hidden">Tócalos, si te atreves</span>
                            </p>
                        </div>
                    </div>
                </header>

                {/* pb-20 (móvil) y md:mr-20 dejan libre la burbuja flotante de WhatsApp. */}
                <footer className="pointer-events-auto relative flex flex-wrap items-center gap-x-5 gap-y-6 pb-20 md:mr-20 md:self-end md:pb-2">
                    <Shade className="-inset-x-16 -inset-y-14" />
                    {/* Botones como calcomanías recortadas a mano: esquinas desiguales,
                        sombra dura de color y un poco chuecos. Al pasar el mouse se
                        enderezan y el icono se asusta. */}
                    <Link
                        href="/contacto"
                        className="group relative inline-block w-full max-w-full -rotate-2 sm:w-auto rounded-[1.6rem_1.1rem_1.8rem_1rem] border-2 border-[#1c1a1e] bg-[#f3ecd9] px-6 pb-3.5 pt-3 text-[#141216] shadow-[5px_5px_0_#d8b36a] transition-[rotate,box-shadow,translate] duration-300 hover:rotate-0 hover:-translate-y-0.5 hover:shadow-[7px_8px_0_#d98a4f] motion-reduce:transition-none"
                    >
                        <span className="flex items-center gap-2.5">
                            <PumpkinIcon />
                            <span className="flex min-w-0 flex-col leading-none">
                                <span className="font-[family-name:var(--font-gluten)] text-base font-bold sm:text-lg md:text-xl">
                                    Cotiza sin miedo
                                </span>
                                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#141216]/60">
                                    no mordemos (mucho)
                                </span>
                            </span>
                        </span>
                        {/* Chorreado de cera bajo el botón. */}
                        <svg
                            aria-hidden="true"
                            viewBox="0 0 120 14"
                            className="absolute -bottom-[11px] left-7 h-3.5 w-28"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M0 0 H120 V2 Q116 2 116 7 Q116 12 112 12 Q108 12 108 6 Q108 2 96 2 H62 Q58 2 58 9 Q58 14 54 14 Q50 14 50 8 Q50 2 44 2 H20 Q16 2 16 5 Q16 9 13 9 Q10 9 10 5 Q10 2 0 2 Z"
                                fill="#f3ecd9"
                            />
                        </svg>
                    </Link>
                    <Link
                        href="/"
                        className="group inline-block w-full max-w-full rotate-1 sm:w-auto rounded-[1.1rem_1.7rem_1rem_1.5rem] border-2 border-dashed border-[#f3ecd9]/70 bg-[#141216]/70 px-6 pb-3.5 pt-3 text-[#f3ecd9] backdrop-blur-sm transition-[rotate,border-color,translate] duration-300 hover:rotate-0 hover:-translate-y-0.5 hover:border-[#f3ecd9] motion-reduce:transition-none"
                    >
                        <span className="flex items-center gap-2.5">
                            <GhostIcon />
                            <span className="flex min-w-0 flex-col leading-none">
                                <span className="font-[family-name:var(--font-gluten)] text-base font-bold sm:text-lg md:text-xl">
                                    <span className="sm:hidden">Volver con los vivos</span>
                                    <span className="hidden sm:inline">Volver al mundo de los vivos</span>
                                </span>
                                <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#f3ecd9]/60">
                                    la versión normal
                                </span>
                            </span>
                        </span>
                    </Link>
                </footer>
            </div>
        </section>
    );
}

/**
 * Mancha de negro difuminado detrás de un bloque de texto o de los botones:
 * el póster sigue asomándose por las orillas, pero justo detrás de las letras
 * queda oscuro. Degradado radial y no `blur`, que costaría repintar.
 */
function Shade({ className }: { className: string }) {
    return (
        <span
            aria-hidden="true"
            className={`pointer-events-none absolute -z-10 rounded-[50%] bg-[radial-gradient(closest-side,rgba(20,18,22,0.94),rgba(20,18,22,0.78)_55%,rgba(20,18,22,0)_100%)] ${className}`}
        />
    );
}

const ICON = "h-7 w-7 shrink-0 transition-transform duration-300 motion-reduce:transition-none";

function PumpkinIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 32 32" className={`${ICON} group-hover:-rotate-12 group-hover:scale-110`}>
            <path d="M16 8 Q15 4 18 2" fill="none" stroke="#3f6b4f" strokeWidth="2.4" strokeLinecap="round" />
            <path
                d="M16 8 C8 6 2 11 3 19 C4 27 11 30 16 28 C21 30 28 27 29 19 C30 11 24 6 16 8 Z"
                fill="#d98a4f"
                stroke="#1c1a1e"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <path d="M16 9 C12 13 12 24 16 28 M16 9 C20 13 20 24 16 28" fill="none" stroke="#b0643a" strokeWidth="1.6" />
            {/* Ojos y boca: se iluminan al pasar el mouse. */}
            <path
                d="M9 15 L12 12 L13 16 Z M23 15 L20 12 L19 16 Z M9 20 Q16 26 23 20 L20 21 L18 19 L16 22 L14 19 L12 21 Z"
                className="fill-[#3a1f2a] transition-colors duration-300 group-hover:fill-[#d8b36a]"
            />
        </svg>
    );
}

function GhostIcon() {
    return (
        <svg aria-hidden="true" viewBox="0 0 32 32" className={`${ICON} group-hover:-translate-y-1 group-hover:rotate-6`}>
            <path
                d="M6 28 V14 C6 7 11 3 16 3 C21 3 26 7 26 14 V28 L22.5 25.5 L19 28 L16 25.5 L13 28 L9.5 25.5 Z"
                fill="#ece3cf"
                stroke="#1c1a1e"
                strokeWidth="2"
                strokeLinejoin="round"
            />
            <ellipse cx="12.5" cy="14" rx="2" ry="2.6" fill="#1c1a1e" />
            <ellipse cx="19.5" cy="14" rx="2" ry="2.6" fill="#1c1a1e" />
            {/* Boca: una rayita en reposo, una "O" de susto al pasar el mouse. */}
            <ellipse cx="16" cy="20" rx="1.8" ry="2.4" fill="#3a1f2a" className="opacity-0 transition-opacity group-hover:opacity-100" />
            <path
                d="M14 20 H18"
                stroke="#1c1a1e"
                strokeWidth="1.6"
                strokeLinecap="round"
                className="transition-opacity group-hover:opacity-0"
            />
        </svg>
    );
}
