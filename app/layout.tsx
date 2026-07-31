import type { Metadata } from "next";
import { Instrument_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const editorial = Newsreader({
  subsets: ["latin"],
  variable: "--font-editorial",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "SecureLearn Biometric Assurance Platform", template: "%s | SecureLearn" },
  description: "A premium biometric-secured e-learning platform with assurance scoring, privacy-preserving personalization, collaboration tools, and role-based dashboards.",
  openGraph: {
    title: "SecureLearn Biometric Assurance Platform",
    description: "A privacy-first e-learning command center secured with WebAuthn passkeys and biometric assurance workflows.",
    type: "website",
    siteName: "SecureLearn"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${editorial.variable}`}>{children}</body></html>;
}
