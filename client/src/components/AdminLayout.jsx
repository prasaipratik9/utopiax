import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Content", end: true, icon: "content" },
  // { to: "/admin/services", label: "Services" },
  // { to: "/admin/products", label: "Products" },
  { to: "/admin/media", label: "Media", icon: "media" },
];

function NavIcon({ name }) {
  if (name === "content") {
    return (
      <svg
        className="admin-sidebar__icon"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      </svg>
    );
  }

  if (name === "media") {
    return (
      <svg
        className="admin-sidebar__icon"
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8.5" cy="10.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    );
  }

  return null;
}

export default function AdminLayout({ title, description, actions, children }) {
  const { logout } = useAuth();

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar__brand">
          <img
            src="/logos/utopiax.png"
            alt=""
            className="admin-sidebar__logo"
            width={32}
            height={32}
          />
          <span className="admin-sidebar__wordmark">
            Utopia<span className="logo-accent">X</span>
          </span>
        </Link>

        <nav className="admin-sidebar__nav" aria-label="Admin navigation">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-sidebar__link${isActive ? " is-active" : ""}`
              }
            >
              {item.icon ? <NavIcon name={item.icon} /> : null}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__divider" aria-hidden="true" />

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-sidebar__link admin-sidebar__link--muted">
            View site
          </Link>
          <button
            type="button"
            className="admin-sidebar__link admin-sidebar__link--muted admin-sidebar__logout"
            onClick={logout}
          >
            Log out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-page-header">
          <div className="admin-page-header__text">
            <h1>{title}</h1>
            {description ? (
              <p className="admin-page-header__desc">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="admin-page-header__actions">{actions}</div> : null}
        </header>
        <div className="admin-main__body">{children}</div>
      </main>
    </div>
  );
}
