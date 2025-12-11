import axios from 'axios';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const backUrl = import.meta.env.VITE_BACK_URL;
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  useEffect(() => {
    filterSuppliers();
  }, [searchQuery, suppliers]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backUrl}/suppliers?page=${currentPage}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      // Handle the API response structure: { page, limit, totalPages, suppliers: [] }
      if (data.suppliers && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
        setFilteredSuppliers(data.suppliers);
        setTotalPages(data.totalPages || 1);
      } else {
        // Fallback for different response structures
        setSuppliers([]);
        setFilteredSuppliers([]);
        setTotalPages(1);
      }

      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch suppliers");
      console.error("Error fetching suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    if (!searchQuery.trim()) {
      setFilteredSuppliers(suppliers);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = suppliers.filter(supplier =>
      supplier.company_name?.toLowerCase().includes(query) ||
      supplier.contact_person?.toLowerCase().includes(query) ||
      supplier.email?.toLowerCase().includes(query) ||
      supplier.phone_number?.toLowerCase().includes(query)
    );

    setFilteredSuppliers(filtered);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const getStatus = (supplier) => {
    return 'Active';
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${currentPage === i
            ? 'bg-gray-200 text-gray-900'
            : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-900">Suppliers</h1>
          <button
            onClick={() => navigate('/supplier/addnewsupplier')}
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
          >
            Add Supplier
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search suppliers..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-2 text-gray-600">Loading suppliers...</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Supplier Name
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Contact Person
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Phone
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-12 text-gray-500">
                        No suppliers found
                      </td>
                    </tr>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 text-gray-900 font-medium">
                          {supplier.company_name}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {supplier.contact_person}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {supplier.email}
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {supplier.phone_number}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatus(supplier) === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                            }`}>
                            {getStatus(supplier)}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col gap-1 text-sm">
                            <button className="text-blue-600 hover:text-blue-800 text-left">
                              View Details
                            </button>
                            <button className="text-blue-600 hover:text-blue-800 text-left">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* Page Numbers */}
                {renderPageNumbers()}

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
