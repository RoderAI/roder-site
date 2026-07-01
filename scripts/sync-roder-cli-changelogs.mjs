import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";

const repo = "RoderAI/roder";
const changelogDir = new URL("../src/content/changelog/", import.meta.url);

function existingCliTags() {
  if (!existsSync(changelogDir)) {
    return new Set();
  }

  return new Set(
    readdirSync(changelogDir)
      .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".mdx"))
      .map((fileName) => readFileSync(new URL(fileName, changelogDir), "utf8"))
      .map((contents) => contents.match(/^tag:\s*["']?(roder\/v[^"'\n]+)["']?\s*$/m)?.[1])
      .filter(Boolean),
  );
}

const output = execFileSync(
  "gh",
  [
    "api",
    `repos/${repo}/releases`,
    "--paginate",
    "--slurp",
  ],
  { encoding: "utf8" },
);

const existingTags = existingCliTags();
const releases = JSON.parse(output)
  .flat()
  .filter((release) => release.tag_name?.startsWith("roder/v"))
  .slice(0, 10)
  .map((release) => ({
    tag: release.tag_name,
    version: release.tag_name.replace(/^roder\/v/, ""),
    name: release.name,
    published_at: release.published_at,
    url: release.html_url,
    isNew: !existingTags.has(release.tag_name),
    body: release.body,
  }));

const missing = releases.filter((release) => release.isNew);

console.log(JSON.stringify(releases, null, 2));
console.log("");

if (missing.length === 0) {
  console.log("No new roder CLI releases found.");
} else {
  console.log("Missing CLI releases:");
  for (const release of missing) {
    console.log(`- ${release.tag} -> src/content/changelog/${release.version}.md`);
  }
  console.log("");
  console.log("Next steps:");
  console.log("1. Create one Markdown article per missing release under src/content/changelog/<version>.md.");
  console.log("2. Rewrite raw release notes into user-facing impact and usefulness.");
  console.log("3. Capture a real Ghostty demonstration when the release has a visual CLI workflow.");
  console.log("4. Verify /changelog/<version>/ renders and npm run build passes.");
}
