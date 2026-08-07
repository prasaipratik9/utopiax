import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";

const INTERESTS = [
  { id: "keynote", label: "Keynote / Speaking", word: "Keynote." },
  { id: "consulting", label: "Consulting / Strategy", word: "Consulting." },
  { id: "program", label: "Bespoke Program", word: "Program." },
  { id: "coaching", label: "Coaching / Mentoring", word: "Coaching." },
  { id: "retreat", label: "Retreat (LumiereX)", word: "Retreat." },
  { id: "media", label: "Media / Press", word: "Conversation." },
];

/**
 * Week 1: UI-only contact form (stubbed submit).
 * Week 3: wire to Nodemailer API endpoint.
 */
export default function Contact() {
  const { site, social } = useContent();
  const [activeIndex, setActiveIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (locked) return undefined;
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % INTERESTS.length);
    }, 1800);
    return () => window.clearInterval(id);
  }, [locked]);

  const active = INTERESTS[activeIndex];

  const selectInterest = (index) => {
    setActiveIndex(index);
    setLocked(true);
  };

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
      `Thanks, ${name}. Your enquiry is recorded locally for now - email delivery arrives in Week 3.`,
    );
    setStatus("is-success");
    e.target.reset();
  };

  const socialLinks = (social || []).filter((s) =>
    ["LinkedIn", "Instagram", "Facebook", "YouTube"].includes(s.label),
  );

  return (
    <div className="contact-landing">
      <section className="contact-split">
        <aside className="contact-panel">
          <div className="contact-panel__glow" aria-hidden="true" />
          <span className="ux-kicker">Let&apos;s talk</span>
          <h1>
            I want to book a
            <br />
            <span className="contact-rotate" aria-live="polite">
              <span key={active.id} className="contact-rotate__live">
                {active.word}
              </span>
            </span>
          </h1>
          <p>
            Tell us where you&apos;re starting from - Christina and the team
            read every enquiry personally and reply within one business day.
          </p>

          <div className="contact-details">
            <div className="contact-detail">
              <span aria-hidden="true">✉</span>
              <div>
                <small>Email</small>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </div>
            </div>
            <div className="contact-detail">
              <span aria-hidden="true">☎</span>
              <div>
                <small>Phone</small>
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              </div>
            </div>
            <div className="contact-detail">
              <span aria-hidden="true">📍</span>
              <div>
                <small>Based in</small>
                <strong>NSW, Australia - working worldwide</strong>
              </div>
            </div>
          </div>

          <div className="contact-social">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
        </aside>

        <div className="contact-form-panel">
          <div>
            <span className="ux-kicker">Step 1 - What are you after?</span>
            <div className="contact-tiles" role="listbox" aria-label="Interest">
              {INTERESTS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === index}
                  className={`contact-tile${activeIndex === index ? " is-selected" : ""}`}
                  onClick={() => selectInterest(index)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.label}</h3>
                </button>
              ))}
            </div>
          </div>

          <form className="contact-form-new" onSubmit={onSubmit} noValidate>
            <span className="ux-kicker">Step 2 - Your details</span>
            <input type="hidden" name="interest" value={active.id} />
            <div className="contact-form-new__row">
              <div className="contact-field">
                <label htmlFor="name">Name</label>
                <input
                  className="contact-input"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Your name"
                  required
                  autoComplete="name"
                />
              </div>
              <div className="contact-field">
                <label htmlFor="organisation">Organisation</label>
                <input
                  className="contact-input"
                  type="text"
                  id="organisation"
                  name="organisation"
                  placeholder="Company / org"
                  autoComplete="organization"
                />
              </div>
            </div>
            <div className="contact-field">
              <label htmlFor="email">Email</label>
              <input
                className="contact-input"
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="contact-field">
              <label htmlFor="message">Tell us about it</label>
              <textarea
                className="contact-input"
                id="message"
                name="message"
                rows={4}
                placeholder="Dates, audience size, what you're hoping for..."
                required
              />
            </div>
            <button type="submit" className="btn btn-primary contact-submit">
              Send Enquiry
            </button>
            {message && (
              <p className={`contact-form-msg ${status}`}>{message}</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
