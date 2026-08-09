import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import seed from "../data/content";

const ContentContext = createContext(null);

/** Map legacy .html nav hrefs to React Router paths */
export function toRoutePath(href) {
  if (!href) return "/";
  if (href === "index.html" || href === "/") return "/";
  return "/" + String(href).replace(/\.html$/i, "").replace(/^\//, "");
}

function withNav(content) {
  const nav = (content.nav || []).map((item) => ({
    ...item,
    path: toRoutePath(item.href),
  }));
  return {
    content,
    nav,
    site: content.site || {},
    social: content.social || [],
  };
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(seed);
  const [source, setSource] = useState("seed");
  const [loading, setLoading] = useState(true);

  const refreshContent = useCallback(async () => {
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("API unavailable");
      const data = await res.json();
      const { _meta, ...payload } = data;
      setContent(payload);
      setSource(_meta?.source || "api");
      return payload;
    } catch {
      setContent(seed);
      setSource("seed");
      return seed;
    } finally {
      setLoading(false);
    }
  }, []);

  const saveContent = useCallback(async (nextContent, token) => {
    const { _meta, ...payload } = nextContent || {};
    const res = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Save failed");
    setContent(payload);
    setSource(data.source || "api");
    return data;
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  const value = useMemo(
    () => ({
      ...withNav(content),
      loading,
      source,
      refreshContent,
      saveContent,
      setContent,
    }),
    [content, loading, source, refreshContent, saveContent],
  );

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
