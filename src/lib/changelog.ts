import type { CollectionEntry } from "astro:content";

export type ChangelogEntry = CollectionEntry<"changelog">;

export function sortChangelog(entries: ChangelogEntry[]): ChangelogEntry[] {
  return [...entries].sort((a, b) => {
    const dateDifference = b.data.releaseDate.valueOf() - a.data.releaseDate.valueOf();
    return dateDifference || b.data.version.localeCompare(a.data.version, undefined, { numeric: true });
  });
}

export function changelogUrl(entry: ChangelogEntry): string {
  return `/changelog/${entry.data.version}/`;
}

export function formatReleaseDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
