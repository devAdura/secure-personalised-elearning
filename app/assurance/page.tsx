import type { Metadata } from "next";
import { AssuranceCommandCenter } from "@/components/assurance/assurance-command-center";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

export const metadata: Metadata = {
  title: "Biometric Assurance Center",
  description: "Biometric assurance, privacy, and audit controls for SecureLearn."
};

export default function AssurancePage() {
  return (
    <>
      <SiteHeader />
      <main className="assurance-page">
        <AssuranceCommandCenter />
      </main>
      <SiteFooter />
    </>
  );
}
