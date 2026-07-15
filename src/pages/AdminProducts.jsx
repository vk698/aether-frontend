import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
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

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/products', {
          headers: { 'x-admin-key': token }
        });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 403) {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        } else {
          setError('Failed to fetch products.');
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    const token = getToken();
    if (!token) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
        headers: { 'x-admin-key': token }
      });
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      setError('Failed to delete product.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#d4af37] font-light tracking-widest animate-pulse">LOADING PRODUCTS...</div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Aether Admin – Manage Products</title>
        <meta name="description" content="Manage your saree collection – add, edit, or remove products from the Aether store." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8 relative overflow-hidden font-sans">
        {/* Marble Texture & Gold Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/30 shadow-royal mb-6 flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0]">
                Products
              </h1>
              <p className="text-xs text-gray-400 tracking-widest font-light uppercase">Manage your saree collection</p>
            </div>
            <Link
              to="/admin/products/new"
              className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm tracking-widest transition bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]"
            >
              <PlusCircle size={16} />
              ADD PRODUCT
            </Link>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {products.length === 0 ? (
            <div className="glass-royal rounded-2xl p-12 text-center border border-[#d4af37]/20 shadow-royal">
              <p className="text-gray-400 font-light">No products added yet.</p>
              <Link to="/admin/products/new" className="inline-block mt-4 text-[#d4af37] hover:text-[#f5e6d0] transition">
                Add your first product
              </Link>
            </div>
          ) : (
            <div className="glass-royal rounded-2xl overflow-hidden border border-[#d4af37]/20 shadow-royal">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black/40 border-b border-[#d4af37]/20">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Fabric</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                      <th className="text-left px-6 py-4 text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4af37]/10">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-[#d4af37]/5 transition-colors duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/40'}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded-lg border border-[#d4af37]/20"
                            />
                            <span className="font-medium text-gray-200 truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-[#d4af37]">₹{product.price.toLocaleString()}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{product.fabric}</td>
                        <td className="px-6 py-4 text-xs text-gray-400">{product.stock}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/products/edit/${product._id}`}
                              className="text-gray-400 hover:text-[#d4af37] transition"
                            >
                              <Pencil size={18} />
                            </Link>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-gray-400 hover:text-red-400 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
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

export default AdminProducts;