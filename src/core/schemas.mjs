import { z } from "zod";

export const claimSchema = z.object({
  title: z.string(),
  category: z.string(),
  requestedBy: z.string(),
  targetProject: z.string(),
  location: z.string(),
  requestedAt: z.string(),
  question: z.string(),
  context: z.string(),
  minimumWitnesses: z.number().int().positive(),
  disclosures: z.object({
    minimumAge: z.number().int().positive(),
    ofac: z.boolean(),
    nationality: z.boolean()
  }),
  desiredWitnessProfile: z.array(z.string()),
  evaluationGoals: z.array(z.string())
});

export const testimonySchema = z.object({
  submissionId: z.string(),
  witnessAgentId: z.string(),
  witnessAlias: z.string(),
  role: z.string(),
  region: z.string(),
  verifiedHuman: z.boolean(),
  verification: z.object({
    minimumAgeMet: z.boolean(),
    ofacPassed: z.boolean(),
    nationality: z.string()
  }),
  verdict: z.enum(["support", "partial", "contest", "insufficient"]),
  confidence: z.number().min(0).max(1),
  statement: z.string(),
  evidenceRefs: z.array(z.string()),
  tags: z.array(z.string())
});

export const testimoniesSchema = z.array(testimonySchema);
