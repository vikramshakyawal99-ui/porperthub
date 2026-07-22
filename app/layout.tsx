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
  title: "PropertyHub | Premium Properties in Jaipur",
  description: "Find premium residential and commercial properties in Jaipur. Explore verified flats, villas, plots and latest real estate projects with PropertyHub.",
  keywords: [
    "PropertyHub",
    "Jaipur real estate",
    "buy property in Jaipur",
    "flats in Jaipur",
    "luxury apartments Jaipur",
    "property dealer Jaipur"
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "PropertyHub | Premium Properties in Jaipur",
    description: "Discover verified properties, builders and latest projects in Jaipur.",
    type: "website",
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
