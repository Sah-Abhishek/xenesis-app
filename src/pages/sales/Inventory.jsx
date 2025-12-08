import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import ProductCard from "../../components/inventory/ProductCard";
import Pagination from "../../components/inventory/Pagination";
import { useGetCategories } from "../../hooks/useGetCategories";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [error, setError] = useState(null);
  const backUrl = import.meta.env.VITE_BACK_URL;
  const categories = useGetCategories()
  console.log("These are the categories: ", categories)

  /* -------------------------------
     LOAD PRODUCTS FROM BACKEND
  ------------------------------- */
  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${backUrl}/products`);

        // Supports both:
        // - Simple array response
        // - Filter API using { data: [...] }
        const payload = Array.isArray(res.data) ? res.data : res.data.data;

        if (mounted) {
          setProducts(payload);
        }
      } catch (err) {
        if (mounted) setError(err.message || "Error fetching products");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => (mounted = false);
  }, []);

  /* -------------------------------
     LOCAL SEARCH FILTER
  ------------------------------- */
  const filtered = useMemo(() => {
    if (!q.trim()) return products;
    const s = q.toLowerCase();

    return products.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(s)) ||
        (p.sku && p.sku.toLowerCase().includes(s)) ||
        (p.category && p.category.toLowerCase().includes(s))
    );
  }, [products, q]);

  /* -------------------------------
     PAGINATION CALCULATIONS
  ------------------------------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  /* -------------------------------
     RENDER UI
  ------------------------------- */
  return (
    <div className="min-h-screen p-6 md:p-10 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Inventory
          </h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M21 21l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                  <circle
                    cx="11"
                    cy="11"
                    r="6"
                    stroke="currentColor"
                    strokeWidth="2"
                  ></circle>
                </svg>
              </div>

              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by product name, SKU, or category"
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          </div>

          {/* Placeholder to match UI */}
          <div className="w-6" />
        </div>

        {/* Filters (UI only) */}
        <div className="flex flex-wrap gap-3 mb-6">
          {["Category", "Supplier", "Stock Status", "Price Range"].map((f) => (
            <button
              key={f}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 bg-white text-sm text-gray-600 shadow-sm"
            >
              <span>{f}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                className="text-gray-400"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </button>
          ))}
        </div>

        {/* Products Label */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-700">Products</h2>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products…</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No products found</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {pageItems.map((p) => (
                <ProductCard key={p.sku} product={p} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
