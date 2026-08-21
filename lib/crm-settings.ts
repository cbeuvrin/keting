import { crmAdmin } from "@/lib/crm";
import { PROTOTIPO_DEFAULT_COPY, type PrototipoCopy } from "@/lib/email-templates/prototipo-web";
import {
    PERSONAL_DEFAULT_BODY,
    PERSONAL_DEFAULT_SALUDO,
} from "@/lib/email-templates/personal";

export const PROTOTIPO_SETTINGS_KEY = "template:prototipo-web";
export const PERSONAL_SETTINGS_KEY = "template:personal";

export type PersonalCopy = {
    subject: string;
    saludo: string;
    body: string;
    firma: string;
    conLogo: boolean;
};

export const PERSONAL_DEFAULT_COPY: PersonalCopy = {
    subject: "Podemos mejorar tu web",
    saludo: PERSONAL_DEFAULT_SALUDO,
    body: PERSONAL_DEFAULT_BODY,
    firma: "Carlos Beuvrin",
    conLogo: true,
};

/** Lo guardado en el panel mezclado sobre los valores de fábrica. */
export async function loadPersonalCopy(): Promise<PersonalCopy> {
    try {
        const { data } = await crmAdmin()
            .from("crm_settings")
            .select("value")
            .eq("key", PERSONAL_SETTINGS_KEY)
            .maybeSingle();
        return { ...PERSONAL_DEFAULT_COPY, ...((data?.value ?? {}) as Partial<PersonalCopy>) };
    } catch {
        return PERSONAL_DEFAULT_COPY;
    }
}

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
