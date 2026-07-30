export type AssuranceAction =
  | "lesson_progress"
  | "peer_review_signature"
  | "exam_start"
  | "exam_submit"
  | "policy_update";

export type AssuranceInput = {
  action: AssuranceAction;
  matchScore: number;
  livenessScore: number;
  templateDistance: number;
  behavioralDrift: number;
  originBound: boolean;
  credentialKnown: boolean;
  deviceKnown: boolean;
  sequenceSatisfied: boolean;
};

export type AuditEvidence = {
  id: string;
  time: string;
  actor: string;
  event: string;
  target: string;
  matchScore: number;
  livenessScore: number;
  status: "GRANTED" | "BLOCKED" | "STEP_UP";
  risk: "low" | "medium" | "high";
};

export const assurancePolicy = {
  matchThreshold: 90,
  livenessThreshold: 86,
  templateDistanceThreshold: 18,
  behavioralDriftThreshold: 24,
  recheckMinutes: 10,
  sequenceWindowMinutes: 5,
  retentionDays: 180,
  privacyBudget: 1.2,
  highRiskActions: ["peer_review_signature", "exam_start", "exam_submit", "policy_update"] as AssuranceAction[],
  rawBiometricStorage: false
};

export const literatureInsights = [
  {
    theme: "FIDO2, WebAuthn, and passkeys",
    papers: 11,
    sources: ["Barbosa et al. 2025", "Bhardwaj and Sastry 2026", "Mitra and Ghosh 2024"],
    productResponse: "Use origin-bound challenges and platform passkeys while preserving a no-cost simulated scanner for demos."
  },
  {
    theme: "Fingerprint liveness and adversarial resistance",
    papers: 21,
    sources: ["Al-Mannai et al. 2025", "Das et al. 2026", "Sumalatha et al. 2024"],
    productResponse: "Gate protected actions with match confidence, liveness, minutiae quality, spoof state, and policy thresholds."
  },
  {
    theme: "Privacy-preserving biometric templates",
    papers: 40,
    sources: ["Member and Sumalatha 2025", "Wu 2026", "Sayapov 2025"],
    productResponse: "Store no raw fingerprint images; surface consent, retention, salted-template, and minimum-necessity controls."
  },
  {
    theme: "LSH, zero-knowledge, and key binding",
    papers: 12,
    sources: ["Khranovskyi and Kernytskyy 2025", "Nyangaresi et al. 2024", "Zita and Khalil 2025"],
    productResponse: "Model template comparison with an irreversible distance score and evidence hash instead of raw biometric comparison."
  },
  {
    theme: "Decentralized identity and auditability",
    papers: 44,
    sources: ["Maic and Nirere 2026", "Ningthoujam et al. 2025", "Prajapati et al. 2026"],
    productResponse: "Use a tamper-evident local audit chain rather than paid blockchain infrastructure."
  },
  {
    theme: "LMS risk management and assessment integrity",
    papers: 27,
    sources: ["Al-Kareem and Saleh 2025", "Sudarto et al. 2024", "Mehrishi et al. 2025"],
    productResponse: "Separate open learning from high-risk events and bind exams to nonces, question-set hashes, and biometric proof."
  }
];

export const freeFirstStack = [
  { layer: "Runtime", choice: "Next.js on Node.js", paidService: "None required" },
  { layer: "Biometrics", choice: "WebAuthn plus local simulated fingerprint evidence", paidService: "None required" },
  { layer: "Data", choice: "Supabase Postgres through Prisma pooled runtime and direct migration URLs", paidService: "Existing Supabase plan" },
  { layer: "Personalization", choice: "Transparent scoring from enrolment, activity, pace, and privacy settings", paidService: "None required" },
  { layer: "Audit", choice: "Hash-chained security log evidence", paidService: "None required" }
];

