import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import siteData from "../content/site.json";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteData.title,
  description: siteData.description,
  icons: {
    icon: [
      { url: "/johi-logo.png", type: "image/png" },
      { url: "/johi-logo.png", sizes: "32x32", type: "image/png" },
      { url: "/johi-logo.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/johi-logo.png",
    apple: [
      { url: "/johi-logo.png", sizes: "180x180", type: "image/png" },
    ],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased overflow-x-hidden`}
    >
      <head>
        <link rel="icon" href="/johi-logo.png" type="image/png" sizes="any" />
        <link rel="icon" href="/johi-logo.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/johi-logo.png" type="image/png" sizes="16x16" />
        <link rel="shortcut icon" href="/johi-logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/johi-logo.png" sizes="180x180" type="image/png" />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col overflow-x-hidden">{children}</body>
    </html>
  );
}
