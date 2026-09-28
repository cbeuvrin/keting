import { Gluten } from "next/font/google";

// La letra de toda la versión Halloween: redonda, chueca, como rotulada a mano.
// Se declara una sola vez y cada página la aplica con `gluten.variable`.
export const gluten = Gluten({ subsets: ["latin"], variable: "--font-gluten" });

/** Clase para usar la letra de Halloween en cualquier elemento. */
export const HW_FONT = "font-[family-name:var(--font-gluten)]";
