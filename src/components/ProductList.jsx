import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Product3DViewer from './Product3DViewer';
import { useCart } from '../context/CartContext';

// 🔥 API Base URL – uses environment variable or falls back to local
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 🔥 Use dynamic API base URL
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load sarees. Please try again.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-[#d4af37] font-light tracking-widest animate-pulse">
          Unfolding Aether...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-xl text-gray-400">No sarees in the collection yet.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Royal Headline */}
      <div className="text-center mb-14">
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0] drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">
          The Aether Collection
        </h1>
        <p className="text-gray-400 tracking-[0.3em] text-sm mt-3 font-light uppercase">
          Black Label · Timeless Weaves
        </p>
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        {products.map((product, index) => (
          <TiltCard
            key={product._id}
            product={product}
            index={index}
            onImageClick={() => setSelectedProduct(product)}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      {/* 3D Viewer Modal */}
      {selectedProduct && (
        <Product3DViewer
          modelPath={selectedProduct.model3d || '/models/mannequin-slim.glb'}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

// 🔥 3D TILT CARD – with dedicated 3D View button
const TiltCard = ({ product, index, onImageClick, onAddToCart }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = ((centerY - y) / centerY) * 12;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    const btn = e.currentTarget;
    const originalText = btn.textContent;
    btn.textContent = '✓ ADDED';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = 'linear-gradient(135deg, #d4af37, #f5e6d0)';
    }, 1500);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="perspective-600 w-full animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div
        className="shiny-card transform-preserve-3d transition-transform duration-200"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Image Container – Clickable for 3D (overlay remains) */}
        <div
          className="relative overflow-hidden rounded-xl cursor-pointer group"
          onClick={onImageClick}
        >
          <img
            src={product.images && product.images.length > 0
              ? product.images[0]
              : 'https://images.unsplash.com/photo-1610030469699-0ea7b0e20a1c?w=400'
            }
            alt={product.name}
            className="card-image w-full h-64 md:h-72 object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-xs font-light tracking-widest border border-white/60 px-4 py-2 rounded-full backdrop-blur-sm">
              VIEW IN 3D
            </span>
          </div>
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-[10px] px-3 py-1 rounded-full tracking-widest font-light border border-[#d4af37]/30">
            {product.fabric}
          </div>
        </div>

        {/* Details */}
        <div className="card-details mt-3">
          <h3 className="card-title">{product.name}</h3>
          <p className="card-meta">{product.occasion}</p>

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="w-4 h-4 rounded-full border border-gray-600 shadow-sm"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                ></span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <span className="card-price">₹{product.price.toLocaleString()}</span>
            <span className={`text-[10px] px-3 py-1 rounded-full font-light tracking-wider border ${
              product.stock > 0
                ? 'bg-green-900/30 text-green-400 border-green-800'
                : 'bg-red-900/30 text-red-400 border-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} AVAILABLE` : 'SOLD OUT'}
            </span>
          </div>

          {/* 🔥 DEDICATED 3D VIEW BUTTON (visible always) */}
          <button
            onClick={onImageClick}
            className="mt-2 w-full py-2 rounded-full border border-gold-royal/50 text-gold-royal hover:bg-gold-royal/10 transition-all duration-300 text-xs font-medium tracking-wider"
          >
            🔮 VIEW IN 3D
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="card-btn"
          >
            {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;