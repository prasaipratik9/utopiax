export default function MediaFilter({ active, onChange }) {
  const filters = [
    { id: "all", label: "All" },
    { id: "article", label: "Articles" },
    { id: "video", label: "Video" },
    { id: "audio", label: "Audio" },
  ];

  return (
    <div className="filter-bar">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          className={`filter-btn${active === f.id ? " is-active" : ""}`}
          onClick={() => onChange(f.id)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
