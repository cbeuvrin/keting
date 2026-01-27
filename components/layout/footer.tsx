import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="bg-black text-white border-t border-gray-800">
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
                    <div className="flex flex-col items-end gap-6">
                        {/* Language Switcher */}
                        <div className="flex gap-8 text-white text-base">
                            <span className="cursor-pointer hover:text-gray-300 transition-colors">
                                Spanish
                            </span>
                            <span className="cursor-pointer hover:text-gray-300 transition-colors">
                                English
                            </span>
                        </div>

                        {/* Contact Buttons */}
                        <div className="flex gap-4">
                            <Link
                                href="mailto:info@keting.com"
                                className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                            >
                                Email ⊕
                            </Link>
                            <Link
                                href="tel:5543830151"
                                className="px-6 py-2 bg-white text-black rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
                            >
                                5543830151 ⊕
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
                            <Link href="#" className="hover:text-white transition-colors">Política de Privacidad</Link>
                            <Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
