import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { RiDashboardLine, RiFileListLine, RiUserLine, RiLogoutBoxLine, RiMenuFoldLine, RiMenuUnfoldLine } from 'react-icons/ri';
import Layout from '../components/Layout';

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
  const [currentSection, setCurrentSection] = useState('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      const response = await axios.get(`${API_URL}/orders`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setOrders(response.data.orders);
      setPendingOrders(response.data.orders.filter(order => order.status === 'pending'));
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async (page = 1) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      const response = await axios.get(`${API_URL}/notifications?page=${page}&limit=5`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setNotifications(response.data.notifications);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.pages,
        hasMore: response.data.pagination.hasMore
      });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/', { replace: true });
      }
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
      'pending': 'bg-yellow-500/20 border-yellow-500/50',
      'processing': 'bg-blue-500/20 border-blue-500/50',
      'completed': 'bg-green-500/20 border-green-500/50',
      'rejected': 'bg-red-500/20 border-red-500/50',
      'confirmed': 'bg-green-500/20 border-green-500/50'
    };
    return colors[status] || 'bg-gray-500/20 border-gray-500/50';
  };

  const renderContent = () => {
    switch(currentSection) {
      case 'overview':
        return (
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
                            <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-sm border ${getStatusColor(order.status)} ${
                              order.status === 'confirmed' || order.status === 'completed' ? 'text-green-300' :
                              order.status === 'pending' ? 'text-yellow-300' :
                              order.status === 'processing' ? 'text-blue-300' :
                              'text-red-300'
                            }`}>
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
        );
      case 'orders':
        return (
          <section className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">All Orders</h2>
            {/* Full orders table */}
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
                          <span className={`px-3 py-1 rounded-full text-xs backdrop-blur-sm border ${getStatusColor(order.status)} ${
                            order.status === 'confirmed' || order.status === 'completed' ? 'text-green-300' :
                            order.status === 'pending' ? 'text-yellow-300' :
                            order.status === 'processing' ? 'text-blue-300' :
                            'text-red-300'
                          }`}>
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
        );
      case 'profile':
        return (
          <section className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
            {user && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-zinc-400">Company Name:</div>
                  <div className="text-white">{user.companyName}</div>
                  <div className="text-zinc-400">Email:</div>
                  <div className="text-white">{user.email}</div>
                </div>
              </div>
            )}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <Layout user={user}>
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
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-white">Overview</h1>
            {user && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-500/30 flex items-center justify-center text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm text-zinc-400">
                  {user.name || user.companyName}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          renderContent()
        )}
      </main>
    </Layout>
  );
};

export default Dashboard;