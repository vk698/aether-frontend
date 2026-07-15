import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminOrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  const getToken = () => localStorage.getItem('adminToken');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/orders/${id}`, {
          headers: { 'x-admin-key': token }
        });
        setOrder(response.data);
        if (response.data.estimatedDeliveryDate) {
          setDeliveryDate(response.data.estimatedDeliveryDate.split('T')[0]);
        }
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) {
          navigate('/admin');
        } else {
          setError('Failed to fetch order details.');
          setLoading(false);
        }
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const updateStatus = async (newStatus) => {
    const token = getToken();
    if (!token) return;
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${id}/status`,
        { status: newStatus },
        { headers: { 'x-admin-key': token } }
      );
      setOrder({ ...order, status: newStatus });
      setSuccess(`Status updated to ${newStatus.toUpperCase()}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update status. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const updateDeliveryDate = async () => {
    if (!deliveryDate) {
      setError('Please select a delivery date.');
      return;
    }
    const token = getToken();
    if (!token) return;
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await axios.patch(
        `http://localhost:5000/api/admin/orders/${id}/delivery-date`,
        { estimatedDeliveryDate: deliveryDate },
        { headers: { 'x-admin-key': token } }
      );
      setOrder({ ...order, estimatedDeliveryDate: new Date(deliveryDate) });
      setSuccess('Delivery date updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update delivery date. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/orders/${id}`, {
        headers: { 'x-admin-key': token }
      });
      navigate('/admin');
    } catch (err) {
      setError('Failed to delete order.');
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

  const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#d4af37] font-light tracking-widest animate-pulse">LOADING ORDER...</div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <>
      <Helmet>
        <title>Aether Admin – Order Details</title>
        <meta name="description" content="View and manage order details for Aether." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Pure Black Background with Marble & Gold Glows */}
      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/30 shadow-royal mb-6 flex flex-wrap justify-between items-center gap-4">
            <div>
              <Link to="/admin" className="text-sm text-gray-400 hover:text-[#d4af37] transition">
                ← Back to Orders
              </Link>
              <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0] mt-1">
                Order Details
              </h1>
            </div>
            <button
              onClick={deleteOrder}
              className="text-xs text-red-400 hover:text-red-300 transition px-4 py-2 border border-red-900/30 rounded-full hover:border-red-400 hover:bg-red-900/20"
            >
              DELETE ORDER
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-900/20 border border-green-800 text-green-300 text-sm p-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {/* Cancellation Reason */}
          {order.status === 'cancelled' && order.cancellationReason && (
            <div className="glass-royal border border-red-800/50 rounded-2xl p-4 md:p-6 mb-6">
              <div className="flex items-start gap-3">
                <span className="text-lg">📌</span>
                <div>
                  <h3 className="text-sm font-medium text-red-300 tracking-wider">Cancellation Reason</h3>
                  <p className="text-sm text-red-200 mt-1">{order.cancellationReason}</p>
                  <p className="text-xs text-red-400/70 mt-2">This order was cancelled by the customer.</p>
                </div>
              </div>
            </div>
          )}

          {/* Customer Details */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/20 shadow-royal mb-6">
            <h2 className="text-sm font-medium text-gray-300 tracking-wider mb-4 border-b border-[#d4af37]/20 pb-2">Customer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-400">Name</p>
                <p className="text-sm font-medium text-gray-200">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-200">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Phone</p>
                <p className="text-sm font-medium text-gray-200">{order.customer.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Payment Method</p>
                <p className="text-sm font-medium text-gray-200 capitalize">{order.paymentMethod || 'COD'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-gray-400">Shipping Address</p>
                <p className="text-sm font-medium text-gray-200">
                  {order.customer.address}, {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                </p>
              </div>
            </div>
          </div>

          {/* Estimated Delivery Date – Editable */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/20 shadow-royal mb-6">
            <h2 className="text-sm font-medium text-gray-300 tracking-wider mb-4 border-b border-[#d4af37]/20 pb-2">📅 Delivery Date</h2>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-400 mb-1">Select Delivery Date</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                />
              </div>
              <button
                onClick={updateDeliveryDate}
                disabled={updating}
                className={`px-6 py-2 rounded-full font-semibold text-sm tracking-widest transition ${
                  updating
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]'
                }`}
              >
                {updating ? 'UPDATING...' : 'UPDATE DATE'}
              </button>
            </div>
            {order.estimatedDeliveryDate && (
              <p className="text-xs text-gray-400 mt-2">
                Current: {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>

          {/* Order Items */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/20 shadow-royal mb-6">
            <h2 className="text-sm font-medium text-gray-300 tracking-wider mb-4 border-b border-[#d4af37]/20 pb-2">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 border-b border-[#d4af37]/10 pb-3 last:border-0">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded-lg border border-[#d4af37]/20"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-200">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#d4af37]">₹{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-[#d4af37]/20 mt-4 pt-4 flex justify-between text-lg font-semibold">
              <span className="text-gray-300">Total</span>
              <span className="text-[#d4af37]">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Status Update */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/20 shadow-royal">
            <h2 className="text-sm font-medium text-gray-300 tracking-wider mb-4 border-b border-[#d4af37]/20 pb-2">Update Status</h2>
            <div className="flex flex-wrap gap-3">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updating || order.status === status}
                  className={`px-4 py-2 text-xs rounded-full border font-medium transition ${
                    order.status === status
                      ? `${getStatusBadge(status)} cursor-default`
                      : 'bg-black/40 border-[#d4af37]/30 text-gray-300 hover:border-[#d4af37] hover:bg-[#d4af37]/10'
                  }`}
                >
                  {order.status === status ? '✓ ' : ''}
                  {status.toUpperCase()}
                </button>
              ))}
            </div>
            {updating && <p className="text-xs text-gray-400 mt-3">Updating status...</p>}
            <div className="mt-4 p-3 bg-black/40 rounded-lg border border-[#d4af37]/20">
              <p className="text-xs text-gray-400">
                Current Status:{' '}
                <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${getStatusBadge(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrderDetail;