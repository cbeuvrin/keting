import { createClient } from "@supabase/supabase-js";
import { BlogClient } from "./BlogClient";

// Server component: trae los artículos de Supabase EN EL SERVIDOR para que el
// listado completo (títulos + links) vaya en el HTML inicial — crawlable por
// Google y agentes de IA. La interactividad (filtros, animaciones) vive en
// BlogClient. Revalida cada hora (igual que la página de artículo).
export const revalidate = 3600;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function BlogPage() {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Solo las columnas que usan las tarjetas — sin `content` (HTML pesado).
    const { data } = await supabase
        .from("articles")
        .select("id, created_at, slug, title, category, excerpt, author, date, image, color, accent, views, word_count")
        .order("created_at", { ascending: false });

    return <BlogClient initialArticles={data ?? []} />;
}
