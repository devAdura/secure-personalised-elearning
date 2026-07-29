import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: { default: "Secure Personalised Collaborative E-Learning Platform", template: "%s | SecureLearn" },
  description: "A biometric-secured e-learning platform with personalised course recommendations, collaboration tools, and role-based dashboards.",
  openGraph: {
    title: "Secure Personalised Collaborative E-Learning Platform",
    description: "A privacy-first e-learning platform secured with WebAuthn passkeys.",
    type: "website",
    siteName: "SecureLearn"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
