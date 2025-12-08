import React, { useState, useEffect } from 'react';
import { Search, Bell, User } from 'lucide-react';
import axios from 'axios';

const SalesDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const backUrl = import.meta.env.VITE_BACK_URL;

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await axios.get(`${backUrl}/api/sales-dashboard`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-end gap-4">
          <div className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg">
            <Search className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent border-none outline-none text-sm text-gray-600 w-40"
            />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sales Dashboard</h1>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">
            Date Range
          </button>
          <button className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">
            Salesperson
          </button>
          <button className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50">
            Regions
          </button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Sales</h3>
            <p className="text-2xl font-bold text-gray-900">
              {data.metrics.totalSalesFormatted}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">New Leads</h3>
            <p className="text-2xl font-bold text-gray-900">{data.metrics.newLeads}</p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">
              {data.metrics.conversionRateFormatted}
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Revenue Trend</h3>
            <p className="text-2xl font-bold text-gray-900">
              {data.metrics.monthlyRevenueTrendFormatted}
            </p>
          </div>
        </div>

        {/* Recent Deals Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 p-6 border-b border-gray-200">
            Recent Deals
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Client Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Deal Value</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Stage</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Owner</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-600">Last Updated</th>
                </tr>
              </thead>
              <tbody>
                {data.recentDeals.map((deal, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="p-4 text-sm text-gray-900">{deal.clientName}</td>
                    <td className="p-4 text-sm text-blue-600 font-medium">
                      {deal.dealValueFormatted}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-blue-600">{deal.owner}</td>
                    <td className="p-4">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                        {deal.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{deal.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesDashboard;
