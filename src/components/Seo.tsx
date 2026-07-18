import { useEffect } from "react";

const SITE_URL = "https://fsilogistics.com"; // TODO: replace with the real domain once it's live
const SITE_NAME = "FSI Logistics";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id: string, data: object) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

interface SeoProps {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  jsonLd?: object;
}

export default function Seo({
  title,
  description,
  path,
  keywords,
  jsonLd,
}: SeoProps) {
  useEffect(() => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    if (keywords?.length) upsertMeta("name", "keywords", keywords.join(", "));

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);

    upsertLink("canonical", url);

    if (jsonLd) upsertJsonLd("page-jsonld", jsonLd);
  }, [title, description, path, keywords, jsonLd]);

  return null;
}

export { SITE_URL, SITE_NAME };
