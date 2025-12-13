import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../stores/useAuthStore';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TicketsPageAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all',
    dateRange: 'all'
  });

  const backUrl = import.meta.env.VITE_BACK_URL;
  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await axios.get(`${backUrl}/tickets/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setTickets(response.data.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const formatTicketType = (type) => {
    if (!type) return 'N/A';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'open':
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'closed':
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'in_progress':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTicketClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filters.status !== 'all' && ticket.status !== filters.status) return false;
    if (filters.type !== 'all' && ticket.ticket_type !== filters.type) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Tickets Overview</h1>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-8">
        {/* Status Filter */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Status
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Type
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="relative">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Date Range
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
          <p className="text-gray-600">Loading tickets...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Ticket Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Sales User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Purchase User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No tickets found
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleTicketClick(ticket.id)}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-blue-600">
                          #{ticket.id.slice(0, 6)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {ticket.product_name || ticket.subject || ticket.product_id || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-600">
                          {formatTicketType(ticket.ticket_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(ticket.status)}`}>
                          {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-blue-600">
                          {ticket.created_by || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {ticket.assigned_to || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {formatDate(ticket.created_at)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsPageAdmin;
