import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import "./globals.css";

// Display face — headings, hero copy, editorial moments (Architecture doc §4)
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// Body face — everything else: paragraphs, labels, UI text
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://visitsrilanka.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Visit Sri Lanka | Discover the Pearl of the Indian Ocean",
    template: "%s | Visit Sri Lanka",
  },
  description:
    "Plan your Sri Lanka journey: explore beaches, wildlife, heritage sites and mountains, find hotels, build itineraries, and budget your trip — all in one place.",
  keywords: [
    "Sri Lanka travel",
    "Sri Lanka tourism",
    "Sri Lanka destinations",
    "Sri Lanka hotels",
    "trip planner Sri Lanka",
    "Sri Lanka beaches",
    "Sri Lanka wildlife",
    "Sri Lanka heritage sites",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Visit Sri Lanka",
    title: "Visit Sri Lanka | Discover the Pearl of the Indian Ocean",
    description:
      "Plan your Sri Lanka journey: explore beaches, wildlife, heritage sites and mountains, find hotels, build itineraries, and budget your trip.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visit Sri Lanka | Discover the Pearl of the Indian Ocean",
    description:
      "Plan your Sri Lanka journey: beaches, wildlife, heritage, mountains, hotels, itineraries and budgeting — all in one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
