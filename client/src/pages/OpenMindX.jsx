import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSection } from "../context/ContentContext";

export default function OpenMindX() {
  const page = useSection("openmindx");
  const [keynotes, setKeynotes] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/services?brand=openmindx");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setKeynotes(data.items || []);
      } catch {
        /* keep empty if API unavailable */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pillar-landing pillar-landing--openmindx">
      <section className="pillar-hero">
        <div className="pillar-hero__copy">
          <span className="ux-kicker">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="pillar-hero__lead">{page.lead}</p>
          <div className="pillar-hero__actions">
            <Link to="/contact" className="btn btn-primary">
              Book a keynote
            </Link>
            <Link to="/xperiences" className="btn btn-outline">
              View Xperiences
            </Link>
          </div>
        </div>
        <div className="pillar-hero__brand">
          <img src="/logos/openmindx.png" alt="OpenMindX" />
        </div>
      </section>

      <section className="pillar-body">
        <div className="pillar-prose">
          <p>{page.body1}</p>
          <p>{page.body2}</p>
        </div>
        <blockquote className="pillar-quote">
          <span aria-hidden="true">“</span>
          <p>{page.quote}</p>
        </blockquote>
      </section>

      <section className="pillar-list">
        <header className="pillar-list__head">
          <span className="ux-kicker">Featured</span>
          <h2>{page.keynotesTitle}</h2>
        </header>
        <div className="pillar-grid">
          {keynotes.map((k, i) => (
            <article className="pillar-card" key={k.id || k.slug || k.title}>
              <div className="pillar-card__meta">
                <span className="ux-pill ux-pill--solid">
                  {(k.tag || "").toUpperCase()}
                </span>
                <span className="pillar-card__num">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3>{k.title}</h3>
              <p>{k.description}</p>
            </article>
          ))}
        </div>
        <Link to="/contact" className="btn btn-primary">
          Book a keynote
        </Link>
      </section>
    </div>
  );
}
