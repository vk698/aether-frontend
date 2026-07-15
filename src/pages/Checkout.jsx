import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: ''
  });

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Aether – Checkout</title>
          <meta name="description" content="Complete your order at Aether." />
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
              You need to be logged in to place an order.
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

  // Check if cart is empty
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <>
        <Helmet>
          <title>Aether – Checkout</title>
          <meta name="description" content="Complete your order at Aether." />
        </Helmet>
        <div className="min-h-screen bg-[#050505] text-[#f5f0eb] flex items-center justify-center px-4 relative overflow-hidden font-sans">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

          <div className="glass-royal rounded-2xl p-8 md:p-12 border border-[#d4af37]/30 shadow-royal text-center max-w-md w-full relative z-10">
            <h2 className="font-serif text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0]">
              Your Cart is Empty
            </h2>
            <p className="text-gray-400 text-sm mt-4 font-light">
              Add some beautiful sarees to your cart first.
            </p>
            <Link
              to="/"
              className="inline-block mt-6 px-8 py-3 rounded-full font-semibold text-sm tracking-widest transition bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    for (let key in formData) {
      if (!formData[key].trim()) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }
    }

    try {
      const orderPayload = {
        customer: formData,
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images && item.images.length > 0 ? item.images[0] : ''
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: 'cod'
      };

      const token = localStorage.getItem('authToken');
      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const response = await axios.post('http://localhost:5000/api/orders', orderPayload, config);
      setOrderId(response.data.order._id);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.error || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Confirmation Screen
  if (orderPlaced) {
    return (
      <>
        <Helmet>
          <title>Aether – Order Confirmed</title>
          <meta name="description" content="Your Aether order has been confirmed." />
        </Helmet>
        <div className="min-h-screen bg-[#050505] text-[#f5f0eb] flex items-center justify-center px-4 relative overflow-hidden font-sans">
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

          <div className="glass-royal rounded-2xl p-8 md:p-12 border border-[#d4af37]/30 shadow-royal text-center max-w-md w-full relative z-10">
            <div className="text-6xl mb-6">✅</div>
            <h2 className="font-serif text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0]">
              Order Placed!
            </h2>
            <p className="text-gray-300 text-sm mt-2">Thank you for shopping with Aether.</p>
            <p className="text-gray-400 text-xs mt-1">Order ID: {orderId}</p>
            <p className="text-gray-300 text-sm mt-4">You will pay <strong className="text-[#d4af37]">Cash on Delivery</strong>.</p>
            <p className="text-gray-300 text-sm">We will confirm your order shortly.</p>
            <Link
              to="/"
              className="inline-block mt-6 px-8 py-3 rounded-full font-semibold text-sm tracking-widest transition bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Aether – Checkout</title>
        <meta name="description" content="Complete your order at Aether." />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8 relative overflow-hidden font-sans">
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0] text-center mb-8">
            Checkout
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="glass-royal rounded-2xl p-6 border border-[#d4af37]/30 shadow-royal order-2 md:order-1">
              <h3 className="font-serif text-xl font-semibold text-gray-200 mb-4 border-b border-[#d4af37]/20 pb-2">Order Summary</h3>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 border-b border-[#d4af37]/10 pb-3">
                    <img
                      src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg border border-[#d4af37]/20"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-200 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-[#d4af37]">₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#d4af37]/20 mt-4 pt-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-200">Total</span>
                  <span className="text-[#d4af37]">₹{getTotalPrice().toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 text-xs text-gray-400">
                <span className="bg-[#d4af37]/20 text-[#d4af37] px-3 py-1 rounded-full border border-[#d4af37]/30">Cash on Delivery</span>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="glass-royal rounded-2xl p-6 border border-[#d4af37]/30 shadow-royal order-1 md:order-2">
              <h3 className="font-serif text-xl font-semibold text-gray-200 mb-4 border-b border-[#d4af37]/20 pb-2">Shipping Details</h3>

              {error && (
                <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                      placeholder="Street, building, landmark"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                        placeholder="City"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                      placeholder="110001"
                      required
                    />
                  </div>

                  <div className="bg-black/40 p-3 rounded-lg border border-[#d4af37]/20">
                    <p className="text-xs text-gray-300">💵 Payment Method: <span className="font-medium text-[#d4af37]">Cash on Delivery</span></p>
                    <p className="text-xs text-gray-400 mt-1">You will pay when your order arrives.</p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-full font-semibold text-sm tracking-widest transition ${
                      loading
                        ? 'bg-gray-600 cursor-not-allowed opacity-50'
                        : 'bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]'
                    }`}
                  >
                    {loading ? 'PLACING ORDER...' : 'PLACE ORDER (COD)'}
                  </button>

                  <Link
                    to="/cart"
                    className="block text-center text-xs text-gray-400 hover:text-[#d4af37] transition"
                  >
                    ← Back to Cart
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;