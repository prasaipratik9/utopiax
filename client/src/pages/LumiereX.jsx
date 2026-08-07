import { Link } from "react-router-dom";
import { useSection } from "../context/ContentContext";

export default function LumiereX() {
  const page = useSection("lumierex");

  return (
    <div className="pillar-landing pillar-landing--lumierex">
      <section className="pillar-hero">
        <div className="pillar-hero__copy">
          <span className="ux-kicker">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="pillar-hero__lead">{page.lead}</p>
          <div className="pillar-hero__actions">
            <Link to="/contact" className="btn btn-primary">
              Enquire about a retreat
            </Link>
            <Link to="/xperiences" className="btn btn-outline">
              All Xperiences
            </Link>
          </div>
        </div>
        <div className="pillar-hero__brand">
          <img src="/logos/lumierex.png" alt="LumiereX" />
        </div>
      </section>

      <section className="pillar-body">
        <div className="pillar-prose">
          <p>{page.body1}</p>
          <p>{page.body2}</p>
        </div>
        <div className="pillar-centres">
          {["Body", "Mind", "Heart", "Soul"].map((c, i) => (
            <div key={c} className="pillar-centre">
              <span>{String(i + 1).padStart(2, "0")}</span>
              <strong>{c}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="pillar-list">
        <header className="pillar-list__head">
          <span className="ux-kicker">Featured</span>
          <h2>{page.retreatsTitle}</h2>
        </header>
        <div className="pillar-grid pillar-grid--2">
          {(page.retreats || []).map((r) => (
            <article className="pillar-card" key={r.title}>
              <div className="pillar-card__meta">
                <span className="ux-pill ux-pill--solid">
                  {(r.tag || "").toUpperCase()}
                </span>
                <span className="pillar-card__status">{r.status}</span>
              </div>
              <h3>{r.title}</h3>
              <p className="pillar-card__loc">{r.location}</p>
              <p>{r.desc}</p>
              <Link to="/contact" className="ux-arrow">
                {r.cta || "Enquire"} <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
