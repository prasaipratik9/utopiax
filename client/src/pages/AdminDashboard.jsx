import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";

const TABS = [
  { id: "site", label: "Site" },
  { id: "home", label: "Home" },
  { id: "openmindx", label: "OpenMindX" },
  { id: "ideationworx", label: "IdeationWorX" },
  { id: "lumierex", label: "LumiereX" },
  { id: "xperiences", label: "Xperiences" },
  { id: "media", label: "Media" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

function Field({ label, value, onChange, multiline = false }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {multiline ? (
        <textarea rows={4} value={value || ""} onChange={onChange} />
      ) : (
        <input type="text" value={value || ""} onChange={onChange} />
      )}
    </label>
  );
}

export default function AdminDashboard() {
  const { isAuthenticated, loading: authLoading, user, token } = useAuth();
  const { content, loading: contentLoading, source, saveContent, refreshContent } =
    useContent();
  const [draft, setDraft] = useState(null);
  const [tab, setTab] = useState("site");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (content) setDraft(structuredClone(content));
  }, [content]);

  const ready = useMemo(
    () => Boolean(draft && !authLoading && !contentLoading),
    [draft, authLoading, contentLoading],
  );

  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!ready) {
    return (
      <div className="admin-shell admin-shell--loading">
        <p className="admin-loading">Loading CMS…</p>
      </div>
    );
  }

  const description = (
    <>
      Signed in as <strong>{user?.username}</strong>
      {source ? (
        <>
          {" "}
          · store: <strong>{source}</strong>
        </>
      ) : null}
    </>
  );

  const patch = (section, key, value) => {
    setDraft((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] || {}),
        [key]: value,
      },
    }));
  };

  const onSave = async () => {
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const result = await saveContent(draft, token);
      setStatus(
        `Saved to ${result.source || "store"} at ${result.savedAt || "now"}`,
      );
      await refreshContent();
    } catch (err) {
      setError(err.message || "Save failed — is the API running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Content editor"
      description={description}
      actions={
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      }
    >
      <div className="admin-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "is-active" : ""}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {status ? <p className="admin-msg is-success">{status}</p> : null}
      {error ? <p className="admin-msg is-error">{error}</p> : null}

      <div className="admin-panel">
        {tab === "site" && (
          <>
            <Field
              label="Footer tagline"
              value={draft.site?.footerTagline}
              onChange={(e) => patch("site", "footerTagline", e.target.value)}
            />
            <Field
              label="Footer location"
              value={draft.site?.footerLocation}
              onChange={(e) => patch("site", "footerLocation", e.target.value)}
            />
            <Field
              label="Phone"
              value={draft.site?.phone}
              onChange={(e) => patch("site", "phone", e.target.value)}
            />
            <Field
              label="Email"
              value={draft.site?.email}
              onChange={(e) => patch("site", "email", e.target.value)}
            />
            <Field
              label="Newsletter title"
              value={draft.site?.newsletterTitle}
              onChange={(e) => patch("site", "newsletterTitle", e.target.value)}
            />
            <Field
              label="Newsletter description"
              multiline
              value={draft.site?.newsletterDesc}
              onChange={(e) => patch("site", "newsletterDesc", e.target.value)}
            />
          </>
        )}

        {tab === "home" && (
          <>
            <Field
              label="Hero eyebrow"
              value={draft.home?.heroEyebrow}
              onChange={(e) => patch("home", "heroEyebrow", e.target.value)}
            />
            <Field
              label="Hero title"
              value={draft.home?.heroTitle}
              onChange={(e) => patch("home", "heroTitle", e.target.value)}
            />
            <Field
              label="Hero lead"
              multiline
              value={draft.home?.heroLead}
              onChange={(e) => patch("home", "heroLead", e.target.value)}
            />
            <Field
              label="Pillars title"
              value={draft.home?.pillarsTitle}
              onChange={(e) => patch("home", "pillarsTitle", e.target.value)}
            />
            <Field
              label="Pillars description"
              multiline
              value={draft.home?.pillarsDesc}
              onChange={(e) => patch("home", "pillarsDesc", e.target.value)}
            />
            <Field
              label="CTA description"
              multiline
              value={draft.home?.ctaDesc}
              onChange={(e) => patch("home", "ctaDesc", e.target.value)}
            />
          </>
        )}

        {tab === "openmindx" && (
          <>
            <Field
              label="Eyebrow"
              value={draft.openmindx?.eyebrow}
              onChange={(e) => patch("openmindx", "eyebrow", e.target.value)}
            />
            <Field
              label="Title"
              value={draft.openmindx?.title}
              onChange={(e) => patch("openmindx", "title", e.target.value)}
            />
            <Field
              label="Lead"
              multiline
              value={draft.openmindx?.lead}
              onChange={(e) => patch("openmindx", "lead", e.target.value)}
            />
            <Field
              label="Body 1"
              multiline
              value={draft.openmindx?.body1}
              onChange={(e) => patch("openmindx", "body1", e.target.value)}
            />
            <Field
              label="Quote"
              multiline
              value={draft.openmindx?.quote}
              onChange={(e) => patch("openmindx", "quote", e.target.value)}
            />
          </>
        )}

        {tab === "ideationworx" && (
          <>
            <Field
              label="Eyebrow"
              value={draft.ideationworx?.eyebrow}
              onChange={(e) => patch("ideationworx", "eyebrow", e.target.value)}
            />
            <Field
              label="Title"
              value={draft.ideationworx?.title}
              onChange={(e) => patch("ideationworx", "title", e.target.value)}
            />
            <Field
              label="Lead"
              multiline
              value={draft.ideationworx?.lead}
              onChange={(e) => patch("ideationworx", "lead", e.target.value)}
            />
            <Field
              label="Design thinking body"
              multiline
              value={draft.ideationworx?.designBody}
              onChange={(e) =>
                patch("ideationworx", "designBody", e.target.value)
              }
            />
            <Field
              label="Moon shot body"
              multiline
              value={draft.ideationworx?.moonshotBody}
              onChange={(e) =>
                patch("ideationworx", "moonshotBody", e.target.value)
              }
            />
          </>
        )}

        {tab === "lumierex" && (
          <>
            <Field
              label="Eyebrow"
              value={draft.lumierex?.eyebrow}
              onChange={(e) => patch("lumierex", "eyebrow", e.target.value)}
            />
            <Field
              label="Title"
              value={draft.lumierex?.title}
              onChange={(e) => patch("lumierex", "title", e.target.value)}
            />
            <Field
              label="Lead"
              multiline
              value={draft.lumierex?.lead}
              onChange={(e) => patch("lumierex", "lead", e.target.value)}
            />
            <Field
              label="Body 1"
              multiline
              value={draft.lumierex?.body1}
              onChange={(e) => patch("lumierex", "body1", e.target.value)}
            />
            <Field
              label="Body 2"
              multiline
              value={draft.lumierex?.body2}
              onChange={(e) => patch("lumierex", "body2", e.target.value)}
            />
          </>
        )}

        {tab === "xperiences" && (
          <>
            <Field
              label="Eyebrow"
              value={draft.xperiences?.eyebrow}
              onChange={(e) => patch("xperiences", "eyebrow", e.target.value)}
            />
            <Field
              label="Title"
              value={draft.xperiences?.title}
              onChange={(e) => patch("xperiences", "title", e.target.value)}
            />
            <Field
              label="Lead"
              multiline
              value={draft.xperiences?.lead}
              onChange={(e) => patch("xperiences", "lead", e.target.value)}
            />
          </>
        )}

        {tab === "media" && (
          <>
            <Field
              label="Eyebrow"
              value={draft.media?.eyebrow}
              onChange={(e) => patch("media", "eyebrow", e.target.value)}
            />
            <Field
              label="Title"
              value={draft.media?.title}
              onChange={(e) => patch("media", "title", e.target.value)}
            />
            <Field
              label="Lead"
              multiline
              value={draft.media?.lead}
              onChange={(e) => patch("media", "lead", e.target.value)}
            />
          </>
        )}

        {tab === "about" && (
          <>
            <Field
              label="Eyebrow"
              value={draft.about?.eyebrow}
              onChange={(e) => patch("about", "eyebrow", e.target.value)}
            />
            <Field
              label="Title"
              value={draft.about?.title}
              onChange={(e) => patch("about", "title", e.target.value)}
            />
            <Field
              label="Lead"
              multiline
              value={draft.about?.lead}
              onChange={(e) => patch("about", "lead", e.target.value)}
            />
            <Field
              label="Founder name"
              value={draft.about?.founderName}
              onChange={(e) => patch("about", "founderName", e.target.value)}
            />
            <Field
              label="Founder bio 1"
              multiline
              value={draft.about?.founderBio1}
              onChange={(e) => patch("about", "founderBio1", e.target.value)}
            />
            <Field
              label="Team title"
              value={draft.about?.teamTitle}
              onChange={(e) => patch("about", "teamTitle", e.target.value)}
            />
          </>
        )}

        {tab === "contact" && (
          <>
            <Field
              label="Eyebrow"
              value={draft.contact?.eyebrow}
              onChange={(e) => patch("contact", "eyebrow", e.target.value)}
            />
            <Field
              label="Title"
              value={draft.contact?.title}
              onChange={(e) => patch("contact", "title", e.target.value)}
            />
            <Field
              label="Lead"
              multiline
              value={draft.contact?.lead}
              onChange={(e) => patch("contact", "lead", e.target.value)}
            />
            <Field
              label="Form heading"
              value={draft.contact?.heading}
              onChange={(e) => patch("contact", "heading", e.target.value)}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
}
