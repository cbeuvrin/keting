"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const cards = [
    {
        id: 1,
        type: "stat",
        bg: "bg-[#0088FF]", // Brand Blue
        title: "10M+",
        subtitle: "Organische views",
        desc: "Groei door slimme content",
        rotate: -6,
        zIndex: 1
    },
    {
        id: 2,
        type: "image",
        src: "/gravity-zoom.jpg", // Placeholder
        rotate: 3,
        zIndex: 2
    },
    {
        id: 3,
        type: "stat",
        bg: "bg-[#25D366]", // Brand Green
        title: "30+",
        subtitle: "Merken geholpen",
        desc: "Van start-up tot multinational",
        rotate: -3,
        zIndex: 3
    },
    {
        id: 4,
        type: "image",
        src: "/gravity-zoom.jpg", // Placeholder
        rotate: 6,
        zIndex: 4
    }
];

export default function FloatingCardsSection() {
    return (
        <section className="w-full min-h-[80vh] bg-[#F9F6F0] py-24 flex items-center justify-center overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-center -space-x-0 md:-space-x-12 space-y-8 md:space-y-0 relative">
                {cards.map((card) => (
                    <Card key={card.id} card={card} />
                ))}
            </div>
        </section>
    );
}

function Card({ card }: { card: any }) {
    return (
        <motion.div
            className={cn(
                "relative w-[280px] h-[380px] md:w-[320px] md:h-[420px] rounded-[30px] shadow-xl overflow-hidden cursor-pointer flex-shrink-0 border-[6px] border-white",
                card.type === "stat" ? card.bg : "bg-gray-200"
            )}
            style={{ zIndex: card.zIndex }}
            initial={{ rotate: card.rotate }}
            whileHover={{
                rotate: 0,
                scale: 1.1,
                zIndex: 50,
                transition: { type: "spring", stiffness: 300, damping: 20 }
            }}
            whileTap={{ scale: 0.95 }}
        >
            {card.type === "stat" ? (
                <div className="h-full flex flex-col justify-between p-8 text-black font-sans">
                    <h3 className="text-6xl md:text-7xl font-bold tracking-tighter">{card.title}</h3>
                    <div className="space-y-2">
                        <p className="text-2xl font-bold leading-none">{card.subtitle}</p>
                        <p className="text-sm font-medium opacity-80">{card.desc}</p>
                    </div>
                </div>
            ) : (
                <img
                    src={card.src}
                    alt="Card Image"
                    className="w-full h-full object-cover"
                />
            )}
        </motion.div>
    );
}
