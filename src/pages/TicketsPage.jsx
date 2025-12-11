import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../stores/useAuthStore'

const CreateTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showTicketTypeDropdown, setShowTicketTypeDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 2;

  const navigate = useNavigate()
  const backUrl = import.meta.env.VITE_BACK_URL;
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backUrl}/tickets?page=${currentPage}&limit=${itemsPerPage}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTickets(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotal(response.data.total || 0);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, [currentPage, backUrl, token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  const formatTicketType = (type) => {
    if (!type) return 'N/A';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'closed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      ticket.id?.toLowerCase().includes(searchLower) ||
      ticket.subject?.toLowerCase().includes(searchLower) ||
      ticket.product_name?.toLowerCase().includes(searchLower) ||
      ticket.created_by?.toLowerCase().includes(searchLower);

    const matchesTicketType = !ticketTypeFilter || ticket.ticket_type === ticketTypeFilter;
    const matchesStatus = !statusFilter || ticket.status === statusFilter;

    return matchesSearch && matchesTicketType && matchesStatus;
  });

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage < maxButtons - 1) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium ${currentPage === i
            ? 'bg-gray-900 text-white'
            : 'hover:bg-gray-100 text-gray-700'
            }`}
        >
          {i}
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">Tickets</div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Ticket</h1>

      {/* Ticket Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* New Product */}
        <div className='bg-gray-100 p-5 rounded-2xl'>
          <h2 className="text-base font-semibold text-gray-900 mb-1">New Product</h2>
          <p className="text-sm text-gray-600 mb-3">
            Create a ticket for adding a completely new product to the system
          </p>
          <button
            onClick={() => navigate('/tickets/createticket/newproduct')}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300">
            Create
          </button>
        </div>

        {/* Existing Product */}
        <div className='bg-gray-100 p-5 rounded-2xl'>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Existing Product</h2>
          <p className="text-sm text-gray-600 mb-3">
            Create a ticket for updating an already existing product in the system
          </p>
          <button
            onClick={() => navigate('/tickets/createticket/existingproduct')}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300">
            Create
          </button>
        </div>

        {/* Bulk Order */}
        <div className='bg-gray-100 p-5 rounded-2xl'>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Bulk Order</h2>
          <p className="text-sm text-gray-600 mb-3">
            Submit a ticket for a large quantity or special pricing request
          </p>
          <button
            onClick={() => navigate('/tickets/createticket/bulkorder')}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-300">
            Create
          </button>
        </div>
      </div>

      {/* Recent Tickets Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Tickets</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Ticket ID, Subject / Product Name, or Created By"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <div className="relative">
          <button
            onClick={() => {
              setShowTicketTypeDropdown(!showTicketTypeDropdown);
              setShowStatusDropdown(false);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            {ticketTypeFilter && (
              <X
                className="w-4 h-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setTicketTypeFilter('');
                }}
              />
            )}
            Ticket Type
            <ChevronDown className="w-4 h-4" />
          </button>
          {showTicketTypeDropdown && (
            <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => { setTicketTypeFilter(''); setShowTicketTypeDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                All
              </button>
              <button
                onClick={() => { setTicketTypeFilter('new_product'); setShowTicketTypeDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                New Product
              </button>
              <button
                onClick={() => { setTicketTypeFilter('existing_product'); setShowTicketTypeDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Existing Product
              </button>
              <button
                onClick={() => { setTicketTypeFilter('bulk_order'); setShowTicketTypeDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Bulk Order
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowStatusDropdown(!showStatusDropdown);
              setShowTicketTypeDropdown(false);
            }}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
          >
            {statusFilter && (
              <X
                className="w-4 h-4"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatusFilter('');
                }}
              />
            )}
            Status
            <ChevronDown className="w-4 h-4" />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => { setStatusFilter(''); setShowStatusDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                All
              </button>
              <button
                onClick={() => { setStatusFilter('pending'); setShowStatusDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Pending
              </button>
              <button
                onClick={() => { setStatusFilter('approved'); setShowStatusDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Approved
              </button>
              <button
                onClick={() => { setStatusFilter('rejected'); setShowStatusDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Rejected
              </button>
              <button
                onClick={() => { setStatusFilter('closed'); setShowStatusDropdown(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Closed
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Ticket ID</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Subject / Product Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Ticket Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Created By</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Date Created</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">No tickets found</td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-100">
                      <td className="p-4 text-sm text-gray-900">#{ticket.id.slice(0, 5)}</td>
                      <td className="p-4 text-sm text-blue-600">
                        {ticket.product_name || ticket.subject || 'N/A'}
                      </td>
                      <td className="p-4 text-sm text-gray-900">{formatTicketType(ticket.ticket_type)}</td>
                      <td className="p-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1) || 'N/A'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-900">{ticket.created_by?.slice(0, 8) || 'N/A'}</td>
                      <td className="p-4 text-sm text-gray-600">{formatDate(ticket.created_at)}</td>
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
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              {renderPaginationButtons()}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, total)} of {total} tickets
          </div>
        </>
      )
      }
    </div >
  );
};

export default CreateTicket;
