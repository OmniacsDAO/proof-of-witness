import { average, round, titleCase } from "./utils.mjs";

function verdictCounts(testimonies) {
  return testimonies.reduce(
    (counts, item) => {
      counts[item.verdict] = (counts[item.verdict] || 0) + 1;
      return counts;
    },
    {
      support: 0,
      partial: 0,
      contest: 0,
      insufficient: 0
    }
  );
}

function pickConsensus(counts) {
  const ordered = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [verdict, count] = ordered[0];
  const second = ordered[1]?.[1] || 0;
  return {
    verdict: count === second ? "split" : verdict,
    topCount: count
  };
}

function collectTagDivergences(testimonies) {
  const buckets = new Map();

  for (const testimony of testimonies) {
    for (const tag of testimony.tags || []) {
      const [key, value] = tag.split(":");
      if (!key || !value) continue;
      const bucket = buckets.get(key) || new Set();
      bucket.add(value);
      buckets.set(key, bucket);
    }
  }

  return [...buckets.entries()]
    .filter(([, values]) => values.size > 1)
    .map(([key, values]) => ({
      key,
      values: [...values]
    }));
}

export function evaluateQuorum(claim, testimonies) {
  const accepted = [];
  const rejected = [];

  for (const testimony of testimonies) {
    if (!testimony.verifiedHuman) {
      rejected.push({
        witnessAlias: testimony.witnessAlias,
        reason: "missing Self verification"
      });
      continue;
    }

    if (claim.disclosures?.minimumAge && !testimony.verification?.minimumAgeMet) {
      rejected.push({
        witnessAlias: testimony.witnessAlias,
        reason: "minimum age requirement not satisfied"
      });
      continue;
    }

    if (claim.disclosures?.ofac && !testimony.verification?.ofacPassed) {
      rejected.push({
        witnessAlias: testimony.witnessAlias,
        reason: "OFAC requirement not satisfied"
      });
      continue;
    }

    accepted.push(testimony);
  }

  const counts = verdictCounts(accepted);
  const consensus = pickConsensus(counts);
  const evidenceCoverage = accepted.length
    ? accepted.filter((item) => (item.evidenceRefs || []).length > 0).length / accepted.length
    : 0;
  const averageConfidence = average(accepted.map((item) => item.confidence || 0));
  const consensusRatio = accepted.length ? consensus.topCount / accepted.length : 0;
  const weightedConfidence = round(averageConfidence * (0.6 + 0.4 * consensusRatio));
  const divergences = collectTagDivergences(accepted);
  const quorumReached = accepted.length >= claim.minimumWitnesses;

  let recommendation = "needs-more-witnesses";
  if (quorumReached) {
    if (consensus.verdict === "contest" || consensusRatio < 0.6) {
      recommendation = "hold-and-investigate";
    } else if (consensus.verdict === "partial") {
      recommendation = "approve-with-caveats";
    } else if (consensus.verdict === "support" && evidenceCoverage >= 0.66) {
      recommendation = "provisionally-verified";
    } else {
      recommendation = "verify-more-evidence";
    }
  }

  const nextQuestions = [];
  if (!quorumReached) {
    nextQuestions.push("Recruit more Self-verified witnesses before reaching a conclusion.");
  }
  if (evidenceCoverage < 0.66) {
    nextQuestions.push("Collect at least one more evidence-backed witness statement.");
  }
  for (const divergence of divergences) {
    nextQuestions.push(
      `Resolve divergence on ${titleCase(divergence.key)}: ${divergence.values.join(", ")}.`
    );
  }

  return {
    accepted,
    rejected,
    counts,
    consensus: {
      verdict: consensus.verdict,
      consensusRatio: round(consensusRatio),
      weightedConfidence
    },
    evidenceCoverage: round(evidenceCoverage),
    divergences,
    quorumReached,
    recommendation,
    nextQuestions
  };
}
