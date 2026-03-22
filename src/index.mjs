import dotenv from "dotenv";
import { createApp } from "./server/app.mjs";

dotenv.config();

const port = Number(process.env.PORT || 8787);
const app = createApp();

app.listen(port, () => {
  console.log(`Proof of Witness listening on port ${port}`);
});
