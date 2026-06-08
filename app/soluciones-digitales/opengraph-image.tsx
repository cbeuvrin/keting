import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Soluciones Digitales · Keting Media · Apps hiper-personalizadas con IA";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    background: "#FAFAFA",
                    color: "#1d1d1f",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "70px 80px",
                    fontFamily: "sans-serif",
                    position: "relative",
                }}
            >
                <div style={{ position: "absolute", top: 40, right: 50, fontSize: 360, color: "rgba(0,0,0,0.05)", lineHeight: 1, display: "flex", transform: "rotate(8deg)" }}>*</div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 48, height: 1, background: "rgba(0,0,0,0.4)", display: "flex" }} />
                    <div style={{ fontSize: 20, letterSpacing: 8, textTransform: "uppercase", color: "rgba(0,0,0,0.5)", display: "flex" }}>
                        02 · Soluciones Digitales
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 120, lineHeight: 0.95, fontWeight: 700, letterSpacing: "-0.04em", display: "flex" }}>
                        Apps con
                    </div>
                    <div style={{ fontSize: 130, lineHeight: 1, fontWeight: 400, fontStyle: "italic", color: "#1d1d1f", letterSpacing: "-0.03em", display: "flex" }}>
                        inteligencia.
                    </div>
                    <div style={{ fontSize: 40, lineHeight: 1.3, fontWeight: 300, color: "rgba(0,0,0,0.55)", maxWidth: 900, marginTop: 14, display: "flex" }}>
                        Plataformas hiper-personalizadas para empresas que escalan.
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: "rgba(0,0,0,0.5)" }}>
                    <div style={{ display: "flex" }}>ketingmedia.com/soluciones-digitales</div>
                    <div style={{ display: "flex" }}>Keting Media</div>
                </div>
            </div>
        ),
        { ...size },
    );
}
