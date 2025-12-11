import { useState } from 'react';
import axios from 'axios'
import { useAuthStore } from '../../stores/useAuthStore';

export default function AddNewSupplier() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    gst: '',
    address: '',
    emailAddress: '',
    phoneNumber: '',
    websiteUrl: '',
    productsServices: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const { token } = useAuthStore();


  const backUrl = import.meta.env.VITE_BACK_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post(`${backUrl}/suppliers`, formData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
      });

      setMessage({ type: "success", text: "Supplier added successfully!" });

      // Reset form
      setFormData({
        companyName: "",
        contactPerson: "",
        gst: "",
        address: "",
        emailAddress: "",
        phoneNumber: "",
        websiteUrl: "",
        productsServices: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to add supplier. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  ;

  const handleCancel = () => {
    setFormData({
      companyName: '',
      contactPerson: '',
      gst: '',
      address: '',
      emailAddress: '',
      phoneNumber: '',
      websiteUrl: '',
      productsServices: ''
    });
    setMessage({ type: '', text: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl  bg-white rounded-lg shadow-sm p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Add New Supplier</h1>
          {/* <button */}
          {/*   onClick={handleSubmit} */}
          {/*   disabled={loading} */}
          {/*   className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" */}
          {/* > */}
          {/*   {loading ? 'Saving...' : 'Save Supplier'} */}
          {/* </button> */}
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
            {message.text}
          </div>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              placeholder="Enter contact person"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* GST */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              GST %
            </label>
            <input
              type="number"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Contact Details Section */}
          <div className="pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Details</h2>

            {/* Email Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                placeholder="Enter email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Website URL */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Website URL
              </label>
              <input
                type="url"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="Enter website URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Products/Services Offered Section */}
          <div className="pt-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Products/Services Offered</h2>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Products/Services
              </label>
              <textarea
                name="productsServices"
                value={formData.productsServices}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-8 pt-6 ">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Supplier'}
          </button>
        </div>
      </div>
    </div>
  );
}
