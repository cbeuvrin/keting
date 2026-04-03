"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Youtube, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Header } from "@/components/layout/header";

export default function AdminBlogPage() {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<null | 'success' | 'error'>(null);
    const [message, setMessage] = useState("");

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic || loading) return;

        setLoading(true);
        setStatus(null);
        setMessage("Keting AI está analizando el tema y generando contenido premium...");

        try {
            // Usamos el endpoint API que ya tenemos (ajustado para recibir un topic específico si queremos, o simplemente correr el cron)
            // Para propósitos de este dashboard, vamos a llamar a un endpoint manual que pasaremos el topic
            const res = await fetch("/api/blog/manual-generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(`¡Éxito! El artículo "${data.title}" ha sido publicado.`);
                setTopic("");
            } else {
                setStatus('error');
                setMessage(data.error || "Algo salió mal.");
            }
        } catch (err) {
            setStatus('error');
            setMessage("Error de conexión con el servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-black text-white font-heading overflow-hidden relative">
            <Header />
            
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <motion.div 
                    animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-500/20 blur-[120px] rounded-full"
                />
                <motion.div 
                    animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.2, 0.4, 0.2],
                        rotate: [0, -90, 0]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-500/10 blur-[120px] rounded-full"
                />
            </div>

            <div className="container mx-auto px-6 pt-40 pb-20 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold tracking-[2px] uppercase mb-6 text-zinc-400">
                        <Sparkles size={14} className="text-blue-400" />
                        AI Editorial Dashboard
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-none">
                        Genera artículos <br />
                        <span className="italic font-light text-zinc-500 text-4xl md:text-6xl">ultra-premium</span>
                    </h1>
                    <p className="text-zinc-400 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                        Introduce un tema y deja que nuestra IA genere contenido experto de +2500 palabras, busque una imagen destacada y un video de YouTube relevante.
                    </p>
                </motion.div>

                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onSubmit={handleGenerate}
                    className="p-8 md:p-12 bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-3xl rounded-[3rem] shadow-2xl relative overflow-hidden group"
                >
                    <div className="space-y-8 relative z-10">
                        <div>
                            <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">Tema o Palabra Clave</label>
                            <input 
                                type="text" 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Ej: Las tendencias de IA en el diseño de lujo 2025..."
                                className="w-full bg-black/50 border border-zinc-800 rounded-2xl p-6 text-xl md:text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-700"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-black/30 border border-zinc-800 rounded-2xl">
                                <Sparkles size={20} className="text-blue-400" />
                                <span className="text-sm text-zinc-400 font-medium">Contenido Expert</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-black/30 border border-zinc-800 rounded-2xl">
                                <ImageIcon size={20} className="text-purple-400" />
                                <span className="text-sm text-zinc-400 font-medium">Imagen Premium</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-black/30 border border-zinc-800 rounded-2xl">
                                <Youtube size={20} className="text-red-500" />
                                <span className="text-sm text-zinc-400 font-medium">YouTube Video</span>
                            </div>
                        </div>

                        <button 
                            disabled={loading}
                            className="w-full relative group overflow-hidden py-6 rounded-2xl bg-white text-black font-bold text-xl transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
                        >
                            <div className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        Generando...
                                    </>
                                ) : (
                                    <>
                                        Generar Artículo <Send size={20} />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>

                    {/* Progress feedback */}
                    <AnimatePresence>
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`mt-8 p-6 rounded-2xl flex items-start gap-4 ${
                                    status === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 
                                    'bg-red-500/10 border border-red-500/20 text-red-400'
                                }`}
                            >
                                {status === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                                <div>
                                    <p className="font-bold">{status === 'success' ? "¡Hecho!" : "Error"}</p>
                                    <p className="text-sm opacity-80">{message}</p>
                                </div>
                            </motion.div>
                        )}
                        {!status && loading && (
                             <motion.div
                             initial={{ opacity: 0, height: 0 }}
                             animate={{ opacity: 1, height: "auto" }}
                             className="mt-8 p-6 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center gap-4 text-blue-400"
                         >
                             <Loader2 size={24} className="animate-spin" />
                             <p className="text-sm font-medium">{message}</p>
                         </motion.div>
                        )}
                    </AnimatePresence>
                </motion.form>
            </div>
        </main>
    );
}
