import { Link } from "react-router-dom";
import { useState } from "react";
import { useContent } from "../context/ContentContext";

export default function Footer() {
  const { site, social } = useContent();
  const [message, setMessage] = useState(null);
  const [status, setStatus] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address.");
      setStatus("is-error");
      return;
    }
    setMessage("Thanks! You're on the list (Week 1 stub - no email sent yet).");
    setStatus("is-success");
    e.target.reset();
  };

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">
            <img
              src="/logos/utopiax.png"
              alt=""
              className="logo-img logo-img--footer"
              width={36}
              height={36}
            />
            <span>
              Utopia<span style={{ color: "var(--ux-red)" }}>X</span>
            </span>
          </div>
          <p className="footer-tagline">{site.footerTagline}</p>
          <p className="footer-location">{site.footerLocation}</p>
        </div>
        <div className="footer-newsletter">
          <h3>{site.newsletterTitle}</h3>
          <p>{site.newsletterDesc}</p>
          <form className="newsletter-form" onSubmit={onSubmit} noValidate>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              aria-label="Email for newsletter"
            />
            <button type="submit" className="btn btn-primary btn-sm">
              Join
            </button>
          </form>
          {message && <p className={`form-message ${status}`}>{message}</p>}
        </div>
        <div>
          <div className="footer-social" style={{ marginBottom: "0.75rem" }}>
            {social.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {s.label}
              </a>
            ))}
          </div>
          <div className="footer-contact">
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; UtopiaX {new Date().getFullYear()}</span>
        <span style={{ display: "flex", gap: "18px" }}>
          <a href="#privacy">Privacy Policy</a>
          <Link to="/contact">Contact</Link>
        </span>
      </div>
    </footer>
  );
}
