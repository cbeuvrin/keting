"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScanLine, X, Check, MessageCircle, Loader2, UserPlus, AlertCircle, Pencil } from "lucide-react";
import { parseQr, paraWhatsapp, type ContactoQr } from "@/lib/qr-contact";
import { fillVars, varsFor } from "@/lib/email-templates/personal";
import { LEAD_SERVICES, SERVICE_LABELS, type LeadService } from "@/lib/crm";
import type { NetworkingCopy } from "@/lib/crm-settings";

type Reciente = {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    company: string | null;
    list_name: string | null;
    created_at: string;
    enviado: boolean;
};

type Guardado = {
    nombre: string;
    correoEnviado: boolean;
    correoError: string;
    yaTenia: boolean;
    mensajeWa: string;
    telefono: string;
};

const VACIO = { name: "", email: "", phone: "", company: "" };

export function Networking({
    recientes,
    resendReady,
    copy,
}: {
    recientes: Reciente[];
    resendReady: boolean;
    copy: NetworkingCopy;
}) {
    const router = useRouter();
    const [campos, setCampos] = useState(VACIO);
    const [evento, setEvento] = useState("");
    const [service, setService] = useState<LeadService | "">("");
    const [escaneando, setEscaneando] = useState(false);
    const [errorCamara, setErrorCamara] = useState("");
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [hecho, setHecho] = useState<Guardado | null>(null);
    const [aviso, setAviso] = useState("");
    const [enlaceWa, setEnlaceWa] = useState("");

    // El nombre del evento se repite en cada contacto de la misma noche: se
    // recuerda para no volver a escribirlo diez veces.
    useEffect(() => {
        try {
            setEvento(localStorage.getItem("crm:evento") ?? "");
        } catch {}
    }, []);
    useEffect(() => {
        try {
            localStorage.setItem("crm:evento", evento);
        } catch {}
    }, [evento]);

    // El envío de un toque se dispara justo antes de saltar a WhatsApp, así que
    // su resultado llega cuando la app ya no está delante. Al volver se recarga
    // la lista: ahí se ve el punto verde de quien sí recibió el correo.
    useEffect(() => {
        const alVolver = () => {
            if (document.visibilityState === "visible") router.refresh();
        };
        document.addEventListener("visibilitychange", alVolver);
        return () => document.removeEventListener("visibilitychange", alVolver);
    }, [router]);

    const aplicar = useCallback((c: ContactoQr) => {
        setCampos((prev) => ({
            name: c.name || prev.name,
            email: c.email || prev.email,
            phone: c.phone || prev.phone,
            company: c.company || prev.company,
        }));
        setEnlaceWa(c.link);
        if (c.formato === "whatsapp-qr") {
            setAviso(
                "Es el QR personal de WhatsApp: por seguridad no lleva el número dentro, ni siquiera WhatsApp lo publica. Abre su chat con el botón de abajo y de ahí copias el número, o pídele su tarjeta."
            );
        } else if (c.formato === "whatsapp") {
            setAviso("El QR solo traía el teléfono. Escribe su nombre para el mensaje.");
        } else if (c.formato === "desconocido") {
            setAviso("Ese QR no traía datos de contacto. Escríbelos a mano.");
        } else {
            setAviso("");
        }
    }, []);

    return (
        <main className="px-4 md:px-8 py-6 max-w-2xl mx-auto pb-24">
            <header className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Networking
                </h1>
                <p className="text-sm text-[#1d1d1f]/55 mt-1">
                    Escanea su QR o escribe sus datos. El correo sale al momento; el WhatsApp, de un toque.
                </p>
            </header>

            {!resendReady && (
                <p className="mb-5 flex gap-2 items-start text-sm rounded-lg border border-amber-300 bg-amber-50 text-amber-900 px-3 py-2.5">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    Falta configurar Resend: el contacto se guarda, pero el correo no saldrá.
                </p>
            )}

            {hecho ? (
                <Resultado
                    hecho={hecho}
                    onSiguiente={() => {
                        setHecho(null);
                        setCampos(VACIO);
                        setAviso("");
                        setEnlaceWa("");
                        router.refresh();
                    }}
                />
            ) : (
                <>
                    {escaneando ? (
                        <Escaner
                            onLeer={(texto) => {
                                aplicar(parseQr(texto));
                                setEscaneando(false);
                            }}
                            onCerrar={() => setEscaneando(false)}
                            onError={(m) => {
                                setErrorCamara(m);
                                setEscaneando(false);
                            }}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={() => {
                                setErrorCamara("");
                                setEscaneando(true);
                            }}
                            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#111111] text-white py-4 text-base font-medium active:scale-[0.99] transition-transform"
                        >
                            <ScanLine className="w-5 h-5" strokeWidth={1.75} />
                            Escanear QR
                        </button>
                    )}

                    {errorCamara && (
                        <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                            {errorCamara}
                        </p>
                    )}
                    {aviso && !errorCamara && (
                        <p className="mt-3 text-sm text-[#1d1d1f]/70 bg-white border border-[#1d1d1f]/10 rounded-lg px-3 py-2.5">
                            {aviso}
                        </p>
                    )}

                    {enlaceWa && (
                        <a
                            href={enlaceWa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#25D366] text-[#128C4A] py-3.5 text-sm font-medium"
                        >
                            <MessageCircle className="w-4 h-4" strokeWidth={2} />
                            Abrir su chat en WhatsApp
                        </a>
                    )}

                    <form
                        className="mt-5 bg-white rounded-xl border border-[#1d1d1f]/10 p-4 md:p-5 space-y-4"
                        onSubmit={async (e) => {
                            e.preventDefault();

                            const cuerpo = JSON.stringify({
                                ...campos,
                                evento,
                                service: service || null,
                            });

                            // Con teléfono, todo cae en el mismo toque: se
                            // dispara el guardado y se salta a WhatsApp sin
                            // esperarlo. Encadenar la navegación DESPUÉS de un
                            // await la bloquearía Safari, que solo abre apps
                            // dentro del gesto que la persona hizo. `keepalive`
                            // es lo que mantiene viva la petición aunque la
                            // pantalla se vaya al fondo.
                            const tel = paraWhatsapp(campos.phone);
                            if (tel) {
                                const vars = varsFor({
                                    name: campos.name,
                                    company: campos.company || null,
                                    email: campos.email || null,
                                });
                                const mensaje = fillVars(copy.whatsapp, vars).text.trim();
                                fetch("/api/admin/crm/networking", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: cuerpo,
                                    keepalive: true,
                                }).catch(() => {});
                                setCampos(VACIO);
                                setAviso("");
                                setEnlaceWa("");
                                window.location.href = `https://wa.me/${tel}?text=${encodeURIComponent(mensaje)}`;
                                return;
                            }

                            setError("");
                            setGuardando(true);
                            try {
                                const res = await fetch("/api/admin/crm/networking", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: cuerpo,
                                });
                                const json = await res.json();
                                if (!res.ok) throw new Error(json?.error ?? "No se pudo guardar");
                                setHecho({
                                    nombre: json.nombre,
                                    correoEnviado: json.correoEnviado,
                                    correoError: json.correoError ?? "",
                                    yaTenia: Boolean(json.yaTenia),
                                    mensajeWa: json.mensajeWa,
                                    telefono: campos.phone,
                                });
                            } catch (err) {
                                setError(err instanceof Error ? err.message : "Algo falló");
                            } finally {
                                setGuardando(false);
                            }
                        }}
                    >
                        <Campo
                            label="Nombre"
                            value={campos.name}
                            onChange={(v) => setCampos((c) => ({ ...c, name: v }))}
                            placeholder="Como quieres saludarle"
                            autoCapitalize="words"
                        />
                        <Campo
                            label="Correo"
                            value={campos.email}
                            onChange={(v) => setCampos((c) => ({ ...c, email: v }))}
                            placeholder="nombre@empresa.com"
                            type="email"
                            inputMode="email"
                        />
                        <Campo
                            label="WhatsApp"
                            value={campos.phone}
                            onChange={(v) => setCampos((c) => ({ ...c, phone: v }))}
                            placeholder="55 1234 5678"
                            type="tel"
                            inputMode="tel"
                        />
                        <Campo
                            label="Empresa"
                            value={campos.company}
                            onChange={(v) => setCampos((c) => ({ ...c, company: v }))}
                            placeholder="Opcional"
                            autoCapitalize="words"
                        />

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-[#1d1d1f]/45 mb-2">
                                Le interesa
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {LEAD_SERVICES.map((sv) => (
                                    <button
                                        key={sv}
                                        type="button"
                                        onClick={() => setService((s) => (s === sv ? "" : sv))}
                                        className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                                            service === sv
                                                ? "bg-[#111111] text-white border-[#111111]"
                                                : "border-[#1d1d1f]/15 text-[#1d1d1f]/70"
                                        }`}
                                    >
                                        {SERVICE_LABELS[sv]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Campo
                            label="Evento"
                            value={evento}
                            onChange={setEvento}
                            placeholder="Dónde lo conociste"
                            autoCapitalize="words"
                        />

                        {error && (
                            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={guardando || (!campos.name && !campos.email && !campos.phone)}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#111111] text-white py-4 text-base font-medium disabled:opacity-35 active:scale-[0.99] transition-transform"
                        >
                            {guardando ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" /> Enviando…
                                </>
                            ) : campos.phone ? (
                                <>
                                    <MessageCircle className="w-5 h-5" strokeWidth={2} /> Enviar y abrir WhatsApp
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" strokeWidth={1.75} /> Guardar y enviar
                                </>
                            )}
                        </button>
                        {campos.phone && (
                            <p className="text-xs text-[#1d1d1f]/45 text-center -mt-1">
                                Se guarda, le sale el correo y te abre su chat con el mensaje escrito.
                            </p>
                        )}
                    </form>
                </>
            )}

            {recientes.length > 0 && (
                <section className="mt-8">
                    <div className="flex items-baseline justify-between mb-3">
                        <h2 className="text-xs uppercase tracking-wider text-[#1d1d1f]/45">
                            Últimos capturados
                        </h2>
                        <Link
                            href="/admin/contactos?origen=networking"
                            className="text-xs text-[#1d1d1f]/45 underline underline-offset-2"
                        >
                            Ver todos
                        </Link>
                    </div>
                    <ul className="bg-white rounded-xl border border-[#1d1d1f]/10 divide-y divide-[#1d1d1f]/[0.07]">
                        {recientes.map((l) => (
                            <li key={l.id} className="flex items-center gap-3 px-4 py-3">
                                <span
                                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        l.enviado ? "bg-emerald-500" : "bg-[#1d1d1f]/20"
                                    }`}
                                    title={l.enviado ? "Correo enviado" : "Sin correo"}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">{l.name}</p>
                                    <p className="text-xs text-[#1d1d1f]/50 truncate">
                                        {[l.company, l.list_name].filter(Boolean).join(" · ") || l.email || l.phone}
                                    </p>
                                </div>
                                <span className="text-xs text-[#1d1d1f]/40 shrink-0">
                                    {new Date(l.created_at).toLocaleDateString("es-MX", {
                                        day: "numeric",
                                        month: "short",
                                    })}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <EditorMensaje inicial={copy} />
        </main>
    );
}

/** El texto que se manda, editable desde el móvil sin pasar por el código. */
function EditorMensaje({ inicial }: { inicial: NetworkingCopy }) {
    const [abierto, setAbierto] = useState(false);
    const [copy, setCopy] = useState(inicial);
    const [estado, setEstado] = useState<"" | "guardando" | "guardado" | "error">("");

    return (
        <section className="mt-8">
            <button
                type="button"
                onClick={() => setAbierto((a) => !a)}
                className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#1d1d1f]/45 mb-3"
            >
                <Pencil className="w-3.5 h-3.5" strokeWidth={2} />
                Editar el mensaje
            </button>

            {abierto && (
                <form
                    className="bg-white rounded-xl border border-[#1d1d1f]/10 p-4 md:p-5 space-y-4"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        setEstado("guardando");
                        const res = await fetch("/api/admin/crm/template", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ template: "networking", ...copy }),
                        });
                        setEstado(res.ok ? "guardado" : "error");
                    }}
                >
                    <p className="text-xs text-[#1d1d1f]/50">
                        Usa <code className="bg-[#1d1d1f]/[0.06] px-1 rounded">{"{{nombre}}"}</code> y{" "}
                        <code className="bg-[#1d1d1f]/[0.06] px-1 rounded">{"{{empresa}}"}</code>. Si no
                        hay dato, la frase se acomoda sola.
                    </p>
                    <Campo
                        label="Asunto"
                        value={copy.subject}
                        onChange={(v) => setCopy((c) => ({ ...c, subject: v }))}
                    />
                    <Campo
                        label="Saludo"
                        value={copy.saludo}
                        onChange={(v) => setCopy((c) => ({ ...c, saludo: v }))}
                    />
                    <Area
                        label="Cuerpo del correo"
                        value={copy.body}
                        rows={9}
                        onChange={(v) => setCopy((c) => ({ ...c, body: v }))}
                    />
                    <Campo
                        label="Firma"
                        value={copy.firma}
                        onChange={(v) => setCopy((c) => ({ ...c, firma: v }))}
                    />
                    <label className="flex items-center gap-2.5 text-sm text-[#1d1d1f]/70">
                        <input
                            type="checkbox"
                            checked={copy.conFoto}
                            onChange={(e) => setCopy((c) => ({ ...c, conFoto: e.target.checked }))}
                            className="w-4 h-4 accent-[#111111]"
                        />
                        Empezar el correo con tu foto
                    </label>

                    <Area
                        label="Mensaje de WhatsApp"
                        value={copy.whatsapp}
                        rows={4}
                        onChange={(v) => setCopy((c) => ({ ...c, whatsapp: v }))}
                    />

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={estado === "guardando"}
                            className="rounded-lg bg-[#111111] text-white px-5 py-3 text-sm font-medium disabled:opacity-40"
                        >
                            {estado === "guardando" ? "Guardando…" : "Guardar"}
                        </button>
                        {estado === "guardado" && (
                            <span className="text-sm text-emerald-600">Guardado.</span>
                        )}
                        {estado === "error" && (
                            <span className="text-sm text-red-600">No se pudo guardar.</span>
                        )}
                    </div>
                </form>
            )}
        </section>
    );
}

