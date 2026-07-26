import { useContent, useSection } from "../context/ContentContext";
import { PageHero, Section, SectionHeader } from "../components/Section";
import Card from "../components/Card";

export default function About() {
  const page = useSection("about");
  const { content } = useContent();
  const team = content.team || [];

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section>
        <div className="prose">
          <h2>{page.utopicTitle}</h2>
          <p>{page.utopicP1}</p>
          <p>{page.utopicP2}</p>
        </div>
      </Section>
      <Section alt>
        <SectionHeader title={page.howTitle} />
        <div className="card-grid">
          {(page.howCards || []).map((c) => (
            <Card key={c.title} title={c.title}>
              {c.desc}
            </Card>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeader title={page.valuesTitle} />
        <ul className="values-list">
          {(page.values || []).map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </Section>
      <Section alt>
        <header className="section-header">
          <p className="eyebrow">{page.founderEyebrow}</p>
          <h2>
            <a
              href={page.founderUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {page.founderName}
            </a>
          </h2>
        </header>
        <div className="prose">
          <p>{page.founderBio1}</p>
          <p>{page.founderBio2}</p>
          <p>
            <a
              href={page.founderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="card-link"
            >
              {page.founderLinkLabel}
            </a>
          </p>
        </div>
      </Section>
      <Section>
        <SectionHeader title={page.teamTitle} />
        <div className="team-grid">
          {team.map((t) => (
            <article key={t.name} className="card team-card">
              <h3>{t.name}</h3>
              <p className="role">{t.role}</p>
              <p>{t.bio}</p>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
