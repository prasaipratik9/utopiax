import { useMemo, useState } from "react";
import { useContent, useSection } from "../context/ContentContext";
import { PageHero, Section } from "../components/Section";
import Card from "../components/Card";
import Pagination from "../components/Pagination";

const PER_PAGE = 6;

export default function Xperiences() {
  const page = useSection("xperiences");
  const { content } = useContent();
  const items = content.experiences || [];
  const [pageNum, setPageNum] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / PER_PAGE));
  const slice = useMemo(() => {
    const start = (pageNum - 1) * PER_PAGE;
    return items.slice(start, start + PER_PAGE);
  }, [items, pageNum]);

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section>
        <div className="card-grid">
          {slice.map((x) => (
            <Card
              key={x.title}
              tag={x.tag}
              title={x.title}
              location={x.location}
              status={x.status}
              to="/contact"
              linkLabel="Enquire"
            >
              {x.desc}
            </Card>
          ))}
        </div>
        <Pagination
          page={pageNum}
          totalPages={totalPages}
          onPrev={() => setPageNum((p) => Math.max(1, p - 1))}
          onNext={() => setPageNum((p) => Math.min(totalPages, p + 1))}
        />
      </Section>
    </>
  );
}
