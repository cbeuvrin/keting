import { bad, db, fail, guard, ok, readBody } from "@/lib/clientes-api";
import { planError, planKey, type PaymentPlan } from "@/lib/payment-plan";

export const runtime = "nodejs";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const denied = await guard();
    if (denied) return denied;
    const { id } = await params;
    const input = await readBody(request);
    const client = db();
    const { data: project, error: projectError } = await client.from("cli_projects").select("total").eq("id", id).single();
    if (projectError) return fail(projectError);
    const error = planError(input, Number(project.total));
    if (error) return bad(error);
    const plan: PaymentPlan = { stages: (input.stages as PaymentPlan["stages"]).map((s) => ({ id: s.id, label: s.label.trim(), kind: s.kind, value: s.value, dueOn: s.dueOn })) };
    const { error: saveError } = await client.from("crm_settings").upsert({ key: planKey(id), value: plan, updated_at: new Date().toISOString() });
    if (saveError) return fail(saveError);
    return ok();
}
