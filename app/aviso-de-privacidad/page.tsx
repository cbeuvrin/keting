"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AvisoDePrivacidad() {
    return (
        <main className="min-h-screen bg-[#FAFAFA] text-[#333333]">
            <Header showLogo={true} forcedTheme="light" />
            
            <section className="pt-48 pb-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-black">
                        AVISO DE PRIVACIDAD <span className="italic font-light">INTEGRAL</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-light mb-12 tracking-wide">
                        Última actualización: 24 de marzo de 2026
                    </p>

                    <div className="space-y-12 text-lg leading-relaxed font-light text-gray-700">
                        <section>
                            <p>
                                <span className="font-bold text-black">Keting Media, S.A. de C.V.</span> (en lo sucesivo, “EL RESPONSABLE”), con domicilio en Ave. Álvaro Obregón 179, Int. 10, Colonia Roma Norte, Alcaldía Cuauhtémoc, CDMX, C.P. 06700, es responsable del uso y protección de los Datos Personales que recaba para la prestación de servicios de diseño web, soluciones digitales y desarrollo de aplicaciones, en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP).
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">1) Finalidades del tratamiento</h2>
                            <p>Los datos personales que recabamos se utilizarán para las siguientes finalidades:</p>
                            
                            <div className="space-y-4 ml-4">
                                <div>
                                    <h3 className="font-bold text-black uppercase text-xs tracking-widest mb-2">Primarias:</h3>
                                    <ul className="list-disc ml-6 space-y-2">
                                        <li>Prestación de servicios de diseño web, desarrollo de software, aplicaciones y soluciones digitales.</li>
                                        <li>Gestión de proyectos, registro de dominios y administración de servicios de hosting o correos electrónicos.</li>
                                        <li>Facturación, cobranza y gestión administrativa de contratos.</li>
                                        <li>Brindar soporte técnico, atención y seguimiento personalizado a clientes.</li>
                                        <li>Cumplir con obligaciones legales y contractuales derivadas de la relación comercial.</li>
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 className="font-bold text-black uppercase text-xs tracking-widest mb-2">Secundarias:</h3>
                                    <ul className="list-disc ml-6 space-y-2">
                                        <li>Enviar propuestas comerciales, promociones o boletines informativos sobre nuevas tecnologías.</li>
                                        <li>Comunicar actualizaciones de servicios, mantenimiento de servidores o mejoras en herramientas digitales.</li>
                                        <li>Realizar encuestas de calidad sobre los proyectos entregados.</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="italic text-sm text-gray-500 mt-4">
                                El Titular podrá oponerse a las finalidades secundarias enviando un correo a <a href="mailto:e.arcaya@ketingmedia.com" className="text-black border-b border-black">e.arcaya@ketingmedia.com</a>.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">2) Datos personales que se recaban</h2>
                            <p>
                                Para las finalidades anteriores, recabaremos: Nombre completo o razón social, correo electrónico, teléfono, domicilio fiscal, RFC, datos de contacto de representantes legales, información técnica de acceso a servidores/plataformas (cuando sea necesario para el servicio) y datos financieros para pagos.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">3) Derechos ARCO</h2>
                            <p>
                                El Titular podrá ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO), así como revocar su consentimiento, mediante solicitud enviada a: <a href="mailto:e.arcaya@ketingmedia.com" className="text-black border-b border-black">e.arcaya@ketingmedia.com</a>.
                            </p>
                            <p>La solicitud deberá incluir:</p>
                            <ul className="list-disc ml-10 space-y-2">
                                <li>Nombre completo y documento de identidad.</li>
                                <li>Descripción precisa de los datos personales sobre los cuales se pretende ejercer un derecho.</li>
                                <li>Especificación del derecho que desea ejercer.</li>
                                <li>Medio de comunicación para notificaciones.</li>
                            </ul>
                            <p>
                                El área responsable atenderá las solicitudes dentro de los plazos establecidos en la LFPDPPP (20 días para respuesta y 15 días adicionales para ejecución, prorrogables una sola vez).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">4) Área responsable de datos personales</h2>
                            <p>
                                El área responsable de atender solicitudes relacionadas con el tratamiento de datos personales es el “Área de Datos Personales” de Keting Media, S.A. de C.V., contacto: <a href="mailto:e.arcaya@ketingmedia.com" className="text-black border-b border-black">e.arcaya@ketingmedia.com</a>.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">5) Revocación del consentimiento</h2>
                            <p>
                                El Titular podrá revocar su consentimiento para el uso de sus datos personales enviando solicitud al correo antes indicado, señalando nombre, documento de identidad, motivo de revocación y medio de respuesta.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">6) Transferencias de datos personales</h2>
                            <p>
                                No se realizarán transferencias de datos personales a terceros, salvo aquellas necesarias para la prestación del servicio (como proveedores de dominios o certificados SSL) o las legalmente exigidas por autoridades competentes.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">7) Uso de cookies y tecnologías similares</h2>
                            <p>
                                Nuestro sitio web utiliza cookies para mejorar la experiencia del usuario y optimizar el funcionamiento de nuestras herramientas digitales. El usuario puede desactivar las cookies desde la configuración de su navegador.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">8) Modificaciones al Aviso de Privacidad</h2>
                            <p>
                                Keting Media, S.A. de C.V. podrá modificar el presente Aviso de Privacidad conforme a cambios legales, internos o tecnológicos. Las versiones actualizadas estarán disponibles en nuestro sitio web oficial.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">9) Autoridad competente</h2>
                            <p>
                                Si el Titular considera que su derecho a la protección de datos personales ha sido vulnerado, podrá acudir ante el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI), en <a href="https://www.inai.org.mx" target="_blank" rel="noopener noreferrer" className="text-black border-b border-black">www.inai.org.mx</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
