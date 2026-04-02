import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display, Sulphur_Point } from "next/font/google"; // Added Sulphur_Point
import "./globals.css";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sulphur = Sulphur_Point({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-sulphur" });

export const metadata: Metadata = {
  title: {
    default: "Keting Media | Soluciones de Marketing Digital y Diseño Web en México",
    template: "%s | Keting Media"
  },
  description: "Agencia de marketing digital en México especializada en diseño web, e-commerce y estrategias de crecimiento que escalan negocios ambiciosos. Innovación impulsada por IA.",
  keywords: ["marketing digital méxico", "diseño web profesional", "agencia e-commerce", "posicionamiento seo", "desarrollo web ia", "keting media"],
  authors: [{ name: "Carlos Beuvrin" }],
  creator: "Keting Media",
  publisher: "Keting Media",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://keting.media"), // Reemplazar con el dominio real si es distinto
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Keting Media | Soluciones de Marketing Digital y Diseño Web",
    description: "Escalamos negocios ambiciosos con diseño web de vanguardia y estrategias digitales de alto impacto.",
    url: "https://keting.media",
    siteName: "Keting Media",
    images: [
      {
        url: "/keting-logo.png", // Asegúrate de que esta imagen sea óptima para compartir (1200x630 recomendado)
        width: 1200,
        height: 630,
        alt: "Keting Media Logo",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keting Media | Marketing Digital de Vanguardia",
    description: "Diseño web y estrategias SEO que escalan tu negocio.",
    images: ["/keting-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={cn(inter.variable, montserrat.variable, playfair.variable, sulphur.variable, "font-sans antialiased bg-[#FAFAFA] text-[#333333]")}
        suppressHydrationWarning
      >
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
