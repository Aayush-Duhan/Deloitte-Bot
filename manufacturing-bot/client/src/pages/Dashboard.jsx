import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasMore: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
      fetchOrders();
      fetchNotifications();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
      // Filter pending orders for notifications
      setPendingOrders(response.data.orders.filter(order => order.status === 'pending'));
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/notifications?page=${page}&limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(response.data.notifications);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.pages,
        hasMore: response.data.pagination.hasMore
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderAction = async (orderId, action) => {
    const toastId = toast.loading(
      action === 'confirm' 
        ? 'Processing order confirmation...' 
        : 'Processing order rejection...'
    );
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/orders/${orderId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove the notification from the list
      setNotifications(prev => prev.filter(n => n.relatedOrder?._id !== orderId));
      
      // Show success toast with different styles based on action
      if (action === 'confirm') {
        toast.success('Order Confirmed', { 
          id: toastId,
          className: '!bg-zinc-800 !text-white !border !border-green-500 !shadow-lg !shadow-green-500/20'
        });
      } else {
        toast.success('Order Rejected', { 
          id: toastId,
          className: '!bg-zinc-800 !text-white !border !border-red-500 !shadow-lg !shadow-red-500/20'
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order. Please try again.', { id: toastId });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchNotifications(newPage);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-500/50',
      'processing': 'bg-blue-500/50',
      'completed': 'bg-green-500/50',
      'rejected': 'bg-red-500/50',
      'confirmed': 'bg-purple-500/50'
    };
    return colors[status] || 'bg-gray-500/50';
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#ffffff',
            },
          },
          error: {
            duration: 3000,
            className: '!bg-zinc-800 !text-white !border !border-red-500 !shadow-lg !shadow-red-500/20',
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
          loading: {
            duration: Infinity,
            className: '!bg-zinc-800 !text-white !border !border-purple-500 !shadow-lg !shadow-purple-500/20',
          },
          style: {
            maxWidth: '400px',
            padding: '16px 24px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '500',
          },
        }}
      />
      
      {/* Header */}
      <header className="bg-black/40 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-white">
                Order Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-sm text-zinc-400">
                  <span className="mr-2">{user.companyName}</span>
                  <span>({user.email})</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-purple-500/80 hover:bg-purple-400/80 transition-all duration-300 ease-in-out backdrop-blur-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Recent Notifications */}
            <section className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Pending Confirmation Requests</h2>
              </div>
              <div className="space-y-3">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white text-sm">{notification.message}</p>
                          <p className="text-zinc-500 text-xs mt-1">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                        {notification.type === 'confirmation_required' && notification.relatedOrder && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleOrderAction(notification.relatedOrder._id, 'confirm')}
                              className="px-3 py-1 rounded-md text-xs font-medium text-white bg-green-500/50 hover:bg-green-400/50 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleOrderAction(notification.relatedOrder._id, 'reject')}
                              className="px-3 py-1 rounded-md text-xs font-medium text-white bg-red-500/50 hover:bg-red-400/50 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {notification.relatedOrder && (
                          <button
                            onClick={() => navigate(`/order/${notification.relatedOrder._id}`)}
                            className="px-3 py-1 rounded-md text-xs font-medium text-white bg-blue-500/50 hover:bg-blue-400/50 transition-colors"
                          >
                            View Order
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-400">No pending confirmation requests</p>
                )}
              </div>
              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-4">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 rounded-md text-xs font-medium text-white bg-purple-500/50 hover:bg-purple-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-zinc-400">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasMore}
                    className="px-3 py-1 rounded-md text-xs font-medium text-white bg-purple-500/50 hover:bg-purple-400/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>

            {/* Orders List */}
            <section className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  See All →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-zinc-400 text-sm border-b border-white/10">
                      <th className="text-left py-3 px-4">Order ID</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Items</th>
                      <th className="text-left py-3 px-4">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <tr 
                          key={order._id}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3 px-4 text-white">{order.orderId}</td>
                          <td className="py-3 px-4 text-zinc-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">{order.items.length} items</td>
                          <td className="py-3 px-4 text-zinc-400">${order.total}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8 text-zinc-400">
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;