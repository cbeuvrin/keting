"use client";

import { useState } from "react";
import { MessageSquare, Mail, X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function WhatsAppButton() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-center gap-4">
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* WhatsApp Option */}
                        <motion.a
                            href="https://wa.me/525543830150" // Updated with current phone
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:brightness-110"
                        >
                            <MessageCircle className="w-6 h-6 fill-current" />
                        </motion.a>

                        {/* Email Option */}
                        <motion.a
                            href="mailto:info@ketingmedia.com" // Updated with current email
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="flex items-center justify-center w-12 h-12 bg-gray-100 text-[#333333] rounded-full shadow-lg hover:bg-gray-200"
                        >
                            <Mail className="w-6 h-6" />
                        </motion.a>
                    </>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <motion.button
                onClick={toggleMenu}
                className="flex items-center justify-center w-14 h-14 bg-black text-white rounded-full shadow-2xl hover:scale-105 transition-transform"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ rotate: 45 }}
                whileTap={{ scale: 0.9 }}
                transition={{ rotate: { duration: 0.3 } }}
            >
                <div className="relative">
                    <AnimatePresence mode="wait">
                        {isOpen ? (
                            <motion.div
                                key="close"
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <X className="w-6 h-6" />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="chat"
                                initial={{ rotate: 90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: -90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <MessageSquare className="w-6 h-6" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.button>
        </div>
    );
}
