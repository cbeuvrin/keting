import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Diseño Web · Keting Media · Sitios editoriales y e-commerce a medida";
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
                <div style={{ position: "absolute", top: 30, right: 50, fontSize: 380, color: "rgba(255,255,255,0.05)", lineHeight: 1, display: "flex", transform: "rotate(12deg)" }}>*</div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.5)", display: "flex" }} />
                    <div style={{ fontSize: 20, letterSpacing: 8, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", display: "flex" }}>
                        01 · Diseño Web
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 130, lineHeight: 0.95, fontWeight: 700, letterSpacing: "-0.04em", display: "flex" }}>
                        Vibe Coder.
                    </div>
                    <div style={{ fontSize: 48, lineHeight: 1.1, fontWeight: 300, color: "rgba(255,255,255,0.65)", maxWidth: 880, marginTop: 20, display: "flex" }}>
                        Sitios <span style={{ fontStyle: "italic", color: "white", fontWeight: 400, marginLeft: 12, marginRight: 12 }}>editoriales</span> y e-commerce que escalan negocios.
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                    <div style={{ display: "flex" }}>ketingmedia.com/webdesing</div>
                    <div style={{ display: "flex" }}>Keting Media · 2026</div>
                </div>
            </div>
        ),
        { ...size },
    );
}
