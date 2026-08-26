import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://propertyhub.com"),

  title: {
    default: "PropertyHub | Buy, Rent & Find Properties in Jaipur",
    template: "%s | PropertyHub",
  },

  description:
    "Find verified properties for sale and rent in Jaipur. Explore flats, villas, plots, PG, hostels, rooms and resale properties on PropertyHub.",

  keywords: [
    "property in Jaipur",
    "properties in Jaipur",
    "buy property in Jaipur",
    "property for rent in Jaipur",
    "flats in Jaipur",
    "villas in Jaipur",
    "plots in Jaipur",
    "PG in Jaipur",
    "hostels in Jaipur",
    "rooms for rent in Jaipur",
    "resale property in Jaipur",
    "Jaipur real estate",
    "PropertyHub",
  ],

  alternates: {
    canonical: "/",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: "https://propertyhub.com",
    siteName: "PropertyHub",
    title: "PropertyHub | Buy, Rent & Find Properties in Jaipur",
    description:
      "Explore verified flats, villas, plots, PG, hostels, rooms and resale properties in Jaipur.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PropertyHub - Properties in Jaipur",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "PropertyHub | Properties in Jaipur",
    description:
      "Find verified properties for sale and rent in Jaipur on PropertyHub.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: [
      {
        url: "/branding/propertyhub-icon.svg",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/branding/propertyhub-icon.svg",
    apple: "/branding/propertyhub-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
