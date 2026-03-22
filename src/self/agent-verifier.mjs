import { AllIds, DefaultConfigStore, SelfBackendVerifier } from "@selfxyz/core";

export function createWitnessVerifier() {
  const verifier = new SelfBackendVerifier(
    process.env.SELF_SCOPE || "pow-witness",
    process.env.SELF_ENDPOINT || "https://example.com/api/self/verify",
    String(process.env.SELF_DEV_MODE || "true") === "true",
    AllIds,
    new DefaultConfigStore({
      minimumAge: Number(process.env.SELF_MIN_AGE || 18),
      excludedCountries: [],
      ofac: true
    }),
    "hex"
  );

  return {
    async verify(payload = {}) {
      const { attestationId, proof, publicSignals, userContextData } = payload;

      if (!attestationId || !proof || !publicSignals || !userContextData) {
        throw new Error(
          "selfProof.attestationId, selfProof.proof, selfProof.publicSignals, and selfProof.userContextData are required."
        );
      }

      return verifier.verify(attestationId, proof, publicSignals, userContextData);
    },
    auth() {
      return async (req, res, next) => {
        try {
          const result = await this.verify(req.body?.selfProof);
          if (!result?.isValidDetails?.isValid) {
            res.status(401).json({
              accepted: false,
              error: "self verification failed",
              details: result?.isValidDetails || null
            });
            return;
          }

          req.selfVerification = result.discloseOutput || null;
          next();
        } catch (error) {
          res.status(400).json({
            accepted: false,
            error: error instanceof Error ? error.message : "self verification failed"
          });
        }
      };
    }
  };
}

export async function verifyWitnessProof(payload) {
  const verifier = createWitnessVerifier();
  return verifier.verify(payload);
}
