import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

const EMPTY = {
  title: "",
  description: "",
  price: "",
  image_url: "",
  is_published: true,
};

function Field({ label, value, onChange, multiline = false, type = "text" }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea rows={4} value={value || ""} onChange={onChange} />
      ) : type === "checkbox" ? (
        <input type="checkbox" checked={Boolean(value)} onChange={onChange} />
      ) : (
        <input type={type} step={type === "number" ? "0.01" : undefined} value={value ?? ""} onChange={onChange} />
      )}
    </label>
  );
}

function centsToDollars(cents) {
  if (cents === null || cents === undefined || cents === "") return "";
  const n = Number(cents);
  if (!Number.isFinite(n)) return "";
  return (n / 100).toFixed(2);
}

function dollarsToCents(value) {
  if (value === "" || value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100);
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

export default function AdminProducts() {
  const { isAuthenticated, loading: authLoading, user, token } = useAuth();
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
    const data = await api("/api/products", token);
    setItems(data.items || []);
  };

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api("/api/products", token);
        if (!cancelled) setItems(data.items || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load products");
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
      <div className="admin-shell admin-shell--loading">
        <p className="admin-loading">Loading products…</p>
      </div>
    );
  }

  const patch = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onUploadImage = async () => {
    if (!imageFile) {
      setError("Choose an image first");
      return;
    }
    setUploading(true);
    setStatus("");
    setError("");
    try {
      const url = await uploadToCloudinary(imageFile, token);
      patch("image_url", url);
      setStatus("Image uploaded");
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
        description: form.description,
        price_cents: dollarsToCents(form.price),
        image_url: form.image_url || null,
        is_published: Boolean(form.is_published),
      };
      if (editingId) {
        await api(`/api/products/${editingId}`, token, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatus("Product updated");
      } else {
        await api("/api/products", token, {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setStatus("Product created");
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
      await api(`/api/products/${item.id}`, token, { method: "DELETE" });
      setItems((prev) => prev.filter((row) => row.id !== item.id));
      if (editingId === item.id) {
        setForm(null);
        setEditingId(null);
      }
      setStatus("Product deleted");
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  return (
    <AdminLayout
      title="Products"
      description={
        <>
          Signed in as <strong>{user?.username}</strong>
        </>
      }
      actions={
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
      }
    >
      {status ? <p className="admin-msg is-success">{status}</p> : null}
      {error ? <p className="admin-msg is-error">{error}</p> : null}

      {form ? (
        <form className="admin-panel" onSubmit={onSave}>
          <Field
            label="Title"
            value={form.title}
            onChange={(e) => patch("title", e.target.value)}
          />
          <Field
            label="Description"
            multiline
            value={form.description}
            onChange={(e) => patch("description", e.target.value)}
          />
          <Field
            label="Price (AUD)"
            type="number"
            value={form.price}
            onChange={(e) => patch("price", e.target.value)}
          />
          <Field
            label="Image URL"
            value={form.image_url}
            onChange={(e) => patch("image_url", e.target.value)}
          />
          <label className="admin-field">
            <span>Upload image</span>
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
              onClick={onUploadImage}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </div>
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
          <p className="admin-top__meta">No products yet.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`admin-list-item${
                item.is_published !== false ? " is-published" : " is-unpublished"
              }`}
            >
              <strong>{item.title}</strong>
              <p className="admin-top__meta">
                {item.price_cents == null
                  ? "No price"
                  : `$${(Number(item.price_cents) / 100).toFixed(2)} ${item.currency || "AUD"}`}
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
                      description: item.description || "",
                      price: centsToDollars(item.price_cents),
                      image_url: item.image_url || "",
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
    </AdminLayout>
  );
}
