import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Bell, User, Edit2, Upload } from 'lucide-react';
import axios from 'axios';
import { useAuthStore } from '../../stores/useAuthStore';
import toast from 'react-hot-toast';

const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [submitting, setSubmitting] = useState(false);
  const [responses, setResponses] = useState([]);
  const [responsesLoading, setResponsesLoading] = useState(true);
  const { user } = useAuthStore()
  const [TicketCloseLoading, setTicketCloseLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [attachments, setAttachments] = useState([]);
  const [ticketStatus, setTicketStatus] = useState('')
  console.log("This is the ticketStatus: ", ticketStatus)

  const backUrl = import.meta.env.VITE_BACK_URL;
  const { token } = useAuthStore();

  const closeTicket = async () => {
    setTicketCloseLoading(true)
    try {
      await axios.put(`${backUrl}/tickets/${ticketId}/status`, {
        status: "completed"
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update the local state
      setTicketStatus("completed");
      toast.success('Ticket closed successfully!');
    } catch (error) {
      console.error('Error closing ticket:', error);
      toast.error('Failed to close ticket');
    } finally {
      setTicketCloseLoading(false)

    }
  };


  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`${backUrl}/tickets/${ticketId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTicket(response.data.tickets[0]);
        setTicketStatus(response.data.tickets[0].status)
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

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(`${backUrl}/tickets/${ticketId}/responses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setResponses(response.data);
        setResponsesLoading(false);
      } catch (error) {
        console.error('Error fetching responses:', error);
        setResponsesLoading(false);
      }
    };

    if (ticketId) {
      fetchResponses();
    }
  }, [ticketId, backUrl, token,]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleSubmitResponse = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);

      attachments.forEach((file) => {
        formDataToSend.append('attachments', file);
      });

      const response = await axios.post(
        `${backUrl}/tickets/${ticketId}/responses`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('Response submitted successfully:', response.data);

      // Refresh responses
      const responsesResponse = await axios.get(`${backUrl}/tickets/${ticketId}/responses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setResponses(responsesResponse.data);

      // Reset form
      setFormData({ title: '', description: '' });
      setAttachments([]);

      // Reset file input
      const fileInput = document.getElementById('file-upload');
      if (fileInput) fileInput.value = '';

      toast.success('Response submitted successfully!');
    } catch (error) {
      toast.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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

  const parseAttachments = (attachments) => {
    try {
      return JSON.parse(attachments);
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
            {/* <button */}
            {/*   onClick={() => setActiveTab('activity')} */}
            {/*   className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'activity' */}
            {/*     ? 'text-gray-900 border-b-2 border-gray-900' */}
            {/*     : 'text-gray-600 hover:text-gray-900' */}
            {/*     }`} */}
            {/* > */}
            {/*   Activity */}
            {/* </button> */}
            {/* <button */}
            {/*   onClick={() => setActiveTab('details')} */}
            {/*   className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'details' */}
            {/*     ? 'text-gray-900 border-b-2 border-gray-900' */}
            {/*     : 'text-gray-600 hover:text-gray-900' */}
            {/*     }`} */}
            {/* > */}
            {/*   Details */}
            {/* </button> */}
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
                  {user.role === 'sales' && ticketStatus !== 'completed' &&
                    < button onClick={closeTicket} className="flex items-center gap-2 px-3 py-2 text-sm text-white bg-red-500 border border-gray-300 rounded-lg hover:bg-rd-600">
                      {/* <Edit2 className="w-4 h-4" /> */}
                      {TicketCloseLoading ? <span>Loading</span> : <span>Close Ticket</span>}
                    </button>


                  }
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

              {/* Conversation History */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation History</h3>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  {responsesLoading ? (
                    <div className="text-center py-8 text-gray-600">Loading responses...</div>
                  ) : responses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No responses yet</div>
                  ) : (
                    <div className="space-y-6">
                      {responses.map((response, index) => {
                        const responseAttachments = parseAttachments(response.attachments);
                        return (
                          <div key={response.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                            <div className="flex items-start gap-4">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-gray-900">{response.responded_by}</span>
                                  <span className="text-xs text-gray-500">{formatDate(response.created_at)}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">{response.title}</h4>
                                <p className="text-sm text-gray-700 mb-3">{response.description}</p>

                                {responseAttachments.length > 0 && (
                                  <div className="space-y-2">
                                    <p className="text-xs font-medium text-gray-600">Attachments:</p>
                                    <div className="grid grid-cols-2 gap-3">
                                      {responseAttachments.map((attachment, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                                          <img
                                            src={attachment}
                                            alt={`Attachment ${idx + 1}`}
                                            className="w-full h-32 object-cover cursor-pointer hover:opacity-75 transition-opacity"
                                            onClick={() => window.open(attachment, '_blank')}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Response Form */}
              {ticketStatus !== 'completed' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Response</h3>
                  <form onSubmit={handleSubmitResponse} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="space-y-6">
                      {/* Title */}
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Enter response title"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      {/* Negotiation Notes */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                          Negotiation Notes
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Enter negotiation notes"
                          rows="5"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          required
                        />
                      </div>

                      {/* Upload Proof */}
                      <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-900 mb-2">
                          Upload Proof
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            id="file-upload"
                            multiple
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-600 cursor-pointer hover:bg-gray-50"
                          >
                            <span>{attachments.length > 0 ? `${attachments.length} file(s) selected` : 'Upload file'}</span>
                            <Upload className="w-5 h-5 text-gray-400" />
                          </label>
                        </div>
                        {attachments.length > 0 && (
                          <div className="mt-2 text-xs text-gray-600">
                            {attachments.map((file, index) => (
                              <div key={index}>{file.name}</div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submitting}
                          className={`px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors ${submitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                          {submitting ? 'Submitting...' : 'Submit Response'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

              )}
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
    </div >
  );
};

export default TicketDetails;
