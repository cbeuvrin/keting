import { crmAdmin } from "@/lib/crm";
import { loadNetworkingCopy } from "@/lib/crm-settings";
import { Networking } from "./Networking";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Networking",
    // iOS no lee el manifest: para que «Añadir a inicio» abra sin barra de
    // navegador hacen falta estas dos etiquetas suyas.
    appleWebApp: { capable: true, title: "CRM", statusBarStyle: "default" as const },
    icons: { apple: "/crm-icon-192.png" },
};

export default async function NetworkingPage() {
    const db = crmAdmin();
    const { data } = await db
        .from("crm_leads")
        .select("id, name, email, phone, company, list_name, created_at")
        .eq("source", "networking")
        .order("created_at", { ascending: false })
        .limit(15);

    const ids = (data ?? []).map((l) => l.id);
    const conCorreo = new Set<string>();
    if (ids.length) {
        const { data: mails } = await db.from("crm_emails").select("lead_id").in("lead_id", ids);
        for (const m of mails ?? []) conCorreo.add(m.lead_id as string);
    }

    const copy = await loadNetworkingCopy();

    return (
        <Networking
            copy={copy}
            recientes={(data ?? []).map((l) => ({ ...l, enviado: conCorreo.has(l.id) }))}
            resendReady={Boolean(process.env.RESEND_KETING_API_KEY && process.env.RESEND_KETING_FROM)}
        />
    );
}