function Area({
    label,
    value,
    onChange,
    rows,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    rows: number;
}) {
    return (
        <label className="block">
            <span className="block text-xs uppercase tracking-wider text-[#1d1d1f]/45 mb-1.5">{label}</span>
            <textarea
                value={value}
                rows={rows}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-[#1d1d1f]/15 px-3.5 py-3 text-base bg-white outline-none focus:border-[#111111] transition-colors leading-relaxed resize-y"
            />
        </label>
    );
}

function Resultado({ hecho, onSiguiente }: { hecho: Guardado; onSiguiente: () => void }) {
    const wa = hecho.telefono ? paraWhatsapp(hecho.telefono) : "";
    return (
        <div className="bg-white rounded-xl border border-[#1d1d1f]/10 p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 grid place-items-center mx-auto mb-3">
                <Check className="w-6 h-6" strokeWidth={2.25} />
            </div>
            <p className="text-lg font-semibold">{hecho.nombre} ya está en el CRM</p>
            <p className="text-sm text-[#1d1d1f]/55 mt-1">
                {hecho.correoEnviado
                    ? "El correo salió hace un segundo."
                    : hecho.yaTenia
                      ? "Ya le habías escrito antes: no le mandé otro correo."
                      : hecho.correoError
                        ? `El correo no salió: ${hecho.correoError}`
                        : "Sin correo: no diste su dirección."}
            </p>

            {wa && (
                <a
                    href={`https://wa.me/${wa}?text=${encodeURIComponent(hecho.mensajeWa)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#25D366] text-white py-4 text-base font-medium active:scale-[0.99] transition-transform"
                >
                    <MessageCircle className="w-5 h-5" strokeWidth={2} />
                    Mandar el WhatsApp
                </a>
            )}
            {wa && (
                <p className="mt-2 text-xs text-[#1d1d1f]/40">
                    Sale de tu número, con el mensaje ya escrito. Solo das enviar.
                </p>
            )}

            <button
                type="button"
                onClick={onSiguiente}
                className="mt-4 w-full rounded-xl border border-[#1d1d1f]/15 py-3.5 text-sm font-medium text-[#1d1d1f]/70"
            >
                Siguiente contacto
            </button>
        </div>
    );
}

const LECTOR_ID = "qr-lector";

function Escaner({
    onLeer,
    onCerrar,
    onError,
}: {
    onLeer: (texto: string) => void;
    onCerrar: () => void;
    onError: (mensaje: string) => void;
}) {
    // La librería se carga solo al abrir la cámara: pesa, y la mayoría de las
    // visitas al panel nunca escanean nada.
    const instancia = useRef<{ stop: () => Promise<void>; clear: () => void } | null>(null);
    const yaLeido = useRef(false);

    // Los callbacks llegan como arrows nuevas en cada render del padre. Si el
    // efecto dependiera de ellas, la cámara se apagaría y encendería a cada
    // tecla escrita en el formulario.
    const cbs = useRef({ onLeer, onCerrar, onError });
    cbs.current = { onLeer, onCerrar, onError };

    useEffect(() => {
        let vivo = true;
        (async () => {
            try {
                const { Html5Qrcode } = await import("html5-qrcode");
                if (!vivo) return;
                // El decodificador nativo del navegador, cuando existe, lee
                // los QR densos y con logo mucho mejor que el de la librería.
                const lector = new Html5Qrcode(LECTOR_ID, {
                    verbose: false,
                    experimentalFeatures: { useBarCodeDetectorIfSupported: true },
                });
                instancia.current = lector as unknown as { stop: () => Promise<void>; clear: () => void };
                await lector.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        // Un recuadro fijo de 240px deja fuera los QR densos —
                        // el personal de WhatsApp lo es, y encima lleva logo en
                        // medio. Se ajusta al visor en vez de imponer tamaño.
                        qrbox: (ancho: number, alto: number) => {
                            const lado = Math.floor(Math.min(ancho, alto) * 0.8);
                            return { width: lado, height: lado };
                        },
                    },
                    (texto) => {
                        // start() sigue disparando mientras el QR esté delante:
                        // sin este cerrojo se rellenaría el formulario en bucle.
                        if (yaLeido.current) return;
                        yaLeido.current = true;
                        cbs.current.onLeer(texto);
                    },
                    () => {}
                );
            } catch (err) {
                if (!vivo) return;
                const msg = err instanceof Error ? err.message : String(err);
                cbs.current.onError(
                    /permission|denied|notallowed/i.test(msg)
                        ? "No diste permiso a la cámara. Actívalo en los ajustes del navegador."
                        : "No se pudo abrir la cámara. Escribe los datos a mano."
                );
            }
        })();

        return () => {
            vivo = false;
            const lector = instancia.current;
            instancia.current = null;
            // stop() falla si nunca llegó a arrancar; da igual, ya nos vamos.
            lector?.stop().then(() => lector.clear()).catch(() => {});
        };
    }, []);

    return (
        <div className="relative rounded-xl overflow-hidden bg-black">
            <div id={LECTOR_ID} className="w-full [&_video]:w-full [&_video]:block" />
            <button
                type="button"
                onClick={onCerrar}
                aria-label="Cerrar la cámara"
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-black/60 text-white grid place-items-center backdrop-blur"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    );
}

function Campo({
    label,
    value,
    onChange,
    ...rest
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
    return (
        <label className="block">
            <span className="block text-xs uppercase tracking-wider text-[#1d1d1f]/45 mb-1.5">{label}</span>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                // 16px reales: por debajo, Safari en iOS hace zoom al enfocar.
                className="w-full rounded-lg border border-[#1d1d1f]/15 px-3.5 py-3 text-base bg-white outline-none focus:border-[#111111] transition-colors"
                {...rest}
            />
        </label>
    );
}
