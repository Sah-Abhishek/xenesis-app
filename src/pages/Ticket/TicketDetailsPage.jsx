import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Edit2 } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../stores/useAuthStore';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const backUrl = import.meta.env.VITE_BACK_URL;
  const { token } = useAuthStore();

  useEffect(() => {
    // console.log("This is the url: ", `${backUrl}/tickets/${ticketId}`,)
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`${backUrl}/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // console.log("This is the response: ", response)
        setTicket(response.data.tickets[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
        setLoading(false);
      }
    };

    if (ticketId) {
      fetchTicketDetails();
    }
  }, [ticketId, backUrl, token]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTicketType = (type) => {
    if (!type) return 'N/A';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'text-yellow-700';
      case 'approved':
        return 'text-green-700';
      case 'rejected':
        return 'text-red-700';
      case 'closed':
        return 'text-gray-700';
      default:
        return 'text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'bg-green-100 text-green-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'high':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const parseSupportingDocs = (docs) => {
    try {
      return JSON.parse(docs);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading ticket details...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Ticket not found</div>
      </div>
    );
  }

  const supportingDocs = parseSupportingDocs(ticket.supporting_docs);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-black rounded-full"></div>
            <span className="font-semibold text-gray-900">Sales CRM</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <div className="relative"> */}
          {/*   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> */}
          {/*   <input */}
          {/*     type="text" */}
          {/*     placeholder="Search" */}
          {/*     className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" */}
          {/*   /> */}
          {/* </div> */}
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6">
          <span
            onClick={() => navigate('/ticketspage')}
            className="cursor-pointer hover:text-blue-600 hover:underline"
          >
            Tickets
          </span>
          {/* <span className="mx-2">/</span> */}
          {/* <span */}
          {/*   onClick={() => navigate('/ticketspage')} */}
          {/*   className="cursor-pointer hover:text-blue-600" */}
          {/* > */}
          {/*   Recent Tickets */}
          {/* </span> */}
          <span className="mx-2">/</span>
          <span>Ticket #{ticket.id.slice(0, 5)}</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ticket Details: #{ticket.id.slice(0, 5)}
        </h1>
        <p className="text-sm text-gray-600 mb-8">
          Created by {ticket.created_by?.slice(0, 8)} on {formatDate(ticket.created_at)}
        </p>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'overview'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'activity'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'details'
                ? 'text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Details
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status Card */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className={`text-lg font-semibold mb-1 ${getStatusColor(ticket.status)}`}>
                      {ticket.status?.charAt(0).toUpperCase() + ticket.status?.slice(1)}
                    </h2>
                    <p className="text-sm text-gray-600">{formatTicketType(ticket.ticket_type)}</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Edit2 className="w-4 h-4" />
                    Edit Ticket
                  </button>
                </div>
              </div>

              {/* Ticket Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Information</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Subject / Product Name</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.product_name || ticket.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Product Category</p>
                      <p className="text-sm font-medium text-gray-900">N/A</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Quantity</p>
                      <p className="text-sm font-medium text-gray-900">N/A</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expected Price</p>
                      <p className="text-sm font-medium text-gray-900">${ticket.expected_new_price}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600 mb-1">Reason / Notes</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.description || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expected Price Range</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${ticket.expected_new_price} - ${ticket.total_expected_price}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Supplier Suggestions</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.preferred_supplier || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Product Description</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.description || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Packaging/Unit details</p>
                      <p className="text-sm font-medium text-gray-900">N/A</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Competitor Reference</p>
                      <p className="text-sm font-medium text-gray-900">N/A</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Metadata</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Created By</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.created_by?.slice(0, 12)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Date & Time Created</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(ticket.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                      <p className="text-sm font-medium text-gray-900">{formatDate(ticket.updated_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Assigned Team / Agent</p>
                      <p className="text-sm font-medium text-gray-900">{ticket.assigned_to || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Priority</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority?.charAt(0).toUpperCase() + ticket.priority?.slice(1) || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Supporting Documents */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Supporting Documents</h3>
                {supportingDocs.length > 0 ? (
                  <div className="space-y-3">
                    {supportingDocs.map((doc, index) => (
                      <div key={index} className="bg-white rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={doc}
                          alt={`Supporting document ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-sm text-gray-500">No documents uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">Activity log will be displayed here</p>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600">Additional details will be displayed here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetails;
