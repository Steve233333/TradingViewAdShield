import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const manifest = JSON.parse(
  await readFile(resolve(projectRoot, "manifest.json"), "utf8"),
);
const rules = JSON.parse(
  await readFile(resolve(projectRoot, "rules.json"), "utf8"),
);
const contentCss = await readFile(
  resolve(projectRoot, "content.css"),
  "utf8",
);

if (manifest.manifest_version !== 3) {
  throw new Error("manifest.json must use Manifest V3.");
}

if (!manifest.declarative_net_request?.rule_resources?.length) {
  throw new Error("manifest.json is missing declarativeNetRequest rules.");
}

if (!Array.isArray(rules) || rules.length === 0) {
  throw new Error("rules.json must contain at least one rule.");
}

const requiredFilters = [
  "||googlesyndication.com^",
  "||doubleclick.net^",
  "||googleadservices.com^",
  "||adservice.google.com^",
];
const configuredFilters = new Set(
  rules.map((rule) => rule.condition?.urlFilter),
);

for (const filter of requiredFilters) {
  if (!configuredFilters.has(filter)) {
    throw new Error(`Missing network rule: ${filter}`);
  }
}

for (const rule of rules) {
  if (!rule.condition?.initiatorDomains?.includes("tradingview.com")) {
    throw new Error(
      `Rule ${rule.id} is not restricted to TradingView initiators.`,
    );
  }
}

for (const selector of ["#charting-ad", '[id^="div-gpt-ad-toast-ad-"]']) {
  if (!contentCss.includes(selector)) {
    throw new Error(`Missing DOM hide selector: ${selector}`);
  }
}

for (const file of [
  "background.js",
  "content.js",
  "popup.js",
  "scripts/validate.mjs",
]) {
  const result = spawnSync(process.execPath, ["--check", resolve(projectRoot, file)], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    throw new Error(`JavaScript syntax check failed: ${file}`);
  }
}

console.log(
  `Validated Manifest V3 extension with ${rules.length} network rules.`,
);
