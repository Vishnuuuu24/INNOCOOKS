import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Preloader from "@/components/Preloader";
import SmoothScroll from "@/components/SmoothScroll";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const viewport: Viewport = {
  themeColor: "#1e1b45",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://innocooks.com"),
  title: {
    default: "InnoCooks — Websites, Internal Systems & AI Automation",
    template: "%s — InnoCooks",
  },
  description:
    "InnoCooks is a systems studio building the websites, internal tools and AI automation growing businesses run on. Crafted like products, not projects.",
  openGraph: {
    title: "InnoCooks — Cooking Innovation",
    description:
      "Websites, internal management systems and AI automation for small and medium businesses.",
    type: "website",
    locale: "en_IN",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "InnoCooks",
  slogan: "Cooking Innovation",
  description:
    "Systems studio building websites, internal management systems, AI workflows and automation for small and medium businesses.",
  email: "vishnuuu24@gmail.com",
  url: "https://innocooks.com",
  areaServed: "IN",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Preloader />
        <SmoothScroll />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
