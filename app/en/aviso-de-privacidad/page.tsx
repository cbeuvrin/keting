"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyNoticeEN() {
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
                        PRIVACY NOTICE <span className="italic font-light">COMPREHENSIVE</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-light mb-6 tracking-wide">
                        Last updated: March 24, 2026
                    </p>

                    <p className="text-sm text-gray-400 font-light mb-12 border-l-2 border-gray-300 pl-4 max-w-2xl">
                        This English version is a translation provided for convenience. The legally binding version is the Spanish one, available at{" "}
                        <Link href="/aviso-de-privacidad" className="underline hover:text-gray-600">
                            /aviso-de-privacidad
                        </Link>
                        .
                    </p>

                    <div className="space-y-12 text-lg leading-relaxed font-light text-gray-700">
                        <section>
                            <p>
                                <span className="font-bold text-black">Keting Media, S.A. de C.V.</span> (hereinafter, “THE DATA CONTROLLER”), with domicile at Ave. Álvaro Obregón 179, Int. 10, Colonia Roma Norte, Alcaldía Cuauhtémoc, CDMX, C.P. 06700, is responsible for the use and protection of the Personal Data it collects for the provision of web design, digital solutions, and application development services, in compliance with the Federal Law on Protection of Personal Data Held by Private Parties (Ley Federal de Protección de Datos Personales en Posesión de los Particulares, “LFPDPPP”).
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">1) Purposes of processing</h2>
                            <p>The personal data we collect will be used for the following purposes:</p>

                            <div className="space-y-4 ml-4">
                                <div>
                                    <h3 className="font-bold text-black uppercase text-xs tracking-widest mb-2">Primary:</h3>
                                    <ul className="list-disc ml-6 space-y-2">
                                        <li>Providing web design, software development, application, and digital solution services.</li>
                                        <li>Project management, domain registration, and administration of hosting or email services.</li>
                                        <li>Billing, collections, and administrative management of contracts.</li>
                                        <li>Providing technical support and personalized attention and follow-up to clients.</li>
                                        <li>Complying with legal and contractual obligations arising from the commercial relationship.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="font-bold text-black uppercase text-xs tracking-widest mb-2">Secondary:</h3>
                                    <ul className="list-disc ml-6 space-y-2">
                                        <li>Sending commercial proposals, promotions, or newsletters about new technologies.</li>
                                        <li>Communicating service updates, server maintenance, or improvements to digital tools.</li>
                                        <li>Conducting quality surveys about delivered projects.</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="italic text-sm text-gray-500 mt-4">
                                The Data Subject may object to the secondary purposes by sending an email to <a href="mailto:e.arcaya@ketingmedia.com" className="text-black border-b border-black">e.arcaya@ketingmedia.com</a>.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">2) Personal data collected</h2>
                            <p>
                                For the purposes described above, we will collect: full name or company name, email address, phone number, tax domicile, RFC (Mexican tax ID), contact details of legal representatives, technical information for access to servers/platforms (when necessary for the service), and financial data for payments.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">3) ARCO rights</h2>
                            <p>
                                The Data Subject may exercise their rights of access, rectification, cancellation, and objection (known in Mexico as “derechos ARCO”), as well as revoke their consent, by submitting a request to: <a href="mailto:e.arcaya@ketingmedia.com" className="text-black border-b border-black">e.arcaya@ketingmedia.com</a>.
                            </p>
                            <p>The request must include:</p>
                            <ul className="list-disc ml-10 space-y-2">
                                <li>Full name and identification document.</li>
                                <li>A precise description of the personal data over which the right is to be exercised.</li>
                                <li>Specification of the right the person wishes to exercise.</li>
                                <li>A means of communication for notifications.</li>
                            </ul>
                            <p>
                                The responsible area will attend to requests within the timeframes established by the LFPDPPP (20 days to respond and an additional 15 days to execute, extendable once).
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">4) Area responsible for personal data</h2>
                            <p>
                                The area responsible for attending to requests related to the processing of personal data is the “Personal Data Area” of Keting Media, S.A. de C.V., contact: <a href="mailto:e.arcaya@ketingmedia.com" className="text-black border-b border-black">e.arcaya@ketingmedia.com</a>.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">5) Revocation of consent</h2>
                            <p>
                                The Data Subject may revoke their consent for the use of their personal data by sending a request to the email address indicated above, stating name, identification document, reason for revocation, and means of response.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">6) Transfer of personal data</h2>
                            <p>
                                No personal data will be transferred to third parties, except for those necessary for the provision of the service (such as domain providers or SSL certificates) or those legally required by competent authorities.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">7) Use of cookies and similar technologies</h2>
                            <p>
                                Our website uses cookies to improve the user experience and optimize the functioning of our digital tools. Users may disable cookies through their browser settings.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">8) Changes to this Privacy Notice</h2>
                            <p>
                                Keting Media, S.A. de C.V. may modify this Privacy Notice in response to legal, internal, or technological changes. Updated versions will be available on our official website.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">9) Competent authority</h2>
                            <p>
                                If the Data Subject believes their right to the protection of personal data has been violated, they may file a complaint with the Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales (INAI, Mexico's national transparency and data protection institute), or before the competent authority on personal data protection matters that may replace it under applicable law.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
