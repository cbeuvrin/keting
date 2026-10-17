"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsAndConditionsEN() {
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
                        TERMS AND CONDITIONS <span className="italic font-light">OF SERVICE</span>
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base font-light mb-6 tracking-wide">
                        Last updated: March 24, 2026
                    </p>

                    <p className="text-sm text-gray-400 font-light mb-12 border-l-2 border-gray-300 pl-4 max-w-2xl">
                        This English version is a translation provided for convenience. The legally binding version is the Spanish one, available at{" "}
                        <Link href="/terminos-y-condiciones" className="underline hover:text-gray-600">
                            /terminos-y-condiciones
                        </Link>
                        .
                    </p>

                    <div className="space-y-12 text-lg leading-relaxed font-light text-gray-700">
                        <section>
                            <p>
                                Welcome to <span className="font-bold text-black">Keting Media, S.A. de C.V.</span> (hereinafter, “Keting Media”). By engaging our web design, software development, hosting, or any other digital solution services, you (hereinafter, “the Client”) accept the following Terms and Conditions:
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">1. Purpose of the Service</h2>
                            <p>
                                Keting Media agrees to provide consulting, design, web development, and digital maintenance services as set out in the commercial proposal or specific agreement accepted by the Client.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">2. Intellectual Property</h2>

                            <div className="space-y-4">
                                <p>
                                    <span className="font-bold text-black uppercase text-xs tracking-widest block mb-1">Belonging to Keting Media:</span>
                                    All proprietary tools, base code, methodologies, and designs used to create the project are the property of Keting Media, unless otherwise agreed in writing.
                                </p>

                                <p>
                                    <span className="font-bold text-black uppercase text-xs tracking-widest block mb-1">Belonging to the Client:</span>
                                    Once the total project payment has been settled, Keting Media assigns to the Client the rights of use and exploitation of the final product. The Client warrants that it holds the copyright to all material (images, text, logos) delivered to Keting Media for the development of the project.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">3. Payments, Deposits, and Project Continuity</h2>
                            <p>To begin any project, a deposit of <span className="font-medium text-black">50% (fifty percent)</span> of the total quoted amount is required.</p>

                            <div className="bg-gray-100 p-8 rounded-3xl space-y-4 border border-gray-200">
                                <h3 className="font-bold text-black uppercase text-xs tracking-widest">Continuity Clause:</h3>
                                <p className="text-gray-600">
                                    Once the service has been contracted, the Client agrees to deliver the information, access, and materials necessary for the execution of the project within a reasonable time. If <span className="font-bold text-black">30 (thirty) calendar days</span> elapse without the Client submitting the required information, Keting Media will automatically proceed to charge the remaining 50% of the project.
                                </p>
                                <p className="text-sm italic">
                                    Payment of the outstanding balance under this circumstance does not cancel the agency's obligation; Keting Media remains committed to completing the project once the Client delivers the missing information, subject to the team's schedule availability at that time.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">4. Hosting and Domains</h2>
                            <p>
                                Keting Media acts as an intermediary in contracting third-party services (such as hosting providers and domain registrars). Keting Media is not responsible for server outages, external technical failures, or loss of information arising from the infrastructure provider, although it will provide the necessary support to manage a solution.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">5. Service Warranty</h2>
                            <p>
                                Keting Media offers a warranty of <span className="font-medium text-black">30/60/90 calendar days</span> following the final delivery of the project for the correction of technical errors or "bugs" that may arise. This warranty does not cover additional aesthetic modifications or changes to the original scope of the project.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">6. Limitation of Liability</h2>
                            <p>Keting Media shall not be liable for:</p>
                            <ul className="list-disc ml-8 space-y-3">
                                <li>Business losses, loss of profit, or indirect damages arising from the use of the tools developed.</li>
                                <li>Illegal content or copyright infringements committed by the Client on its website or app.</li>
                                <li>Cyberattacks or external hacking, although it will implement current best security practices.</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">7. Confidentiality</h2>
                            <p>
                                Both parties agree to keep under strict confidentiality all technical, commercial, or financial information exchanged during the provision of the service.
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-black border-b border-gray-200 pb-2">8. Jurisdiction and Applicable Law</h2>
                            <p>
                                For the interpretation and fulfillment of these terms, the parties submit to the laws in force in Mexico City and to the jurisdiction of its competent courts, waiving any other venue that might correspond to them by reason of their present or future domicile.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
