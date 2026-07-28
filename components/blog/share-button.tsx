"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";
import { useLang } from "@/lib/i18n/lang-context";

/**
 * Botón de compartir: usa la Web Share API nativa (hoja de compartir en móvil)
 * y, si no está disponible (escritorio), copia el enlace al portapapeles y
 * muestra confirmación temporal.
 */
export function ShareButton({ title }: { title?: string }) {
    const { t } = useLang();
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = typeof window !== "undefined" ? window.location.href : "";

        if (navigator.share) {
            try {
                await navigator.share({ title: title ?? document.title, url });
                return;
            } catch {
                // El usuario canceló la hoja de compartir: no hacemos nada.
                return;
            }
        }

        // Fallback escritorio: copiar al portapapeles.
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Si no hay permiso de portapapeles, abrimos prompt como último recurso.
            window.prompt("Copia el enlace:", url);
        }
    };

    return (
        <button
            onClick={handleShare}
            aria-label={t.blogArticle.shareAriaLabel}
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all text-sm font-medium"
        >
            {copied ? (
                <>
                    <Check size={16} /> {t.blogArticle.shareCopied}
                </>
            ) : (
                <>
                    <Share2 size={16} /> {t.blogArticle.shareLabel}
                </>
            )}
        </button>
    );
}
