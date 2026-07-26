import { createContext, useContext, useMemo } from "react";
import seed from "../data/content";

const ContentContext = createContext(null);

/** Map legacy .html nav hrefs to React Router paths */
export function toRoutePath(href) {
  if (!href) return "/";
  if (href === "index.html" || href === "/") return "/";
  return "/" + String(href).replace(/\.html$/i, "").replace(/^\//, "");
}

export function ContentProvider({ children }) {
  const value = useMemo(() => {
    const content = seed;
    const nav = (content.nav || []).map((item) => ({
      ...item,
      path: toRoutePath(item.href),
    }));
    return { content, nav, site: content.site || {}, social: content.social || [] };
  }, []);

  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

export function useSection(key) {
  const { content } = useContent();
  return content[key] || {};
}
