export default function Pagination({ page, totalPages, onPrev, onNext }) {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        disabled={page === 1}
        onClick={onPrev}
      >
        Previous
      </button>
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        disabled={page === totalPages}
        onClick={onNext}
      >
        Next
      </button>
    </div>
  );
}
