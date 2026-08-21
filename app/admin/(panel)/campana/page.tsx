import { crmAdmin, type Lead } from "@/lib/crm";
import { Campana } from "./Campana";
import { loadPrototipoCopy, loadAllPersonalCopies } from "@/lib/crm-settings";

export const dynamic = "force-dynamic";

export default async function CampanaPage() {
    const { data } = await crmAdmin()
        .from("crm_leads")
        .select("*")
        .order("created_at", { ascending: false });

    const [copy, personales] = await Promise.all([loadPrototipoCopy(), loadAllPersonalCopies()]);
    const emailed: Record<string, string> = {};
    {
        const { data: mails } = await crmAdmin()
            .from("crm_emails")
            .select("lead_id, created_at")
            .order("created_at", { ascending: false });
        for (const m of mails ?? []) {
            if (!(m.lead_id in emailed)) emailed[m.lead_id] = m.created_at;
        }
    }
    return (
        <Campana
            leads={(data as Lead[]) ?? []}
            emailed={emailed}
            templateSubject={copy.subject}
            personales={personales}
            resendReady={Boolean(process.env.RESEND_KETING_API_KEY && process.env.RESEND_KETING_FROM)}
        />
    );
}
