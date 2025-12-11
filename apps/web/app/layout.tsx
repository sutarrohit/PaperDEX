import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/providers/providers";
import "./globals.css";
// import { ReactScan } from "@/path/to/ReactScanComponent";

// import { Geist, Geist_Mono } from "next/font/google";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PaperDEX",
  description:
    "Trade Bitcoin, Ethereum, and 100+ cryptos in real-time without spending a dime. Sign up, get demo money, and start your risk-free trading journey today!",
  icons: [
    {
      rel: "icon",
      url: "https://raw.githubusercontent.com/sutarrohit/PaperDEX/main/apps/web/app/favicon.ico",
    },
  ],
  openGraph: {
    title: "PaperDEX",
    description:
      "Trade Bitcoin, Ethereum, and 100+ cryptos in real-time without spending a dime. Sign up, get demo money, and start your risk-free trading journey today!",
    images: [
      {
        url: "https://raw.githubusercontent.com/sutarrohit/PaperDEX/main/apps/web/public/landing/og-image-optimized.jpg",
        width: 1200,
        height: 630,
        alt: "PaperDEX - Trade Cryptocurrencies Risk-Free",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PaperDEX",
    description:
      "Trade Bitcoin, Ethereum, and 100+ cryptos in real-time without spending a dime. Sign up, get demo money, and start your risk-free trading journey today!",
    images: [
      {
        url: "https://raw.githubusercontent.com/sutarrohit/PaperDEX/main/apps/web/public/landing/og-image-optimized.jpg",
        width: 1200,
        height: 630,
        alt: "PaperDEX - Trade Cryptocurrencies Risk-Free",
        type: "image/jpeg",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} antialiased `}>
        <Providers>
          {/* <ReactScan /> */}
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
