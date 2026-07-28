import Link from "next/link";
import { Linkedin } from "lucide-react";
import { AUTHOR } from "@/lib/author";

// Caja de autor (E-E-A-T): muestra quién escribe, su rol y credenciales.
export function AuthorBio() {
    return (
        <aside className="not-prose mt-16 mb-4 rounded-3xl border border-gray-200 bg-[#FAFAFA] p-6 md:p-8">
            {/* Encabezado: foto circular pequeña + nombre/rol */}
            <div className="flex items-center gap-4 mb-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={AUTHOR.photo}
                    alt={`${AUTHOR.name} — ${AUTHOR.jobTitle}`}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0 ring-1 ring-gray-200"
                    loading="lazy"
                />
                <div className="min-w-0">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-0.5">
                        Escrito por
                    </p>
                    <h3 className="text-lg font-bold text-black leading-tight">{AUTHOR.name}</h3>
                    <p className="text-sm text-gray-500">{AUTHOR.jobTitle} · Keting Media</p>
                </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed font-light">{AUTHOR.bio}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4">
                <a
                    href={AUTHOR.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
                >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                </a>
                <Link
                    href="/nosotros/carlos-beuvrin"
                    className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
                >
                    Ver perfil completo
                </Link>
            </div>
        </aside>
    );
}
