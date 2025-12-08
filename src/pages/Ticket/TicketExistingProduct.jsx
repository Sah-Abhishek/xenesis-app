import React, { useState, useEffect } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateExistingProductTicket = () => {
  const [formData, setFormData] = useState({
    productId: '',
    currentProductName: '',
    quantity: '',
    reasonForUpdate: '',
    fieldsToModify: '',
    expectedNewPrice: '',
    documents: []
  });

  const [dragActive, setDragActive] = useState(false);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
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
      e.target.value = ''; // Reset input to allow re-uploading same file
    }
  };

  const handleFiles = (files) => {
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));

    const newPreviews = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
      size: file.size
    }));

    setDocumentPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeDocument = (index) => {
    URL.revokeObjectURL(documentPreviews[index].url);

    setDocumentPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();
      submitData.append('productId', formData.productId);
      submitData.append('currentProductName', formData.currentProductName);
      submitData.append('quantity', formData.quantity);
      submitData.append('reasonForUpdate', formData.reasonForUpdate);
      submitData.append('fieldsToModify', formData.fieldsToModify);
      submitData.append('expectedNewPrice', formData.expectedNewPrice);

      formData.documents.forEach((doc) => {
        submitData.append('documents', doc);
      });

      const response = await fetch('http://localhost:3000/tickets/existing-product', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        alert('Ticket submitted successfully!');
        handleCancel();
      } else {
        alert('Failed to submit ticket');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket');
    }
  };

  const handleCancel = () => {
    documentPreviews.forEach((p) => URL.revokeObjectURL(p.url));

    setFormData({
      productId: '',
      currentProductName: '',
      quantity: '',
      reasonForUpdate: '',
      fieldsToModify: '',
      expectedNewPrice: '',
      documents: []
    });
    setDocumentPreviews([]);
  };

  useEffect(() => {
    return () => {
      documentPreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="text-sm text-gray-600 mb-6">
          <span
            onClick={() => navigate('/ticketspage')}
            className="text-blue-600 cursor-pointer hover:underline">Tickets</span>
          <span> / Existing Product</span>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create Ticket - Existing Product
        </h1>

        <div className="max-w-2xl">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Product ID / SKU
            </label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleInputChange}
              placeholder="Enter Product ID or SKU"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Product Name
            </label>
            <input
              type="text"
              name="currentProductName"
              value={formData.currentProductName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Quantity
            </label>
            <input
              type="text"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Reason for Update
            </label>
            <textarea
              name="reasonForUpdate"
              value={formData.reasonForUpdate}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Fields to Modify
            </label>
            <input
              type="text"
              name="fieldsToModify"
              value={formData.fieldsToModify}
              onChange={handleInputChange}
              placeholder="Select fields to modify"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Expected New Price
            </label>
            <input
              type="text"
              name="expectedNewPrice"
              value={formData.expectedNewPrice}
              onChange={handleInputChange}
              placeholder="Enter new expected price"
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Upload Supporting Documents
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
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
                  type="file"
                  id="document-upload"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <label
                  htmlFor="document-upload"
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
                    {doc.type.startsWith('image/') ? (
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

          <div className="flex justify-end gap-3">
            <button
              onClick={handleCancel}
              className="px-6 py-2 bg-gray-200 text-gray-900 text-sm font-medium rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateExistingProductTicket;
