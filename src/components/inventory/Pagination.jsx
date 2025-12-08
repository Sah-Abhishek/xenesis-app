import { useMemo } from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  const pages = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= totalPages; i++) arr.push(i);
    return arr;
  }, [totalPages]);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      {/* Previous */}
      <button
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        className="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white hover:bg-gray-50"
      >
        ‹
      </button>

      {/* Page Buttons */}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-3 py-2 rounded-lg text-sm border ${p === page
              ? "bg-slate-50 border-slate-300 font-semibold"
              : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
        >
          {p}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        className="px-3 py-2 rounded-lg text-sm border border-gray-200 bg-white hover:bg-gray-50"
      >
        ›
      </button>
    </div>
  );
};

export default Pagination;
