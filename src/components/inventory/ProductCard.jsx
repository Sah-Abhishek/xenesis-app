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
  // console.log("This is the product in the productcard: ", product)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Image */}
      <div className="h-36 md:h-40 lg:h-44 w-full bg-gradient-to-b from-gray-100 to-gray-50 flex items-center justify-center">
        <img
          src={product.images[0].url}
          alt={product.name}
          className="object-cover h-full w-full"
          style={{ borderRadius: "16px 16px 0 0" }}
        />
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        <h3 className="text-sm md:text-base font-medium text-gray-800">
          {product.name}
        </h3>

        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          <span className="block">
            <span className="font-semibold text-gray-600">SKU:</span> {product.sku} ·{" "}
            <span className="font-semibold text-gray-600">Category:</span> {product.category}
          </span>

          <span className="block">
            <span className="font-semibold text-gray-600">Supplier:</span> {product.supplier} ·{" "}
            <span className="font-semibold text-gray-600">Price:</span> {formatCurrency(product.price)}
          </span>

          <span className="block">
            <span className="font-semibold text-gray-600">Stock:</span> {product.stock} ·{" "}
            <span className="font-semibold text-gray-600">Updated:</span>{" "}
            {formatDateShort(product.updated)}
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
