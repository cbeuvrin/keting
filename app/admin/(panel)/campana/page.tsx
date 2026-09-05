import { selectAll, type Lead } from "@/lib/crm";
import { Campana } from "./Campana";
import { loadPrototipoCopy, loadAllPersonalCopies } from "@/lib/crm-settings";

export const dynamic = "force-dynamic";

export default async function CampanaPage() {
    const data = await selectAll<Lead>("crm_leads", "*", { campo: "created_at", ascendente: false });

    const [copy, personales] = await Promise.all([loadPrototipoCopy(), loadAllPersonalCopies()]);
    const emailed: Record<string, string> = {};
    {
        const mails = await selectAll<{ lead_id: string; created_at: string }>(
            "crm_emails", "lead_id, created_at", { campo: "created_at", ascendente: false }
        );
        for (const m of mails) {
            if (!(m.lead_id in emailed)) emailed[m.lead_id] = m.created_at;
        }
    }
    return (
        <Campana
            leads={data}
            emailed={emailed}
            templateSubject={copy.subject}
            personales={personales}
            resendReady={Boolean(process.env.RESEND_KETING_API_KEY && process.env.RESEND_KETING_FROM)}
        />
    );
}
