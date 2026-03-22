import crypto from "node:crypto";

export function nowIso() {
  return new Date().toISOString();
}

export function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function average(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function makeClaimId(claim) {
  const seed = [claim.title, claim.targetProject, claim.location, claim.requestedAt].join("|");
  return `pow-${crypto.createHash("sha256").update(seed).digest("hex").slice(0, 10)}`;
}

export function compactLines(lines) {
  return lines.filter(Boolean).join("\n");
}

export function formatBullets(items) {
  return (items || []).map((item) => `- ${item}`).join("\n");
}

export function verdictLabel(verdict) {
  const labels = {
    support: "Support",
    partial: "Partial",
    contest: "Contest",
    insufficient: "Insufficient Evidence"
  };
  return labels[verdict] || verdict;
}

export function titleCase(value) {
  return String(value)
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}
