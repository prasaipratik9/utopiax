import { useState } from "react";
import { useContent, useSection } from "../context/ContentContext";
import { PageHero, Section } from "../components/Section";

/**
 * Week 1: UI-only contact form (stubbed submit).
 * Week 3: wire to Nodemailer API endpoint.
 */
export default function Contact() {
  const page = useSection("contact");
  const { site } = useContent();
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const body = String(data.get("message") || "").trim();

    if (!name || !email || !body) {
      setMessage("Please fill in all required fields.");
      setStatus("is-error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setStatus("is-error");
      return;
    }

    setMessage(
      `Thanks, ${name}. Your enquiry is recorded locally for now — email delivery arrives in Week 3.`
    );
    setStatus("is-success");
    e.target.reset();
  };

  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} lead={page.lead} />
      <Section>
        <div className="contact-layout">
          <div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                marginTop: 0,
              }}
            >
              {page.heading}
            </h2>
            <div className="contact-info">
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </div>
            <p style={{ color: "var(--text-muted)", marginTop: "2rem" }}>
              {page.followNote}
            </p>
          </div>
          <form className="contact-form" onSubmit={onSubmit} noValidate>
            <div>
              <label htmlFor="name">Name *</label>
              <input type="text" id="name" name="name" required autoComplete="name" />
            </div>
            <div>
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="interest">I'm interested in</label>
              <select id="interest" name="interest" defaultValue="">
                <option value="">Select…</option>
                <option>OpenMindX — Speaking</option>
                <option>IdeationWorX — Workshops</option>
                <option>LumiereX — Retreats</option>
                <option>Xperiences — Programs</option>
                <option>General enquiry</option>
              </select>
            </div>
            <div>
              <label htmlFor="message">Message *</label>
              <textarea id="message" name="message" required />
            </div>
            <button type="submit" className="btn btn-primary">
              Send enquiry
            </button>
            <p className="form-message" style={{ opacity: 0.85, fontSize: "0.85rem" }}>
              Week 1 stub — messages are not emailed yet.
            </p>
            {message && (
              <p className={`form-message ${status}`}>{message}</p>
            )}
          </form>
        </div>
      </Section>
    </>
  );
}
