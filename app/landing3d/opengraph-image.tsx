import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Landing 3D · Keting Media · Experiencias web inmersivas";
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
                <div style={{ position: "absolute", top: 30, right: 40, fontSize: 400, color: "rgba(255,255,255,0.04)", lineHeight: 1, display: "flex", transform: "rotate(20deg)" }}>*</div>

                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <div style={{ width: 48, height: 1, background: "rgba(255,255,255,0.5)", display: "flex" }} />
                    <div style={{ fontSize: 20, letterSpacing: 8, textTransform: "uppercase", color: "rgba(255,255,255,0.7)", display: "flex" }}>
                        Experiencia · 3D · WebGL
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ fontSize: 130, lineHeight: 0.95, fontWeight: 700, letterSpacing: "-0.04em", display: "flex" }}>
                        Landing 3D.
                    </div>
                    <div style={{ fontSize: 50, lineHeight: 1.15, fontWeight: 300, color: "rgba(255,255,255,0.7)", maxWidth: 900, marginTop: 20, display: "flex" }}>
                        Scrollytelling inmersivo para marcas que necesitan <span style={{ fontStyle: "italic", color: "white", marginLeft: 10 }}>diferenciarse</span>.
                    </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 18, letterSpacing: 5, textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                    <div style={{ display: "flex" }}>ketingmedia.com/landing3d</div>
                    <div style={{ display: "flex" }}>Keting Media</div>
                </div>
            </div>
        ),
        { ...size },
    );
}
