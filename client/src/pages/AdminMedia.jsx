import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const CREATE_TYPES = [
  { id: "article", label: "Article" },
  { id: "video", label: "Video" },
  { id: "document", label: "Document" },
];

const CATEGORIES = [
  { value: "openmindx", label: "OpenMindX" },
  { value: "ideationworx", label: "IdeationWorX" },
  { value: "lumierex", label: "LumiereX" },
];

const EMPTY_BY_TYPE = {
  article: {
    title: "",
    type: "article",
    category: "openmindx",
    excerpt: "",
    content: "",
    thumbnail_url: "",
    slug: "",
    is_published: true,
  },
  video: {
    title: "",
    type: "video",
    category: "openmindx",
    url: "",
    thumbnail_url: "",
    slug: "",
    is_published: true,
  },
  document: {
    title: "",
    type: "document",
    category: "openmindx",
    url: "",
    thumbnail_url: "",
    slug: "",
    is_published: true,
  },
};

function slugify(title) {
  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function Field({ label, value, onChange, multiline = false, type = "text", options }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {options ? (
        <select value={value || ""} onChange={onChange}>
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : multiline ? (
        <textarea rows={type === "content" ? 10 : 4} value={value || ""} onChange={onChange} />
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
  const [pickingType, setPickingType] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

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
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "title" && !slugTouched && !editingId) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  const startCreate = (type) => {
    setEditingId(null);
    setSlugTouched(false);
    setImageFile(null);
    setDocFile(null);
    setForm({ ...EMPTY_BY_TYPE[type] });
    setPickingType(false);
    setStatus("");
    setError("");
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
      setStatus("Image uploaded");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onUploadDocument = async () => {
    if (!docFile) {
      setError("Choose a file first");
      return;
    }
    setUploading(true);
    setStatus("");
    setError("");
    try {
      const url = await uploadToCloudinary(docFile, token);
      patch("url", url);
      setStatus("File uploaded");
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
        category: form.category || null,
        slug: form.slug || slugify(form.title),
        thumbnail_url: form.thumbnail_url || null,
        is_published: Boolean(form.is_published),
        published_at: form.published_at || null,
      };

      if (form.type === "article") {
        payload.excerpt = form.excerpt || null;
        payload.content = form.content || null;
      }
      if (form.type === "video" || form.type === "document") {
        payload.url = form.url || null;
      }
      if (form.type === "image") {
        payload.url = form.url || form.thumbnail_url || null;
      }

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
      setPickingType(false);
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
            setForm(null);
            setEditingId(null);
            setPickingType(true);
            setStatus("");
            setError("");
          }}
        >
          Add New
        </button>
      </p>

      {pickingType && !form ? (
        <div className="admin-panel">
          <p className="admin-top__meta">Choose a content type</p>
          <div className="admin-top__actions">
            {CREATE_TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className="btn btn-outline"
                onClick={() => startCreate(t.id)}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setPickingType(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {form ? (
        <form className="admin-panel" onSubmit={onSave}>
          <p className="admin-top__meta">
            Template: <strong>{form.type}</strong>
          </p>
          <Field
            label="Title"
            value={form.title}
            onChange={(e) => patch("title", e.target.value)}
          />
          <Field
            label="Category"
            value={form.category}
            options={CATEGORIES}
            onChange={(e) => patch("category", e.target.value)}
          />
          <Field
            label="Slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              patch("slug", slugify(e.target.value));
            }}
          />

          {form.type === "article" ? (
            <>
              <Field
                label="Excerpt"
                multiline
                value={form.excerpt}
                onChange={(e) => patch("excerpt", e.target.value)}
              />
              <Field
                label="Content (HTML for now — rich text editor optional)"
                multiline
                type="content"
                value={form.content}
                onChange={(e) => patch("content", e.target.value)}
              />
            </>
          ) : null}

          {form.type === "video" ? (
            <Field
              label="Video URL"
              value={form.url}
              onChange={(e) => patch("url", e.target.value)}
            />
          ) : null}

          {form.type === "document" ? (
            <>
              <Field
                label="File URL"
                value={form.url}
                onChange={(e) => patch("url", e.target.value)}
              />
              <label className="admin-field">
                <span>Upload file</span>
                <input
                  type="file"
                  onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                />
              </label>
              <div className="admin-top__actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onUploadDocument}
                  disabled={uploading}
                >
                  {uploading ? "Uploading…" : "Upload file"}
                </button>
              </div>
            </>
          ) : null}

          <Field
            label={form.type === "article" ? "Cover image URL" : "Thumbnail URL"}
            value={form.thumbnail_url}
            onChange={(e) => patch("thumbnail_url", e.target.value)}
          />
          <label className="admin-field">
            <span>{form.type === "article" ? "Upload cover" : "Upload thumbnail"}</span>
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
            value={form.published_at || ""}
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
                setPickingType(false);
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
                {item.category ? ` · ${item.category}` : ""}
                {item.slug ? ` · /media/${item.slug}` : ""}
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
                    setSlugTouched(true);
                    setPickingType(false);
                    setForm({
                      title: item.title || "",
                      type: item.type || "article",
                      category: item.category || "openmindx",
                      excerpt: item.excerpt || "",
                      content: item.content || "",
                      url: item.url || "",
                      thumbnail_url: item.thumbnail_url || "",
                      slug: item.slug || "",
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
