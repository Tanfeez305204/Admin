const formatDate = (value) => new Date(value).toLocaleDateString();

const LANGUAGE_OPTIONS = [
  "Hindi Dubbed",
  "South Dubbed",
  "English",
  "Bollywood",
  "Multi Audio"
];

const SORT_OPTIONS = [
  { value: "created_at", label: "Created" },
  { value: "title", label: "Title" },
  { value: "year", label: "Year" }
];

const SortButton = ({ label, active, order, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-white"
  >
    {label}
    {active ? <span className="text-[10px] text-accent">{order === "asc" ? "^" : "v"}</span> : null}
  </button>
);

const StatusBadge = ({ published }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      published ? "bg-emerald-500/10 text-emerald-300" : "bg-amber-500/10 text-amber-300"
    }`}
  >
    {published ? "Published" : "Draft"}
  </span>
);

const MobileDetail = ({ label, value }) => (
  <div className="rounded-2xl border border-white/5 bg-panel px-3 py-2.5">
    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
    <p className="mt-1 text-sm text-slate-200">{value}</p>
  </div>
);

export default function MovieTable({
  movies,
  search,
  language,
  selectedIds,
  sortBy,
  sortOrder,
  onSearchChange,
  onLanguageChange,
  onSortChange,
  onSortByChange,
  onSortOrderChange,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
  onDeleteSelected
}) {
  const allSelected = movies.length > 0 && movies.every((movie) => selectedIds.includes(movie.id));

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-white/5 bg-panelSoft shadow-panel sm:rounded-[2rem]">
      <div className="flex flex-col gap-4 border-b border-white/5 px-4 py-4 sm:px-6 sm:py-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title"
            className="rounded-2xl border border-stroke bg-panel px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
            aria-label="Search movies by title"
          />

          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value)}
            className="rounded-2xl border border-stroke bg-panel px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
            aria-label="Filter movies by language"
          >
            <option value="">All languages</option>
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(event) => onSortByChange(event.target.value)}
            className="rounded-2xl border border-stroke bg-panel px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
            aria-label="Sort movies by"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                Sort: {option.label}
              </option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(event) => onSortOrderChange(event.target.value)}
            className="rounded-2xl border border-stroke bg-panel px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
            aria-label="Sort order"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:gap-4">
            <span>{movies.length} results on this page</span>
            <button
              type="button"
              onClick={() => onToggleSelectAll(!allSelected)}
              className="text-left font-medium text-slate-200 transition hover:text-white"
            >
              {allSelected ? "Clear page selection" : "Select this page"}
            </button>
          </div>

          <button
            type="button"
            onClick={onDeleteSelected}
            disabled={!selectedIds.length}
            className="w-full rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Delete Selected ({selectedIds.length})
          </button>
        </div>
      </div>

      <div className="space-y-3 p-4 md:hidden">
        {movies.length ? (
          movies.map((movie) => (
            <article key={movie.id} className="rounded-[1.5rem] border border-white/5 bg-[#111628] p-4">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(movie.id)}
                  onChange={() => onToggleSelect(movie.id)}
                  aria-label={`Select ${movie.title}`}
                  className="mt-1 h-4 w-4 rounded border-stroke bg-panel text-accent focus:ring-accent"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-base font-semibold text-white">{movie.title}</h3>
                      <p className="mt-1 break-all text-xs text-slate-500">{movie.slug}</p>
                    </div>
                    <StatusBadge published={movie.is_published} />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <MobileDetail label="Language" value={movie.language} />
                    <MobileDetail label="Year" value={movie.year} />
                    <MobileDetail label="Created" value={formatDate(movie.created_at)} />
                    <MobileDetail label="Sort" value={`${sortBy} / ${sortOrder}`} />
                  </div>

                  <div className="mt-4 flex flex-col gap-2 min-[420px]:flex-row">
                    <button
                      type="button"
                      onClick={() => onEdit(movie.id)}
                      className="w-full rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(movie.id)}
                      className="w-full rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-panel px-4 py-10 text-center text-sm text-slate-400">
            No movies match the current filters.
          </div>
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-white/5">
          <thead>
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(event) => onToggleSelectAll(event.target.checked)}
                  aria-label="Select all movies on this page"
                  className="h-4 w-4 rounded border-stroke bg-panel text-accent focus:ring-accent"
                />
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton
                  label="Title"
                  active={sortBy === "title"}
                  order={sortOrder}
                  onClick={() => onSortChange("title")}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Language
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton
                  label="Year"
                  active={sortBy === "year"}
                  order={sortOrder}
                  onClick={() => onSortChange("year")}
                />
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Status
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton
                  label="Created"
                  active={sortBy === "created_at"}
                  order={sortOrder}
                  onClick={() => onSortChange("created_at")}
                />
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {movies.length ? (
              movies.map((movie) => (
                <tr key={movie.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(movie.id)}
                      onChange={() => onToggleSelect(movie.id)}
                      aria-label={`Select ${movie.title}`}
                      className="h-4 w-4 rounded border-stroke bg-panel text-accent focus:ring-accent"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-[24rem]">
                      <p className="line-clamp-2 font-medium text-white">{movie.title}</p>
                      <p className="mt-1 break-all text-sm text-slate-400">{movie.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">{movie.language}</td>
                  <td className="px-6 py-4 text-sm text-slate-300">{movie.year}</td>
                  <td className="px-6 py-4">
                    <StatusBadge published={movie.is_published} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{formatDate(movie.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(movie.id)}
                        className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(movie.id)}
                        className="rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-300 transition hover:bg-red-500/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-400">
                  No movies match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
