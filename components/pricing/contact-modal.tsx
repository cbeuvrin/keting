
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wifi, Facebook, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { SOCIAL } from "@/lib/social";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useLang } from "@/lib/i18n/lang-context";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Intereses: `id` es el valor estable enviado al backend/email (independiente
// del idioma de la página); `label` es lo que se muestra según el locale.
const INTEREST_IDS = ["web", "price", "digital", "automation"] as const;
type InterestId = (typeof INTEREST_IDS)[number];

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const { t } = useLang();
    const [selectedInterest, setSelectedInterest] = useState<InterestId[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [mounted, setMounted] = useState(false);
    // Honeypot anti-spam: invisible para humanos; los bots tienden a rellenarlo.
    const [company, setCompany] = useState("");
    // Validación: obligar a elegir al menos un servicio.
    const [interestError, setInterestError] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Block body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Valor ESTABLE enviado al backend/email — siempre en español, sin importar
    // el idioma de la página, para no romper el correo interno del equipo.
    const INTEREST_VALUES: Record<InterestId, string> = {
        web: "Diseño Web",
        price: "Precio",
        digital: "Solución digital",
        automation: "Automatización IA",
    };

    // Etiqueta mostrada al usuario según el idioma actual.
    const interests: { id: InterestId; label: string }[] = [
        { id: "web", label: t.contactModal.chipWeb },
        { id: "price", label: t.contactModal.chipPrice },
        { id: "digital", label: t.contactModal.chipDigital },
        { id: "automation", label: t.contactModal.chipAutomation },
    ];

    const toggleInterest = (interest: InterestId) => {
        setInterestError(false);
        if (selectedInterest.includes(interest)) {
            setSelectedInterest(selectedInterest.filter(i => i !== interest));
        } else {
            setSelectedInterest([...selectedInterest, interest]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Obligatorio: al menos un servicio seleccionado.
        if (selectedInterest.length === 0) {
            setInterestError(true);
            return;
        }
        setStatus("sending");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    company, // honeypot
                    interests: selectedInterest.map((id) => INTEREST_VALUES[id]),
                    source: "Modal Precios"
                }),
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", phone: "", message: "" });
                setSelectedInterest([]);
                setTimeout(() => {
                    setStatus("idle");
                    onClose();
                }, 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("error");
        }
    };

    if (!mounted) return null;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(4px)", zIndex: 2147483647 - 1 }}
                    />

                    {/* Modal Container */}
                    <div style={{ position: "fixed", inset: 0, zIndex: 2147483647, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", pointerEvents: "none" }}>
                        <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl max-h-[90vh] pointer-events-auto overflow-y-auto md:overflow-visible">

                            {/* Left Side: Form - Opens First */}
                            <motion.div
                                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="flex-1 bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative"
                            >
                                {/* Mobile Close Button */}
                                <button
                                    onClick={onClose}
                                    aria-label={t.contactModal.close}
                                    className="absolute top-4 right-4 z-50 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white p-2 rounded-full md:hidden shadow-lg transition-transform active:scale-90"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="p-8 md:p-12 overflow-y-auto h-full">
                                    <h2 className="text-3xl md:text-4xl font-heading font-medium mb-6">
                                        {t.contactModal.heading}
                                    </h2>

                                    <div className="border-t border-dashed border-gray-300 my-4 w-full" />

                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        {/* Honeypot anti-spam: oculto a humanos, los bots lo rellenan */}
                                        <input
                                            type="text"
                                            name="company"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            tabIndex={-1}
                                            autoComplete="off"
                                            aria-hidden="true"
                                            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
                                        />
                                        {/* Interests */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">
                                                {t.contactModal.helpLabel}
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {interests.map((interest) => (
                                                    <button
                                                        key={interest.id}
                                                        type="button"
                                                        onClick={() => toggleInterest(interest.id)}
                                                        className={cn(
                                                            "px-4 py-1.5 rounded-full border text-xs transition-all duration-200",
                                                            selectedInterest.includes(interest.id)
                                                                ? "bg-transparent text-black border-black border-2 font-bold"
                                                                : "bg-white text-gray-500 border-gray-300 hover:border-black hover:text-black",
                                                            interestError && "border-red-400"
                                                        )}
                                                    >
                                                        {interest.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {interestError && (
                                                <p className="text-xs text-red-600 font-medium">
                                                    {t.contactModal.selectError}
                                                </p>
                                            )}
                                        </div>

                                        {/* Inputs Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">{t.contactModal.nameLabel}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder={t.contactModal.namePlaceholder}
                                                    className="w-full border p-2 rounded-lg text-base focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">{t.contactModal.emailLabel}</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder={t.contactModal.emailPlaceholder}
                                                    className="w-full border p-2 rounded-lg text-base focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">{t.contactModal.phoneLabel}</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder={t.contactModal.phonePlaceholder}
                                                    className="w-full border p-2 rounded-lg text-base focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">{t.contactModal.messageLabel}</label>
                                            <textarea
                                                rows={3}
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder={t.contactModal.messagePlaceholder}
                                                className="w-full border p-2 rounded-lg text-base focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300 resize-none"
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end pt-2">
                                            <button
                                                type="submit"
                                                disabled={status === "sending"}
                                                className={cn(
                                                    "bg-black text-white px-10 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
                                                    status === "success" && "bg-green-600 hover:bg-green-700",
                                                    status === "error" && "bg-red-600 hover:bg-red-700"
                                                )}
                                            >
                                                {status === "idle" && t.contactModal.submitIdle}
                                                {status === "sending" && t.contactModal.submitSending}
                                                {status === "success" && t.contactModal.submitSent}
                                                {status === "error" && t.contactModal.submitError}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>

                            {/* Right Side: Info Panel - Opens Second */}
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                                className="hidden md:flex md:w-[350px] bg-white rounded-[2rem] p-6 md:p-8 flex-col justify-between shadow-2xl relative h-fit"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-50 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"
                                >
                                    {t.contactModal.close} <X className="w-4 h-4" />
                                </button>

                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Wifi className="w-5 h-5 rotate-45 text-black" />
                                    </div>

                                    <h3 className="text-xs font-heading font-bold uppercase tracking-widest mb-1">
                                        {t.contactModal.panelHeading}
                                    </h3>

                                    <p className="text-gray-500 text-[10px] md:text-xs mb-6 leading-relaxed">
                                        {t.contactModal.panelBody}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl">🇲🇽</span>
                                            <div>
                                                <h4 className="font-heading font-bold uppercase text-xs">CDMX</h4>
                                                <p className="text-gray-500 text-[10px] uppercase tracking-wider">México</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-300 border-dashed">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">{t.contactModal.contactDirect}</h4>
                                    <div className="space-y-1 mb-4">
                                        <p className="text-xs font-medium">info@ketingmedia.com</p>
                                        <p className="text-xs font-medium">5543830150</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-1.5 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                                            <Facebook className="w-3.5 h-3.5" />
                                        </a>
                                        <a href={SOCIAL.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="p-1.5 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                                            <Linkedin className="w-3.5 h-3.5" />
                                        </a>
                                        <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-1.5 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                                            <Instagram className="w-3.5 h-3.5" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );

    return createPortal(modalContent, document.body);
}
