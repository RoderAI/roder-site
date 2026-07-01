import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { sortChangelog } from "../../lib/changelog";
import { ogMetadataForChangelog, staticOgPages, type OgImageMetadata } from "../../lib/seo";
import { renderOgImage } from "../../lib/ogImage";

export const getStaticPaths: GetStaticPaths = async () => {
  const changelogEntries = sortChangelog(await getCollection("changelog"));
  const changelogImages = changelogEntries.map(ogMetadataForChangelog);
  const pages = [...staticOgPages, ...changelogImages];

  return pages.map((page) => ({
    params: { slug: page.slug },
    props: { page },
  }));
};

export const GET: APIRoute<{ page: OgImageMetadata }> = ({ props }) => {
  return renderOgImage(props.page);
};
