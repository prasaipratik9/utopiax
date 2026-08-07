import { Link } from "react-router-dom";
import { useContent, useSection } from "../context/ContentContext";

function ImageSlot({ label, className = "" }) {
  return (
    <div className={`ux-img-slot ${className}`.trim()} role="img" aria-label={label}>
      {label}
    </div>
  );
}

export default function Home() {
  const home = useSection("home");
  const { content } = useContent();
  const experiences = (content.experiences || []).slice(0, 3);
  const mediaItems = (content.mediaItems || []).slice(0, 3);

  const pillars = [
    {
      id: "openmindx",
      num: "01",
      pill: "SPEAKING",
      title: "OpenMindX",
      desc: "Keynotes that challenge audiences to step into their future.",
      cta: "Book a keynote",
      to: "/openmindx",
      logo: "/logos/openmindx.png",
      accent: "#1a3a5c",
    },
    {
      id: "ideationworx",
      num: "02",
      pill: "PROGRAMS",
      title: "IdeationWorX",
      desc: "Design thinking workshops that turn ideas into action.",
      cta: "Run a workshop",
      to: "/ideationworx",
      logo: "/logos/ideationworx.png",
      accent: "#fa3e32",
    },
    {
      id: "lumierex",
      num: "03",
      pill: "RETREATS",
      title: "LumiereX",
      desc: "Purpose-designed retreats to grow body, mind, heart and soul.",
      cta: "Join a retreat",
      to: "/lumierex",
      logo: "/logos/lumierex.png",
      accent: "#6b4698",
    },
  ];

  const centres = [
    { n: "01", title: "Body", sub: "Home" },
    { n: "02", title: "Mind", sub: "Work" },
    { n: "03", title: "Heart", sub: "Passion" },
    { n: "04", title: "Soul", sub: "Purpose" },
  ];

  const marquee = [
    "OPENMINDX",
    "IDEATIONWORX",
    "LUMIEREX",
    "MOONSHOTS",
    "TRANSFORM TODAY · IMPACT TOMORROW",
  ];

  return (
    <div className="home-landing">
      {/* Hero */}
      <section className="ux-hero">
        <div className="ux-hero__watermark" aria-hidden="true">
          X
        </div>
        <div className="ux-hero__copy">
          <span className="ux-badge">
            <span className="ux-badge__dot" />
            {home.heroEyebrow || "Fourth Industrial Revolution"}
          </span>
          <h1>
            Making the impossible{" "}
            <em>
              possible
              <svg viewBox="0 0 220 14" preserveAspectRatio="none" aria-hidden="true">
                <path
                  d="M4 10 C 60 2, 160 2, 216 8"
                  fill="none"
                  stroke="var(--ux-red)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </em>
          </h1>
          <p className="ux-hero__lead">{home.heroLead}</p>
          <div className="ux-hero__actions">
            <Link to="/xperiences" className="btn btn-primary">
              Explore Xperiences
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Get in touch
            </Link>
          </div>
          <div className="ux-stats">
            <div>
              <strong>15+</strong>
              <span>Years of Xperiences</span>
            </div>
            <div>
              <strong>200+</strong>
              <span>Organisations</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Moonshots imagined</span>
            </div>
          </div>
        </div>
        <div className="ux-hero__media">
          <div className="ux-hero__glow" aria-hidden="true" />
          <figure className="ux-hero__figure">
            <img
              src="/images/hero-keynote.png"
              alt="Christina Gerakiteys keynote - Ditch the Boundaries"
              className="ux-hero__photo"
            />
            <div className="ux-hero__overlay" />
            <div className="ux-hero__play">
              <span className="ux-hero__play-btn" aria-hidden="true">
                ▶
              </span>
              <span>Watch the showreel</span>
            </div>
          </figure>
          <div className="ux-hero__float">
            <small>Now booking</small>
            <strong>2027 Keynotes &amp; Programs</strong>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="ux-marquee" aria-hidden="true">
        <div className="ux-marquee__track">
          {[...marquee, ...marquee].map((item, i) => (
            <span className="ux-marquee__item" key={`${item}-${i}`}>
              <span>{item}</span>
              <span className="ux-marquee__star">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* Pillars */}
      <section className="ux-section">
        <div className="ux-section__head">
          <div>
            <span className="ux-kicker">{home.pillarsEyebrow}</span>
            <h2>{home.pillarsTitle}</h2>
          </div>
          <p>{home.pillarsDesc}</p>
        </div>
        <div className="ux-grid-3">
          {pillars.map((p) => (
            <Link
              key={p.id}
              to={p.to}
              className={`ux-card ux-pillar ux-pillar--${p.id}`}
              style={{ "--pillar-accent": p.accent }}
            >
              <figure className="ux-pillar__media">
                <img src={p.logo} alt="" className="ux-pillar__logo" />
                <span className="ux-pillar__spark" aria-hidden="true" />
                <span className="ux-pill">{p.pill}</span>
              </figure>
              <div className="ux-card__body">
                <div className="ux-card__title-row">
                  <h3>{p.title}</h3>
                  <span className="ux-card__num">{p.num}</span>
                </div>
                <p>{p.desc}</p>
                <span className="ux-arrow">
                  {p.cta} <span>→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Four centres */}
      <section className="ux-centres">
        <div className="ux-centres__glow" aria-hidden="true" />
        <span className="ux-kicker">{home.centresEyebrow}</span>
        <h2>{home.centresTitle}</h2>
        <p>{home.centresDesc}</p>
        <div className="ux-centres__grid">
          {centres.map((c) => (
            <div key={c.title} className="ux-centre">
              <span className="ux-centre__spark" aria-hidden="true" />
              <div className="ux-centre__n">{c.n}</div>
              <h3>{c.title}</h3>
              <p>{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quote + logos */}
      <section className="ux-quote">
        <div className="ux-quote__mark" aria-hidden="true">
          “
        </div>
        <blockquote>
          UtopiaX gave our leadership a framework and a language for the change
          we already knew we needed.
        </blockquote>
        <figcaption>
          - Innovation Lead, Global Professional Services Firm
        </figcaption>
        <div className="ux-logos">
          <p className="ux-kicker">Trusted by</p>
          <div className="ux-logos__row">
            {[
              "Deloitte logo",
              "BUPA logo",
              "George Weston Foods logo",
              "Government agency logo",
              "University logo",
            ].map((label) => (
              <ImageSlot key={label} label={label} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Xperiences */}
      <section className="ux-section" style={{ paddingTop: 8 }}>
        <div className="ux-section__head">
          <div>
            <span className="ux-kicker">{home.featuredEyebrow}</span>
            <h2>{home.featuredTitle}</h2>
          </div>
          <Link to="/xperiences" className="ux-arrow" style={{ fontSize: 14 }}>
            View all Xperiences <span>→</span>
          </Link>
        </div>
        <div className="ux-grid-3">
          {experiences.map((x) => (
            <article key={x.title} className="ux-card">
              <figure>
                <ImageSlot label={`${x.title} photo`} />
                <span className="ux-pill ux-pill--solid">
                  {(x.tag || "").toUpperCase()}
                </span>
              </figure>
              <div className="ux-card__body">
                <h3 style={{ fontSize: 19, marginBottom: 10 }}>{x.title}</h3>
                <p>{x.desc}</p>
                <Link to="/xperiences" className="ux-arrow">
                  Learn more <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recent media */}
      <section className="ux-section--tight">
        <div className="ux-section__head">
          <div>
            <span className="ux-kicker">{home.mediaEyebrow}</span>
            <h2>{home.mediaTitle}</h2>
          </div>
          <Link to="/media" className="ux-arrow" style={{ fontSize: 14 }}>
            View all Media <span>→</span>
          </Link>
        </div>
        <div className="ux-medialist">
          {mediaItems.map((m) => (
            <Link key={m.title} to="/media" className="ux-mediarow">
              <span className="ux-mediarow__meta">
                {m.date} · {m.category}
              </span>
              <div>
                <h3>{m.title}</h3>
                <p>{m.excerpt}</p>
              </div>
              <span className="ux-mediarow__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="ux-cta">
        <img
          src="/images/cta-factor-x.png"
          alt=""
          className="ux-cta__bg"
        />
        <div className="ux-cta__shade" aria-hidden="true" />
        <div className="ux-cta__wm" aria-hidden="true">
          X
        </div>
        <h2>
          Ready to add your factor <span>X</span>?
        </h2>
        <p>{home.ctaDesc}</p>
        <Link to="/contact" className="btn btn-primary">
          Contact us
        </Link>
      </section>
    </div>
  );
}
