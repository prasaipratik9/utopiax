import { useSection } from "../context/ContentContext";
import { PageHero, Section, CtaButton } from "../components/Section";

export default function IdeationWorX() {
  const page = useSection("ideationworx");

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section>
        <div className="prose">
          <h2>{page.designTitle}</h2>
          <p>{page.designBody}</p>
          <h2>{page.moonshotTitle}</h2>
          <p>{page.moonshotBody}</p>
          <h2>{page.programsTitle}</h2>
          <ul>
            {(page.programs || []).map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>
            <CtaButton to="/xperiences">View workshops</CtaButton>{" "}
            <CtaButton to="/contact" variant="outline">
              Enquire
            </CtaButton>
          </p>
        </div>
      </Section>
    </>
  );
}
