import { notFound } from "next/navigation";
import Link from "next/link";
import { crmAdmin, type Lead, type LeadEmail, type LeadNote } from "@/lib/crm";
import { LeadActions } from "./LeadActions";

export const dynamic = "force-dynamic";

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const db = crmAdmin();

    const [{ data: lead }, { data: notes }, { data: emails }] = await Promise.all([
        db.from("crm_leads").select("*").eq("id", id).maybeSingle(),
        db.from("crm_notes").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
        db.from("crm_emails").select("*").eq("lead_id", id).order("created_at", { ascending: false }),
    ]);
    if (!lead) notFound();

    return (
        <main className="max-w-5xl mx-auto px-6 py-10">
            <Link href="/admin" className="text-sm text-[#1d1d1f]/50 hover:text-[#1d1d1f]">← Tablero</Link>
            <LeadActions
                lead={lead as Lead}
                notes={(notes as LeadNote[]) ?? []}
                emails={(emails as LeadEmail[]) ?? []}
                smtpReady={Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)}
            />
        </main>
    );
}
