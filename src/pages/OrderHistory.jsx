import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CancelOrderModal from '../components/CancelOrderModal';

// 🔥 API Base URL – uses environment variable or falls back to local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const OrderHistory = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cancelling, setCancelling] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Aether – My Orders</title>
          <meta name="description" content="View your order history at Aether." />
        </Helmet>
        <div className="min-h-screen bg-[#050505] text-[#f5f0eb] flex items-center justify-center px-4 relative overflow-hidden font-sans">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

          <div className="glass-royal rounded-2xl p-8 md:p-12 border border-[#d4af37]/30 shadow-royal text-center max-w-md w-full relative z-10">
            <h2 className="font-serif text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0]">
              Please Login
            </h2>
            <p className="text-gray-400 text-sm mt-4 font-light">
              You need to be logged in to view your orders.
            </p>
            <Link
              to="/login"
              className="inline-block mt-6 px-8 py-3 rounded-full font-semibold text-sm tracking-widest transition bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]"
            >
              LOGIN NOW
            </Link>
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please login to view your orders.');
          setLoading(false);
          return;
        }

        // 🔥 Use dynamic API base URL
        const response = await axios.get(`${API_BASE_URL}/auth/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const handleCancelConfirm = async (reason) => {
    if (!selectedOrderId) return;

    setCancelling(selectedOrderId);
    setError('');
    setSuccess('');

    try {
      const payload = { email: user.email, reason };
      if (user.phone) payload.phone = user.phone;

      // 🔥 Use dynamic API base URL
      await axios.patch(`${API_BASE_URL}/orders/${selectedOrderId}/cancel`, payload);
      setSuccess('Order cancelled successfully!');
      setOrders(orders.map(order =>
        order._id === selectedOrderId
          ? { ...order, status: 'cancelled', cancellationReason: reason }
          : order
      ));
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel order.');
      setTimeout(() => setError(''), 4000);
    } finally {
      setCancelling(null);
      setShowModal(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-900/30 text-yellow-400 border-yellow-800',
      confirmed: 'bg-blue-900/30 text-blue-400 border-blue-800',
      shipped: 'bg-purple-900/30 text-purple-400 border-purple-800',
      delivered: 'bg-green-900/30 text-green-400 border-green-800',
      cancelled: 'bg-red-900/30 text-red-400 border-red-800'
    };
    return colors[status] || 'bg-gray-900/30 text-gray-400 border-gray-800';
  };

  const canCancel = (status) => {
    return ['pending', 'confirmed'].includes(status);
  };

  const getStatusStep = (status) => {
    const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
    const index = steps.indexOf(status);
    return index !== -1 ? index : 0;
  };

  const formatDeliveryDate = (dateStr) => {
    if (!dateStr) return 'Not available';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysLeft = (estimatedDate) => {
    if (!estimatedDate) return null;
    const now = new Date();
    const delivery = new Date(estimatedDate);
    const diff = Math.ceil((delivery - now) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Delivered';
    if (diff === 0) return 'Today';
    return `${diff} days left`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#d4af37] font-light tracking-widest animate-pulse">LOADING ORDERS...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Aether – My Orders</title>
        <meta name="description" content="View your order history at Aether." />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8 relative overflow-hidden font-sans">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0] text-center mb-8">
            My Orders
          </h1>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-4 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/20 border border-green-800 text-green-300 text-sm p-4 rounded-lg mb-4">
              {success}
            </div>
          )}

          {orders.length === 0 ? (
            <div className="glass-royal rounded-2xl p-12 text-center border border-[#d4af37]/20 shadow-royal">
              <p className="text-gray-400 font-light">No orders found.</p>
              <Link to="/" className="inline-block mt-4 text-[#d4af37] hover:text-[#f5e6d0] transition">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="glass-royal rounded-2xl p-6 border border-[#d4af37]/30 shadow-royal">
                  {/* Header */}
                  <div className="flex flex-wrap justify-between items-start gap-4 border-b border-[#d4af37]/20 pb-4">
                    <div>
                      <p className="text-xs text-gray-400">Order ID</p>
                      <p className="font-mono text-sm text-gray-300">{order._id}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total</p>
                      <p className="text-lg font-semibold text-[#d4af37]">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Status & Delivery */}
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBadge(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">Payment: {order.paymentMethod || 'COD'}</span>
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <span className="text-xs text-gray-300 bg-black/30 px-3 py-1 rounded-full border border-[#d4af37]/20">
                        Expected Delivery: {formatDeliveryDate(order.estimatedDeliveryDate)}
                        {order.estimatedDeliveryDate && (
                          <span className="ml-1 text-[#d4af37]">
                            ({getDaysLeft(order.estimatedDeliveryDate)})
                          </span>
                        )}
                      </span>
                    )}
                    {order.status === 'delivered' && (
                      <span className="text-xs text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-800">
                        Delivered on {formatDeliveryDate(order.estimatedDeliveryDate) || 'N/A'}
                      </span>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {order.status !== 'cancelled' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>Order Placed</span>
                        <span>Confirmed</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                      <div className="relative w-full h-2 bg-black/40 rounded-full mt-1">
                        <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] rounded-full transition-all duration-500"
                          style={{ width: `${(getStatusStep(order.status) / 3) * 100}%` }}
                        ></div>
                        {['pending', 'confirmed', 'shipped', 'delivered'].map((step, idx) => (
                          <div
                            key={step}
                            className={`absolute top-0 w-3 h-3 rounded-full -mt-0.5 transition-all duration-500 ${
                              getStatusStep(order.status) >= idx ? 'bg-[#d4af37]' : 'bg-gray-600'
                            }`}
                            style={{ left: `${(idx / 3) * 100}%`, transform: 'translateX(-50%)' }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Items */}
                  <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                    <p className="text-xs text-gray-400 mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-300">{item.name} × {item.quantity}</span>
                          <span className="text-gray-400">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                    <p className="text-xs text-gray-400 mb-1">Shipping Address</p>
                    <p className="text-sm text-gray-300">
                      {order.customer.name}, {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">📞 {order.customer.phone} · ✉️ {order.customer.email}</p>
                  </div>

                  {/* Cancellation Reason */}
                  {order.status === 'cancelled' && order.cancellationReason && (
                    <div className="mt-4 pt-4 border-t border-red-900/50">
                      <p className="text-xs text-gray-400">Cancellation Reason</p>
                      <p className="text-sm text-red-300">{order.cancellationReason}</p>
                    </div>
                  )}

                  {/* Cancel Button */}
                  {canCancel(order.status) && (
                    <div className="mt-4 pt-4 border-t border-[#d4af37]/20">
                      <button
                        onClick={() => handleCancelClick(order._id)}
                        disabled={cancelling === order._id}
                        className={`text-xs px-4 py-2 border rounded-full transition ${
                          cancelling === order._id
                            ? 'text-gray-400 border-gray-600 cursor-not-allowed'
                            : 'text-red-400 border-red-800 hover:bg-red-900/30 hover:text-red-300 hover:border-red-600'
                        }`}
                      >
                        {cancelling === order._id ? 'CANCELLING...' : 'CANCEL ORDER'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cancel Modal */}
      <CancelOrderModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleCancelConfirm}
        loading={!!cancelling}
      />
    </>
  );
};

export default OrderHistory;