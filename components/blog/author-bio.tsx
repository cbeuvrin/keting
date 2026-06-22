import { Linkedin } from "lucide-react";
import { AUTHOR } from "@/lib/author";

// Caja de autor (E-E-A-T): muestra quién escribe, su rol y credenciales.
export function AuthorBio() {
    return (
        <aside className="not-prose mt-16 mb-4 rounded-3xl border border-gray-200 bg-[#FAFAFA] p-6 md:p-8">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={AUTHOR.photo}
                    alt={`${AUTHOR.name} — ${AUTHOR.jobTitle}`}
                    className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                    style={{ objectPosition: "center 5%" }}
                    loading="lazy"
                />
                <div className="flex-1">
                    <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-1">
                        Escrito por
                    </p>
                    <h3 className="text-xl font-bold text-black leading-tight">{AUTHOR.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{AUTHOR.jobTitle} · Keting Media</p>
                    <p className="text-sm text-gray-600 leading-relaxed font-light">{AUTHOR.bio}</p>
                    <a
                        href={AUTHOR.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-black hover:text-gray-600 transition-colors"
                    >
                        <Linkedin className="w-4 h-4" />
                        LinkedIn
                    </a>
                </div>
            </div>
        </aside>
    );
}
