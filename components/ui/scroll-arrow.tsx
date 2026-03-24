"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export function ScrollArrow({ className = "text-white" }: { className?: string }) {
    const handleScrollData = () => {
        window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer z-30 p-2 ${className}`}
            onClick={handleScrollData}
        >
            <ChevronDown className="w-8 h-8 opacity-80 hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
