import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, message, interests, source } = body;

        // Configuración de transporte (Banahosting suele usar estos puertos)
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 465,
            secure: Number(process.env.SMTP_PORT) === 465, // true para 465, false para 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                // A veces necesario para servidores de hosting compartido
                rejectUnauthorized: false
            }
        });

        // Construir el cuerpo del correo
        const interestsList = interests && Array.isArray(interests) ? interests.join(', ') : 'N/A';
        
        const mailOptions = {
            from: `"KETING Web" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_TO || process.env.SMTP_USER,
            replyTo: email,
            subject: `Nuevo contacto desde la web (${source || 'General'})`,
            text: `
                Nuevo mensaje de contacto:
                
                Nombre: ${name}
                Email: ${email}
                Teléfono: ${phone}
                Intereses: ${interestsList}
                Mensaje: ${message || 'Sin mensaje'}
                
                Enviado desde: ${source || 'Formulario general'}
            `,
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
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true, message: 'Correo enviado con éxito' });
    } catch (error: any) {
        console.error('Error enviando email:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'Error al enviar el correo' },
            { status: 500 }
        );
    }
}
