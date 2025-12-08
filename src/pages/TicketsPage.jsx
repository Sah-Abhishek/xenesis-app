import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticketTypeFilter, setTicketTypeFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:3000/tickets');
        const data = await response.json();
        setTickets(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter(ticket => {
    const searchLower = searchTerm.toLowerCase();
    return (
      ticket.ticketId.toLowerCase().includes(searchLower) ||
      ticket.subjectProduct.toLowerCase().includes(searchLower) ||
      ticket.createdBy.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-600 mb-6">Tickets</div>

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Ticket</h1>

      {/* Ticket Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* New Product */}
        <div className=' bg-gray-100 p-5 rounded-2xl'>
          <h2 className="text-base font-semibold text-gray-900 mb-1">New Product</h2>
          <p className="text-sm text-gray-600 mb-3">
            Create a ticket for adding a completely new product to the system
          </p>
          <button
            onClick={() => navigate('/tickets/createticket/newproduct')}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-200">
            Create
          </button>
        </div>

        {/* Existing Product */}
        <div className=' bg-gray-100 p-5 rounded-2xl'>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Existing Product</h2>
          <p className="text-sm text-gray-600 mb-3">
            Create a ticket for updating an already existing product in the system
          </p>
          <button
            onClick={() => navigate('/tickets/createticket/existingproduct')}
            className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-200">
            Create
          </button>
        </div>

        {/* Bulk Order */}
        <div className=' bg-gray-100 p-5 rounded-2xl'>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Bulk Order</h2>
          <p className="text-sm text-gray-600 mb-3">
            Submit a ticket for a large quantity or special pricing request
          </p>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded hover:bg-gray-200">
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
        <button
          onClick={() => setTicketTypeFilter(!ticketTypeFilter)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          <X className="w-4 h-4" />
          Ticket Type
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={() => setStatusFilter(!statusFilter)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          <X className="w-4 h-4" />
          Status
          <ChevronDown className="w-4 h-4" />
        </button>
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
                {filteredTickets.map((ticket, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-4 text-sm text-gray-900">{ticket.ticketId}</td>
                    <td className="p-4 text-sm text-blue-600">{ticket.subjectProduct}</td>
                    <td className="p-4 text-sm text-gray-900">{ticket.ticketType}</td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {ticket.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-900">{ticket.createdBy}</td>
                    <td className="p-4 text-sm text-gray-600">{ticket.dateCreated}</td>
                    <td className="p-4">
                      <button className="text-sm text-blue-600 hover:underline">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <button className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-gray-900 text-white text-sm font-medium">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm font-medium text-gray-700">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 text-sm font-medium text-gray-700">
              3
            </button>
            <button className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateTicket;
