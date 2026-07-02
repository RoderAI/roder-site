import { ImageResponse } from "@vercel/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH, SITE_NAME, SITE_URL, type OgImageMetadata } from "./seo";

type OgElement = {
  $$typeof: symbol;
  type: string;
  key: null;
  ref: null;
  props: Record<string, unknown>;
};

type Style = Record<string, string | number>;

const reactElement = Symbol.for("react.element");
const roderIcon = `data:image/png;base64,${readFileSync(join(cwd(), "public", "roder-icon.png")).toString("base64")}`;

function element(type: string, props: Record<string, unknown> = {}, ...children: unknown[]): OgElement {
  const style = props.style && typeof props.style === "object" ? (props.style as Style) : undefined;
  const normalizedStyle = type === "div" && style && !("display" in style)
    ? { display: "flex", ...style }
    : style;

  return {
    $$typeof: reactElement,
    type,
    key: null,
    ref: null,
    props: {
      ...props,
      ...(normalizedStyle ? { style: normalizedStyle } : {}),
      children: children.length === 1 ? children[0] : children,
    },
  };
}

function roderMark() {
  return element(
    "img",
    {
      src: roderIcon,
      width: 116,
      height: 116,
      style: {
        display: "flex",
        width: 116,
        height: 116,
        objectFit: "contain",
      },
    },
  );
}

function accentColor(accent: OgImageMetadata["accent"]) {
  if (accent === "mint") return "#66d7ad";
  if (accent === "graphite") return "#111316";
  return "#ff4d00";
}

export function renderOgImage(metadata: OgImageMetadata): Response {
  const accent = accentColor(metadata.accent);
  const card = element(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "62px 72px",
        background: "#f7f8f6",
        color: "#111316",
        fontFamily: "Inter, Arial, sans-serif",
        position: "relative",
        overflow: "hidden",
      },
    },
    element("div", {
      style: {
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: 14,
        background: accent,
      },
    }),
    element("div", {
      style: {
        position: "absolute",
        right: -120,
        top: 70,
        width: 420,
        height: 420,
        border: "2px solid rgba(17, 19, 22, 0.08)",
        borderRadius: 36,
        transform: "rotate(18deg)",
      },
    }),
    element("div", {
      style: {
        position: "absolute",
        right: 110,
        bottom: 100,
        width: 220,
        height: 220,
        border: `28px solid ${accent}`,
        opacity: 0.12,
        borderRadius: 24,
        transform: "rotate(-14deg)",
      },
    }),
    element(
      "div",
      { style: { display: "flex", alignItems: "center", justifyContent: "space-between" } },
      element(
        "div",
        { style: { display: "flex", alignItems: "center", gap: 24 } },
        roderMark(),
        element(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: 4 } },
          element("div", { style: { fontSize: 42, fontWeight: 800, letterSpacing: -1 } }, SITE_NAME),
          element("div", { style: { fontSize: 18, color: "rgba(17, 19, 22, 0.58)", fontWeight: 700 } }, metadata.eyebrow),
        ),
      ),
      metadata.version
        ? element(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 146,
                height: 70,
                border: `3px solid ${accent}`,
                borderRadius: 12,
                fontSize: 34,
                fontWeight: 900,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              },
            },
            `v${metadata.version}`,
          )
        : element("div", { style: { width: 146 } }),
    ),
    element(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 26, maxWidth: 900 } },
      element(
        "div",
        {
          style: {
            fontSize: metadata.title.length > 62 ? 56 : 68,
            lineHeight: 1.02,
            fontWeight: 900,
            letterSpacing: -2,
          },
        },
        metadata.title,
      ),
      element(
        "div",
        {
          style: {
            maxWidth: 840,
            color: "rgba(17, 19, 22, 0.68)",
            fontSize: 28,
            lineHeight: 1.28,
            fontWeight: 650,
          },
        },
        metadata.description,
      ),
    ),
    element(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "rgba(17, 19, 22, 0.56)",
          fontSize: 20,
          fontWeight: 750,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        },
      },
      element("div", {}, new URL(SITE_URL).hostname),
      element("div", {}, "tools · policy · state · replay"),
    ),
  );

  return new ImageResponse(card, {
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
  });
}
