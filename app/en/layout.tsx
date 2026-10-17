import { RootDocument } from "@/components/layout/root-document";
import { enRootMetadata } from "@/lib/seo/site";

// Raíz de las páginas en inglés: con ella el HTML del servidor sale con
// lang="en-US". Ver lib/seo/site.ts para por qué el sitio tiene varias raíces.
export const metadata = enRootMetadata;

export default function EnLayout({ children }: { children: React.ReactNode }) {
    return <RootDocument lang="en">{children}</RootDocument>;
}
