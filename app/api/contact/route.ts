import { NextResponse } from 'next/server';
import { Resend } from 'resend';



export async function POST(request: Request) {
    try {
        // Inicializar Resend con la API Key (dentro del handler para evitar errores en build)
        const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
        
        const body = await request.json();
        const { name, email, phone, message, interests, source } = body;

        // Construir lista de intereses
        const interestsList = interests && Array.isArray(interests) ? interests.join(', ') : 'N/A';
        
        // Enviar el correo usando Resend
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM || 'onboarding@resend.dev',
            to: [process.env.SMTP_TO || 'carlos@keting.media'],
            reply_to: email,
            subject: `Nuevo contacto desde la web (${source || 'General'})`,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #000;">Nuevo mensaje de contacto</h2>
                    <p><strong>Nombre:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Teléfono:</strong> ${phone}</p>
                    <p><strong>Intereses:</strong> ${interestsList}</p>
                    <p><strong>Mensaje:</strong></p>
                    <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
                        ${message || 'Sin mensaje'}
                    </div>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #888;">Enviado desde: ${source || 'Formulario general'}</p>
                </div>
            `,
        });

        if (error) {
            console.error('Error de Resend:', error);
            return NextResponse.json(
                { success: false, error: error.message || 'Error en el servicio de correo' },
                { status: 400 }
            );
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Correo enviado con éxito',
            id: data?.id 
        });
    } catch (error: any) {
        console.error('Error enviando email:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Error al enviar el correo' },
            { status: 500 }
        );
    }
}
