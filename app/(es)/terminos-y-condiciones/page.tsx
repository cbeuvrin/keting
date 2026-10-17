"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TerminosYCondiciones() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#333333]">
            <Header showLogo={true} forcedTheme="light" />
            
            <section className="pt-48 pb-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-black uppercase">
                        TÉRMINOS Y CONDICIONES <span className="italic font-light">DE SERVICIO</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-light mb-12 tracking-wide">
                        Última actualización: 24 de marzo de 2026
                    </p>

                    <div className="space-y-12 text-lg leading-relaxed font-light text-gray-700">
                        <section>
                            <p>
                                Bienvenido a <span className="font-bold text-black">Keting Media, S.A. de C.V.</span> (en lo sucesivo, “Keting Media”). Al contratar nuestros servicios de diseño web, desarrollo de software, hosting o cualquier solución digital, usted (en lo sucesivo, “el Cliente”) acepta los siguientes Términos y Condiciones:
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">1. Objeto del Servicio</h2>
                            <p>
                                Keting Media se compromete a prestar servicios de consultoría, diseño, desarrollo web y mantenimiento digital según lo estipulado en la propuesta comercial o contrato específico aceptado por el Cliente.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">2. Propiedad Intelectual</h2>
                            
                            <div className="space-y-4">
                                <p>
                                    <span className="font-bold text-black uppercase text-xs tracking-widest block mb-1">De Keting Media:</span>
                                    Todas las herramientas, códigos base, metodologías y diseños propios utilizados para la creación del proyecto son propiedad de Keting Media, salvo que se pacte lo contrario por escrito.
                                </p>
                                
                                <p>
                                    <span className="font-bold text-black uppercase text-xs tracking-widest block mb-1">Del Cliente:</span>
                                    Una vez liquidado el pago total del proyecto, Keting Media cede los derechos de uso y explotación del producto final al Cliente. El Cliente garantiza que cuenta con los derechos de autor de todo el material (imágenes, textos, logotipos) que entregue a Keting Media para el desarrollo del proyecto.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">3. Pagos, Anticipos y Continuidad del Proyecto</h2>
                            <p>Para iniciar cualquier proyecto, se requiere un anticipo del <span className="font-medium text-black">50% (cincuenta por ciento)</span> del total cotizado.</p>
                            
                            <div className="bg-gray-100 p-8 rounded-3xl space-y-4 border border-gray-200">
                                <h3 className="font-bold text-black uppercase text-xs tracking-widest">Cláusula de Continuidad:</h3>
                                <p className="text-gray-600">
                                    Una vez contratado el servicio, el Cliente se compromete a entregar la información, accesos y materiales necesarios para la ejecución del proyecto en un plazo razonable. Si transcurren <span className="font-bold text-black">30 (treinta) días naturales</span> sin que el Cliente envíe la información requerida, Keting Media procederá al cobro del 50% restante del proyecto de manera automática.
                                </p>
                                <p className="text-sm italic">
                                    El pago del saldo pendiente bajo esta circunstancia no cancela la obligación de la agencia; Keting Media mantiene el compromiso de terminar el proyecto una vez que el Cliente entregue la información faltante, sujeto a la disponibilidad de agenda del equipo en ese momento.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">4. Hosting y Dominios</h2>
                            <p>
                                Keting Media actúa como intermediario en la contratación de servicios de terceros (como proveedores de hosting y registradores de dominios). Keting Media no se hace responsable por caídas del servidor, fallas técnicas externas o pérdida de información derivadas del proveedor de infraestructura, aunque brindará el soporte necesario para gestionar la solución.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">5. Garantía de Servicio</h2>
                            <p>
                                Keting Media ofrece una garantía de <span className="font-medium text-black">30/60/90 días naturales</span> posteriores a la entrega final del proyecto para la corrección de errores técnicos o "bugs" que pudieran surgir. Esta garantía no cubre modificaciones estéticas adicionales o cambios en el alcance original del proyecto.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">6. Limitación de Responsabilidad</h2>
                            <p>Keting Media no será responsable por:</p>
                            <ul className="list-disc ml-8 space-y-3">
                                <li>Pérdidas de negocio, lucro cesante o daños indirectos derivados del uso de las herramientas desarrolladas.</li>
                                <li>Contenido ilegal o infracciones de derechos de autor cometidas por el Cliente en su sitio web o app.</li>
                                <li>Ataques cibernéticos o hackeos externos, aunque implementará las mejores prácticas de seguridad vigentes.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">7. Confidencialidad</h2>
                            <p>
                                Ambas partes se obligan a mantener bajo estricta confidencialidad toda la información técnica, comercial o financiera intercambiada durante la prestación del servicio.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">8. Jurisdicción y Ley Aplicable</h2>
                            <p>
                                Para la interpretación y cumplimiento de estos términos, las partes se someten a la legislación vigente en la Ciudad de México y a la jurisdicción de sus tribunales competentes, renunciando a cualquier otro fuero que pudiera corresponderles por razón de su domicilio presente o futuro.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
