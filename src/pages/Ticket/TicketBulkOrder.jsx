import React, { useState, useEffect } from "react";
import { Upload, X, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from "../../stores/useAuthStore";
import toast from "react-hot-toast";


const CreateBulkOrderTicket = () => {
  const [formData, setFormData] = useState({
    productId: "",
    ticketType: "bulk_order",
    quantity: "",
    expectedUnitPrice: "",
    totalExpectedPrice: "",
    preferredSupplier: "",
    deliveryDate: "",
    reasonForBulkOrder: "",
    supportingDocs: [],
  });

  const [dragActive, setDragActive] = useState(false);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuthStore();
  // console.log("This is the token: ", token)

  const backUrl = import.meta.env.VITE_BACK_URL || "http://localhost:4000";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleFiles = (files) => {
    setFormData((prev) => ({
      ...prev,
      supportingDocs: [...prev.supportingDocs, ...files],
    }));

    const newPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size,
    }));

    setDocumentPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeDocument = (index) => {
    URL.revokeObjectURL(documentPreviews[index].url);

    setDocumentPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      supportingDocs: prev.supportingDocs.filter((_, i) => i !== index),
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const resetForm = () => {
    documentPreviews.forEach((p) => URL.revokeObjectURL(p.url));

    setFormData({
      productId: "",
      quantity: "",
      expectedUnitPrice: "",
      totalExpectedPrice: "",
      preferredSupplier: "",
      deliveryDate: "",
      reasonForBulkOrder: "",
      supportingDocs: [],
    });
    setDocumentPreviews([]);
  };

  const validate = () => {
    if (!formData.productId.trim()) {
      toast.success("Please enter a product name or SKU.");
      return false;
    }
    if (!formData.quantity) {
      toast.error("Please enter quantity.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "supportingDocs") {
          formData.supportingDocs.forEach((doc) => {
            payload.append("supportingDocs", doc);
          });
        } else if (value !== "") {
          payload.append(key, value);
        }
      });

      // Ensure ticketType is bulk_order (overwrites if already present)
      payload.set("ticketType", "bulk_order");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(
        `${backUrl}/tickets/bulk_order`,
        payload,
        { headers }
      );

      // ✅ axios already gives you parsed data as res.data
      // const data = res.data; // use this if you need the response body

      if (res.status === 201 || res.status === 200) {
        toast.success("Bulk order ticket submitted successfully!");
        resetForm();
      } else {
        toast.error(`Unexpected response: ${res.status}`);
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      toast.error("Error submitting ticket");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (confirm("Discard changes?")) resetForm();
  };

  useEffect(() => {
    return () => {
      documentPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-blue-600 mb-6">
        <span onClick={() => (navigate('/ticketspage'))} className="cursor-pointer hover:underline">Tickets</span>
        <span className="text-gray-600"> / Bulk Order</span>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create Ticket – Bulk Order
      </h1>

      {/* Form */}
      <div className="max-w-2xl space-y-6">
        {/* Product Name/SKU */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Product Name/SKU
          </label>
          <input
            name="productId"
            value={formData.productId}
            onChange={handleInputChange}
            placeholder="Search product by name or SKU"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Quantity
          </label>
          <input
            name="quantity"
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
            placeholder="Enter quantity"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Expected Unit Price */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Expected Unit Price
          </label>
          <input
            name="expectedUnitPrice"
            type="number"
            value={formData.expectedUnitPrice}
            onChange={handleInputChange}
            placeholder="Enter expected unit price"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Total Expected Price */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Total Expected Price
          </label>
          <input
            name="totalExpectedPrice"
            type="number"
            value={formData.totalExpectedPrice}
            onChange={handleInputChange}
            placeholder="Enter total expected price"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Preferred Supplier */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Preferred Supplier
          </label>
          <select
            name="preferredSupplier"
            value={formData.preferredSupplier}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select supplier</option>
            <option value="supplier_1">Supplier 1</option>
            <option value="supplier_2">Supplier 2</option>
            <option value="supplier_3">Supplier 3</option>
          </select>
        </div>

        {/* Delivery Date */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Delivery Date
          </label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate}
            onChange={handleInputChange}
            placeholder="Select delivery date"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Reason for Bulk Order / Notes */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Reason for Bulk Order / Notes
          </label>
          <textarea
            name="reasonForBulkOrder"
            value={formData.reasonForBulkOrder}
            onChange={handleInputChange}
            rows={4}
            placeholder="Enter reason or notes..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Upload Supporting Documents
          </label>

          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
              }`}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Upload Supporting Documents
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Drag & drop files here or
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx"
                className="hidden"
                onChange={handleFileInput}
              />
              <label
                htmlFor="file-input"
                className="px-6 py-2 bg-white text-gray-700 text-sm font-medium border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Browse
              </label>
            </div>
          </div>

          {documentPreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {documentPreviews.map((doc, index) => (
                <div
                  key={index}
                  className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                >
                  {doc.type.startsWith("image/") ? (
                    <div className="aspect-square">
                      <img
                        src={doc.url}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square flex items-center justify-center bg-gray-100">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <button
                    onClick={() => removeDocument(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                    aria-label="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="p-2 bg-white border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {doc.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(doc.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? "Submitting..." : "Submit Bulk Order Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBulkOrderTicket;
