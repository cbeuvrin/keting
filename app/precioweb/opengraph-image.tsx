import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Precio Web · Keting Media · Tarifas claras para diseño web profesional";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#0a0a0a",
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "70px 80px",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                <div style={{ position: "absolute", top: 50, right: 80, fontSize: 320, color: "rgba(255,255,255,0.04)", lineHeight: 1, display: "flex" }}>*</div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.5)", display: "flex" }} />
                    <div style={{ fontSize: 20, letterSpacing: 8, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", display: "flex" }}>
                        Inversión · Transparente
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 120, lineHeight: 0.95, fontWeight: 700, letterSpacing: "-0.04em", display: "flex" }}>
                        Precio
                    </div>
                    <div style={{ fontSize: 140, lineHeight: 1, fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.03em", display: "flex" }}>
                        sin sorpresas.
                    </div>
                    <div style={{ fontSize: 38, lineHeight: 1.3, fontWeight: 300, color: "rgba(255,255,255,0.6)", maxWidth: 900, marginTop: 14, display: "flex" }}>
                        Diseño web, e-commerce y landing pages — alcance y tiempos claros.
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                    <div style={{ display: "flex" }}>ketingmedia.com/precioweb</div>
                    <div style={{ display: "flex" }}>Keting Media</div>
                </div>
            </div>
        ),
        { ...size },
    );
}
