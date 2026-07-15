import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Cloudinary Config
const CLOUD_NAME = 'i7kx6ig5';
const UPLOAD_PRESET = 'saree_uploads';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    fabric: '',
    occasion: '',
    colors: '',
    stock: '',
    model3d: ''
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getToken = () => localStorage.getItem('adminToken');

  // Load Cloudinary script
  useEffect(() => {
    if (window.cloudinary) return;
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Fetch product when editing
  useEffect(() => {
    if (!isEdit) return;
    const fetchProduct = async () => {
      const token = getToken();
      if (!token) {
        navigate('/admin/login');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/products/${id}`, {
          headers: { 'x-admin-key': token }
        });
        const p = response.data;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          price: p.price || '',
          fabric: p.fabric || '',
          occasion: p.occasion || '',
          colors: (p.colors || []).join(', '),
          stock: p.stock || '',
          model3d: p.model3d || ''
        });
        setImageUrls(p.images || []);
      } catch (err) {
        setError('Failed to load product.');
      }
    };
    fetchProduct();
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Cloudinary upload
  const openUploadWidget = () => {
    if (!window.cloudinary) {
      setError('Cloudinary widget not loaded. Please wait.');
      return;
    }
    setUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUD_NAME,
        uploadPreset: UPLOAD_PRESET,
        multiple: true,
        maxFiles: 5,
        folder: 'saree_products',
        resourceType: 'image',
        clientAllowedFormats: ['jpeg', 'png', 'webp', 'gif', 'jpg']
      },
      (error, result) => {
        setUploading(false);
        if (error) {
          console.error('Upload error:', error);
          setError('Failed to upload image.');
          return;
        }
        if (result.event === 'success') {
          const uploadedUrl = result.info.secure_url;
          setImageUrls(prev => [...prev, uploadedUrl]);
          setSuccess('Image uploaded successfully!');
          setTimeout(() => setSuccess(''), 3000);
        }
      }
    );
    widget.open();
  };

  const removeImage = (index) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllImages = () => {
    setImageUrls([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = getToken();
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock) || 0,
      colors: formData.colors.split(',').map(s => s.trim()).filter(Boolean),
      images: imageUrls
    };

    try {
      let response;
      if (isEdit) {
        response = await axios.put(`http://localhost:5000/api/admin/products/${id}`, payload, {
          headers: { 'x-admin-key': token }
        });
      } else {
        response = await axios.post('http://localhost:5000/api/admin/products', payload, {
          headers: { 'x-admin-key': token }
        });
      }
      setSuccess(response.data.message);
      setTimeout(() => {
        if (!isEdit) {
          setFormData({
            name: '',
            description: '',
            price: '',
            fabric: '',
            occasion: '',
            colors: '',
            stock: '',
            model3d: ''
          });
          setImageUrls([]);
        }
        navigate('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.error || 'Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Aether Admin – Manage Products</title>
        <meta name="description" content="Add or edit products in the Aether admin panel." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Pure Black Background with Marble & Gold Glows */}
      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Header */}
          <div className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/30 shadow-royal mb-6 flex flex-wrap items-center gap-4">
            <Link to="/admin/products" className="text-sm text-gray-400 hover:text-[#d4af37] transition">
              ← Back
            </Link>
            <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0]">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
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

          {/* Form – Glass Card */}
          <form onSubmit={handleSubmit} className="glass-royal rounded-2xl p-4 md:p-6 border border-[#d4af37]/20 shadow-royal space-y-5">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
              />
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Fabric & Occasion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Fabric *</label>
                <input
                  type="text"
                  name="fabric"
                  value={formData.fabric}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                  required
                  placeholder="e.g. Silk, Cotton"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Occasion *</label>
                <input
                  type="text"
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                  required
                  placeholder="e.g. Wedding, Festival"
                />
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Colors (comma separated)</label>
              <input
                type="text"
                name="colors"
                value={formData.colors}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                placeholder="Red, Gold, Blue"
              />
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Images</label>
              <div className="flex flex-wrap gap-2 mb-2">
                <input
                  type="text"
                  value={imageUrls.join(', ')}
                  readOnly
                  className="flex-1 min-w-[200px] px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg text-gray-400 cursor-not-allowed transition"
                  placeholder="Image URLs will appear here"
                />
                <button
                  type="button"
                  onClick={openUploadWidget}
                  disabled={uploading}
                  className="px-4 py-2 rounded-full font-semibold text-sm tracking-widest transition bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'UPLOADING...' : '📷 UPLOAD'}
                </button>
                {imageUrls.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllImages}
                    className="px-4 py-2 rounded-full font-semibold text-sm tracking-widest transition bg-red-900/30 text-red-300 border border-red-800 hover:bg-red-900/50 hover:text-red-200"
                  >
                    CLEAR ALL
                  </button>
                )}
              </div>

              {imageUrls.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-2">
                  {imageUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative group w-16 h-16 rounded-lg overflow-hidden border border-[#d4af37]/30 shadow-sm"
                    >
                      <img src={url} alt={`product ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-gray-400 mt-1">
                Upload images or paste URLs directly into the field above.
              </p>
            </div>

            {/* 3D Model Path */}
            <div>
              <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">3D Model Path (optional)</label>
              <input
                type="text"
                name="model3d"
                value={formData.model3d}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 transition"
                placeholder="/models/product.glb"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-2 rounded-full font-semibold text-sm tracking-widest transition ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]'
                }`}
              >
                {loading ? 'SAVING...' : isEdit ? 'UPDATE PRODUCT' : 'ADD PRODUCT'}
              </button>
              <Link
                to="/admin/products"
                className="px-6 py-2 rounded-full border border-[#d4af37]/40 text-sm font-medium text-gray-300 hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition"
              >
                CANCEL
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdminProductForm;