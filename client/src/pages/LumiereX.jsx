import { useSection } from "../context/ContentContext";
import { PageHero, Section, SectionHeader } from "../components/Section";
import Card from "../components/Card";

export default function LumiereX() {
  const page = useSection("lumierex");

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section>
        <div className="prose">
          <p>{page.body1}</p>
          <p>{page.body2}</p>
        </div>
      </Section>
      <Section alt>
        <SectionHeader title={page.retreatsTitle} />
        <div className="card-grid">
          {(page.retreats || []).map((r) => (
            <Card
              key={r.title}
              tag={r.tag}
              title={r.title}
              location={r.location}
              status={r.status}
              to="/contact"
              linkLabel={r.cta || "Enquire"}
            >
              {r.desc}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
