import { useEffect } from "react";

const SITE_URL = "https://tryhidey.xyz";

interface SeoOptions {
  title: string;
  description: string;
  /** Path of the current page, e.g. "/contact" */
  canonicalPath?: string;
}

function upsertMeta(selector: string, create: () => HTMLMetaElement, content: string) {
  let tag = document.querySelector(selector) as HTMLMetaElement | null;
  if (!tag) {
    tag = create();
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export function useSeo({ title, description, canonicalPath }: SeoOptions) {
  useEffect(() => {
    document.title = title;

    upsertMeta('meta[name="description"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      return m;
    }, description);

    upsertMeta('meta[property="og:title"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:title");
      return m;
    }, title);

    upsertMeta('meta[property="og:description"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("property", "og:description");
      return m;
    }, description);

    upsertMeta('meta[name="twitter:title"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "twitter:title");
      return m;
    }, title);

    upsertMeta('meta[name="twitter:description"]', () => {
      const m = document.createElement("meta");
      m.setAttribute("name", "twitter:description");
      return m;
    }, description);

    if (canonicalPath) {
      const href = `${SITE_URL}${canonicalPath}`;
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);

      upsertMeta('meta[property="og:url"]', () => {
        const m = document.createElement("meta");
        m.setAttribute("property", "og:url");
        return m;
      }, href);
    }
  }, [title, description, canonicalPath]);
}
