import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://subscriptiontrimmer.com';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Subscription Trimmer | Privacy-First FinTech Co-Pilot",
    template: "%s | Subscription Trimmer",
  },
  description: "Automatically detect recurring subscriptions, analyze financial spending metrics, and manage user-authorized cancellation workflows.",
  applicationName: "Subscription Trimmer",
  authors: [{ name: "Subscription Trimmer Team" }],
  keywords: [
    "subscription management",
    "recurring charge detection",
    "fintech co-pilot",
    "spending analytics",
    "cancellation workflows",
    "financial privacy",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "Subscription Trimmer",
    title: "Subscription Trimmer | Privacy-First FinTech Co-Pilot",
    description: "Automatically detect recurring subscriptions, analyze spending metrics, and manage user-authorized cancellation workflows.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Subscription Trimmer | Privacy-First FinTech Co-Pilot",
    description: "Automatically detect recurring subscriptions, analyze spending metrics, and manage user-authorized cancellation workflows.",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
