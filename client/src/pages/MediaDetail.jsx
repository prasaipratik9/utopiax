import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CATEGORY_LABELS = {
  openmindx: "OpenMindX",
  ideationworx: "IdeationWorX",
  lumierex: "LumiereX",
};

export default function MediaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/media/${encodeURIComponent(slug)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.error || "Not found");
        }
        if (!cancelled) setItem(data);
      } catch (err) {
        if (!cancelled) {
          setItem(null);
          setError(err.message || "Not found");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="media-landing">
        <section className="media-hero">
          <p className="ux-kicker">Media</p>
          <h1>Loading…</h1>
        </section>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="media-landing">
        <section className="media-hero">
          <p className="ux-kicker">Media</p>
          <h1>Not found</h1>
          <p>{error || "This piece is unpublished or does not exist."}</p>
          <p>
            <Link to="/media" className="btn btn-outline">
              Back to Media
            </Link>
          </p>
        </section>
      </div>
    );
  }

  const categoryLabel = CATEGORY_LABELS[item.category] || item.category;
  const cover = item.thumbnail_url || item.url;

  return (
    <div className="media-landing">
      <section className="media-hero">
        <Link to="/media" className="ux-kicker">
          ← Media
        </Link>
        {categoryLabel ? (
          <p className="media-journal__meta" style={{ marginTop: 12 }}>
            {String(categoryLabel).toUpperCase()}
            {item.type ? ` · ${String(item.type).toUpperCase()}` : ""}
          </p>
        ) : null}
        <h1>{item.title}</h1>
        {item.excerpt ? <p>{item.excerpt}</p> : null}
      </section>

      <section className="media-body">
        {cover && item.type !== "video" ? (
          <figure className="media-feature__media" style={{ marginBottom: 32 }}>
            <img src={cover} alt="" className="media-feature__photo" />
          </figure>
        ) : null}

        {item.type === "video" && item.url ? (
          <div style={{ marginBottom: 32 }}>
            <a href={item.url} className="btn btn-primary" target="_blank" rel="noreferrer">
              Watch video
            </a>
            {item.thumbnail_url ? (
              <figure className="media-feature__media" style={{ marginTop: 20 }}>
                <img src={item.thumbnail_url} alt="" className="media-feature__photo" />
              </figure>
            ) : null}
          </div>
        ) : null}

        {item.type === "document" && item.url ? (
          <p style={{ marginBottom: 32 }}>
            <a href={item.url} className="btn btn-primary" target="_blank" rel="noreferrer">
              Open document
            </a>
          </p>
        ) : null}

        {item.content ? (
          <div
            className="media-feature__excerpt"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        ) : null}
      </section>
    </div>
  );
}
