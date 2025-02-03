import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { orderId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data.order);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-900 flex justify-center items-center">
        <div className="text-white">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="bg-black/40 border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/orders')}
                className="text-white hover:text-zinc-300"
              >
                ← Back to Orders
              </button>
              <h1 className="text-xl font-semibold text-white">
                Order Details
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-lg overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-zinc-400">Order ID</div>
                <div className="text-white font-medium mt-1">{order.orderId}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-400">Company</div>
                <div className="text-white font-medium mt-1">{order.companyName}</div>
              </div>
              <div>
                <div className="text-sm text-zinc-400">Order Date</div>
                <div className="text-white font-medium mt-1">
                  {new Date(order.emailDetails.receivedAt).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-zinc-400">Status</div>
                <div className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-white mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-zinc-400 text-sm border-b border-white/10">
                    <th className="text-left py-3 px-4">Item Name</th>
                    <th className="text-left py-3 px-4">Quantity</th>
                    <th className="text-left py-3 px-4">Price</th>
                    <th className="text-left py-3 px-4">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr 
                      key={index}
                      className="border-b border-white/10"
                    >
                      <td className="py-3 px-4 text-white">{item.name}</td>
                      <td className="py-3 px-4 text-zinc-400">{item.quantity}</td>
                      <td className="py-3 px-4 text-zinc-400">${item.price}</td>
                      <td className="py-3 px-4 text-zinc-400">${item.price * item.quantity}</td>
                    </tr>
                  ))}
                  <tr className="bg-white/5">
                    <td colSpan="3" className="py-3 px-4 text-right text-white font-medium">
                      Total Amount
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      ${order.total}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="p-6 border-t border-white/10">
            <h2 className="text-lg font-medium text-white mb-4">Order Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5"></div>
                <div>
                  <div className="text-white">Order Received</div>
                  <div className="text-sm text-zinc-400">
                    {new Date(order.emailDetails.receivedAt).toLocaleString()}
                  </div>
                </div>
              </div>
              {order.emailDetails.processedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5"></div>
                  <div>
                    <div className="text-white">Order Processed</div>
                    <div className="text-sm text-zinc-400">
                      {new Date(order.emailDetails.processedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
