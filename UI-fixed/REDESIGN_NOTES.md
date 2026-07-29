# SecureLearn UI-fixed Redesign Notes

## Scope

The root project is preserved as the before version. `UI-fixed` is the revised SecureLearn project that integrates BioLearn Synth's biometric assurance ideas and applies the premium SaaS redesign pass.

## Literature-backed product decisions

| Literature theme | Product decision |
| --- | --- |
| FIDO2, WebAuthn, and passkeys | Keep SecureLearn's existing passkey architecture and add origin-bound assurance scoring. |
| Fingerprint liveness and spoof resistance | Add match, liveness, template-distance, behavior-drift, and spoof-oriented risk controls. |
| Privacy-preserving templates | Keep raw biometric storage disabled and expose consent, retention, and privacy-budget controls. |
| LSH, zero-knowledge, and key binding | Model irreversible template evidence with distance scoring and stable evidence hashes. |
| Decentralized identity and auditability | Use a free local hash-chained audit ledger instead of paid blockchain infrastructure. |
| LMS risk management and assessment integrity | Separate open learning from high-risk actions such as exam unlocks, submissions, policy updates, and peer review signatures. |

## Design reference synthesis

| Reference area | What applies to SecureLearn | What was not copied |
| --- | --- | --- |
| Awwwards Product Honors | Editorial first viewport, strong product artifact, and clear status cues. | Decorative product theatrics that hide core workflows. |
| Awwwards UI Design | Dense but legible operational panels, compact labels, deliberate focus states. | Generic dark dashboard templates. |
| Awwwards Data Visualization | Thresholds, evidence hashes, trust rings, and provenance markers. | Decorative charts without actionability. |
| Awwwards Interaction Design | Subtle hover states, reduced-motion support, and canvas motion that clarifies biometric scanning. | Heavy 3D scenes or paid media assets. |

## Design system

- Typography: free Google fonts through `next/font`: Instrument Sans for interface text and Newsreader for editorial headings.
- Palette: off-white operational surfaces, deep green-black ink, biometric teal, liveness green, warning amber, risk coral, and audit violet.
- Radius: 8px token for command surfaces.
- Motion: short 180ms transitions with reduced-motion fallback.
- Data visualization: trust ring, scanner canvas, evidence rows, threshold cards, and audit hash chain.
- Visual asset system: canvas-based biometric trust surface plus UI-rendered product console. No paid images, videos, models, or external media.

## Component state matrix

- Buttons: default, hover, focus-visible, disabled through shared button styles and premium action classes.
- Navigation: default, hover, focus-visible, mobile compact layout.
- Cards and panels: default, elevated, warning/risk through border color and semantic badges.
- Inputs: default, focus-visible, selected, range updates.
- Audit rows: low, medium, high risk via left-border semantic color.
- Canvas: animated by default, static when reduced motion is requested.

## Verification targets

- Original app: root SecureLearn project.
- Redesigned app: `UI-fixed`.
- Intended preview ports: original `4300`, redesigned `4301`.
- Checks: structure validation, security invariant script, TypeScript, build where local environment allows.
- Browser QA: desktop, tablet, and mobile screenshots with Playwright.

## Verification results

- `npm run validate:structure`: passed.
- `npm run check:security`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed with one inherited `<img>` warning in `components/courses/course-card.tsx`.
- `npm run build`: passed and generated the new `/assurance`, `/api/assurance/evaluate`, and `/api/assurance/audit-chain` routes.
- Playwright screenshots were captured in `redesign-screenshots/` for before home, after home, and after assurance at desktop, tablet, and mobile widths.
- Playwright overflow checks reported no horizontal overflow for the tested desktop, tablet, and mobile views.
- Canvas verification found the assurance trust surface rendered with opaque and colored pixels after hydration.

## Limitations and needed inputs

- Live production data was not provided; assurance cards use deterministic demo evidence.
- No real fingerprint reader API is used because browsers do not expose raw fingerprints. WebAuthn remains the production-safe biometric path.
- No paid services were added.
- A real visual identity package, institution photography, and approved product screenshots would improve production polish.
