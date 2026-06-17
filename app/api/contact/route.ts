import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Envío vía SMTP (Banahost). Requiere SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_TO.
export const runtime = 'nodejs';

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
        // El formulario del modal exige elegir al menos un servicio (calidad de lead + anti-bot).
        if (source === 'Modal Precios' && (!Array.isArray(interests) || interests.length === 0)) {
            return NextResponse.json(
                { success: false, error: 'Selecciona al menos un servicio.' },
                { status: 400 }
            );
        }

        const interestsList =
            interests && Array.isArray(interests) ? interests.map(escapeHtml).join(', ') : 'N/A';

        // 4. Configurar SMTP (Banahost)
        const host = process.env.SMTP_HOST;
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        const to = process.env.SMTP_TO || user;
        const port = Number(process.env.SMTP_PORT) || 465;

        if (!host || !user || !pass) {
            console.error('Faltan variables SMTP (SMTP_HOST/SMTP_USER/SMTP_PASS).');
            return NextResponse.json(
                { success: false, error: 'Servicio de correo no configurado.' },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // 465 = SSL; 587/25 = STARTTLS
            auth: { user, pass },
            // Fallar rápido si el servidor no responde (no colgar la función).
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });

        // 5. Enviar el correo (todos los campos escapados)
        await transporter.sendMail({
            from: `"Keting Web" <${user}>`, // debe ser una cuenta del dominio autenticada
            to,
            replyTo: email,
            subject: `Nuevo contacto desde la web (${String(source || 'General').slice(0, 120)})`,
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

        return NextResponse.json({ success: true, message: 'Correo enviado con éxito' });
    } catch (error: any) {
        console.error('Error enviando email:', error);
        return NextResponse.json(
            { success: false, error: 'Error al enviar el correo' },
            { status: 500 }
        );
    }
}
