import { RootDocument } from "@/components/layout/root-document";
import { esRootMetadata } from "@/lib/seo/site";

// Raíz de las páginas en español. Es un grupo de rutas: "(es)" no aparece en
// la URL. Ver lib/seo/site.ts para por qué el sitio tiene varias raíces.
export const metadata = esRootMetadata;

export default function EsLayout({ children }: { children: React.ReactNode }) {
    return <RootDocument lang="es">{children}</RootDocument>;
}
