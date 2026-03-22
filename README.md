# Proof of Witness

**A Self-verified witness quorum for trust-sensitive claims.**

Proof of Witness lets evaluators, operators, and AI systems ask a question that cannot be responsibly settled by one more model output. When a claim matters, the product recruits a quorum of Self-verified human witnesses, collects structured testimony, and produces an attestation bundle with consensus, disagreement signals, and evidence coverage.

This is not a generic oracle and not another research copilot. It is a witness layer for high-trust decisions: public-goods evaluation, field verification, legitimacy checks, community attestations, and other cases where human-backed identity is the product.

## Track Alignment

### Primary: Best Self Agent ID Integration

Track UUID: `437781b864994698b2a304227e277b56`

| Track requirement | How Proof of Witness fits |
|---|---|
| Identity must be load-bearing | Testimony only counts toward quorum if it comes from a Self-verified witness agent |
| Human-backed, privacy-preserving identity | Witnesses prove humanity and policy requirements without revealing raw identity documents |
| Functional Self integration | The repo ships Self backend verifier middleware plus Self QR app configuration for witness enrollment |
| Sybil resistance matters | The product's trust model depends on Self's one-human-backed-agent identity rather than anonymous responses |

### Secondary: Agents for Public Goods Data Collection for Project Evaluation

Track UUID: `db41ba89c2214fc18ef707331645d3fe`

Why it fits:

- The sample flow is built around a public-goods project evaluation claim.
- Witness testimony surfaces qualitative legitimacy signals that dashboards do not capture.
- The product is purpose-built to collect richer, more reliable human-grounded evidence.

### Secondary: Agents for Public Goods Data Analysis for Project Evaluation

Track UUID: `4026705215f3401db4f2092f7219561b`

Why it fits:

- The engine computes consensus ratio, contradiction flags, evidence coverage, and follow-up questions.
- The output is an evaluator-ready dossier rather than a raw list of quotes.

### Secondary: Synthesis Open Track

Track UUID: `fdb76d08812b43f6a5f454744b66f590`

Why it fits:

- It is a distinct agentic product with a clear trust layer and concrete use.

## Problem

Many decisions need human-grounded truth, but current systems force a bad tradeoff:

- anonymous forms are easy to game
- surveys produce low-trust signals
- one expert review does not scale
- AI summaries can sound confident without grounding
- evaluators lack a clean way to separate evidence from social noise

This is especially painful in public-goods funding, field operations, and legitimacy checks. The missing layer is not another model. It is a privacy-preserving way to ask: **which verified humans saw this, what do they say, and where do they disagree?**

## Solution

Proof of Witness turns a claim into a structured witness round:

1. A requester opens a claim.
2. Witnesses enroll with Self Agent ID.
3. Only Self-verified witnesses can submit testimony.
4. The engine aggregates verdicts, confidence, and evidence references.
5. The output becomes a bundle and dossier that a human or agent can act on.

The product does not try to erase disagreement. It exposes it. That makes it useful.

## What Is Shipped

- A deterministic quorum engine in [`src/core/quorum.mjs`](./src/core/quorum.mjs)
- Claim-to-dossier workflow code in [`src/core/engine.mjs`](./src/core/engine.mjs)
- Self backend verifier helpers in [`src/self/agent-verifier.mjs`](./src/self/agent-verifier.mjs)
- Self witness-enrollment app config in [`src/self/app-config.mjs`](./src/self/app-config.mjs)
- An Express server skeleton in [`src/server/app.mjs`](./src/server/app.mjs)
- A local no-secrets demo in [`src/demo.mjs`](./src/demo.mjs)
- Sample outputs in [`examples/`](./examples)
- A static product preview in [`web/index.html`](./web/index.html)
- Submission metadata template in [`submission.template.json`](./submission.template.json)
- Judged build narrative in [`conversationLog.md`](./conversationLog.md)

## Why Self Is Load-Bearing

Without Self, this collapses into anonymous testimony collection.

With Self:

- each accepted witness is human-backed
- testimony can be gated by minimum age and OFAC checks
- the system can reject non-verified responses before they influence quorum
- no raw passport data is stored in the application

That is the core product claim. Identity is not decoration here. It determines who gets to count.

## Product Model

```text
Claim opened
    |
    v
+-------------------------+
| Witness Enrollment      |
| Self QR / deep link     |
| proof requirements      |
+------------+------------+
             |
             v
+-------------------------+
| Verified Witness Pool   |
| one human-backed agent  |
| per accepted witness    |
+------------+------------+
             |
             v
+-------------------------+
| Testimony Intake        |
| verdict, confidence,    |
| evidence refs, tags     |
+------------+------------+
             |
             v
+-------------------------+
| Quorum Engine           |
| consensus ratio         |
| divergence map          |
| evidence coverage       |
+------------+------------+
             |
             v
+-------------------------+
| Attestation Bundle      |
| requester brief         |
| evaluator dossier       |
+-------------------------+
```

## Demo Scenario

The included sample is framed for public-goods evaluation:

- target project: `Solar Classroom DAO`
- question: did the project really run six workshops and deliver roughly 180 refurbished devices in Nairobi?
- witness quorum: local educator, volunteer coordinator, school partner, and community witness
- identity rule: Self-verified, age-gated, OFAC-screened witnesses only

Run the local demo:

```bash
npm install
npm run demo
```

The demo writes:

- `output/<claim-id>/attestation-bundle.json`
- `output/<claim-id>/dossier.md`
- `output/<claim-id>/requester-brief.md`

Prebuilt artifacts also live in [`examples/`](./examples).

## Server Routes

The included server is intentionally small but submission-grade:

- `POST /api/claims`
- `GET /api/claims/:claimId`
- `GET /api/claims/:claimId/enrollment/:witnessId`
- `POST /api/claims/:claimId/testimonies`
- `GET /api/claims/:claimId/bundle`

The testimony route already expects a Self proof payload and verifies it server-side before testimony is accepted.

## Security

The submission is intentionally clean:

- no private keys are committed
- `.env` is ignored
- `.env.example` contains placeholders only
- the demo runs without secrets
- no raw identity documents are stored

If deployed live, keep actual Self keys and endpoints in environment variables only.

## Repo Structure

```text
proof-of-witness/
├── .env.example
├── .gitignore
├── agent.json
├── conversationLog.md
├── examples/
│   ├── public-goods-bundle.json
│   ├── public-goods-dossier.md
│   └── requester-brief.md
├── package.json
├── README.md
├── scenarios/
│   ├── public-goods-claim.json
│   └── public-goods-testimonies.json
├── submission.template.json
├── src/
│   ├── core/
│   │   ├── engine.mjs
│   │   ├── quorum.mjs
│   │   ├── schemas.mjs
│   │   └── utils.mjs
│   ├── demo.mjs
│   ├── index.mjs
│   ├── self/
│   │   ├── agent-verifier.mjs
│   │   └── app-config.mjs
│   └── server/
│       └── app.mjs
└── web/
    ├── app.js
    ├── index.html
    ├── sample-bundle.js
    └── styles.css
```

## Honest Scope

What is implemented:

- a deterministic witness quorum engine
- Self-focused verifier and enrollment modules
- sample artifacts for evaluator review
- a claim-oriented product story with strong track fit

What is not claimed:

- no production witness payout system
- no live on-chain attestation contract
- no storage of raw personal data from witness documents

That is deliberate. The repo stays honest, privacy-respecting, and strongly aligned with the Self track instead of pretending to ship more than it does.
