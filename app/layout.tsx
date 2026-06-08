import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display, Sulphur_Point } from "next/font/google"; // Added Sulphur_Point
import "./globals.css";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { GoogleTranslateInit } from "@/components/ui/google-translate";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sulphur = Sulphur_Point({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-sulphur" });

const SITE_URL = "https://ketingmedia.com";
const SITE_NAME = "Keting Media";

export const metadata: Metadata = {
  title: {
    default: "Keting Media · Agencia de diseño web y soluciones digitales con IA en México",
    template: "%s · Keting Media"
  },
  description: "Agencia digital en México que diseña webs editoriales, e-commerce y soluciones impulsadas por IA para marcas que cambian su industria. +80% de proyectos referidos.",
  keywords: [
    "agencia diseño web méxico",
    "diseño web editorial",
    "e-commerce a medida",
    "soluciones digitales con IA",
    "desarrollo web mexico",
    "agencia digital cdmx",
    "landing pages alto impacto",
    "estrategia digital",
    "keting media",
    "carlos beuvrin",
  ],
  authors: [{ name: "Carlos Beuvrin", url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "Agencia Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: { "es-MX": "/" },
  },
  openGraph: {
    title: "Keting Media · Diseño web e ideas que escalan negocios ambiciosos",
    description: "Estudios, plataformas y experiencias digitales para marcas que cambian su industria. Diseño editorial, ingeniería y IA aplicada.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Keting Media · Diseño web editorial · IA · México",
    description: "Webs editoriales, e-commerce y soluciones con IA para marcas ambiciosas.",
    creator: "@ketingmedia",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Si tienes Google Search Console, agrega aquí el verification code
    // google: "tu-codigo-de-verificacion",
  },
};

// JSON-LD: Organization + LocalBusiness para señalar a Google
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/keting-logo.png`,
  description: "Agencia digital en México especializada en diseño web editorial, e-commerce y soluciones con IA.",
  founder: {
    "@type": "Person",
    name: "Carlos Beuvrin",
  },
  foundingDate: "2019",
  address: {
    "@type": "PostalAddress",
    addressCountry: "MX",
    addressLocality: "Ciudad de México",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+52-55-4383-0150",
    email: "info@ketingmedia.com",
    contactType: "Sales",
    areaServed: "MX",
    availableLanguage: ["es"],
  },
  sameAs: [
    "https://www.linkedin.com/company/ketingmedia",
    "https://www.instagram.com/ketingmedia",
    "https://www.facebook.com/ketingmedia",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-MX">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={cn(inter.variable, montserrat.variable, playfair.variable, sulphur.variable, "font-sans antialiased bg-[#FAFAFA] text-[#333333]")}
        suppressHydrationWarning
      >
        {children}
        <WhatsAppButton />
        <GoogleTranslateInit />
      </body>
    </html>
  );
}
