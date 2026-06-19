import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CornerButtonProps {
    href: string;
    className?: string;
    iconColor?: string;
    /** En móvil muestra solo la flecha sin el círculo (en desktop conserva el círculo). */
    bareArrowOnMobile?: boolean;
}

export function CornerButton({ href, className, iconColor = "text-black border-black", bareArrowOnMobile = false }: CornerButtonProps) {
    return (
        <Link
            href={href}
            className={cn(
                "absolute bottom-8 right-8 z-30 flex items-center gap-2 group",
                className
            )}
        >
            <span className={cn("font-heading font-normal tracking-[1px] text-lg lowercase", iconColor.includes("white") ? "text-white" : "text-black")}>click</span>
            <div className={cn(
                "bg-transparent transition-transform group-hover:translate-x-1",
                bareArrowOnMobile ? "border-0 p-0 md:border md:rounded-full md:p-2" : "border rounded-full p-2",
                iconColor
            )}>
                <ArrowRight className="w-5 h-5" />
            </div>
        </Link>
    );
}
