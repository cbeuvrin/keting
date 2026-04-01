import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-[#242424] text-white border-t border-gray-800">
            {/* Main Footer Content */}
            <div className="container mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Image
                            src="/keting-logo-gray.png"
                            alt="Keting Logo"
                            width={600}
                            height={200}
                            className="w-[300px] md:w-[400px] h-auto"
                        />
                    </div>

                    {/* Right Section: Language & Contact */}
                    <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                        {/* Language Switcher */}
                        <div className="flex gap-6 md:gap-8 text-white text-sm md:text-base">
                            <span className="cursor-pointer hover:text-gray-300 transition-colors">
                                Spanish
                            </span>
                            <span className="cursor-pointer hover:text-gray-300 transition-colors">
                                English
                            </span>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex flex-wrap justify-center md:justify-end gap-4 w-full">
                            <Link
                                href="mailto:info@ketingmedia.com"
                                className="px-6 md:px-8 py-3 bg-white text-black rounded-2xl hover:bg-gray-200 transition-colors flex items-center gap-2 text-xs md:text-sm font-bold"
                            >
                                Email ⊕
                            </Link>
                            <Link
                                href="tel:5543830150"
                                className="px-6 md:px-8 py-3 bg-white text-black rounded-2xl hover:bg-gray-200 transition-colors flex items-center gap-2 text-xs md:text-sm font-bold"
                            >
                                5543830150 ⊕
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Legal Line */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                        <p>&copy; {new Date().getFullYear()} Keting Media. Todos los derechos reservados.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <Link href="/aviso-de-privacidad" className="hover:text-white transition-colors">Aviso de Privacidad</Link>
                            <Link href="/terminos-y-condiciones" className="hover:text-white transition-colors">Términos y Condiciones</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
