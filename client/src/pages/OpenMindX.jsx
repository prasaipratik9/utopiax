import { useSection } from "../context/ContentContext";
import { PageHero, Section, SectionHeader, CtaButton } from "../components/Section";
import Card from "../components/Card";

export default function OpenMindX() {
  const page = useSection("openmindx");

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section>
        <div className="prose">
          <p>{page.body1}</p>
          <p>{page.body2}</p>
          <blockquote className="blockquote">{page.quote}</blockquote>
        </div>
      </Section>
      <Section alt>
        <SectionHeader title={page.keynotesTitle} />
        <div className="card-grid">
          {(page.keynotes || []).map((k) => (
            <Card key={k.title} tag={k.tag} title={k.title}>
              {k.desc}
            </Card>
          ))}
        </div>
        <p style={{ marginTop: "2rem" }}>
          <CtaButton to="/contact">Book a keynote</CtaButton>
        </p>
      </Section>
    </>
  );
}
