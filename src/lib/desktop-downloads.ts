/** Canonical download + update host: Cloudflare R2, refreshed by desktop release CI. */
export const DESKTOP_DL_BASE = "https://dl.roder.sh/desktop/latest";

export const DESKTOP_RELEASES_URL = "https://github.com/RoderAI/roder-desktop/releases";
export const DESKTOP_GITHUB_LATEST_BASE =
  "https://github.com/RoderAI/roder-desktop/releases/latest/download";

export const DESKTOP_MACOS_DMG_URL = `${DESKTOP_DL_BASE}/Roder-macos-arm64.dmg`;
export const DESKTOP_MACOS_ZIP_URL = `${DESKTOP_DL_BASE}/Roder-macos-arm64.zip`;
export const DESKTOP_WINDOWS_EXE_URL = `${DESKTOP_DL_BASE}/Roder-windows-x64-installer.exe`;
export const DESKTOP_CHECKSUMS_URL = `${DESKTOP_DL_BASE}/SHA256SUMS`;

/** Electron Squirrel.Mac / Sparkle-compatible JSON feed (R2). */
export const DESKTOP_UPDATES_JSON_URL = `${DESKTOP_DL_BASE}/updates.json`;

/** Sparkle appcast (R2). */
export const DESKTOP_APPCAST_URL = `${DESKTOP_DL_BASE}/appcast.xml`;

export const DESKTOP_MANIFEST_URL = `${DESKTOP_DL_BASE}/manifest.json`;

export type DesktopPlatform = "mac" | "windows" | "other";

export type DesktopReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

export type DesktopLatestRelease = {
  tagName: string;
  version: string;
  publishedAt: string;
  htmlUrl: string;
  body: string;
  assets: DesktopReleaseAsset[];
  source: "r2" | "github";
};

export function detectDesktopPlatform(userAgent: string): DesktopPlatform {
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows") || ua.includes("win32") || ua.includes("win64")) {
    return "windows";
  }
  if (ua.includes("mac os") || ua.includes("macintosh") || ua.includes("mac_powerpc")) {
    return "mac";
  }
  return "other";
}

export function primaryDownloadForPlatform(platform: DesktopPlatform): {
  label: string;
  href: string;
  fileName: string;
} {
  if (platform === "windows") {
    return {
      label: "Download for Windows",
      href: DESKTOP_WINDOWS_EXE_URL,
      fileName: "Roder-windows-x64-installer.exe",
    };
  }
  return {
    label: "Download for Mac",
    href: DESKTOP_MACOS_DMG_URL,
    fileName: "Roder-macos-arm64.dmg",
  };
}

export function stripVersionPrefix(tagName: string): string {
  return tagName.replace(/^v/i, "");
}

async function fetchR2Manifest(
  fetchImpl: typeof fetch,
): Promise<DesktopLatestRelease | null> {
  try {
    const response = await fetchImpl(DESKTOP_MANIFEST_URL, {
      headers: { Accept: "application/json", "User-Agent": "roder-site" },
    });
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as {
      version?: string;
      tag?: string | null;
      commit?: string;
      artifacts?: Array<{
        name?: string;
        url?: string;
        bytes?: number;
        sha256?: string;
      }>;
    };
    const tagName = payload.tag || (payload.version && payload.version !== "latest"
      ? payload.version.startsWith("v")
        ? payload.version
        : `v${payload.version}`
      : null);
    const version = stripVersionPrefix(tagName || payload.version || "");
    if (!version) {
      return null;
    }
    const assets = (payload.artifacts ?? [])
      .filter(
        (artifact): artifact is { name: string; url: string; bytes: number } =>
          Boolean(artifact.name && artifact.url && typeof artifact.bytes === "number"),
      )
      .map((artifact) => ({
        name: artifact.name,
        browser_download_url: artifact.url,
        size: artifact.bytes,
      }));
    if (assets.length === 0) {
      return null;
    }
    return {
      tagName: tagName || `v${version}`,
      version,
      publishedAt: new Date().toISOString(),
      htmlUrl: tagName
        ? `https://github.com/RoderAI/roder-desktop/releases/tag/${tagName}`
        : DESKTOP_RELEASES_URL,
      body: `Roder Desktop ${tagName || version}`,
      assets,
      source: "r2",
    };
  } catch {
    return null;
  }
}

async function fetchGithubLatestRelease(
  fetchImpl: typeof fetch,
): Promise<DesktopLatestRelease | null> {
  try {
    const response = await fetchImpl(
      "https://api.github.com/repos/RoderAI/roder-desktop/releases/latest",
      {
        headers: {
          Accept: "application/vnd.github+json",
          "User-Agent": "roder-site",
        },
      },
    );
    if (!response.ok) {
      return null;
    }
    const payload = (await response.json()) as {
      tag_name?: string;
      published_at?: string;
      html_url?: string;
      body?: string | null;
      assets?: Array<{
        name?: string;
        browser_download_url?: string;
        size?: number;
      }>;
    };
    if (!payload.tag_name || !payload.published_at || !payload.html_url) {
      return null;
    }
    return {
      tagName: payload.tag_name,
      version: stripVersionPrefix(payload.tag_name),
      publishedAt: payload.published_at,
      htmlUrl: payload.html_url,
      body: payload.body?.trim() || `Roder Desktop ${payload.tag_name}`,
      assets: (payload.assets ?? [])
        .filter(
          (asset): asset is { name: string; browser_download_url: string; size: number } =>
            Boolean(asset.name && asset.browser_download_url && typeof asset.size === "number"),
        )
        .map((asset) => ({
          name: asset.name,
          browser_download_url: asset.browser_download_url,
          size: asset.size,
        })),
      source: "github",
    };
  } catch {
    return null;
  }
}

/** Prefer R2 (CI-published); fall back to GitHub Releases if the bucket is empty. */
export async function fetchLatestDesktopRelease(
  fetchImpl: typeof fetch = fetch,
): Promise<DesktopLatestRelease | null> {
  const fromR2 = await fetchR2Manifest(fetchImpl);
  if (fromR2) {
    return fromR2;
  }
  return fetchGithubLatestRelease(fetchImpl);
}

export function assetUrl(
  release: DesktopLatestRelease | null,
  fileName: string,
  fallback: string,
): string {
  const match = release?.assets.find((asset) => asset.name === fileName);
  return match?.browser_download_url ?? fallback;
}

export function githubFallbackUrl(fileName: string): string {
  return `${DESKTOP_GITHUB_LATEST_BASE}/${fileName}`;
}
