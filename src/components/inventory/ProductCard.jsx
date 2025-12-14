/* --- ProductCard --- */
const formatCurrency = (v) =>
  v != null ? v.toLocaleString(undefined, { style: "currency", currency: "USD" }) : "";

const formatDateShort = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const ProductCard = ({ product }) => {
  // Safely get the first image URL or use a placeholder
  const imageUrl = product.images && product.images.length > 0
    ? product.images[0].url
    : "https://via.placeholder.com/400x400?text=No+Image";

  // Handle both 'name' and 'product_name' fields
  const productName = product.name || product.product_name || "Unnamed Product";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="h-36 md:h-40 lg:h-44 w-full bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center">
        <img
          src={imageUrl}
          alt={productName}
          className="object-cover h-full w-full"
          style={{ borderRadius: "16px 16px 0 0" }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
          }}
        />
      </div>
      {/* Info */}
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-medium text-gray-800">
          {productName}
        </h3>
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          <span className="block">
            <span className="font-semibold text-gray-600">SKU:</span> {product.sku || "N/A"} ·{" "}
            <span className="font-semibold text-gray-600">Category:</span> {product.category || "Uncategorized"}
          </span>
          <span className="block">
            <span className="font-semibold text-gray-600">Supplier:</span> {product.supplier || "N/A"} ·{" "}
            <span className="font-semibold text-gray-600">Price:</span> {formatCurrency(parseFloat(product.price))}
          </span>
          <span className="block">
            <span className="font-semibold text-gray-600">Stock:</span> {product.stock ?? "N/A"} ·{" "}
            <span className="font-semibold text-gray-600">Updated:</span>{" "}
            {formatDateShort(product.updated || product.created_at)}
          </span>
        </p>
        <div className="mt-3">
          <a
            href="#"
            className="text-xs text-emerald-600 font-medium hover:underline"
          >
            Create Ticket
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
