import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { useContent } from "../context/ContentContext";

export default function Header() {
  const { nav } = useContent();
  const [open, setOpen] = useState(false);

  const close = () => {
    setOpen(false);
    document.body.classList.remove("nav-open");
  };

  const toggle = () => {
    setOpen((prev) => {
      const next = !prev;
      document.body.classList.toggle("nav-open", next);
      return next;
    });
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="UtopiaX home" onClick={close}>
          <span className="logo-mark">U</span>
          <span className="logo-text">
            Utopia<span className="logo-accent">X</span>
          </span>
        </Link>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          aria-label="Open menu"
          onClick={toggle}
        >
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
          <span className="nav-toggle-bar" />
        </button>
        <nav
          id="site-nav"
          className={`site-nav${open ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          {nav.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link${isActive ? " is-active" : ""}`
              }
              onClick={close}
              end={item.path === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
