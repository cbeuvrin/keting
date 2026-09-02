import { crmAdmin, LEAD_SERVICES, type LeadService } from "@/lib/crm";
import { PROTOTIPO_DEFAULT_COPY, type PrototipoCopy } from "@/lib/email-templates/prototipo-web";
import {
    PERSONAL_DEFAULT_BODY,
    PERSONAL_DEFAULT_SALUDO,
} from "@/lib/email-templates/personal";

export const PROTOTIPO_SETTINGS_KEY = "template:prototipo-web";
export const PERSONAL_SETTINGS_KEY = "template:personal";
export const NETWORKING_SETTINGS_KEY = "template:networking";

/**
 * Clave del texto de un servicio. Sin servicio (o si ese grupo no tiene texto
 * propio) se usa el general: así se puede escribir una versión específica solo
 * para los grupos que la necesiten — a quien busca una app no se le habla de
 * mejorar su web.
 */
export function personalKey(service?: LeadService | null): string {
    return service ? `${PERSONAL_SETTINGS_KEY}:${service}` : PERSONAL_SETTINGS_KEY;
}

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

/** Lo que se manda a quien acabas de conocer: correo + mensaje de WhatsApp. */
export type NetworkingCopy = PersonalCopy & { whatsapp: string };

export const NETWORKING_DEFAULT_COPY: NetworkingCopy = {
    subject: "Un gusto conocerte hoy",
    saludo: "Hola {{nombre}}, un gusto conocerte.",
    body: `Te escribo para dejarte mis datos y que los tengas a la mano.

Soy Carlos Beuvrin, de Keting Media. Diseñamos y programamos páginas web, apps y automatizaciones con IA a la medida — sin plantillas, todo desde cero con React y Next.js.

En ketingmedia.com puedes ver los proyectos que hemos hecho, cada uno con sus números.

Si en algún momento te sirve algo de esto, o simplemente quieres platicarlo, aquí estoy. Mi teléfono está en la firma.

¡Saludos!`,
    firma: "Carlos Beuvrin",
    conLogo: true,
    whatsapp: `Hola {{nombre}}, soy Carlos Beuvrin de Keting Media — un gusto conocerte hoy. Te dejo mi contacto por aquí, y te acabo de mandar un correo con más información. Si en algún momento necesitas web, apps o automatización con IA, aquí estoy: ketingmedia.com`,
};

export async function loadNetworkingCopy(): Promise<NetworkingCopy> {
    try {
        const { data } = await crmAdmin()
            .from("crm_settings")
            .select("value")
            .eq("key", NETWORKING_SETTINGS_KEY)
            .maybeSingle();
        return { ...NETWORKING_DEFAULT_COPY, ...((data?.value ?? {}) as Partial<NetworkingCopy>) };
    } catch {
        return NETWORKING_DEFAULT_COPY;
    }
}

/**
 * Texto para un servicio. Si ese grupo no tiene el suyo, cae al general, y de
 * ahí a los valores de fábrica. Nunca lanza: el envío no se cae por esto.
 */
export async function loadPersonalCopy(service?: LeadService | null): Promise<PersonalCopy> {
    try {
        const db = crmAdmin();
        const claves = service ? [personalKey(service), PERSONAL_SETTINGS_KEY] : [PERSONAL_SETTINGS_KEY];
        const { data } = await db.from("crm_settings").select("key, value").in("key", claves);
        const porClave = new Map((data ?? []).map((r) => [r.key as string, r.value as Partial<PersonalCopy>]));
        const propio = service ? porClave.get(personalKey(service)) : undefined;
        const general = porClave.get(PERSONAL_SETTINGS_KEY);
        return { ...PERSONAL_DEFAULT_COPY, ...(general ?? {}), ...(propio ?? {}) };
    } catch {
        return PERSONAL_DEFAULT_COPY;
    }
}

/** Todos los textos de golpe, para que el panel pueda cambiar de servicio sin ir al servidor. */
export async function loadAllPersonalCopies(): Promise<Record<string, PersonalCopy>> {
    const general = await loadPersonalCopy();
    const out: Record<string, PersonalCopy> = { "": general };
    try {
        const { data } = await crmAdmin()
            .from("crm_settings")
            .select("key, value")
            .in("key", LEAD_SERVICES.map((sv) => personalKey(sv)));
        for (const sv of LEAD_SERVICES) {
            const fila = (data ?? []).find((r) => r.key === personalKey(sv));
            // Sin texto propio, el grupo hereda el general.
            out[sv] = { ...general, ...((fila?.value ?? {}) as Partial<PersonalCopy>) };
        }
    } catch {
        for (const sv of LEAD_SERVICES) out[sv] = general;
    }
    return out;
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
