import type { ChangelogEntry } from "./changelog";

export const SITE_URL = "https://roder.sh";
export const SITE_NAME = "Roder";
export const DEFAULT_DESCRIPTION =
  "Roder is reusable Rust infrastructure for building, evaluating, and embedding coding agents.";
export const DEFAULT_OG_IMAGE = "/og/default.png";
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

export type SeoType = "website" | "article";

export type SeoInput = {
  title: string;
  description?: string;
  pathname: string;
  image?: string;
  imageAlt?: string;
  type?: SeoType;
  publishedTime?: Date | string;
  modifiedTime?: Date | string;
  tags?: string[];
  noindex?: boolean;
};

export type SeoMetadata = Required<Pick<SeoInput, "title" | "description" | "pathname" | "type">> & {
  canonicalUrl: string;
  imageUrl: string;
  imageAlt: string;
  publishedTime?: string;
  modifiedTime?: string;
  tags: string[];
  noindex: boolean;
};

export type OgImageMetadata = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  accent: "orange" | "graphite" | "mint";
  version?: string;
};

export const staticOgPages: OgImageMetadata[] = [
  {
    slug: "default",
    title: "Roder",
    description: DEFAULT_DESCRIPTION,
    eyebrow: "Runtime infrastructure",
    accent: "orange",
  },
  {
    slug: "index",
    title: "Runtime infrastructure for coding agents",
    description: "Real tools, policy, state, events, replay, and one control plane for every client.",
    eyebrow: "Roder",
    accent: "orange",
  },
  {
    slug: "docs",
    title: "Roder docs",
    description: "Build on the Rust runtime for coding agents.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "changelog",
    title: "Roder CLI changelog",
    description: "User-facing release notes for the roder command-line interface.",
    eyebrow: "Release notes",
    accent: "orange",
  },
  {
    slug: "evals",
    title: "Roder evals",
    description: "Current eval results, run history, and score trends over time.",
    eyebrow: "Evaluation",
    accent: "mint",
  },
  {
    slug: "mission",
    title: "Roder Mission",
    description: "Reusable Rust infrastructure for teams building, evaluating, and embedding coding agents.",
    eyebrow: "Mission",
    accent: "graphite",
  },
  {
    slug: "extensions",
    title: "Extension directory",
    description: "Every first-party Roder extension organized by category and capability.",
    eyebrow: "Extensions",
    accent: "mint",
  },
  {
    slug: "contact",
    title: "Talk to the Roder devs",
    description: "Contact the Roder team about agent runtime infrastructure, evals, and product work.",
    eyebrow: "Contact",
    accent: "orange",
  },
  {
    slug: "font-lab",
    title: "Roder font lab",
    description: "Internal wordmark studies for the Roder brand system.",
    eyebrow: "Brand study",
    accent: "graphite",
  },
  {
    slug: "docs/acp",
    title: "ACP compatibility",
    description: "How Agent Client Protocol fits into Roder's compatibility roadmap.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/agent-swarm",
    title: "Agent swarm",
    description: "Run one task shape across many items with bounded parallel agents.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/app-server",
    title: "App server",
    description: "The local JSON-RPC control plane for Roder clients.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/architecture",
    title: "Runtime architecture",
    description: "How Roder's Rust runtime, registry, tools, providers, and event bus fit together.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/blaxel-runner",
    title: "Blaxel sandbox runner",
    description: "Run coding tools in a persistent Blaxel sandbox and control its lifecycle.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/chrome",
    title: "Chrome browser control",
    description: "Pair Roder with a logged-in Chrome session through the browser extension.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/claude-code",
    title: "Claude Code provider",
    description: "Run Claude Code models through Roder.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/codex-parity-tools",
    title: "Codex-parity tools",
    description: "Native tool shapes and eval-loop behavior for Codex-trained coding models.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/cursor-sdk-agents",
    title: "Cursor SDK agents",
    description: "Launch and resume Cursor cloud agents through a process extension.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/desktop",
    title: "Desktop clients",
    description: "How native desktop shells should integrate with the Roder app-server control plane.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/edit-tools",
    title: "Edit tools package",
    description: "Reuse Roder's file-edit behavior in JavaScript agent loops.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/evals",
    title: "Eval harness",
    description: "How Roder is exercised in Harbor and Terminal-Bench runs.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/event-bus",
    title: "Events & replay",
    description: "The typed event stream that makes Roder observable, replayable, and usable by clients.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/extensibility",
    title: "Extension model",
    description: "How Roder installs native Rust extensions without forking the core.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/fireworks",
    title: "Fireworks provider",
    description: "First-party Fireworks AI inference through Roder's provider runtime.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/goal-mode",
    title: "Plan mode & goals",
    description: "Policy-gated planning, long-running objectives, and mode transitions.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/hosted-service",
    title: "Hosted service",
    description: "Run Roder as a multi-tenant gateway.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/install",
    title: "Install & run",
    description: "Build and run the Rust Roder workspace.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/knowledge",
    title: "Project knowledge",
    description: "Markdown-backed project documents the agent can search and revise.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/mcp",
    title: "MCP integration",
    description: "How streamable HTTP MCP servers become Roder tools.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/media-generation",
    title: "Media generation",
    description: "Provider-neutral image generation and media artifacts.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/memories",
    title: "Memory & embeddings",
    description: "Local memories, provider-neutral embeddings, and retrieval configuration.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/openrouter",
    title: "OpenRouter",
    description: "Configure Roder's OpenRouter provider and Grok Build model route.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/process-extensions",
    title: "Process extensions",
    description: "Run non-Rust extensions as child processes behind the normal registry.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/providers",
    title: "Inference providers",
    description: "Provider extensions translate model APIs into canonical Roder inference events.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/remote-nodes",
    title: "Remote agent nodes",
    description: "Control a full remote Roder runtime over mTLS.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/roadmap-loop",
    title: "Roadmap orchestration",
    description: "Supervised roadmap loops, inbox triage, worker dispatch, and evidence.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/roder-cloud",
    title: "roder.cloud provider",
    description: "Use roder.cloud hosted inference as a first-class provider.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/sdk",
    title: "TypeScript SDK",
    description: "Drive Roder from JavaScript or TypeScript hosts.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/sessions",
    title: "Sessions & state",
    description: "How Roder models threads, turns, snapshots, session stores, and persisted extension state.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/speech",
    title: "Speech",
    description: "Provider-neutral speech-to-text for clients that capture audio.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/tool-search",
    title: "Provider tool search",
    description: "Provider-native discovery for large tool catalogs.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/tools",
    title: "Tools & policy",
    description: "The built-in tool surface, tool contributors, and policy modes.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/tui",
    title: "TUI",
    description: "The Ratatui terminal client for the Roder app server.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/usage-analytics",
    title: "Usage analytics",
    description: "Local-only analytics for tokens, tools, latency, and sessions.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/use-cases",
    title: "Use cases",
    description: "Where Roder fits: agent products, research harnesses, CI automation, and client integrations.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/vertex",
    title: "Google Vertex AI",
    description: "Gemini-on-Vertex through service-account OAuth and regional endpoints.",
    eyebrow: "Documentation",
    accent: "orange",
  },
  {
    slug: "docs/workflows",
    title: "Dynamic workflows",
    description: "Approval-gated orchestration scripts for multi-agent Roder work.",
    eyebrow: "Documentation",
    accent: "mint",
  },
  {
    slug: "docs/workspace-forks",
    title: "Workspace forks",
    description: "Isolated writable workspaces for branchable agent work.",
    eyebrow: "Documentation",
    accent: "graphite",
  },
  {
    slug: "docs/zerolang",
    title: "Zerolang graph edits",
    description: "Checked ProgramGraph editing tools for Zero source tasks.",
    eyebrow: "Documentation",
    accent: "mint",
  },
];

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_URL).toString();
}

