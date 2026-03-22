import fs from "node:fs/promises";
import path from "node:path";
import { evaluateQuorum } from "./quorum.mjs";
import {
  compactLines,
  formatBullets,
  makeClaimId,
  nowIso,
  slugify,
  verdictLabel
} from "./utils.mjs";

export function buildWitnessBundle(claim, testimonies) {
  const claimId = makeClaimId(claim);
  const quorum = evaluateQuorum(claim, testimonies);

  const recommendationNotes = {
    "needs-more-witnesses": "Do not score this claim yet. The witness quorum is incomplete.",
    "hold-and-investigate": "The witness pool materially disagrees. Escalate before any final judgement.",
    "approve-with-caveats": "The core claim looks directionally true, but the dossier contains meaningful caveats.",
    "provisionally-verified": "The claim is supported by a Self-verified witness quorum with usable evidence coverage.",
    "verify-more-evidence": "The witness pool leans positive, but the evidence density is still thin."
  };

  const summary =
    quorum.consensus.verdict === "split"
      ? "The witness pool is split and should not be collapsed into a single confident claim."
      : `The witness pool currently leans ${verdictLabel(quorum.consensus.verdict).toLowerCase()} with a consensus ratio of ${quorum.consensus.consensusRatio}.`;

  return {
    claimId,
    createdAt: nowIso(),
    claim,
    identityRequirements: {
      provider: "Self Agent ID",
      minimumAge: claim.disclosures?.minimumAge || null,
      ofac: Boolean(claim.disclosures?.ofac),
      nationalityDisclosure: Boolean(claim.disclosures?.nationality)
    },
    quorum: {
      requiredWitnesses: claim.minimumWitnesses,
      acceptedWitnesses: quorum.accepted.length,
      rejectedWitnesses: quorum.rejected.length,
      quorumReached: quorum.quorumReached
    },
    consensus: quorum.consensus,
    evidenceCoverage: quorum.evidenceCoverage,
    recommendation: {
      outcome: quorum.recommendation,
      note: recommendationNotes[quorum.recommendation]
    },
    summary,
    divergences: quorum.divergences,
    nextQuestions: quorum.nextQuestions,
    acceptedWitnesses: quorum.accepted.map((item) => ({
      witnessAlias: item.witnessAlias,
      role: item.role,
      region: item.region,
      verdict: item.verdict,
      confidence: item.confidence,
      nationality: item.verification?.nationality || "",
      evidenceCount: (item.evidenceRefs || []).length,
      statement: item.statement
    })),
    rejectedWitnesses: quorum.rejected
  };
}

export function renderRequesterBrief(bundle) {
  return compactLines([
    `# Requester Brief — ${bundle.claim.title}`,
    "",
    `- Claim ID: \`${bundle.claimId}\``,
    `- Target project: ${bundle.claim.targetProject}`,
    `- Primary track fit: Best Self Agent ID Integration`,
    `- Recommendation: **${bundle.recommendation.outcome}**`,
    "",
    "## Summary",
    "",
    bundle.summary,
    "",
    "## Why this result is trustworthy",
    "",
    formatBullets([
      `${bundle.quorum.acceptedWitnesses} Self-verified witnesses counted`,
      `${bundle.rejectedWitnesses.length} non-compliant witness submissions excluded`,
      `Evidence coverage: ${bundle.evidenceCoverage}`,
      `Consensus confidence: ${bundle.consensus.weightedConfidence}`
    ]),
    "",
    "## Follow-up questions",
    "",
    formatBullets(bundle.nextQuestions)
  ]);
}

export function renderDossierMarkdown(bundle) {
  return compactLines([
    `# Evaluation Dossier — ${bundle.claim.targetProject}`,
    "",
    `- Claim ID: \`${bundle.claimId}\``,
    `- Question: ${bundle.claim.question}`,
    `- Requested by: ${bundle.claim.requestedBy}`,
    `- Location: ${bundle.claim.location}`,
    "",
    "## Witness Identity Rules",
    "",
    formatBullets([
      "Self Agent ID required for every counted witness",
      `Minimum age: ${bundle.identityRequirements.minimumAge}+`,
      `OFAC screening enabled: ${bundle.identityRequirements.ofac ? "yes" : "no"}`,
      `Nationality disclosure requested: ${bundle.identityRequirements.nationalityDisclosure ? "yes" : "no"}`
    ]),
    "",
    "## Result",
    "",
    `Consensus verdict: **${verdictLabel(bundle.consensus.verdict)}**`,
    "",
    formatBullets([
      `Accepted witnesses: ${bundle.quorum.acceptedWitnesses}/${bundle.quorum.requiredWitnesses} required`,
      `Consensus ratio: ${bundle.consensus.consensusRatio}`,
      `Weighted confidence: ${bundle.consensus.weightedConfidence}`,
      `Evidence coverage: ${bundle.evidenceCoverage}`,
      `Recommendation: ${bundle.recommendation.outcome}`
    ]),
    "",
    "## Divergences",
    "",
    bundle.divergences.length
      ? formatBullets(
          bundle.divergences.map(
            (item) => `${item.key}: ${item.values.join(", ")}`
          )
        )
      : "- No material divergences detected.",
    "",
    "## Accepted Witnesses",
    "",
    formatBullets(
      bundle.acceptedWitnesses.map(
        (item) =>
          `${item.witnessAlias} (${item.role}) — ${verdictLabel(item.verdict)}, confidence ${item.confidence}, evidence refs ${item.evidenceCount}`
      )
    ),
    "",
    "## Excluded Witnesses",
    "",
    bundle.rejectedWitnesses.length
      ? formatBullets(
          bundle.rejectedWitnesses.map(
            (item) => `${item.witnessAlias}: ${item.reason}`
          )
        )
      : "- None",
    "",
    "## Follow-Up Questions",
    "",
    formatBullets(bundle.nextQuestions)
  ]);
}

export async function writeDemoArtifacts(bundle, rootDir) {
  const outputDir = path.join(rootDir, slugify(bundle.claimId));
  await fs.mkdir(outputDir, { recursive: true });

  const bundlePath = path.join(outputDir, "attestation-bundle.json");
  const dossierPath = path.join(outputDir, "dossier.md");
  const briefPath = path.join(outputDir, "requester-brief.md");

  await fs.writeFile(bundlePath, JSON.stringify(bundle, null, 2));
  await fs.writeFile(dossierPath, renderDossierMarkdown(bundle));
  await fs.writeFile(briefPath, renderRequesterBrief(bundle));

  return {
    outputDir,
    files: [bundlePath, dossierPath, briefPath]
  };
}
