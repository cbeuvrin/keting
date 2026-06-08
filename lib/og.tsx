import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Tamaño estándar Open Graph / LinkedIn / Twitter.
export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Charset amplio: cubre el texto de todas las páginas + acentos + símbolos.
// textTransform:uppercase obliga a incluir también las mayúsculas/acentos.
const CHARSET =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÁÉÍÓÚÑáéíóúñ0123456789·—&@.,+() ";

async function loadGoogleFont(family: string) {
    const url = `https://fonts.googleapis.com/css2?family=${family}&text=${encodeURIComponent(CHARSET)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\(/)?.[1];
    if (!src) throw new Error("No se pudo resolver la fuente");
    return (await fetch(src)).arrayBuffer();
}

type Theme = "dark" | "light";

export interface KetingOgInput {
    eyebrow: string;
    lineSans: string;
    lineSerif: string;
    sub?: string;
    url: string;
    right?: string;
    theme?: Theme;
    /** Tamaño de las líneas grandes; bájalo si el texto es largo. */
    headingSize?: number;
}

export async function ketingOgImage({
    eyebrow,
    lineSans,
    lineSerif,
    sub,
    url,
    right = "Keting Media · 2026",
    theme = "dark",
    headingSize = 100,
}: KetingOgInput) {
    const dark = theme === "dark";
    const logoFile = dark ? "keting-logo-white.png" : "keting-logo-black.png";

    const [logo, playfair, montserrat] = await Promise.all([
        readFile(join(process.cwd(), "public", logoFile)).then(
            (b) => `data:image/png;base64,${b.toString("base64")}`
        ),
        loadGoogleFont("Playfair+Display:ital@1").catch(() => null),
        loadGoogleFont("Montserrat:wght@700").catch(() => null),
    ]);

    // Paleta dependiente del tema.
    const fg = dark ? "255,255,255" : "29,29,31"; // #1d1d1f en claro
    const bg = dark
        ? "radial-gradient(120% 120% at 75% 15%, #1f1f1f 0%, #121212 45%, #0a0a0a 100%)"
        : "radial-gradient(120% 120% at 75% 15%, #ffffff 0%, #f5f5f7 55%, #ececee 100%)";
    const sans = montserrat ? "Montserrat" : "sans-serif";
    const serif = playfair ? "Playfair Display" : "serif";
    // Con subtítulo el bloque central crece: bajamos el heading para dejar aire al pie.
    const hSize = sub ? Math.min(headingSize, 88) : headingSize;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: bg,
                    color: `rgb(${fg})`,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px 80px",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                {/* Hairline superior de marca */}
                <div
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 4,
                        background: `linear-gradient(90deg, rgba(${fg},0.9), rgba(${fg},0.15) 60%, transparent)`,
                        display: "flex",
                    }}
                />

                {/* Fila superior: eyebrow + logo */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ width: 48, height: 1, background: `rgba(${fg},0.5)`, display: "flex" }} />
                        <div
                            style={{
                                fontFamily: sans,
                                fontWeight: 700,
                                fontSize: 20,
                                letterSpacing: 7,
                                textTransform: "uppercase",
                                color: `rgba(${fg},0.7)`,
                                display: "flex",
                            }}
                        >
                            {eyebrow}
                        </div>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} width={270} height={154} alt="Keting Media" />
                </div>

                {/* Bloque central: slogan (sans bold + serif italic) + subtítulo opcional */}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <div
                        style={{
                            fontFamily: sans,
                            fontSize: hSize,
                            lineHeight: 1.02,
                            fontWeight: 700,
                            letterSpacing: "-0.035em",
                            display: "flex",
                        }}
                    >
                        {lineSans}
                    </div>
                    <div
                        style={{
                            fontFamily: serif,
                            fontStyle: "italic",
                            fontSize: hSize,
                            lineHeight: 1.02,
                            color: `rgba(${fg},0.92)`,
                            letterSpacing: "-0.02em",
                            display: "flex",
                        }}
                    >
                        {lineSerif}
                    </div>
                    {sub ? (
                        <div
                            style={{
                                fontFamily: sans,
                                fontWeight: 700,
                                fontSize: 29,
                                lineHeight: 1.3,
                                color: `rgba(${fg},0.5)`,
                                maxWidth: 900,
                                marginTop: 20,
                                display: "flex",
                            }}
                        >
                            {sub}
                        </div>
                    ) : null}
                </div>

                {/* Pie: URL + dato derecho */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: sans,
                        fontWeight: 700,
                        fontSize: 18,
                        letterSpacing: 4,
                        textTransform: "uppercase",
                        color: `rgba(${fg},0.55)`,
                    }}
                >
                    <div style={{ display: "flex" }}>{url}</div>
                    <div style={{ display: "flex" }}>{right}</div>
                </div>
            </div>
        ),
        {
            ...OG_SIZE,
            fonts: [
                ...(playfair
                    ? [{ name: "Playfair Display", data: playfair, style: "italic" as const, weight: 400 as const }]
                    : []),
                ...(montserrat
                    ? [{ name: "Montserrat", data: montserrat, style: "normal" as const, weight: 700 as const }]
                    : []),
            ],
        }
    );
}
