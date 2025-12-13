import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

// Mock auth store - replace with your actual implementation

const PurchaseDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const backUrl = import.meta.env.VITE_BACK_URL;
  const navigate = useNavigate()
  const { user, token } = useAuthStore();

  const fetchTickets = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await axios.get(`${backUrl}/tickets?page=${page}&limit=3`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTickets(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setTotal(response.data.total || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets(1);
  }, []);

  // Auto-refresh every 5 seconds
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchTickets(currentPage);
  //   }, 5000);
  //
  //   return () => clearInterval(interval);
  // }, [currentPage]);

  const getStatusClass = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'quote_received') return 'bg-green-100 text-green-700';
    if (status === 'in_progress') return 'bg-blue-100 text-blue-700';
    if (status === 'completed') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getStatusText = (status) => {
    if (status === 'pending') return 'Waiting for price';
    if (status === 'quote_received') return 'Quote Received';
    if (status === 'in_progress') return 'In Progress';
    if (status === 'completed') return 'Completed';
    return status;
  };

  const getUrgency = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffHours = (due - now) / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffDays < -1) return { text: `${Math.abs(Math.floor(diffDays))} days overdue`, color: 'text-red-600' };
    if (diffHours < 0) return { text: `${Math.abs(Math.floor(diffHours))} hours overdue`, color: 'text-red-600' };
    if (diffHours <= 2) return { text: 'Due in 2 hours', color: 'text-orange-600' };
    if (diffDays <= 1) return { text: '1 day overdue', color: 'text-orange-600' };
    return null;
  };

  const getDueDateText = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    const diffDays = (dueDay - today) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      const hours = due.getHours();
      const minutes = due.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `Due: Today ${displayHours}:${minutes.toString().padStart(2, '0')}${ampm}`;
    }
    if (diffDays === 1) return 'Due: Tomorrow';
    if (diffDays < 0) return `${Math.abs(Math.floor(diffDays))} days overdue`;
    return `Due in ${Math.floor(diffDays)} days`;
  };

  const requiresResponseTickets = tickets.filter(
    ticket => ticket.assigned_to === user.name
  );

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = searchQuery === '' ||
      ticket.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === 'All') return matchesSearch;
    if (activeTab === 'Awaiting Me') return matchesSearch && ticket.assigned_to === user.name;
    if (activeTab === 'In Progress') return matchesSearch && ticket.status === 'in_progress';
    return matchesSearch;
  });

  const getTypeDisplay = (ticketType, priority) => {
    const type = ticketType === 'new_product' ? 'New Product' :
      ticketType === 'existing_product' ? 'Existing Product' :
        ticketType === 'bulk_order' ? 'Bulk Order' : ticketType;
    return `${type} - ${priority}`;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      fetchTickets(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${currentPage === i
            ? 'bg-gray-900 text-white'
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Purchase Dashboard</h1>

        {/* Requires Your Response Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Requires Your Response</h2>
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Filter by date,time
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {requiresResponseTickets.slice(0, 3).map((ticket) => {
              const urgency = getUrgency(ticket.expected_delivery_date);
              return (
                <div key={ticket.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  {urgency && (
                    <div className={`text-xs font-medium mb-2 ${urgency.color}`}>
                      {urgency.text}
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {ticket.subject || ticket.product_name}
                  </h3>
                  <div className="text-sm text-gray-600 mb-3">
                    <div>Quantity: {ticket.quantity || 'N/A'} | Exp Price: ₹{parseFloat(ticket.expected_new_price || 0).toFixed(0)}</div>
                  </div>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-medium py-2 px-4 rounded transition-colors">
                    Respond Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Ticket Queue Section */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Ticket Queue</h2>

            {/* Search Bar */}
            <div className="relative mb-4">
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
              {['All', 'Awaiting Me', 'In Progress'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === tab
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status/Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>

                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      Loading tickets...
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{ticket.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-teal-600">
                        {ticket.product_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {getTypeDisplay(ticket.ticket_type, ticket.priority)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(ticket.status)}`}>
                          {ticket.expected_delivery_date ? getDueDateText(ticket.expected_delivery_date) : getStatusText(ticket.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => navigate(`/tickets/${ticket.id}`)}
                          className="text-sm text-blue-600 hover:underline" >
                          View Details
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center">
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
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
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseDashboard;
