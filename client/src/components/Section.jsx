import { Link } from "react-router-dom";

export function Hero({ eyebrow, title, lead, actions }) {
  return (
    <section className="hero">
      <div className="hero-inner">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="hero-lead">{lead}</p>}
        {actions && <div className="hero-actions">{actions}</div>}
      </div>
    </section>
  );
}

export function PageHero({ eyebrow, title, lead }) {
  return (
    <section className="page-hero">
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </section>
  );
}

export function Section({ alt, children, className = "" }) {
  return (
    <section className={`section${alt ? " section-alt" : ""} ${className}`.trim()}>
      <div className="container">{children}</div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, desc }) {
  return (
    <header className="section-header">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      {title && <h2>{title}</h2>}
      {desc && <p>{desc}</p>}
    </header>
  );
}

export function CtaButton({ to, children, variant = "primary" }) {
  return (
    <Link to={to} className={`btn btn-${variant}`}>
      {children}
    </Link>
  );
}
