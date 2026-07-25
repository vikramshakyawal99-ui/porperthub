import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "../components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://propertyhub.com"),

  title: "PropertyHub | Premium Properties in Jaipur",

  description:
    "Find premium residential and commercial properties in Jaipur. Explore verified flats, villas, plots and latest real estate projects with PropertyHub.",

  keywords: [
    "PropertyHub",
    "Jaipur real estate",
    "buy property in Jaipur",
    "flats in Jaipur",
    "luxury apartments Jaipur",
    "villa in Jaipur",
    "plots in Jaipur",
    "property dealer Jaipur",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "PropertyHub | Premium Properties in Jaipur",
    description:
      "Discover verified properties, builders and latest projects in Jaipur.",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyHub Jaipur Properties",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PropertyHub | Premium Properties in Jaipur",
    description: "Find premium flats, villas and plots in Jaipur.",
    images: ["/og-image.jpg"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "PropertyHub",
  url: "https://propertyhub.com",
  logo: "https://propertyhub.com/logo.png",
  description:
    "Find verified properties, flats, villas, plots, PGs, hostels and rental listings in Jaipur.",
  areaServed: {
    "@type": "City",
    name: "Jaipur",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}