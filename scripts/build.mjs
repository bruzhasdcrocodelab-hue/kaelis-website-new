import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { verifyPublicCatalog } from "./verify-public-catalog.mjs";

async function build() {
  const { token, catalog } = await verifyPublicCatalog();
  process.stdout.write("Public catalog verified.\n");
  const temporaryDirectory = await mkdtemp(join(tmpdir(), "kaelis-public-catalog-"));
  const snapshotPath = join(temporaryDirectory, "catalog.json");
  await writeFile(snapshotPath, JSON.stringify(catalog));
  const next = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
  try {
    const processResult = await new Promise((resolve, reject) => {
      const child = spawn(process.execPath, [next, "build"], {
        env: { ...process.env, PUBLIC_CATALOG_TOKEN: token, PUBLIC_CATALOG_SNAPSHOT_PATH: snapshotPath },
        stdio: "inherit",
      });
      child.once("error", reject);
      child.once("exit", (code, signal) => resolve({ code, signal }));
    });
    if (processResult.code !== 0) {
      throw new Error(processResult.signal ? `next build terminated by ${processResult.signal}` : `next build failed (${processResult.code})`);
    }
  } finally {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
}

build().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
