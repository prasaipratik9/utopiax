import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Content", end: true },
  { to: "/admin/services", label: "Services" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/media", label: "Media" },
];

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
