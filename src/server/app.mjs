import express from "express";
import { buildWitnessBundle } from "../core/engine.mjs";
import { claimSchema, testimonySchema } from "../core/schemas.mjs";
import { makeClaimId } from "../core/utils.mjs";
import { buildWitnessEnrollmentApp } from "../self/app-config.mjs";
import { createWitnessVerifier } from "../self/agent-verifier.mjs";

export function createApp() {
  const app = express();
  const verifier = createWitnessVerifier();

  const claims = new Map();
  const testimonies = new Map();

  app.use(express.json());

  app.get("/healthz", (_req, res) => {
    res.json({ ok: true, service: "proof-of-witness" });
  });

  app.post("/api/claims", (req, res) => {
    const claim = claimSchema.parse(req.body);
    const claimId = makeClaimId(claim);
    claims.set(claimId, claim);
    testimonies.set(claimId, []);
    res.json({ claimId, claim });
  });

  app.get("/api/claims/:claimId", (req, res) => {
    const claim = claims.get(req.params.claimId);
    if (!claim) {
      res.status(404).json({ error: "claim not found" });
      return;
    }
    res.json({ claimId: req.params.claimId, claim });
  });

  app.get("/api/claims/:claimId/enrollment/:witnessId", (req, res) => {
    const claim = claims.get(req.params.claimId);
    if (!claim) {
      res.status(404).json({ error: "claim not found" });
      return;
    }
    res.json(buildWitnessEnrollmentApp(req.params));
  });

  app.post("/api/claims/:claimId/testimonies", verifier.auth(), (req, res) => {
    const claim = claims.get(req.params.claimId);
    if (!claim) {
      res.status(404).json({ error: "claim not found" });
      return;
    }

    const selfResult = req.selfVerification || {};
    const parsed = testimonySchema.parse({
      ...req.body,
      verifiedHuman: true,
      verification: {
        minimumAgeMet: !!selfResult.minimumAge,
        ofacPassed: !!selfResult.ofac,
        nationality: selfResult.nationality || "undisclosed"
      }
    });
    const items = testimonies.get(req.params.claimId) || [];
    items.push(parsed);
    testimonies.set(req.params.claimId, items);
    res.json({ accepted: true, count: items.length });
  });

  app.get("/api/claims/:claimId/bundle", (req, res) => {
    const claim = claims.get(req.params.claimId);
    if (!claim) {
      res.status(404).json({ error: "claim not found" });
      return;
    }
    const bundle = buildWitnessBundle(claim, testimonies.get(req.params.claimId) || []);
    res.json(bundle);
  });

  return app;
}
