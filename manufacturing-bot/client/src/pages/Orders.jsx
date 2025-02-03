import React, { useState, useEffect, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';

const API_URL = 'http://localhost:5000/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [page, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/', { replace: true });
        return;
      }

      const response = await axios.get(
        `${API_URL}/orders?page=${page}&limit=10${searchTerm ? `&search=${searchTerm}` : ''}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination?.pages) {
      setPage(newPage);
      window.scrollTo(0, 0);
    }
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

  return (
    <Layout>
      <div className="min-h-screen bg-zinc-900">
        {/* Header */}
        <header className="bg-black/40 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-white hover:text-zinc-300"
                >
                  ← Back to Dashboard
                </button>
                <h1 className="text-xl font-semibold text-white">
                  All Orders
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1); // Reset to first page on search
                    }}
                    className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-64"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setPage(1);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-6">
          <div className="bg-black/40 backdrop-blur-md rounded-lg shadow">
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-zinc-400">
                <thead className="text-xs uppercase bg-black/40 text-zinc-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">Order ID</th>
                    <th scope="col" className="px-6 py-3">Company</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">No. of Items</th>
                    <th scope="col" className="px-6 py-3">Total</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr 
                      key={order._id}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4 text-white">{order.orderId}</td>
                      <td className="py-3 px-4 text-zinc-400">{order.companyName}</td>
                      <td className="py-3 px-4 text-zinc-400">
                        {new Date(order.emailDetails.receivedAt).toLocaleDateString()}
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
                      <td className="py-3 px-4 text-zinc-400">
                        {order.items.length} items
                      </td>
                      <td className="py-3 px-4 text-zinc-400">${order.total}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => navigate(`/order/${order._id}`)}
                          className="px-3 py-1 rounded-md text-xs font-medium text-white bg-blue-500/50 hover:bg-blue-400/50 transition-colors"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls - Fixed spacing and alignment */}
            {pagination && (
              <div className="flex items-center justify-between px-6 py-4 bg-black/20 border-t border-white/5">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm rounded-md text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    First
                  </button>
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 text-sm rounded-md text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ←
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) <= 1 || p === 1 || p === pagination.pages)
                    .map((p, i, arr) => (
                      <Fragment key={p}>
                        {i > 0 && arr[i - 1] !== p - 1 && (
                          <span className="text-zinc-600">...</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            p === page
                              ? 'bg-purple-500/50 text-white'
                              : 'text-zinc-400 hover:text-white'
                          }`}
                        >
                          {p}
                        </button>
                      </Fragment>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.pages}
                    className="px-3 py-1 text-sm rounded-md text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    →
                  </button>
                  <button
                    onClick={() => setPage(pagination.pages)}
                    disabled={page === pagination.pages}
                    className="px-3 py-1 text-sm rounded-md text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Last
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-8 text-zinc-400">
            No orders found
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
