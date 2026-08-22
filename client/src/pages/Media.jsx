import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent, useSection } from "../context/ContentContext";

function ImageSlot({ label, className = "" }) {
  return (
    <div
      className={`ux-img-slot ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  );
}

function Waveform({ light = false }) {
  return (
    <span className={`media-wave${light ? " media-wave--light" : ""}`} aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "article", label: "Articles" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

const podcasts = [
  {
    ep: "Ep. 03",
    title: "How Thinking Differently Impacts Team Performance",
    cover: "/images/inspired-for-impact-ep03.png",
    placeholder: "Ep. 03 cover art",
  },
  {
    ep: "Ep. 13",
    title: "Empowering Women and Redefining Business Success",
    cover: "/images/inspired-for-impact-ep13.png",
    placeholder: "Ep. 13 cover art",
  },
];

const externalPodcasts = [
  {
    title: "PepTalks with triiyo - Navigating the Future of Work",
    date: "Ep. 1",
    category: "Podcast",
    type: "audio",
    excerpt:
      "Featuring Christina Gerakiteys, Co-CEO, SingularityU Australia.",
    cover: "/images/peptalks-ep01.png",
  },
  {
    title:
      "She's The Boss Leaders - Christina Gerakiteys, Co-CEO of SingularityU & Founder of UtopiaX",
    date: "Podcast Episode",
    category: "Spotify",
    type: "audio",
    excerpt:
      "Christina Gerakiteys joins She's The Boss Leaders to discuss leadership, innovation, and founding UtopiaX.",
    cover: "/images/shes-the-boss-podcast.png",
  },
];

/** Fallback journal cards when the API has no published articles yet */
const blogArticles = [
  {
    id: "family-legacy",
    slug: "family-legacy",
    title: "A Family Legacy of Failure and Success",
    date: "13 May 24",
    category: "Innovation",
    excerpt:
      "A monumental failure is a monumental lesson. Failure is not a closed door to success. Unless nothing is learnt.",
    cover: "/images/family-legacy.png",
    placeholder: "Family legacy article - photo",
  },
  {
    id: "nobody-knows",
    slug: "nobody-knows-anything",
    title: "Nobody Knows Anything",
    date: "12 May 24",
    category: "Innovation",
    excerpt:
      "How do you know if it's going to work? The truth is, we never know. Not for sure.",
    cover: "/images/nobody-knows-anything.png",
    placeholder: "Nobody Knows Anything - photo",
  },
  {
    id: "vision-values",
    slug: "vision-and-values",
    title: "Vision and Values are More Than Rhetoric",
    date: "8 May 24",
    category: "Innovation",
    excerpt:
      "Working in the 'purpose' space doesn't mean you continually celebrate success. It does ensure the failures are continuous stepping stones to success.",
    cover: "/images/vision-and-values.png",
    placeholder: "Vision and Values - photo",
  },
];

const LAYOUTS = ["featured", "thumb", "thumb", "audio-accent"];

const CATEGORY_LABELS = {
  openmindx: "OpenMindX",
  ideationworx: "IdeationWorX",
  lumierex: "LumiereX",
};

function mapApiItem(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type === "document" ? "article" : row.type,
    date: row.published_at
      ? new Date(row.published_at).toLocaleDateString("en-AU", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        })
      : "",
    published_at: row.published_at || null,
    is_featured: Boolean(row.is_featured),
    category: CATEGORY_LABELS[row.category] || row.category || row.type,
    excerpt: row.excerpt || "",
    cover: row.thumbnail_url || null,
  };
}

function pickFeaturedSlotItem(filtered) {
  const featured = filtered.filter((m) => m.is_featured);
  if (!featured.length) return filtered[0];
  if (featured.length === 1) return featured[0];
  return featured.sort((a, b) => {
    const ta = a.published_at ? new Date(a.published_at).getTime() : 0;
    const tb = b.published_at ? new Date(b.published_at).getTime() : 0;
    return tb - ta;
  })[0];
}

export default function Media() {
  const page = useSection("media");
  const { content } = useContent();
  const seedItems = content.mediaItems || [];
  const [filter, setFilter] = useState("all");
  const [apiItems, setApiItems] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/media");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setApiItems((data.items || []).map(mapApiItem));
      } catch {
        /* keep seed content if API unavailable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const items = useMemo(() => {
    if (apiItems.length) return apiItems;
    return seedItems;
  }, [apiItems, seedItems]);

  const filtered = useMemo(() => {
    const all = [...items];
    const additions = externalPodcasts.filter(
      (podcast) => !all.some((item) => item.title === podcast.title),
    );
    all.splice(1, 0, ...additions);
    if (filter === "all") return all;
    return all.filter((m) => m.type === filter);
  }, [items, filter]);

  const bentoItems =
    filter === "all"
      ? [
          pickFeaturedSlotItem(filtered),
          ...externalPodcasts,
          filtered.find((m) => m.type === "audio" && !m.cover) || filtered[2],
        ].filter(Boolean)
      : filtered.filter((m) => m.type !== "article");

  const journalArticles = useMemo(() => {
    const fromApi = apiItems.filter((m) => m.type === "article" && m.slug);
    return fromApi.length ? fromApi : blogArticles;
  }, [apiItems]);

  const showArticles = filter === "all" || filter === "article";

  return (
    <div className="media-landing">
      <section className="media-hero">
        <span className="ux-kicker">{page.eyebrow}</span>
        <h1>{page.title}</h1>
        <p>{page.lead}</p>
      </section>

      <section className="media-body">
        <div className="media-filters" role="tablist" aria-label="Media type">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`media-pill${filter === f.id ? " is-active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {filter !== "article" && (
          <div
            className={`media-bento${filter !== "all" ? " media-bento--filtered" : ""}`}
          >
            {bentoItems.map((item, index) => {
              const layout =
                filter === "all" ? LAYOUTS[index] || "thumb" : "wide-excerpt";
              return (
                <MediaCard key={item.title} item={item} layout={layout} />
              );
            })}
          </div>
        )}

        {showArticles && (
          <div className="media-journal">
            <header className="media-journal__head">
              <span className="ux-kicker">From the Journal</span>
              <h2>Words on failure, purpose &amp; possibility</h2>
            </header>

            {journalArticles[0] && (
              <Link
                to={journalArticles[0].slug ? `/media/${journalArticles[0].slug}` : "/media"}
                className="media-feature"
                style={{ textDecoration: "none", color: "inherit", display: "grid" }}
              >
                <figure className="media-feature__media">
                  {journalArticles[0].cover ? (
                    <img
                      src={journalArticles[0].cover}
                      alt=""
                      className="media-feature__photo"
                    />
                  ) : (
                    <ImageSlot label={journalArticles[0].placeholder || journalArticles[0].title} />
                  )}
                  <span className="media-feature__index">01</span>
                </figure>
                <div className="media-feature__body">
                  <p className="media-journal__meta">
                    {(journalArticles[0].date || "").toUpperCase()}
                    <span />
                    {(journalArticles[0].category || "").toUpperCase()}
                  </p>
                  <h3>{journalArticles[0].title}</h3>
                  <p className="media-feature__excerpt">
                    {journalArticles[0].excerpt}
                  </p>
                  <span className="media-journal__more">
                    Read more <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
            )}

            <div className="media-journal__rows">
              {journalArticles.slice(1).map((article, i) => (
                <Link
                  className="media-row"
                  key={article.id || article.slug || article.title}
                  to={article.slug ? `/media/${article.slug}` : "/media"}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="media-row__index">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="media-row__body">
                    <p className="media-journal__meta">
                      {(article.date || "").toUpperCase()}
                      <span />
                      {(article.category || "").toUpperCase()}
                    </p>
                    <h3>{article.title}</h3>
                    <p className="media-row__excerpt">{article.excerpt}</p>
                    <span className="media-journal__more">
                      Read more <span aria-hidden="true">→</span>
                    </span>
                  </div>
                  <figure className="media-row__media">
                    {article.cover ? (
                      <img
                        src={article.cover}
                        alt=""
                        className="media-row__photo"
                      />
                    ) : (
                      <ImageSlot label={article.placeholder || article.title} />
                    )}
                  </figure>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="media-podcast-head">
          <span>Inspired For Impact</span>
          <small>- the podcast, latest episodes</small>
        </div>
        <div className="media-podcasts">
          {podcasts.map((pod) => (
            <article className="media-pod" key={pod.ep}>
              <figure>
                {pod.cover ? (
                  <img src={pod.cover} alt="" className="media-pod__cover" />
                ) : (
                  <ImageSlot label={pod.placeholder} />
                )}
              </figure>
              <div>
                <span>{pod.ep}</span>
                <h4>{pod.title}</h4>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MediaCard({ item, layout }) {
  const href = item.slug ? `/media/${item.slug}` : null;
  const Wrapper = href ? Link : "article";
  const wrapperProps = href
    ? { to: href, className: undefined, style: { textDecoration: "none", color: "inherit" } }
    : {};

  if (item.cover && (layout === "thumb" || layout === "wide-excerpt" || layout === "audio")) {
    return (
      <Wrapper {...wrapperProps} className="media-card media-card--thumb">
        <figure>
          <img src={item.cover} alt="" className="media-card__thumb-img" />
        </figure>
        <div className="media-card__meta">
          <span>
            {item.date}
            {item.category ? ` · ${item.category}` : ""}
          </span>
          <span className="media-card__play media-card__play--sm">▶</span>
        </div>
        <h3>{item.title}</h3>
      </Wrapper>
    );
  }

  if (layout === "featured") {
    return (
      <Wrapper {...wrapperProps} className="media-card media-card--featured">
        <img
          src="/images/hero-keynote.png"
          alt=""
          className="media-card__bg"
        />
        <div className="media-card__shade" />
        <div className="media-card__inner">
          <div className="media-card__top">
            <span className="media-card__play">▶</span>
            <span>Featured Video · {item.date}</span>
          </div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (layout === "audio" || layout === "audio-accent") {
    return (
      <Wrapper
        {...wrapperProps}
        className={`media-card media-card--${layout === "audio-accent" ? "audio-accent" : "audio"}`}
      >
        <div className="media-card__meta">
          <Waveform light={layout === "audio-accent"} />
          <span>
            {item.date}
            {layout === "audio-accent" ? " · Fireside Chat" : ""}
          </span>
        </div>
        <h3>
          {item.title.replace(" - Podcast", "").replace(" - Fireside Chat", "")}
        </h3>
      </Wrapper>
    );
  }

  if (layout === "thumb") {
    return (
      <Wrapper {...wrapperProps} className="media-card media-card--thumb">
        <figure>
          {item.cover ? (
            <img src={item.cover} alt="" className="media-card__thumb-img" />
          ) : (
            <ImageSlot label={`${item.title} - event photo`} />
          )}
        </figure>
        <div className="media-card__meta">
          <span>{item.date}</span>
          <span className="media-card__play media-card__play--sm">▶</span>
        </div>
        <h3>{item.title}</h3>
      </Wrapper>
    );
  }

  return (
    <Wrapper {...wrapperProps} className="media-card media-card--wide">
      <div className="media-card__meta">
        <span>
          {item.date} · {item.category}
        </span>
        <span className="media-card__dot" />
      </div>
      <h3>{item.title}</h3>
      {item.excerpt ? <p>{item.excerpt}</p> : null}
    </Wrapper>
  );
}
