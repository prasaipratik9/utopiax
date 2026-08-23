import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const CATEGORY_LABELS = {
  openmindx: "OpenMindX",
  ideationworx: "IdeationWorX",
  lumierex: "LumiereX",
};

const CTA_LABELS = {
  video: "Watch the video",
  podcast: "Listen to the episode",
  press: "Read the feature",
  image: "View image",
};

const EXTERNAL_LINK_TYPES = new Set(["video", "podcast", "press", "image"]);

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

function getHeroImage(item) {
  if (item.thumbnail_url) return item.thumbnail_url;
  if (item.type === "image" && item.url) return item.url;
  return null;
}

function getWatermarkLabel(item) {
  const category = CATEGORY_LABELS[item.category] || item.category;
  if (category) return String(category).toUpperCase();
  if (item.type) return String(item.type).toUpperCase();
  return "MEDIA";
}

function getCtaLabel(type) {
  return CTA_LABELS[type] || "Open link";
}

export default function MediaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
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

  useEffect(() => {
    if (!item?.slug) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/media");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const others = (data.items || [])
          .filter((row) => row.slug && row.slug !== item.slug && row.is_published !== false)
          .slice(0, 3);
        setRelated(others);
      } catch {
        /* optional strip */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [item?.slug]);

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
  const dateLabel = formatDate(item.published_at);
  const heroImage = getHeroImage(item);
  const showCta =
    Boolean(item.url) && item.type !== "article" && EXTERNAL_LINK_TYPES.has(item.type);
  const watermark = getWatermarkLabel(item);

  return (
    <div className="media-landing">
      <section className="media-hero media-detail__intro">
        <Link to="/media" className="ux-kicker">
          ← Media
        </Link>
        {(dateLabel || categoryLabel) && (
          <p className="media-journal__meta media-detail__meta">
            {dateLabel ? dateLabel.toUpperCase() : null}
            {dateLabel && categoryLabel ? <span /> : null}
            {categoryLabel ? String(categoryLabel).toUpperCase() : null}
          </p>
        )}
        <h1>{item.title}</h1>
        {item.excerpt ? <p className="media-detail__lead">{item.excerpt}</p> : null}
      </section>

      <section className="media-body media-detail__body">
        {heroImage ? (
          <figure className="media-detail__hero">
            <img src={heroImage} alt="" className="media-detail__hero-img" />
          </figure>
        ) : (
          <div className="media-detail__placeholder" aria-hidden="true">
            <span className="media-detail__watermark">{watermark}</span>
          </div>
        )}

        {showCta ? (
          <p className="media-detail__cta">
            <a
              href={item.url}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {getCtaLabel(item.type)}
            </a>
          </p>
        ) : null}

        {item.content ? (
          <div
            className="media-detail__content media-feature__excerpt"
            dangerouslySetInnerHTML={{ __html: item.content }}
          />
        ) : null}

        {related.length > 0 ? (
          <aside className="media-journal media-detail__related">
            <header className="media-journal__head">
              <span className="ux-kicker">More from the Journal</span>
              <h2>Keep reading &amp; listening</h2>
            </header>
            <div className="media-bento media-detail__related-grid">
              {related.map((row) => (
                <RelatedCard key={row.id || row.slug} row={row} />
              ))}
            </div>
          </aside>
        ) : null}
      </section>
    </div>
  );
}

function RelatedCard({ row }) {
  const dateLabel = formatDate(row.published_at);
  const categoryLabel = CATEGORY_LABELS[row.category] || row.category || row.type;
  const cover = row.thumbnail_url || (row.type === "image" ? row.url : null);
  const externalHref =
    row.url && EXTERNAL_LINK_TYPES.has(row.type) ? row.url : null;
  const slugHref = !externalHref && row.slug ? `/media/${row.slug}` : null;
  const Wrapper = externalHref ? "a" : slugHref ? Link : "article";
  const wrapperProps = externalHref
    ? {
        href: externalHref,
        target: "_blank",
        rel: "noopener noreferrer",
        style: { textDecoration: "none", color: "inherit" },
      }
    : slugHref
      ? { to: slugHref, style: { textDecoration: "none", color: "inherit" } }
      : {};

  return (
    <Wrapper {...wrapperProps} className="media-card media-card--thumb">
      <figure>
        {cover ? (
          <img src={cover} alt="" className="media-card__thumb-img" />
        ) : (
          <div className="ux-img-slot">{row.title}</div>
        )}
      </figure>
      <div className="media-card__meta">
        <span>
          {dateLabel}
          {categoryLabel ? ` · ${categoryLabel}` : ""}
        </span>
        {externalHref ? <span className="media-card__play media-card__play--sm">▶</span> : null}
      </div>
      <h3>{row.title}</h3>
    </Wrapper>
  );
}