export function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const withoutHash = pathname.split("#")[0].split("?")[0];
  return withoutHash.endsWith("/") ? withoutHash : `${withoutHash}/`;
}

export function ogImageForPath(pathname: string): string {
  const normalized = normalizePathname(pathname);
  if (normalized === "/") return "/og/index.png";

  const slug = normalized.replace(/^\/|\/$/g, "");
  if (slug.startsWith("docs/")) return `/og/${slug}.png`;
  if (slug.startsWith("changelog/") && slug !== "changelog") return `/og/${slug}.png`;
  if (staticOgPages.some((page) => page.slug === slug)) return `/og/${slug}.png`;
  return DEFAULT_OG_IMAGE;
}

export function docsOgImageForPath(pathname: string): string {
  return ogImageForPath(pathname);
}

export function changelogOgImage(entry: ChangelogEntry): string {
  return `/og/changelog/${entry.data.version}.png`;
}

export function buildSeo(input: SeoInput): SeoMetadata {
  const pathname = normalizePathname(input.pathname);
  const description = input.description || DEFAULT_DESCRIPTION;

  return {
    title: input.title,
    description,
    pathname,
    type: input.type || "website",
    canonicalUrl: absoluteUrl(pathname),
    imageUrl: absoluteUrl(input.image || ogImageForPath(pathname)),
    imageAlt: input.imageAlt || `${input.title} social preview`,
    publishedTime: input.publishedTime ? new Date(input.publishedTime).toISOString() : undefined,
    modifiedTime: input.modifiedTime ? new Date(input.modifiedTime).toISOString() : undefined,
    tags: input.tags || [],
    noindex: input.noindex || false,
  };
}

export function ogMetadataForChangelog(entry: ChangelogEntry): OgImageMetadata {
  return {
    slug: `changelog/${entry.data.version}`,
    title: entry.data.headline,
    description: entry.data.summary,
    eyebrow: "Roder CLI release",
    accent: "orange",
    version: entry.data.version,
  };
}
