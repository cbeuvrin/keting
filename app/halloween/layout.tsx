import { RootDocument } from "@/components/layout/root-document";
import { esRootMetadata } from "@/lib/seo/site";

// /halloween no cuelga de app/(es) para no mover una carpeta en la que se está
// trabajando; necesita su propia raíz en español, idéntica a la de (es).
export const metadata = esRootMetadata;

export default function HalloweenLayout({ children }: { children: React.ReactNode }) {
    return <RootDocument lang="es">{children}</RootDocument>;
}
