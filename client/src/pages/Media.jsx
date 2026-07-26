import { useMemo, useState } from "react";
import { useContent, useSection } from "../context/ContentContext";
import { PageHero, Section } from "../components/Section";
import Card from "../components/Card";
import MediaFilter from "../components/MediaFilter";

export default function Media() {
  const page = useSection("media");
  const { content } = useContent();
  const items = content.mediaItems || [];
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((m) => m.type === filter);
  }, [items, filter]);

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section>
        <MediaFilter active={filter} onChange={setFilter} />
        <div className="card-grid">
          {filtered.map((m) => (
            <Card
              key={m.title}
              meta={`${m.date} · ${m.category} · ${m.type}`}
              title={m.title}
            >
              {m.excerpt}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
