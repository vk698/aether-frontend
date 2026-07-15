import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <>
        <Helmet>
          <title>Aether – Your Cart</title>
          <meta name="description" content="Review your Aether cart – premium handcrafted sarees." />
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
              Explore our beautiful collection of sarees.
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

  return (
    <>
      <Helmet>
        <title>Aether – Your Cart</title>
        <meta name="description" content="Review your Aether cart – premium handcrafted sarees." />
      </Helmet>

      {/* Pure Black Background */}
      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] p-4 md:p-8 relative overflow-hidden font-sans">
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0] text-center mb-2">
            Your Cart
          </h2>
          <p className="text-center text-gray-400 text-sm font-light tracking-widest mb-8">
            {getTotalItems()} items
          </p>

          {/* Cart Items – Glass Card */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="glass-royal rounded-2xl p-4 border border-[#d4af37]/30 shadow-royal flex flex-wrap items-center gap-4"
              >
                <img
                  src={item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg border border-[#d4af37]/20"
                />
                <div className="flex-1 min-w-[120px]">
                  <h3 className="font-serif text-lg font-semibold text-gray-200">{item.name}</h3>
                  <p className="text-xs text-gray-400">{item.fabric} • {item.occasion}</p>
                  <p className="text-lg font-bold text-[#d4af37] mt-1">₹{item.price.toLocaleString()}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-medium text-gray-200">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#d4af37]/10 hover:border-[#d4af37] transition flex items-center justify-center"
                  >
                    +
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-gray-400 hover:text-red-400 transition text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="glass-royal rounded-2xl p-6 border border-[#d4af37]/30 shadow-royal mt-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Subtotal ({getTotalItems()} items)</span>
              <span className="font-medium text-gray-200">₹{getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-400">Shipping</span>
              <span className="text-gray-400">Calculated at checkout</span>
            </div>
            <div className="border-t border-[#d4af37]/20 mt-4 pt-4 flex justify-between text-lg font-semibold">
              <span className="text-gray-200">Total</span>
              <span className="text-[#d4af37]">₹{getTotalPrice().toLocaleString()}</span>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={clearCart}
                className="flex-1 py-3 rounded-full border border-[#d4af37]/40 text-gray-300 hover:bg-[#d4af37]/10 hover:text-[#d4af37] transition text-sm tracking-widest"
              >
                CLEAR CART
              </button>
              <Link
                to="/checkout"
                className="flex-1 py-3 rounded-full font-semibold text-sm tracking-widest text-center transition bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]"
              >
                PROCEED TO CHECKOUT
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;