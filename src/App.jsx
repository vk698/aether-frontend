import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import ProductList from './components/ProductList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrderDetail from './pages/AdminOrderDetail';
import ProtectedRoute from './components/ProtectedRoute';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';

function App() {
  const { getTotalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const logoRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 3D Tilt effect on logo
  const handleLogoMove = (e) => {
    const el = logoRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleLogoLeave = () => {
    const el = logoRef.current;
    if (!el) return;
    el.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <Helmet>
        <title>Aether – Black Label | Premium Handcrafted Sarees</title>
        <meta name="description" content="Discover the pinnacle of luxury. Aether's Black Label collection – timeless elegance, pure black, and gold." />
        <meta name="keywords" content="black label sarees, luxury silk, premium sarees, Aether" />
        <link rel="canonical" href="https://youraetherstore.com" />
        <meta property="og:title" content="Aether – Black Label | Premium Sarees" />
        <meta property="og:description" content="Timeless elegance, pure black, and gold." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://youraetherstore.com" />
        <meta property="og:image" content="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aether – Black Label" />
        <meta name="twitter:description" content="Timeless elegance, pure black, and gold." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Manrope:wght@200;300;400;500;600&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Pure Black Background with Marble Texture & Gold Glows */}
      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] flex flex-col relative overflow-hidden font-sans">

        {/* Ambient Gold Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        {/* Marble Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>

        {/* Floating Gold Dust Particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="gold-dust" style={{ top: '15%', left: '8%', animationDelay: '0s' }}></div>
          <div className="gold-dust" style={{ top: '30%', left: '40%', animationDelay: '1.5s' }}></div>
          <div className="gold-dust" style={{ top: '55%', left: '85%', animationDelay: '2.8s' }}></div>
          <div className="gold-dust" style={{ top: '75%', left: '20%', animationDelay: '0.9s' }}></div>
          <div className="gold-dust" style={{ top: '90%', left: '70%', animationDelay: '3.2s' }}></div>
          <div className="gold-dust" style={{ top: '40%', left: '75%', animationDelay: '2s' }}></div>
          <div className="gold-dust" style={{ top: '65%', left: '50%', animationDelay: '0.5s' }}></div>
          <div className="gold-dust" style={{ top: '10%', left: '95%', animationDelay: '2.5s' }}></div>
          <div className="gold-dust" style={{ top: '50%', left: '15%', animationDelay: '1.2s' }}></div>
          <div className="gold-dust" style={{ top: '85%', left: '45%', animationDelay: '0.3s' }}></div>
        </div>

        {/* Ornamental Gold Border */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent z-10"></div>
        <div className="absolute top-0 left-6 w-10 h-10 border-t-[1px] border-l-[1px] border-[#d4af37]/60 rounded-tl-xl z-10"></div>
        <div className="absolute top-0 right-6 w-10 h-10 border-t-[1px] border-r-[1px] border-[#d4af37]/60 rounded-tr-xl z-10"></div>

        {/* Header – Glassmorphism with Gold Shimmer */}
        {!isAdminRoute && (
          <header className="relative z-20 mx-4 mt-4 glass-royal rounded-2xl overflow-hidden shadow-royal">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-[#d4af37]/10 to-transparent animate-shimmer-gold"></div>

            <div className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
              <Link
                to="/"
                className="flex items-center gap-3 group"
                ref={logoRef}
                onMouseMove={handleLogoMove}
                onMouseLeave={handleLogoLeave}
                style={{ transformStyle: 'preserve-3d', transition: 'transform 0.1s ease' }}
              >
                <span className="font-serif text-3xl font-bold tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0] drop-shadow-[0_0_30px_rgba(212,175,55,0.3)] group-hover:scale-105 transition-transform duration-700">
                  AETHER
                </span>
                <span className="text-[10px] font-serif-alt font-light tracking-[0.4em] text-[#d4af37]/70 uppercase border-l border-[#d4af37]/30 pl-3">
                  Black Label
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-light tracking-wider text-gray-300 font-serif-alt">
                <Link to="/" className="relative text-gray-300 hover:text-[#d4af37] transition-colors duration-500 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d4af37] after:transition-all after:duration-500 hover:after:w-full">
                  Collection
                </Link>
                <a href="#" className="relative text-gray-300 hover:text-[#d4af37] transition-colors duration-500 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d4af37] after:transition-all after:duration-500 hover:after:w-full">
                  About
                </a>
                <Link to="/orders" className="relative text-gray-300 hover:text-[#d4af37] transition-colors duration-500 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#d4af37] after:transition-all after:duration-500 hover:after:w-full">
                  Track Order
                </Link>
                <Link to="/cart" className="relative text-gray-300 hover:text-[#d4af37] transition-colors duration-500 flex items-center gap-2">
                  Cart
                  <span className="bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-[#d4af37]/30 animate-pulse-royal">
                    {getTotalItems()}
                  </span>
                </Link>

                {isAuthenticated ? (
                  <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300 group">
                    <img
                      src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=d4af37&color=050505&size=28`}
                      alt={user?.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover border-2 border-[#d4af37]/50 group-hover:border-[#d4af37] transition-colors duration-300"
                    />
                    <span className="text-xs text-gray-400 group-hover:text-[#d4af37] transition-colors duration-300">{user?.name}</span>
                  </Link>
                ) : (
                  <Link to="/login" className="text-gray-300 hover:text-black transition-all duration-500 px-5 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/40 hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#f5e6d0] hover:text-black hover:shadow-lg hover:shadow-[#d4af37]/30 text-xs font-medium font-sans">
                    Login
                  </Link>
                )}

                <Link
                  to="/admin"
                  className="text-xs text-gray-500 hover:text-[#d4af37] transition-colors duration-300"
                >
                  Admin
                </Link>
              </nav>

              <button
                className="md:hidden text-gray-300 hover:text-[#d4af37] transition-colors text-2xl focus:outline-none"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                ☰
              </button>
            </div>
          </header>
        )}

        {/* Mobile Menu Slide-in */}
        {mobileMenuOpen && !isAdminRoute && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-3xl hover:text-[#d4af37] transition"
              >
                ✕
              </button>
            </div>
            <nav className="flex flex-col items-center gap-6 text-lg font-light text-gray-300 mt-8">
              <Link to="/" className="hover:text-[#d4af37] transition" onClick={closeMobileMenu}>Collection</Link>
              <a href="#" className="hover:text-[#d4af37] transition" onClick={closeMobileMenu}>About</a>
              <Link to="/orders" className="hover:text-[#d4af37] transition" onClick={closeMobileMenu}>Track Order</Link>
              <Link to="/cart" className="hover:text-[#d4af37] transition flex items-center gap-2" onClick={closeMobileMenu}>
                Cart
                <span className="bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg shadow-[#d4af37]/30">
                  {getTotalItems()}
                </span>
              </Link>
              {isAuthenticated ? (
                <Link to="/profile" className="flex items-center gap-2 hover:text-[#d4af37] transition" onClick={closeMobileMenu}>
                  <img
                    src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=d4af37&color=050505&size=28`}
                    alt={user?.name || 'User'}
                    className="w-7 h-7 rounded-full object-cover border-2 border-[#d4af37]/50"
                  />
                  <span>{user?.name}</span>
                </Link>
              ) : (
                <Link to="/login" className="hover:text-[#d4af37] transition" onClick={closeMobileMenu}>Login / Sign Up</Link>
              )}
              <Link to="/admin" className="text-xs text-gray-500 hover:text-[#d4af37] transition" onClick={closeMobileMenu}>Admin</Link>
            </nav>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 relative z-10 px-4 py-8 md:py-12 animate-fade-up-royal">
          <div className="container mx-auto max-w-7xl">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/order/:id" element={<ProtectedRoute><AdminOrderDetail /></ProtectedRoute>} />
              <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
              <Route path="/admin/products/new" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
              <Route path="/admin/products/edit/:id" element={<ProtectedRoute><AdminProductForm /></ProtectedRoute>} />
            </Routes>
          </div>
        </main>

        {/* Royal Footer */}
        {!isAdminRoute && (
          <footer className="relative z-10 mx-4 mb-4 glass-royal rounded-2xl shadow-royal py-6 px-4 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent"></div>
            <div className="container mx-auto text-center">
              <div className="flex justify-center items-center gap-4 mb-3">
                <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-[#d4af37]"></span>
                <span className="text-[10px] tracking-[0.4em] text-[#d4af37]/60 uppercase font-serif-alt">Black Label</span>
                <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-[#d4af37]"></span>
              </div>
              <p className="text-sm font-light text-gray-300 tracking-wider font-serif">
                © 2026 <span className="font-bold text-[#d4af37]">AETHER</span> — Black Label. Timeless Soul.
              </p>
              <p className="text-[10px] text-gray-500 mt-1 tracking-widest font-serif-alt">Designed in India · Ethically Crafted</p>
            </div>
          </footer>
        )}

        {/* 🔥 FLOATING CART BUTTON – Royal Premium Icon */}
        {!isAdminRoute && (
          <Link
            to="/cart"
            onClick={closeMobileMenu}
            className="md:hidden fixed bottom-6 right-6 z-50 bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black p-4 rounded-full shadow-2xl shadow-[#d4af37]/40 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
          >
            {/* 🔥 Royal Crown Shopping Bag Icon */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
              {/* Crown */}
              <path d="M12 2L14.5 6.5L19 4L16.5 9L21 8.5L17.5 13L22 14L17 18.5L19.5 22L12 19.5L4.5 22L7 18.5L2 14L6.5 13L3 8.5L7.5 9L5 4L9.5 6.5L12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" fillOpacity="0.15"/>
              {/* Shopping Bag */}
              <path d="M7 8L5 20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20L17 8H7Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
              <path d="M9 11C9 12.0609 9.42143 13.0783 10.1716 13.8284C10.9217 14.5786 11.9391 15 13 15C14.0609 15 15.0783 14.5786 15.8284 13.8284C16.5786 13.0783 17 12.0609 17 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-black">
                {getTotalItems()}
              </span>
            )}
          </Link>
        )}
      </div>
    </>
  );
}

export default App;