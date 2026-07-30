"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  Download,
  Fingerprint,
  KeyRound,
  LockKeyhole,
  Radar,
  RefreshCcw,
  ShieldCheck,
  SlidersHorizontal
} from "lucide-react";
import {
  assurancePolicy,
  assuranceScenarios,
  evaluateAssurance,
  sealAudit,
  seedAudit,
  type AssuranceInput
} from "@/lib/biometric-assurance";
import { cn } from "@/lib/utils";

const actionLabels: Record<AssuranceInput["action"], string> = {
  lesson_progress: "Lesson progress",
  peer_review_signature: "Peer review signature",
  exam_start: "Exam unlock",
  exam_submit: "Exam submission",
  policy_update: "Policy update"
};

export function AssuranceCommandCenter() {
  const [input, setInput] = useState<AssuranceInput>(assuranceScenarios[0]);
  const [sequenceFresh, setSequenceFresh] = useState(false);
  const [privacy, setPrivacy] = useState({
    consent: true,
    mode: "Privacy-preserving cohort",
    retentionDays: assurancePolicy.retentionDays,
    epsilon: assurancePolicy.privacyBudget,
    cohortSignals: true
  });
  const assessment = useMemo(() => evaluateAssurance({ ...input, sequenceSatisfied: sequenceFresh || input.sequenceSatisfied }), [input, sequenceFresh]);
  const sealedAudit = useMemo(() => sealAudit(seedAudit), []);

  function updateNumber(name: keyof AssuranceInput, value: string) {
    setInput((current) => ({ ...current, [name]: Number(value) }));
  }

  function updateBoolean(name: keyof AssuranceInput, value: boolean) {
    setInput((current) => ({ ...current, [name]: value }));
  }

  function exportEvidence() {
    const blob = new Blob(
      [
        JSON.stringify(
          {
            exportedAt: new Date().toISOString(),
            assurancePolicy,
            assessment,
            privacy,
            sealedAudit
          },
          null,
          2
        )
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "securelearn-assurance-evidence.json";
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="assurance-shell">
      <section className="assurance-hero-panel">
        <div className="assurance-copy">
          <p className="kicker">BioLearn Synth integrated</p>
          <h1>Biometric assurance command center for collaborative learning.</h1>
          <p>
            A premium SecureLearn workspace for liveness, passkey trust, privacy-preserving personalization, two-finger step-up proof,
            and tamper-evident assessment records.
          </p>
          <div className="assurance-action-row">
            <button type="button" className="premium-button" onClick={() => setSequenceFresh(true)}>
              <Fingerprint className="h-4 w-4" />
              Run sequential proof
            </button>
            <button type="button" className="premium-button secondary" onClick={exportEvidence}>
              <Download className="h-4 w-4" />
              Export evidence
            </button>
          </div>
        </div>
        <div className="assurance-visual" aria-label="Fingerprint trust signal visualization">
          <TrustSignalCanvas score={assessment.score} decision={assessment.decision} />
          <div className="visual-readout">
            <span>{assessment.assuranceLevel}</span>
            <strong>{assessment.score}/100</strong>
            <small>{assessment.decision.replaceAll("_", " ")}</small>
          </div>
        </div>
      </section>

      <section className="assurance-metric-grid" aria-label="Assurance metrics">
        <Metric label="Match confidence" value={`${input.matchScore}%`} tone="teal" detail={`Threshold ${assurancePolicy.matchThreshold}%`} />
        <Metric label="Liveness" value={`${input.livenessScore}%`} tone="green" detail={`Threshold ${assurancePolicy.livenessThreshold}%`} />
        <Metric label="Template distance" value={input.templateDistance} tone="amber" detail={`Ceiling ${assurancePolicy.templateDistanceThreshold}`} />
        <Metric label="Audit chain" value="Valid" tone="violet" detail={`${sealedAudit.length} sealed records`} />
      </section>

      <div className="assurance-main-grid">
        <section className="command-panel simulator-panel">
          <PanelHeading icon={SlidersHorizontal} label="Risk simulator" title="Assurance decision model" />
          <label className="field-stack">
            <span>Protected action</span>
            <select value={input.action} onChange={(event) => setInput((current) => ({ ...current, action: event.target.value as AssuranceInput["action"] }))}>
              {Object.entries(actionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <Slider label="Match confidence" value={input.matchScore} min={50} max={99} suffix="%" onChange={(value) => updateNumber("matchScore", value)} />
          <Slider label="Liveness confidence" value={input.livenessScore} min={50} max={99} suffix="%" onChange={(value) => updateNumber("livenessScore", value)} />
          <Slider label="Template distance" value={input.templateDistance} min={3} max={40} onChange={(value) => updateNumber("templateDistance", value)} />
          <Slider label="Behavior drift" value={input.behavioralDrift} min={0} max={60} onChange={(value) => updateNumber("behavioralDrift", value)} />
          <div className="toggle-matrix">
            <Toggle label="Origin-bound" checked={input.originBound} onChange={(value) => updateBoolean("originBound", value)} />
            <Toggle label="Known credential" checked={input.credentialKnown} onChange={(value) => updateBoolean("credentialKnown", value)} />
            <Toggle label="Known device" checked={input.deviceKnown} onChange={(value) => updateBoolean("deviceKnown", value)} />
            <Toggle label="Sequence fresh" checked={sequenceFresh || input.sequenceSatisfied} onChange={(value) => {
              setSequenceFresh(value);
              updateBoolean("sequenceSatisfied", value);
            }} />
          </div>
        </section>

        <section className="command-panel decision-panel">
          <PanelHeading icon={Radar} label="Decision" title={assessment.decision.replaceAll("_", " ")} />
          <div className="score-orbit" style={{ "--score": assessment.score } as CSSProperties}>
            <strong>{assessment.score}</strong>
            <span>{assessment.assuranceLevel}</span>
          </div>
          <div className="control-stack">
            {assessment.controls.map((control) => (
              <p key={control}>
                <CheckCircle2 className="h-4 w-4" />
                {control}
              </p>
            ))}
          </div>
          <div className="sequence-strip">
            <Fingerprint className="h-5 w-5" />
            <div>
              <strong>{sequenceFresh ? "Sequential proof fresh" : "Step-up proof not fresh"}</strong>
              <span>Right index plus right thumb within {assurancePolicy.sequenceWindowMinutes} minutes.</span>
            </div>
            <button type="button" className="icon-control" onClick={() => setSequenceFresh((value) => !value)} aria-label="Toggle sequential proof">
              <RefreshCcw className="h-4 w-4" />
            </button>
          </div>
        </section>

        <section className="command-panel privacy-panel">
          <PanelHeading icon={LockKeyhole} label="Minimum necessity" title="Consent and retention" />
          <Toggle label="Biometric consent active" checked={privacy.consent} onChange={(consent) => setPrivacy((current) => ({ ...current, consent }))} />
          <label className="field-stack">
            <span>Personalization mode</span>
            <select value={privacy.mode} onChange={(event) => setPrivacy((current) => ({ ...current, mode: event.target.value }))}>
              <option>Privacy-preserving cohort</option>
              <option>Local only</option>
              <option>Disabled</option>
            </select>
          </label>
          <Slider
            label="Retention window"
            value={privacy.retentionDays}
            min={7}
            max={730}
            suffix=" days"
            onChange={(value) => setPrivacy((current) => ({ ...current, retentionDays: Number(value) }))}
          />
          <Slider
            label="Privacy budget epsilon"
            value={privacy.epsilon}
            min={0.2}
            max={5}
            step={0.1}
            onChange={(value) => setPrivacy((current) => ({ ...current, epsilon: Number(value) }))}
          />
          <Toggle label="Share anonymized cohort signals" checked={privacy.cohortSignals} onChange={(cohortSignals) => setPrivacy((current) => ({ ...current, cohortSignals }))} />
          <div className="storage-lock">
            <ShieldCheck className="h-5 w-5" />
            <div>
              <strong>Raw fingerprint storage disabled</strong>
              <span>Only credential metadata, salted evidence, and audit hashes are modeled.</span>
            </div>
          </div>
        </section>

        <section className="command-panel audit-panel">
          <PanelHeading icon={KeyRound} label="Tamper evidence" title="Hash-chained audit trail" />
          <div className="audit-ledger">
            {sealedAudit.map((entry) => (
              <article key={entry.id} className={cn("ledger-row", entry.risk)}>
                <span>{entry.time}</span>
                <div>
                  <strong>{entry.event}</strong>
                  <small>{entry.actor} - {entry.target}</small>
                </div>
                <div>
                  <strong>{entry.chainHash}</strong>
                  <small>prev {entry.previous.slice(0, 8)}</small>
                </div>
                <em>{entry.status}</em>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function TrustSignalCanvas({ score, decision }: { score: number; decision: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const targetCanvas = canvas;
    const ctx = context;
    let frame = 0;
    let raf = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function draw() {
      const width = targetCanvas.width;
      const height = targetCanvas.height;
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#101a17");
      gradient.addColorStop(0.55, "#17201d");
      gradient.addColorStop(1, "#2b1925");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2 + 8);
      const tone = decision === "BLOCKED" ? "226, 82, 98" : decision === "STEP_UP_REQUIRED" ? "224, 161, 64" : "24, 148, 124";
      for (let index = 0; index < 24; index += 1) {
        const movement = reduceMotion ? 0 : Math.sin((frame + index * 8) / 28) * 2.4;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(${tone}, ${0.12 + index / 44})`;
        ctx.lineWidth = index % 5 === 0 ? 2.4 : 1.2;
        ctx.ellipse(0, movement, 32 + index * 7, 52 + index * 8, -0.08, Math.PI * 0.92, Math.PI * 2.08);
        ctx.stroke();
      }
      const y = -150 + (score / 100) * 300;
      ctx.fillStyle = `rgba(${tone}, 0.16)`;
      ctx.fillRect(-148, y - 16, 296, 32);
      ctx.strokeStyle = `rgba(${tone}, 0.92)`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-154, y);
      ctx.lineTo(154, y);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.font = "700 14px sans-serif";
      ctx.fillText("LIVE TRUST SURFACE", 24, 34);
      ctx.fillStyle = "rgba(255,255,255,0.42)";
      ctx.fillText("PASSKEY + LIVENESS + TEMPLATE DISTANCE", 24, 56);

      frame += 1;
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(raf);
  }, [decision, score]);

  const tone = decision === "BLOCKED" ? "226, 82, 98" : decision === "STEP_UP_REQUIRED" ? "224, 161, 64" : "24, 148, 124";

  return (
    <>
      <canvas ref={canvasRef} width={520} height={420} />
      <div className="trust-signal-fallback" style={{ "--tone": tone, "--score": score } as CSSProperties} aria-hidden="true" />
    </>
  );
}

function Metric({ label, value, detail, tone }: { label: string; value: string | number; detail: string; tone: string }) {
  return (
    <article className={cn("assurance-metric", tone)}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function PanelHeading({ icon: Icon, label, title }: { icon: LucideIcon; label: string; title: string }) {
  return (
    <div className="panel-heading">
      <span>
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p>{label}</p>
        <h2>{title}</h2>
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  suffix = "",
  step = 1,
  onChange
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  step?: number;
  onChange: (value: string) => void;
}) {
  return (
    <label className="range-stack">
      <span>
        {label}
        <strong>{value}{suffix}</strong>
      </span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="toggle-control">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
