
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react"; // Changed icon to ArrowRight for the circle button
import { PricingProduct } from "./data";
import { PricingImageModal } from "./pricing-image-modal";

interface PricingCardProps {
    product: PricingProduct;
    index: number;
}

export function PricingCard({ product, index }: PricingCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Use the pre-calculated starting price from data
    const startingPrice = product.startingPrice;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group cursor-pointer flex flex-col gap-4"
                onClick={() => setIsModalOpen(true)}
            >
                {/* Image Container */}
                <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-[#F5F5F0] p-4 md:p-6">
                    {/* Image */}
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.type}
                            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200" />
                    )}

                    {/* Circular Arrow Button (Bottom Right) */}
                    <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6">
                        <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-full bg-white text-black shadow-lg transition-transform duration-300 group-hover:scale-110 ring-[8px] ring-[#F5F5F0] md:ring-0">
                            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                    </div>
                </div>

                {/* Content Below Image */}
                <div className="flex items-start justify-between px-2">
                    {/* Title */}
                    <div>
                        <h3 className="font-heading text-lg md:text-2xl font-black uppercase leading-none tracking-tight text-black">
                            {product.category}
                        </h3>
                        <p className="mt-1 text-[10px] md:text-xs font-bold uppercase tracking-widest text-zinc-500">
                            {product.type}
                        </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                        <p className="font-heading text-lg md:text-xl font-bold tracking-tight text-black">
                            Desde {startingPrice}
                        </p>
                        <p className="mt-1 text-xs text-zinc-500">
                            {product.options.length} opciones disponibles
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Modal Component */}
            <PricingImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
            />
        </>
    );
}
