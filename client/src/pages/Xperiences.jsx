import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent, useSection } from "../context/ContentContext";

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
    <div className="pillar-landing pillar-landing--xperiences">
      <section className="pillar-hero pillar-hero--simple">
        <div className="pillar-hero__copy">
          <span className="ux-kicker">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="pillar-hero__lead">{page.lead}</p>
        </div>
      </section>

      <section className="pillar-list">
        <div className="pillar-grid">
          {slice.map((x, i) => (
            <article className="pillar-card" key={x.title}>
              <div className="pillar-card__meta">
                <span className="ux-pill ux-pill--solid">
                  {(x.tag || "").toUpperCase()}
                </span>
                <span className="pillar-card__num">
                  {String((pageNum - 1) * PER_PAGE + i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3>{x.title}</h3>
              <p className="pillar-card__loc">
                {x.location}
                {x.status ? ` · ${x.status}` : ""}
              </p>
              <p>{x.desc}</p>
              <Link to="/contact" className="ux-arrow">
                Enquire <span>→</span>
              </Link>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pillar-pagination">
            <button
              type="button"
              className="btn btn-outline"
              disabled={pageNum === 1}
              onClick={() => setPageNum((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span>
              Page {pageNum} of {totalPages}
            </span>
            <button
              type="button"
              className="btn btn-outline"
              disabled={pageNum === totalPages}
              onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
