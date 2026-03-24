"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, ArrowUpRight, Box, Layers } from "lucide-react";
import { PricingProduct, PricingOption } from "./data";
import { cn } from "@/lib/utils";

interface PricingImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: PricingProduct;
}

export function PricingImageModal({ isOpen, onClose, product }: PricingImageModalProps) {
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0);
    const [is3D, setIs3D] = useState(false);

    const currentOption = product.options[selectedOptionIndex];
    // Some products might not have 3D price or it might be "Bajo Cotización"
    // Handle potential undefined if index changes when product changes (though product is stable here per modal instance usually)
    const safeOption = currentOption || product.options[0];
    const currentPrice = is3D ? safeOption.price3D : safeOption.price2D;

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
                        className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-[#111111] w-full max-w-5xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row pointer-events-auto border border-white/10"
                        >
                            {/* Image and Header Container (Mobile: Top, Desktop: Left) */}
                            <div className="flex-1 relative flex flex-col bg-black/50">
                                {/* Header (Mobile only - hidden on desktop if desired, or keep for consistency) */}
                                <div className="flex items-center justify-between p-6 border-b border-white/10 md:hidden">
                                    <h3 className="text-xl font-heading font-medium text-white uppercase tracking-wider">
                                        {product.type}
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Image */}
                                <div className="flex-1 p-8 flex items-center justify-center overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.type}
                                        className="max-w-full max-h-[40vh] md:max-h-[60vh] object-contain shadow-2xl rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Controls and Info Sidebar (Desktop: Right) */}
                            <div className="w-full md:w-[400px] bg-[#111111] border-l border-white/10 flex flex-col h-full overflow-y-auto">
                                {/* Desktop Header */}
                                <div className="hidden md:flex items-center justify-between p-6 border-b border-white/10">
                                    <h3 className="text-2xl font-heading font-bold text-white uppercase tracking-wider">
                                        {product.type}
                                    </h3>
                                    <button
                                        onClick={onClose}
                                        className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-8 flex-1">
                                    {/* Scale / Volume Selector */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                                            Escala / Volumen
                                        </label>
                                        {product.options.length > 1 ? (
                                            <div className="relative">
                                                <select
                                                    value={selectedOptionIndex}
                                                    onChange={(e) => setSelectedOptionIndex(Number(e.target.value))}
                                                    className="w-full appearance-none bg-white/5 text-white text-sm px-4 py-3 rounded-xl border border-white/10 outline-none focus:border-white transition-colors cursor-pointer"
                                                >
                                                    {product.options.map((option, idx) => (
                                                        <option key={idx} value={idx} className="bg-[#111111] text-white">
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                    <ArrowUpRight className="w-4 h-4 text-zinc-500 rotate-90" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full bg-white/5 text-white text-sm px-4 py-3 rounded-xl border border-white/10">
                                                {safeOption.label}
                                            </div>
                                        )}
                                    </div>

                                    {/* 2D / 3D Toggle */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                                            Estilo
                                        </label>
                                        <div className="bg-white/5 rounded-xl p-1 border border-white/10 flex relative">
                                            <button
                                                onClick={() => setIs3D(false)}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-300 relative z-10",
                                                    !is3D ? "text-black bg-white shadow-md" : "text-zinc-400 hover:text-white"
                                                )}
                                            >
                                                <Box className="w-3 h-3" />
                                                <span>2D</span>
                                            </button>
                                            <button
                                                onClick={() => setIs3D(true)}
                                                className={cn(
                                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-300 relative z-10",
                                                    is3D ? "text-black bg-white shadow-md" : "text-zinc-400 hover:text-white"
                                                )}
                                            >
                                                <Layers className="w-3 h-3" />
                                                <span>3D</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price Display */}
                                    <div className="pt-6 border-t border-white/10">
                                        <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Precio Estimado</p>
                                        <p className="text-4xl font-heading font-bold text-white tracking-tight">
                                            {currentPrice}
                                        </p>
                                        <p className="text-xs text-zinc-500 mt-2">
                                            {is3D && currentPrice === "Bajo Cotización"
                                                ? "Contacta para un presupuesto a medida."
                                                : `${product.type} - ${safeOption.label} (${is3D ? '3D' : '2D'})`
                                            }
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="p-6 border-t border-white/10 bg-[#111111] space-y-3">
                                    <button
                                        onClick={() => {
                                            console.log("View examples clicked");
                                        }}
                                        className="w-full px-6 py-4 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <span>Ver Ejemplos</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            console.log("Proceed clicked");
                                        }}
                                        className="w-full px-6 py-4 bg-white text-black rounded-xl font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
                                    >
                                        Seleccionar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
