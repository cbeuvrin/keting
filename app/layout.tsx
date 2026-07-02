import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display, Sulphur_Point } from "next/font/google"; // Added Sulphur_Point
import "./globals.css";
import { cn } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { LangProvider } from "@/lib/i18n/lang-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const sulphur = Sulphur_Point({ weight: ["300", "400", "700"], subsets: ["latin"], variable: "--font-sulphur" });

const SITE_URL = "https://ketingmedia.com";
const SITE_NAME = "Keting Media";

export const metadata: Metadata = {
  title: {
    default: "Desarrollo de software, web y apps en México · Keting Media",
    template: "%s · Keting Media"
  },
  description: "Empresa mexicana de desarrollo de software, aplicaciones web y móviles a medida. Del sitio web al sistema interno que opera tu negocio. Diseño, ingeniería e IA.",
  keywords: [
    "desarrollo de software",
    "empresa de desarrollo de software",
    "fábrica de software",
    "desarrollo web méxico",
    "desarrollo de aplicaciones móviles",
    "desarrollo de apps",
    "aplicaciones web",
    "e-commerce a medida",
    "plataformas saas",
    "desarrollo web next.js",
    "software a medida",
    "soluciones digitales con ia",
    "keting media",
    "carlos beuvrin",
  ],
  authors: [{ name: "Carlos Beuvrin", url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  category: "Diseño y desarrollo de software, web y apps",
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
    title: "Keting Media · Desarrollo de software, web y apps en México",
    description: "Desarrollo de software, aplicaciones web y móviles a medida en México. Diseño, ingeniería e IA aplicada.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desarrollo de software, web y apps · México · IA",
    description: "Software, e-commerce, plataformas y apps a medida con IA para negocios ambiciosos.",
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
  description: "Empresa de desarrollo de software, web y apps a medida en México: sitios, e-commerce, plataformas/SaaS e IA aplicada. Ingeniería, diseño de producto e inteligencia artificial en un mismo equipo.",
  knowsAbout: [
    "Diseño y desarrollo web",
    "Desarrollo de software a medida",
    "Aplicaciones móviles y multiplataforma",
    "E-commerce",
    "Plataformas SaaS",
    "Inteligencia artificial aplicada",
  ],
  founder: {
    "@type": "Person",
    name: "Carlos Beuvrin",
    jobTitle: "Ingeniero de IA y Fundador",
    description: "Ingeniero IA y fundador, especializado en el diseño y desarrollo de productos digitales de extremo a extremo: aplicaciones web, plataformas SaaS y soluciones de comercio, con modelos de IA en el núcleo del producto.",
    sameAs: ["https://www.linkedin.com/in/carlos-fernando-beuvrin-rodriguez-520526222/"],
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
    "https://www.instagram.com/keting_media/",
    "https://www.facebook.com/ketingmedia/",
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
        <LangProvider>
          {children}
          <WhatsAppButton />
          <CookieConsent />
        </LangProvider>
      </body>
    </html>
  );
}
