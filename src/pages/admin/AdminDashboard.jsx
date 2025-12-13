import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../stores/useAuthStore';
import { X } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: { sales: 0, purchase: 0, admin: 0 },
    tickets: { pending: 8, inProgress: 15, completed: 45 },
    inventory: { totalProducts: 450, lowStock: 15, categories: 8 },
    catalog: { totalProducts: 450 }
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'sales'
  });

  const backUrl = import.meta.env.VITE_BACK_URL;
  const { token } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backUrl}/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);

      // Calculate user statistics
      const userStats = response.data.reduce((acc, user) => {
        if (user.role === 'sales') acc.sales++;
        else if (user.role === 'purchase') acc.purchase++;
        else if (user.role === 'admin') acc.admin++;
        return acc;
      }, { sales: 0, purchase: 0, admin: 0 });

      setStats(prev => ({
        ...prev,
        totalUsers: userStats
      }));

      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddNewUser = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewUser({
      name: '',
      email: '',
      password: '',
      role: 'sales'
    });
  };

  const handleSubmitNewUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post(
        `${backUrl}/admin/add-user`,
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('User created successfully:', response.data);

      // Refresh users list
      await fetchUsers();

      // Close modal and reset form
      handleCloseModal();

      alert('User added successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert(error.response?.data?.message || 'Failed to add user. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'sales':
        return 'bg-blue-100 text-blue-700';
      case 'purchase':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Dashboard Header */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Summary Section */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Total Users</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Sales:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalUsers.sales}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Purchase:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalUsers.purchase}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Admin:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.totalUsers.admin}</span>
              </div>
            </div>
          </div>

          {/* Tickets Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tickets</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Pending:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.tickets.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">In Progress:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.tickets.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Completed:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.tickets.completed}</span>
              </div>
            </div>
          </div>

          {/* Inventory Overview Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Inventory Overview</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Products:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.inventory.totalProducts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Low Stock:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.inventory.lowStock}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Categories:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.inventory.categories}</span>
              </div>
            </div>
          </div>

          {/* Product Catalog Health Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Catalog Health</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Total Products:</span>
                <span className="text-sm font-semibold text-gray-900">{stats.catalog.totalProducts}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User & Role Management Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">User & Role Management</h2>

        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleAddNewUser}
              className="mt-6 px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add New User
            </button>
          </>
        )}
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">Add New User</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitNewUser} className="p-6">
              <div className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    placeholder="Enter user's name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    placeholder="Enter password"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    minLength={6}
                  />
                </div>

                {/* Role Field */}
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="sales">Sales</option>
                    <option value="purchase">Purchase</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition-colors ${submitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                >
                  {submitting ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
