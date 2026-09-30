"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/lang-context";
import { enHref } from "@/lib/i18n/routes";
import { cn } from "@/lib/utils";

/** Botón del hero que lleva al póster de Halloween. El fantasmita se asoma al pasar el mouse. */
export function HalloweenLink({ label, className }: { label: string; className?: string }) {
    const { lang } = useLang();
    return (
        // Sin prefetch: el botón está en el hero, así que Next bajaba la página
        // entera de Halloween (~140 KB) en cada visita al home, aunque nadie la abriera.
        <Link
            href={enHref("/halloween", lang === "en")}
            prefetch={false}
            className={cn(
                "group inline-flex items-center gap-2.5 w-fit rounded-2xl border border-black/80 px-6 py-4 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white",
                className,
            )}
        >
            <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
            >
                <path
                    d="M4.5 20.5V11a7.5 7.5 0 0 1 15 0v9.5l-2.5-1.8-2.5 1.8-2.5-1.8-2.5 1.8-2.5-1.8z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
                <circle cx="9.5" cy="11" r="1.3" fill="currentColor" />
                <circle cx="14.5" cy="11" r="1.3" fill="currentColor" />
            </svg>
            {label}
        </Link>
    );
}