export const assuranceScenarios: AssuranceInput[] = [
  {
    action: "exam_start",
    matchScore: 96,
    livenessScore: 94,
    templateDistance: 8,
    behavioralDrift: 9,
    originBound: true,
    credentialKnown: true,
    deviceKnown: true,
    sequenceSatisfied: false
  },
  {
    action: "peer_review_signature",
    matchScore: 98,
    livenessScore: 96,
    templateDistance: 6,
    behavioralDrift: 7,
    originBound: true,
    credentialKnown: true,
    deviceKnown: true,
    sequenceSatisfied: true
  },
  {
    action: "policy_update",
    matchScore: 81,
    livenessScore: 66,
    templateDistance: 31,
    behavioralDrift: 38,
    originBound: false,
    credentialKnown: false,
    deviceKnown: false,
    sequenceSatisfied: false
  }
];

export const seedAudit: AuditEvidence[] = [
  {
    id: "audit-001",
    time: "09:12",
    actor: "Ada Morgan",
    event: "PASSKEY_LOGIN",
    target: "Student dashboard",
    matchScore: 98,
    livenessScore: 97,
    status: "GRANTED",
    risk: "low"
  },
  {
    id: "audit-002",
    time: "09:33",
    actor: "Elena Rostova",
    event: "PEER_REVIEW_SIGNATURE",
    target: "Secure lab alpha",
    matchScore: 97,
    livenessScore: 96,
    status: "GRANTED",
    risk: "low"
  },
  {
    id: "audit-003",
    time: "09:41",
    actor: "Unknown device",
    event: "ADMIN_POLICY_ACCESS",
    target: "Liveness threshold",
    matchScore: 34,
    livenessScore: 12,
    status: "BLOCKED",
    risk: "high"
  }
];

export function evaluateAssurance(input: AssuranceInput) {
  const highRisk = assurancePolicy.highRiskActions.includes(input.action);
  const controls: string[] = [];
  let score = 100;

  if (input.matchScore < assurancePolicy.matchThreshold) {
    score -= 32;
    controls.push("Raise match confidence or recover the credential.");
  }
  if (input.livenessScore < assurancePolicy.livenessThreshold) {
    score -= 36;
    controls.push("Reject likely presentation attacks before matching.");
  }
  if (input.templateDistance > assurancePolicy.templateDistanceThreshold) {
    score -= 20;
    controls.push("Reject wide template-distance matches.");
  }
  if (input.behavioralDrift > assurancePolicy.behavioralDriftThreshold) {
    score -= 12;
    controls.push("Use continuous-authentication step-up.");
  }
  if (!input.originBound) {
    score -= 18;
    controls.push("Require origin-bound WebAuthn challenge verification.");
  }
  if (!input.credentialKnown) {
    score -= 16;
    controls.push("Deny unknown credential identifiers.");
  }
  if (!input.deviceKnown) {
    score -= 8;
    controls.push("Shorten the trust window for a new device.");
  }
  if (highRisk && !input.sequenceSatisfied) {
    score -= 18;
    controls.push("Require sequential fingerprint proof for this action.");
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const blocked =
    input.matchScore < assurancePolicy.matchThreshold ||
    input.livenessScore < assurancePolicy.livenessThreshold ||
    input.templateDistance > assurancePolicy.templateDistanceThreshold;
  const decision = blocked ? "BLOCKED" : score < 76 || (highRisk && !input.sequenceSatisfied) ? "STEP_UP_REQUIRED" : "GRANTED";
  const assuranceLevel = score >= 92 && (!highRisk || input.sequenceSatisfied) ? "AAL3" : score >= 76 ? "AAL2" : "AAL1";

  return {
    decision,
    assuranceLevel,
    score,
    highRisk,
    controls: controls.length ? controls : ["All configured biometric, privacy, and origin-binding controls pass."]
  };
}

export function stableHash(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

export function sealAudit(entries: AuditEvidence[]) {
  let previous = "GENESIS";
  return entries.map((entry) => {
    const evidence = stableHash(JSON.stringify(entry));
    const chainHash = stableHash(`${previous}:${evidence}`);
    const sealed = { ...entry, evidence, previous, chainHash };
    previous = chainHash;
    return sealed;
  });
}
