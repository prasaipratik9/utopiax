import { useMemo, useState } from "react";
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

/** Blog / article cards - images to be added next */
const blogArticles = [
  {
    id: "family-legacy",
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
    title: "Vision and Values are More Than Rhetoric",
    date: "8 May 24",
    category: "Innovation",
    excerpt:
      "Working in the 'purpose' space doesn't mean you continually celebrate success. It does ensure the failures are continuous stepping stones to success.",
    cover: "/images/vision-and-values.png",
    placeholder: "Vision and Values - photo",
  },
];

/** Layout variants for the visual bento (featured + image cards) */
const LAYOUTS = ["featured", "thumb", "thumb", "audio-accent"];

export default function Media() {
  const page = useSection("media");
  const { content } = useContent();
  const items = content.mediaItems || [];
  const [filter, setFilter] = useState("all");

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
          filtered[0],
          ...externalPodcasts,
          filtered.find((m) => m.type === "audio" && !m.cover) || filtered[2],
        ].filter(Boolean)
      : filtered.filter((m) => m.type !== "article");

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

            {blogArticles[0] && (
              <article className="media-feature">
                <figure className="media-feature__media">
                  {blogArticles[0].cover ? (
                    <img
                      src={blogArticles[0].cover}
                      alt=""
                      className="media-feature__photo"
                    />
                  ) : (
                    <ImageSlot label={blogArticles[0].placeholder} />
                  )}
                  <span className="media-feature__index">01</span>
                </figure>
                <div className="media-feature__body">
                  <p className="media-journal__meta">
                    {blogArticles[0].date.toUpperCase()}
                    <span />
                    {blogArticles[0].category.toUpperCase()}
                  </p>
                  <h3>{blogArticles[0].title}</h3>
                  <p className="media-feature__excerpt">
                    {blogArticles[0].excerpt}
                  </p>
                  <span className="media-journal__more">
                    Read more <span aria-hidden="true">→</span>
                  </span>
                </div>
              </article>
            )}

            <div className="media-journal__rows">
              {blogArticles.slice(1).map((article, i) => (
                <article className="media-row" key={article.id}>
                  <span className="media-row__index">
                    {String(i + 2).padStart(2, "0")}
                  </span>
                  <div className="media-row__body">
                    <p className="media-journal__meta">
                      {article.date.toUpperCase()}
                      <span />
                      {article.category.toUpperCase()}
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
                      <ImageSlot label={article.placeholder} />
                    )}
                  </figure>
                </article>
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
  if (item.cover && (layout === "thumb" || layout === "wide-excerpt" || layout === "audio")) {
    return (
      <article className="media-card media-card--thumb">
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
      </article>
    );
  }

  if (layout === "featured") {
    return (
      <article className="media-card media-card--featured">
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
      </article>
    );
  }

  if (layout === "audio" || layout === "audio-accent") {
    return (
      <article
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
      </article>
    );
  }

  if (layout === "thumb") {
    return (
      <article className="media-card media-card--thumb">
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
      </article>
    );
  }

  return (
    <article className="media-card media-card--wide">
      <div className="media-card__meta">
        <span>
          {item.date} · {item.category}
        </span>
        <span className="media-card__dot" />
      </div>
      <h3>{item.title}</h3>
      {item.excerpt ? <p>{item.excerpt}</p> : null}
    </article>
  );
}
