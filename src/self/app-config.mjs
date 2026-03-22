import { getUniversalLink } from "@selfxyz/core";
import { SelfAppBuilder } from "@selfxyz/qrcode";

function encodeClaimContext(claimId) {
  return Buffer.from(JSON.stringify({ claimId }))
    .toString("hex")
    .slice(0, 128)
    .padEnd(128, "0");
}

export function buildWitnessEnrollmentApp({ claimId, witnessId }) {
  const app = new SelfAppBuilder({
    appName: process.env.SELF_APP_NAME || "Proof of Witness",
    scope: process.env.SELF_SCOPE || "pow-witness",
    endpoint: process.env.SELF_ENDPOINT || "https://example.com/api/self/verify",
    endpointType: process.env.SELF_ENDPOINT_TYPE || "staging",
    userId: witnessId,
    userIdType: "uuid",
    version: 2,
    userDefinedData: encodeClaimContext(claimId),
    devMode: String(process.env.SELF_DEV_MODE || "true") === "true",
    disclosures: {
      minimumAge: Number(process.env.SELF_MIN_AGE || 18),
      nationality: true,
      ofac: true
    }
  }).build();

  return {
    app,
    universalLink: getUniversalLink(app)
  };
}
