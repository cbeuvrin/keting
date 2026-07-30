import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Recoge testimonios de clientes para publicarlos en los casos de éxito
// (/casos/*). No se guarda en base de datos a propósito: son pocos, de una sola
// vez, y todos pasan por revisión antes de publicarse — montar tabla, permisos
// y panel para eso sería sobreingeniería. Llega por correo y se pasa a
// `lib/case-studies.ts`.
//
// Envío vía SMTP (Banahost), mismas variables que /api/contact.

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function escapeHtml(str: string): string {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, company, project, testimonial, email, consent, website } = body ?? {};

        // Honeypot: los bots rellenan campos ocultos. Se responde 200 para no
        // darles pistas, pero no se envía nada.
        if (website) return NextResponse.json({ success: true });

        const required = { name, role, company, project, testimonial, email };
        for (const [field, value] of Object.entries(required)) {
            if (!value || String(value).trim().length === 0) {
                return NextResponse.json(
                    { success: false, error: `Falta un campo obligatorio: ${field}.` },
                    { status: 400 }
                );
            }
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
            return NextResponse.json(
                { success: false, error: 'El correo no parece válido.' },
                { status: 400 }
            );
        }

        // Sin consentimiento no se publica: estamos poniendo el nombre, el cargo
        // y la empresa de una persona real en una web pública.
        if (consent !== true) {
            return NextResponse.json(
                { success: false, error: 'Necesitamos tu autorización para publicar el testimonio.' },
                { status: 400 }
            );
        }

        if (String(testimonial).trim().length < 40) {
            return NextResponse.json(
                { success: false, error: 'El testimonio es muy corto: cuéntanos un poco más.' },
                { status: 400 }
            );
        }

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
            secure: port === 465,
            auth: { user, pass },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });

        await transporter.sendMail({
            from: `"Keting Web" <${user}>`,
            to,
            replyTo: String(email),
            subject: `Testimonio recibido — ${String(company).slice(0, 80)} (${String(project).slice(0, 40)})`,
            html: `
                <div style="font-family: sans-serif; padding: 24px; max-width: 640px;">
                    <h2 style="margin:0 0 4px;">Nuevo testimonio de cliente</h2>
                    <p style="color:#666; margin:0 0 20px; font-size:14px;">Listo para publicar en el caso correspondiente.</p>

                    <p><strong>Proyecto:</strong> ${escapeHtml(project)}</p>
                    <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
                    <p><strong>Cargo:</strong> ${escapeHtml(role)}</p>
                    <p><strong>Empresa:</strong> ${escapeHtml(company)}</p>
                    <p><strong>Email:</strong> ${escapeHtml(email)}</p>

                    <p style="margin-top:20px;"><strong>Testimonio:</strong></p>
                    <div style="background:#f7f7f5; padding:18px; border-left:3px solid #000; font-style:italic; line-height:1.7;">
                        ${escapeHtml(testimonial).replace(/\n/g, '<br/>')}
                    </div>

                    <p style="margin-top:20px; color:#0a7c2f;"><strong>✔ Autorizó la publicación</strong> de su nombre, cargo y empresa en ketingmedia.com</p>

                    <hr style="border:none; border-top:1px solid #eee; margin:24px 0;"/>
                    <p style="color:#888; font-size:13px;">Para publicarlo: añadir el campo <code>quote</code> al caso en <code>lib/case-studies.ts</code>.</p>
                </div>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('Error al enviar testimonio:', error);
        return NextResponse.json(
            { success: false, error: 'No pudimos enviar el testimonio. Inténtalo de nuevo.' },
            { status: 500 }
        );
    }
}
