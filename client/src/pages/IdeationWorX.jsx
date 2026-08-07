import { Link } from "react-router-dom";
import { useSection } from "../context/ContentContext";

export default function IdeationWorX() {
  const page = useSection("ideationworx");

  return (
    <div className="pillar-landing pillar-landing--ideationworx">
      <section className="pillar-hero">
        <div className="pillar-hero__copy">
          <span className="ux-kicker">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="pillar-hero__lead">{page.lead}</p>
          <div className="pillar-hero__actions">
            <Link to="/xperiences" className="btn btn-primary">
              View workshops
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Enquire
            </Link>
          </div>
        </div>
        <div className="pillar-hero__brand">
          <img src="/logos/ideationworx.png" alt="IdeationWorX" />
        </div>
      </section>

      <section className="pillar-split">
        <article>
          <span className="ux-kicker">01</span>
          <h2>{page.designTitle}</h2>
          <p>{page.designBody}</p>
        </article>
        <article>
          <span className="ux-kicker">02</span>
          <h2>{page.moonshotTitle}</h2>
          <p>{page.moonshotBody}</p>
        </article>
      </section>

      <section className="pillar-list">
        <header className="pillar-list__head">
          <span className="ux-kicker">Offerings</span>
          <h2>{page.programsTitle}</h2>
        </header>
        <ol className="pillar-programs">
          {(page.programs || []).map((p, i) => (
            <li key={p}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <p>{p}</p>
            </li>
          ))}
        </ol>
        <div className="pillar-hero__actions">
          <Link to="/xperiences" className="btn btn-primary">
            View workshops
          </Link>
          <Link to="/contact" className="btn btn-outline">
            Enquire
          </Link>
        </div>
      </section>
    </div>
  );
}
