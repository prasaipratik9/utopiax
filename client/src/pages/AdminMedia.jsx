import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const TYPES = ["video", "article", "podcast", "press"];

const EMPTY = {
  title: "",
  type: "video",
  url: "",
  thumbnail_url: "",
  published_at: "",
  is_published: true,
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

function toDateInput(value) {
  if (!value) return "";
  return String(value).slice(0, 10);
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

export default function AdminMedia() {
  const { isAuthenticated, loading: authLoading, user, token, logout } =
    useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const data = await api("/api/media", token);
    setItems(data.items || []);
  };

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api("/api/media", token);
        if (!cancelled) setItems(data.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load media");
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
        <p className="admin-loading">Loading media…</p>
      </div>
    );
  }

  const patch = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onUploadThumbnail = async () => {
    if (!imageFile) {
      setError("Choose an image first");
      return;
    }
    setUploading(true);
    setStatus("");
    setError("");
    try {
      const url = await uploadToCloudinary(imageFile, token);
      patch("thumbnail_url", url);
      setStatus("Thumbnail uploaded");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const payload = {
        title: form.title,
        type: form.type,
        url: form.url || null,
        thumbnail_url: form.thumbnail_url || null,
        published_at: form.published_at || null,
        is_published: Boolean(form.is_published),
      };
      if (editingId) {
        await api(`/api/media/${editingId}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatus("Media item updated");
      } else {
        await api("/api/media", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatus("Media item created");
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
      await api(`/api/media/${item.id}`, token, { method: "DELETE" });
      setItems((prev) => prev.filter((row) => row.id !== item.id));
      if (editingId === item.id) {
        setForm(null);
        setEditingId(null);
      }
      setStatus("Media item deleted");
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <div className="admin-shell admin-shell--wide">
      <header className="admin-top">
        <div>
          <p className="ux-kicker">UtopiaX CMS</p>
          <h1>Media catalog</h1>
          <p className="admin-top__meta">
            Signed in as <strong>{user?.username}</strong>
          </p>
        </div>
        <div className="admin-top__actions">
          <Link to="/admin" className="btn btn-outline">
            Content
          </Link>
          <Link to="/admin/services" className="btn btn-outline">
            Services
          </Link>
          <Link to="/admin/products" className="btn btn-outline">
            Products
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
            label="Type"
            value={form.type}
            options={TYPES}
            onChange={(e) => patch("type", e.target.value)}
          />
          <Field
            label="URL"
            value={form.url}
            onChange={(e) => patch("url", e.target.value)}
          />
          <Field
            label="Thumbnail URL"
            value={form.thumbnail_url}
            onChange={(e) => patch("thumbnail_url", e.target.value)}
          />
          <label className="admin-field">
            <span>Upload thumbnail</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
          </label>
          <div className="admin-top__actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onUploadThumbnail}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
          <Field
            label="Published at"
            type="date"
            value={form.published_at}
            onChange={(e) => patch("published_at", e.target.value)}
          />
          <Field
            label="Published"
            type="checkbox"
            value={form.is_published}
            onChange={(e) => patch("is_published", e.target.checked)}
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
          <p className="admin-top__meta">No media items yet.</p>
        ) : (
          items.map((item) => (
            <div key={item.id}>
              <strong>{item.title}</strong>
              <p className="admin-top__meta">
                {item.type}
                {item.published_at ? ` · ${toDateInput(item.published_at)}` : ""}
                {" · "}
                {item.is_published ? "Published" : "Unpublished"}
              </p>
              <div className="admin-top__actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setEditingId(item.id);
                    setForm({
                      title: item.title || "",
                      type: item.type || "video",
                      url: item.url || "",
                      thumbnail_url: item.thumbnail_url || "",
                      published_at: toDateInput(item.published_at),
                      is_published: item.is_published !== false,
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
