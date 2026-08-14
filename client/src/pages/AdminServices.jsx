import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const BRANDS = ["openmindx", "ideationworx", "lumierex"];

const EMPTY = {
  title: "",
  brand: "openmindx",
  description: "",
  slug: "",
  is_published: true,
  sort_order: 0,
};

function Field({ label, value, onChange, multiline = false, type = "text", options }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {options ? (
        <select value={value || ""} onChange={onChange}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea rows={4} value={value || ""} onChange={onChange} />
      ) : type === "checkbox" ? (
        <input type="checkbox" checked={Boolean(value)} onChange={onChange} />
      ) : (
        <input type={type} value={value ?? ""} onChange={onChange} />
      )}
    </label>
  );
}

async function api(path, token, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export default function AdminServices() {
  const { isAuthenticated, loading: authLoading, user, token, logout } =
    useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const data = await api("/api/services", token);
    setItems(data.items || []);
  };

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api("/api/services", token);
        if (!cancelled) setItems(data.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load services");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (authLoading || loading) {
    return (
      <div className="admin-shell">
        <p className="admin-loading">Loading services…</p>
      </div>
    );
  }

  const patch = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const payload = {
        title: form.title,
        brand: form.brand,
        description: form.description,
        slug: form.slug,
        is_published: Boolean(form.is_published),
        sort_order: Number(form.sort_order) || 0,
      };
      if (editingId) {
        await api(`/api/services/${editingId}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatus("Service updated");
      } else {
        await api("/api/services", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatus("Service created");
      }
      setForm(null);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setStatus("");
    setError("");
    try {
      await api(`/api/services/${item.id}`, token, { method: "DELETE" });
      setItems((prev) => prev.filter((row) => row.id !== item.id));
      if (editingId === item.id) {
        setForm(null);
        setEditingId(null);
      }
      setStatus("Service deleted");
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="admin-shell admin-shell--wide">
      <header className="admin-top">
        <div>
          <p className="ux-kicker">UtopiaX CMS</p>
          <h1>Services</h1>
          <p className="admin-top__meta">
            Signed in as <strong>{user?.username}</strong>
          </p>
        </div>
        <div className="admin-top__actions">
          <Link to="/admin" className="btn btn-outline">
            Content
          </Link>
          <Link to="/admin/products" className="btn btn-outline">
            Products
          </Link>
          <Link to="/admin/media" className="btn btn-outline">
            Media
          </Link>
          <Link to="/" className="btn btn-outline">
            View site
          </Link>
          <button type="button" className="btn btn-outline" onClick={logout}>
            Log out
          </button>
        </div>
      </header>

      {status ? <p className="admin-msg is-success">{status}</p> : null}
      {error ? <p className="admin-msg is-error">{error}</p> : null}

      <p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setEditingId(null);
            setForm({ ...EMPTY });
            setStatus("");
            setError("");
          }}
        >
          Add new
        </button>
      </p>

      {form ? (
        <form className="admin-panel" onSubmit={onSave}>
          <Field
            label="Title"
            value={form.title}
            onChange={(e) => patch("title", e.target.value)}
          />
          <Field
            label="Brand"
            value={form.brand}
            options={BRANDS}
            onChange={(e) => patch("brand", e.target.value)}
          />
          <Field
            label="Description"
            multiline
            value={form.description}
            onChange={(e) => patch("description", e.target.value)}
          />
          <Field
            label="Slug"
            value={form.slug}
            onChange={(e) => patch("slug", e.target.value)}
          />
          <Field
            label="Published"
            type="checkbox"
            value={form.is_published}
            onChange={(e) => patch("is_published", e.target.checked)}
          />
          <Field
            label="Sort order"
            type="number"
            value={form.sort_order}
            onChange={(e) => patch("sort_order", e.target.value)}
          />
          <div className="admin-top__actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                setForm(null);
                setEditingId(null);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <div className="admin-panel">
        {items.length === 0 ? (
          <p className="admin-top__meta">No services yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id}>
              <strong>{item.title}</strong>
              <p className="admin-top__meta">
                {item.brand} · {item.is_published ? "Published" : "Unpublished"}
                {item.slug ? ` · ${item.slug}` : ""}
              </p>
              <div className="admin-top__actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingId(item.id);
                    setForm({
                      title: item.title || "",
                      brand: item.brand || "openmindx",
                      description: item.description || "",
                      slug: item.slug || "",
                      is_published: item.is_published !== false,
                      sort_order: item.sort_order ?? 0,
                    });
                    setStatus("");
                    setError("");
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => onDelete(item)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
