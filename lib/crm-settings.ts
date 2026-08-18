import { crmAdmin } from "@/lib/crm";
import { PROTOTIPO_DEFAULT_COPY, type PrototipoCopy } from "@/lib/email-templates/prototipo-web";

export const PROTOTIPO_SETTINGS_KEY = "template:prototipo-web";

/**
 * Textos de la plantilla: lo guardado en el panel mezclado sobre los defaults.
 * Si la tabla crm_settings aún no existe (falta el SQL fase 3) o algo falla,
 * devuelve los defaults — el envío nunca se cae por esto.
 */
export async function loadPrototipoCopy(): Promise<PrototipoCopy> {
    try {
        const { data } = await crmAdmin()
            .from("crm_settings")
            .select("value")
            .eq("key", PROTOTIPO_SETTINGS_KEY)
            .maybeSingle();
        const saved = (data?.value ?? {}) as Partial<PrototipoCopy>;
        return { ...PROTOTIPO_DEFAULT_COPY, ...saved };
    } catch {
        return PROTOTIPO_DEFAULT_COPY;
    }
}
