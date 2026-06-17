import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// --- Anti-spam: rate limit en memoria (best-effort) -------------------------
// Nota: en serverless cada instancia tiene su propio mapa, así que esto frena
// ráfagas en una instancia caliente, no es un límite global perfecto. Para un
// límite estricto haría falta un store compartido (Vercel KV / Upstash).
const WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);
    // Limpieza oportunista para que el mapa no crezca sin límite.
    if (hits.size > 5000) {
        for (const [k, v] of hits) {
            if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
        }
    }
    return recent.length > MAX_PER_WINDOW;
}

// Escapa HTML para evitar inyección en el correo que recibe el equipo.
function escapeHtml(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
    try {
        // 1. Rate limit por IP
        const ip =
            request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
            request.headers.get('x-real-ip') ||
            'unknown';
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { success: false, error: 'Demasiados envíos. Intenta de nuevo en unos minutos.' },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { name, email, phone, message, interests, source, company } = body;

        // 2. Honeypot: campo oculto que los humanos nunca llenan. Si viene con
        //    valor, es un bot → respondemos "éxito" sin enviar nada.
        if (typeof company === 'string' && company.trim() !== '') {
            return NextResponse.json({ success: true, message: 'Correo enviado con éxito' });
        }

        // 3. Validación básica
        if (!email || typeof email !== 'string' || !EMAIL_RE.test(email) || email.length > 254) {
            return NextResponse.json(
                { success: false, error: 'Email inválido.' },
                { status: 400 }
            );
        }
        if (typeof message === 'string' && message.length > 5000) {
            return NextResponse.json(
                { success: false, error: 'El mensaje es demasiado largo.' },
                { status: 400 }
            );
        }
        if (typeof name === 'string' && name.length > 200) {
            return NextResponse.json(
                { success: false, error: 'Nombre demasiado largo.' },
                { status: 400 }
            );
        }

        const interestsList =
            interests && Array.isArray(interests) ? interests.map(escapeHtml).join(', ') : 'N/A';

        // Inicializar Resend con la API Key (dentro del handler para evitar errores en build)
        const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

        // 4. Enviar el correo (todos los campos escapados)
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM || 'onboarding@resend.dev',
            to: [process.env.SMTP_TO || 'carlos@keting.media'],
            reply_to: email,
            subject: `Nuevo contacto desde la web (${escapeHtml(source || 'General')})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #000;">Nuevo mensaje de contacto</h2>
                    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
                    <p><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>
                    <p><strong>Intereses:</strong> ${interestsList}</p>
                    <p><strong>Mensaje:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                        ${escapeHtml(message) || 'Sin mensaje'}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">Enviado desde: ${escapeHtml(source || 'Formulario general')}</p>
                </div>
            `,
        });

        if (error) {
            console.error('Error de Resend:', error);
            return NextResponse.json(
                { success: false, error: 'Error en el servicio de correo' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Correo enviado con éxito',
            id: data?.id,
        });
    } catch (error: any) {
        console.error('Error enviando email:', error);
        return NextResponse.json(
            { success: false, error: 'Error al enviar el correo' },
            { status: 500 }
        );
    }
}
