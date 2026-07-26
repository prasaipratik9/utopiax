import { Link } from "react-router-dom";

export default function Card({
  tag,
  meta,
  title,
  location,
  status,
  children,
  to,
  linkLabel = "Learn more",
  className = "",
}) {
  return (
    <article className={`card ${className}`.trim()}>
      {tag && <span className="card-tag">{tag}</span>}
      {meta && <span className="card-meta">{meta}</span>}
      {title && <h3>{title}</h3>}
      {location && <p className="card-location">{location}</p>}
      {status && <p className="card-status">{status}</p>}
      {children && <p>{children}</p>}
      {to && (
        <Link to={to} className="card-link">
          {linkLabel}
        </Link>
      )}
    </article>
  );
}
