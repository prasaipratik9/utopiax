import { Link } from "react-router-dom";
import { useSection, useContent } from "../context/ContentContext";
import { Hero, Section, SectionHeader, CtaButton } from "../components/Section";
import Card from "../components/Card";

export default function Home() {
  const home = useSection("home");
  const { content } = useContent();
  const experiences = (content.experiences || []).slice(0, 3);
  const mediaItems = (content.mediaItems || []).slice(0, 3);

  return (
    <>
      <Hero
        eyebrow={home.heroEyebrow}
        title={home.heroTitle}
        lead={home.heroLead}
        actions={
          <>
            <CtaButton to="/xperiences">Explore Xperiences</CtaButton>
            <CtaButton to="/contact" variant="outline">
              Get in touch
            </CtaButton>
          </>
        }
      />

      <Section>
        <SectionHeader
          eyebrow={home.pillarsEyebrow}
          title={home.pillarsTitle}
          desc={home.pillarsDesc}
        />
        <div className="pillars">
          <Link to="/openmindx" className="pillar-card">
            <h3>OpenMindX</h3>
            <p>{home.pillarOpenMindX}</p>
          </Link>
          <Link to="/ideationworx" className="pillar-card">
            <h3>IdeationWorX</h3>
            <p>{home.pillarIdeationWorX}</p>
          </Link>
          <Link to="/lumierex" className="pillar-card">
            <h3>LumiereX</h3>
            <p>{home.pillarLumiereX}</p>
          </Link>
        </div>
      </Section>

      <Section alt>
        <SectionHeader
          eyebrow={home.centresEyebrow}
          title={home.centresTitle}
          desc={home.centresDesc}
        />
        <div className="centres-grid">
          <div className="centre-item">
            <strong>Body</strong>
            <span>Home</span>
          </div>
          <div className="centre-item">
            <strong>Mind</strong>
            <span>Work</span>
          </div>
          <div className="centre-item">
            <strong>Heart</strong>
            <span>Passion</span>
          </div>
          <div className="centre-item">
            <strong>Soul</strong>
            <span>Purpose</span>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow={home.featuredEyebrow}
          title={home.featuredTitle}
        />
        <div className="card-grid">
          {experiences.map((x) => (
            <Card
              key={x.title}
              tag={x.tag}
              title={x.title}
              to="/xperiences"
              linkLabel="View all Xperiences"
            >
              {x.desc}
            </Card>
          ))}
        </div>
      </Section>

      <Section alt>
        <SectionHeader eyebrow={home.mediaEyebrow} title={home.mediaTitle} />
        <div className="card-grid">
          {mediaItems.map((m) => (
            <Card
              key={m.title}
              meta={`${m.date} · ${m.category}`}
              title={m.title}
              to="/media"
              linkLabel="View Media"
            >
              {m.excerpt}
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              marginBottom: "1rem",
            }}
          >
            {home.ctaTitle}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: "40ch",
              margin: "0 auto 1.5rem",
            }}
          >
            {home.ctaDesc}
          </p>
          <CtaButton to="/contact">Contact us</CtaButton>
        </div>
      </Section>
    </>
  );
}
