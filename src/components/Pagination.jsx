const getVisiblePages = (currentPage, totalPages) => {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  const pages = [];

  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <nav className="-mx-4 mt-6 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:px-0">
      <div className="flex min-w-max items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="rounded-xl border border-white/10 bg-panel px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 disabled:opacity-40 sm:px-4"
        >
          Prev
        </button>

        {getVisiblePages(page, totalPages).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition ${
              item === page
                ? "bg-accent text-white"
                : "border border-white/10 bg-panel text-slate-200 hover:bg-white/5"
            }`}
          >
            {item}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="rounded-xl border border-white/10 bg-panel px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 disabled:opacity-40 sm:px-4"
        >
          Next
        </button>
      </div>
    </nav>
  );
}
