// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AdminDashboard = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const getToken = () => localStorage.getItem('adminToken');

//   useEffect(() => {
//     const token = getToken();
//     if (!token) {
//       navigate('/admin/login');
//       return;
//     }

//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/admin/orders', {
//           headers: { 'x-admin-key': token }
//         });
//         setOrders(response.data);
//         setLoading(false);
//       } catch (err) {
//         if (err.response?.status === 403) {
//           localStorage.removeItem('adminToken');
//           navigate('/admin/login');
//         } else {
//           setError('Failed to fetch orders. Please try again.');
//           setLoading(false);
//         }
//       }
//     };

//     fetchOrders();
//   }, [navigate]);

//   const getStatusBadge = (status) => {
//     const colors = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
//       shipped: 'bg-purple-100 text-purple-800 border-purple-200',
//       delivered: 'bg-green-100 text-green-800 border-green-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('adminToken');
//     navigate('/admin/login');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-600 font-light tracking-widest animate-pulse">LOADING ORDERS...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
//           <div>
//             <h1 className="text-3xl font-thin tracking-widest text-gray-800">Orders</h1>
//             <p className="text-xs text-gray-400 tracking-widest">MANAGE ALL CUSTOMER ORDERS</p>
//           </div>
//           <div className="flex items-center gap-3 flex-wrap">
//             <span className="text-sm text-gray-500">{orders.length} orders</span>
//             {/* 🔥 NEW: Link to manage products */}
//             <Link
//               to="/admin/products"
//               className="text-xs text-gray-400 hover:text-black transition px-4 py-2 border border-gray-200 rounded-full"
//             >
//               Manage Products
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="text-xs text-gray-400 hover:text-red-500 transition px-4 py-2 border border-gray-200 rounded-full"
//             >
//               LOGOUT
//             </button>
//           </div>
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg mb-6 border border-red-200">
//             {error}
//           </div>
//         )}

//         {/* Orders Table */}
//         {orders.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
//             <p className="text-gray-500">No orders placed yet.</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="bg-gray-50 border-b border-gray-200">
//                   <tr>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Delivery</th>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                     <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {orders.map((order) => (
//                     <tr key={order._id} className="hover:bg-gray-50 transition">
//                       <td className="px-6 py-4 font-mono text-xs text-gray-600">
//                         {order._id.slice(-8)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="font-medium text-gray-800">{order.customer.name}</div>
//                         <div className="text-xs text-gray-400">{order.customer.phone}</div>
//                       </td>
//                       <td className="px-6 py-4 text-xs text-gray-500">
//                         {new Date(order.orderDate).toLocaleDateString('en-IN')}
//                       </td>
//                       <td className="px-6 py-4 font-semibold text-gray-900">
//                         ₹{order.totalAmount.toLocaleString()}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
//                           {order.paymentMethod || 'COD'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-xs text-gray-500">
//                         {order.estimatedDeliveryDate ? 
//                           new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
//                           : '—'}
//                       </td>
//                       <td className="px-6 py-4">
//                         <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBadge(order.status)}`}>
//                           {order.status.toUpperCase()}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4">
//                         <Link
//                           to={`/admin/order/${order._id}`}
//                           className="text-xs text-black hover:text-gray-600 transition underline underline-offset-2"
//                         >
//                           View Details
//                         </Link>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getToken = () => localStorage.getItem('adminToken');

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/orders', {
          headers: { 'x-admin-key': token }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          setError('Failed to fetch orders. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [navigate]);

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

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
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
        <title>Aether Admin – Manage Orders & Products</title>
        <meta name="description" content="Admin dashboard for Aether – manage customer orders, track deliveries, and update product inventory." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://youraetherstore.com/admin" />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8">
        {/* Marble texture overlay */}
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header – Royal Glassmorphism */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 glass-royal rounded-2xl p-6 border border-[#d4af37]/30 shadow-royal">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0]">
                Orders
              </h1>
              <p className="text-xs text-gray-400 tracking-widest font-light uppercase">Manage all customer orders</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-[#d4af37]/20">
                {orders.length} orders
              </span>
              <Link
                to="/admin/products"
                className="text-xs text-gray-300 hover:text-[#d4af37] transition px-4 py-2 border border-[#d4af37]/30 rounded-full hover:border-[#d4af37] hover:bg-[#d4af37]/10"
              >
                Manage Products
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-300 hover:text-red-400 transition px-4 py-2 border border-red-900/30 rounded-full hover:border-red-400 hover:bg-red-900/20"
              >
                LOGOUT
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Orders Table – Royal Card */}
          {orders.length === 0 ? (
            <div className="glass-royal rounded-2xl p-12 text-center border border-[#d4af37]/20 shadow-royal">
              <p className="text-gray-400 font-light">No orders placed yet.</p>
            </div>
          ) : (
            <div className="glass-royal rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-royal">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/40 border-b border-[#d4af37]/20">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Total</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Payment</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Est. Delivery</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4af37]/10">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-[#d4af37]/5 transition-colors duration-300">
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">
                          {order._id.slice(-8)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-200">{order.customer.name}</div>
                          <div className="text-xs text-gray-500">{order.customer.phone}</div>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {new Date(order.orderDate).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#d4af37]">
                          ₹{order.totalAmount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-800/50 text-gray-300 border border-gray-700">
                            {order.paymentMethod || 'COD'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-400">
                          {order.estimatedDeliveryDate ? 
                            new Date(order.estimatedDeliveryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) 
                            : '—'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBadge(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Link
                            to={`/admin/order/${order._id}`}
                            className="text-xs text-[#d4af37] hover:text-[#f5e6d0] transition underline underline-offset-2"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;