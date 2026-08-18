import { crmAdmin, type Lead } from "@/lib/crm";
import { Campana } from "./Campana";

export const dynamic = "force-dynamic";

export default async function CampanaPage() {
    const { data } = await crmAdmin()
        .from("crm_leads")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <Campana
            leads={(data as Lead[]) ?? []}
            resendReady={Boolean(process.env.RESEND_KETING_API_KEY && process.env.RESEND_KETING_FROM)}
        />
    );
}
