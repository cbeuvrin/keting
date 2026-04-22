
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wifi, Facebook, Linkedin, Instagram } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [selectedInterest, setSelectedInterest] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

    const interests = ["Diseño Web", "Precio", "Solución digital"];

    const toggleInterest = (interest: string) => {
        if (selectedInterest.includes(interest)) {
            setSelectedInterest(selectedInterest.filter(i => i !== interest));
        } else {
            setSelectedInterest([...selectedInterest, interest]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    interests: selectedInterest,
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

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 pointer-events-none">
                        <div className="flex flex-col md:flex-row gap-4 w-full max-w-7xl max-h-[90vh] pointer-events-auto">

                            {/* Left Side: Form - Opens First */}
                            <motion.div
                                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="flex-1 bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-2xl relative"
                            >
                                <div className="p-8 md:p-12 overflow-y-auto h-full">
                                    <h2 className="text-3xl md:text-4xl font-heading font-medium mb-6">
                                        Conecta con el equipo
                                    </h2>

                                    <div className="border-t border-dashed border-gray-300 my-4 w-full" />

                                    <form className="space-y-4" onSubmit={handleSubmit}>
                                        {/* Interests */}
                                        <div className="space-y-3">
                                            <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">
                                                ¿En qué podemos ayudarte?
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {interests.map((interest) => (
                                                    <button
                                                        key={interest}
                                                        type="button"
                                                        onClick={() => toggleInterest(interest)}
                                                        className={cn(
                                                            "px-4 py-1.5 rounded-full border text-xs transition-all duration-200",
                                                            selectedInterest.includes(interest)
                                                                ? "bg-transparent text-black border-black border-2 font-bold"
                                                                : "bg-white text-gray-500 border-gray-300 hover:border-black hover:text-black"
                                                        )}
                                                    >
                                                        {interest}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Inputs Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">Nombre*</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    placeholder="Tu nombre"
                                                    className="w-full border p-2 rounded-lg text-base focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">Correo electrónico*</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="Correo electrónico"
                                                    className="w-full border p-2 rounded-lg text-base focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">Celular*</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    placeholder="Tu número de celular"
                                                    className="w-full border p-2 rounded-lg text-base focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300"
                                                />
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-900 block uppercase tracking-wider">Mensaje*</label>
                                            <textarea
                                                rows={3}
                                                required
                                                value={formData.message}
                                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                placeholder="Cuéntanos un poco sobre tu proyecto"
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
                                                {status === "idle" && "Enviar Mensaje"}
                                                {status === "sending" && "Enviando..."}
                                                {status === "success" && "¡Enviado!"}
                                                {status === "error" && "Error al enviar"}
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
                                className="w-full md:w-[350px] bg-white rounded-[2rem] p-6 md:p-8 flex flex-col justify-between shadow-2xl relative h-fit"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={onClose}
                                    className="absolute -top-3 -right-3 md:-top-4 md:-right-4 z-50 bg-[#FF4500] hover:bg-[#FF4500]/90 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-transform hover:scale-105 shadow-lg"
                                >
                                    Cerrar <X className="w-4 h-4" />
                                </button>

                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Wifi className="w-5 h-5 rotate-45 text-black" />
                                    </div>

                                    <h3 className="text-xs font-heading font-bold uppercase tracking-widest mb-1">
                                        TRABAJANDO EN MÉXICO
                                    </h3>

                                    <p className="text-gray-500 text-[10px] md:text-xs mb-6 leading-relaxed">
                                        Keting es un equipo altamente capacitado que trabaja con clientes ambiciosos en diversas ubicaciones de México.
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
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Contáctanos directamente</h4>
                                    <div className="space-y-1 mb-4">
                                        <p className="text-xs font-medium">info@ketingmedia.com</p>
                                        <p className="text-xs font-medium">5543830150</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <a href="#" className="p-1.5 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                                            <Facebook className="w-3.5 h-3.5" />
                                        </a>
                                        <a href="#" className="p-1.5 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
                                            <Linkedin className="w-3.5 h-3.5" />
                                        </a>
                                        <a href="#" className="p-1.5 bg-gray-100 rounded-full hover:bg-black hover:text-white transition-all">
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
}
