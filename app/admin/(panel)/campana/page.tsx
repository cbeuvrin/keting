import { selectAll, type Lead } from "@/lib/crm";
import { Campana } from "./Campana";
import { SeguimientoEditor } from "./SeguimientoEditor";
import { loadPrototipoCopy, loadAllPersonalCopies, loadAllSeguimientoCopies } from "@/lib/crm-settings";

export const dynamic = "force-dynamic";

// Mismo criterio de elegibilidad que el cron (app/api/cron/campana/route.ts):
// abrió el inicial hace SEGUIMIENTO_DIAS o más, nunca recibió ya un
// seguimiento, y el trato no está cerrado a mano. Solo informativo — el envío
// real lo decide el cron, esto es para que Carlos vea cuántos hay antes de
// que salgan.
const SEGUIMIENTO_DIAS = 4;
const ETAPAS_EXCLUIDAS = new Set(["ganado", "perdido"]);

type Correo = { lead_id: string; created_at: string; kind: string | null; opened_at: string | null };

/** Cuántos leads calificarían para el seguimiento ahora mismo, con el mismo
 *  criterio que la segunda pasada del cron. Aparte del componente para que el
 *  lint de pureza no se queje del Date.now() de aquí adentro. */
function contarElegiblesSeguimiento(leads: Lead[], mails: Correo[]): number {
    const inicialAbierto = new Map<string, string>();
    const yaSeguimiento = new Set<string>();
    for (const m of mails) {
        if (m.kind === "seguimiento") yaSeguimiento.add(m.lead_id);
        else if (m.opened_at && !inicialAbierto.has(m.lead_id)) inicialAbierto.set(m.lead_id, m.opened_at);
    }
    const corte = Date.now() - SEGUIMIENTO_DIAS * 24 * 60 * 60 * 1000;
    return leads.filter((l) => {
        if (!l.email || l.unsubscribed || yaSeguimiento.has(l.id) || ETAPAS_EXCLUIDAS.has(l.stage)) return false;
        const abierto = inicialAbierto.get(l.id);
        return Boolean(abierto) && new Date(abierto!).getTime() <= corte;
    }).length;
}

export default async function CampanaPage() {
    const data = await selectAll<Lead>("crm_leads", "*", { campo: "created_at", ascendente: false });

    const [copy, personales, seguimientos] = await Promise.all([
        loadPrototipoCopy(),
        loadAllPersonalCopies(),
        loadAllSeguimientoCopies(),
    ]);
    const mails = await selectAll<Correo>(
        "crm_emails", "lead_id, created_at, kind, opened_at", { campo: "created_at", ascendente: false }
    );
    const emailed: Record<string, string> = {};
    for (const m of mails) {
        if (!(m.lead_id in emailed)) emailed[m.lead_id] = m.created_at;
    }
    const elegiblesSeguimiento = contarElegiblesSeguimiento(data, mails);
    return (
        <>
            <Campana
                leads={data}
                emailed={emailed}
                templateSubject={copy.subject}
                personales={personales}
                resendReady={Boolean(process.env.RESEND_KETING_API_KEY && process.env.RESEND_KETING_FROM)}
            />
            <SeguimientoEditor seguimientos={seguimientos} elegiblesHoy={elegiblesSeguimiento} />
        </>
    );
}
