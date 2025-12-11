import React, { useState, useEffect } from "react";
import { Upload, X, FileText } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "../../stores/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CreateNewProductTicket = () => {
  const [formData, setFormData] = useState({
    productName: "",
    ticketType: "new_product",
    subject: "",
    leadId: "",
    notesFromSales: "",
    expectedNewPrice: "",
    preferredSupplier: "",
    totalExpectedPrice: "",
    expectedDeliveryDate: "",
    assignedTo: "",
    priority: "medium",
    supportingDocs: [],
  });

  const [dragActive, setDragActive] = useState(false);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const backUrl = import.meta.env.VITE_BACK_URL || "http://localhost:4000";

  // Get token from auth store
  const token = useAuthStore((state) => state.token);

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
      e.target.value = ""; // Reset input to allow re-uploading same file
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
      productName: "",
      ticketType: "new_product",
      subject: "",
      lead_id: "",
      notesFromSales: "",
      expectedNewPrice: "",
      preferredSupplier: "",
      totalExpectedPrice: "",
      expectedDeliveryDate: "",
      assignedTo: "",
      priority: "medium",
      supportingDocs: [],
    });
    setDocumentPreviews([]);
  };

  const validate = () => {
    if (!formData.productName.trim()) {
      toast.error("Please enter a product name.");
      return false;
    }
    if (!formData.subject.trim()) {
      toast.error("Please enter a subject.");
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
        } else if (value !== "" || key === "lead_id") {
          payload.append(key, value);
        }
      });

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = await axios.post(`${backUrl}/tickets`, payload, { headers });

      if (res.status === 201 || res.status === 200) {
        toast.success("Ticket submitted successfully!");
        resetForm();
      } else {
        toast.error(`Unexpected response: ${res.status}`);
      }
    } catch (err) {
      console.error("Error submitting ticket:", err);
      toast.error(err.response?.data?.message || "Error submitting ticket");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-blue-600 mb-6">
        <span
          onClick={() => navigate("/ticketspage")}
          className="cursor-pointer hover:underline"
        >
          Tickets
        </span>
        <span className="text-gray-600"> / New Product</span>
      </div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create Ticket - New Product
      </h1>

      {/* Form */}
      <div className="max-w-2xl space-y-6">
        {/* Product Name Text Input */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Product Name
          </label>
          <input
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Subject
          </label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Ticket subject"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* notesFromSales */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Notes From Sales (optional)
          </label>
          <textarea
            name="notesFromSales"
            value={formData.notesFromSales}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe your request..."
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Pricing fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Expected New Price
            </label>
            <input
              name="expectedNewPrice"
              value={formData.expectedNewPrice}
              onChange={handleInputChange}
              placeholder="e.g. 1500"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Total Expected Price
            </label>
            <input
              name="totalExpectedPrice"
              value={formData.totalExpectedPrice}
              onChange={handleInputChange}
              placeholder="e.g. 3000"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                         placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Supplier & Delivery Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Preferred Supplier
            </label>
            <input
              name="preferredSupplier"
              value={formData.preferredSupplier}
              onChange={handleInputChange}
              placeholder="Supplier name (optional)"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                          placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-base font-medium text-gray-900 mb-2">
              Expected Delivery Date
            </label>
            <input
              type="date"
              name="expectedDeliveryDate"
              value={formData.expectedDeliveryDate}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Assigned To */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Assign To (optional)
          </label>
          <input
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleInputChange}
            placeholder="User ID / Username"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 
                       placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priority Selector */}
        <div>
          <label className="block text-base font-medium text-gray-900 mb-2">
            Priority
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: "low" }))}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${formData.priority === "low"
                ? "bg-green-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-green-500 hover:bg-green-50"
                }`}
            >
              Low
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: "medium" }))}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${formData.priority === "medium"
                ? "bg-yellow-500 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-yellow-500 hover:bg-yellow-50"
                }`}
            >
              Medium
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, priority: "high" }))}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${formData.priority === "high"
                ? "bg-red-600 text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-300 hover:border-red-500 hover:bg-red-50"
                }`}
            >
              High
            </button>
          </div>
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
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
              }`}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-3" />
              <h3 className="text-base font-semibold text-gray-900 mb-1">
                Drop your files here
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                or click to browse (multiple files supported)
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
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
              >
                Choose Files
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
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewProductTicket;
