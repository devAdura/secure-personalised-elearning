import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Fingerprint,
  Gauge,
  KeyRound,
  LockKeyhole,
  MessagesSquare,
  Radar,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { assurancePolicy, freeFirstStack, literatureInsights } from "@/lib/biometric-assurance";

const workstreams = [
  { icon: Fingerprint, label: "Passkey assurance", value: "AAL3", detail: "Origin-bound proof with liveness scoring" },
  { icon: Sparkles, label: "Personalization", value: "1.2", detail: "Privacy-budgeted recommendation signal" },
  { icon: MessagesSquare, label: "Collaboration", value: "BioSigned", detail: "Peer review and protected study actions" },
  { icon: ShieldCheck, label: "Audit chain", value: "Valid", detail: "Hash-linked evidence for reviews and exams" }
];

const workflows = [
  "Fingerprint/passkey sign-in with no raw biometric storage",
  "Adaptive learning paths based on enrolment, pace, and activity",
  "Verified collaboration rooms for discussions, submissions, and review",
  "Instructor security console with liveness and policy evidence"
];

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="home-command">
          <div className="page-container">
            <div className="home-grid">
              <div className="home-copy">
                <p className="kicker"><LockKeyhole className="h-4 w-4" />SecureLearn biometric command center</p>
                <h1>Securing and personalizing collaborative e-learning with fingerprint biometrics.</h1>
                <p>
                  SecureLearn now combines the original LMS with BioLearn Synth assurance logic: passkeys, liveness checks,
                  privacy-preserving personalization, sequential proof, and tamper-evident assessment records.
                </p>
                <div className="home-actions">
                  <Link href="/assurance" className={buttonVariants({ size: "lg", className: "premium-link" })}>
                    Open assurance center
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/register" className={buttonVariants({ size: "lg", variant: "outline" })}>
                    Create account
                  </Link>
                </div>
              </div>

              <div className="home-console" aria-label="SecureLearn assurance preview">
                <div className="console-topline">
                  <div>
                    <span>Live trust surface</span>
                    <strong>Student vault - Ada Morgan</strong>
                  </div>
                  <span className="status-chip">Trusted</span>
                </div>
                <div className="console-fingerprint">
                  <div className="finger-lines" aria-hidden="true" />
                  <div className="trust-readout">
                    <span>Match</span>
                    <strong>{assurancePolicy.matchThreshold + 6}%</strong>
                  </div>
                  <div className="trust-readout">
                    <span>Liveness</span>
                    <strong>{assurancePolicy.livenessThreshold + 8}%</strong>
                  </div>
                  <div className="trust-readout">
                    <span>Template distance</span>
                    <strong>8</strong>
                  </div>
                </div>
                <div className="console-rows">
                  <ConsoleRow icon={Radar} label="Exam unlock" value="Step-up proof required" />
                  <ConsoleRow icon={KeyRound} label="Question-set hash" value="0dd191b99183" />
                  <ConsoleRow icon={Gauge} label="Recommendation engine" value="Cohort + local signals" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-container section-padding">
          <div className="workstream-grid">
            {workstreams.map(({ icon: Icon, label, value, detail }) => (
              <article className="workstream-card" key={label}>
                <span><Icon className="h-5 w-5" /></span>
                <p>{label}</p>
                <strong>{value}</strong>
                <small>{detail}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="page-container product-band">
          <div>
            <p className="kicker">Integrated learning operations</p>
            <h2>One improved SecureLearn project: LMS workflows plus biometric assurance.</h2>
          </div>
          <div className="workflow-list">
            {workflows.map((item) => (
              <p key={item}>
                <CheckCircle2 className="h-5 w-5" />
                {item}
              </p>
            ))}
          </div>
        </section>

        <section className="page-container section-padding">
          <div className="evidence-grid">
            <div>
              <p className="kicker">Literature-backed controls</p>
              <h2>Research themes are visible in the product, not hidden in a report.</h2>
            </div>
            {literatureInsights.slice(0, 4).map((insight) => (
              <article className="evidence-card" key={insight.theme}>
                <strong>{insight.theme}</strong>
                <span>{insight.papers} papers sampled</span>
                <p>{insight.productResponse}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="page-container free-band">
          <div>
            <p className="kicker">Free-first implementation</p>
            <h2>No paid biometric provider, AI API, blockchain host, or proprietary course service is required.</h2>
          </div>
          <div className="free-grid">
            {freeFirstStack.map((item) => (
              <article key={item.layer}>
                <strong>{item.layer}</strong>
                <span>{item.choice}</span>
                <em>{item.paidService}</em>
              </article>
            ))}
          </div>
        </section>

        <section className="page-container section-padding">
          <div className="cta-strip">
            <Users className="h-7 w-7" />
            <div>
              <h2>Enter the improved SecureLearn workspace.</h2>
              <p>Students, lecturers, and administrators share one trust model with role-specific workflows.</p>
            </div>
            <div className="home-actions">
              <Link href="/courses" className={buttonVariants({ variant: "outline" })}><BookOpen className="h-4 w-4" />Courses</Link>
              <Link href="/login" className={buttonVariants()}><Fingerprint className="h-4 w-4" />Login</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function ConsoleRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="console-row">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
