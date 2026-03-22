import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildWitnessBundle, writeDemoArtifacts } from "./core/engine.mjs";
import { claimSchema, testimoniesSchema } from "./core/schemas.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const claimPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(projectRoot, "scenarios", "public-goods-claim.json");
const testimoniesPath = process.argv[3]
  ? path.resolve(process.cwd(), process.argv[3])
  : path.join(projectRoot, "scenarios", "public-goods-testimonies.json");

async function main() {
  const claim = claimSchema.parse(JSON.parse(await fs.readFile(claimPath, "utf8")));
  const testimonies = testimoniesSchema.parse(
    JSON.parse(await fs.readFile(testimoniesPath, "utf8"))
  );
  const bundle = buildWitnessBundle(claim, testimonies);
  const result = await writeDemoArtifacts(bundle, path.join(projectRoot, "output"));

  console.log("Proof of Witness demo complete");
  console.log(`Claim ID: ${bundle.claimId}`);
  console.log(`Recommendation: ${bundle.recommendation.outcome}`);
  console.log(`Output: ${result.outputDir}`);
  for (const file of result.files) {
    console.log(`- ${path.relative(projectRoot, file)}`);
  }
}

main().catch((error) => {
  console.error("Demo failed:", error);
  process.exitCode = 1;
});
