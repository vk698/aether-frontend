// import React, { createContext, useState, useContext, useEffect } from 'react';

// // Create Context
// const CartContext = createContext();

// // Custom hook to use Cart
// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// // Cart Provider Component
// export const CartProvider = ({ children }) => {
//   const [cartItems, setCartItems] = useState([]);

//   // Load cart from localStorage on mount
//   useEffect(() => {
//     const savedCart = localStorage.getItem('aether_cart');
//     if (savedCart) {
//       setCartItems(JSON.parse(savedCart));
//     }
//   }, []);

//   // Save cart to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem('aether_cart', JSON.stringify(cartItems));
//   }, [cartItems]);

//   // Add item to cart (or increase quantity)
//   const addToCart = (product) => {
//     setCartItems(prevItems => {
//       const existingItem = prevItems.find(item => item._id === product._id);
//       if (existingItem) {
//         // If product already in cart, increase quantity
//         return prevItems.map(item =>
//           item._id === product._id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       } else {
//         // Add new product with quantity 1
//         return [...prevItems, { ...product, quantity: 1 }];
//       }
//     });
//   };

//   // Remove item from cart
//   const removeFromCart = (productId) => {
//     setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
//   };

//   // Update quantity (increase or decrease)
//   const updateQuantity = (productId, newQuantity) => {
//     if (newQuantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }
//     setCartItems(prevItems =>
//       prevItems.map(item =>
//         item._id === productId
//           ? { ...item, quantity: newQuantity }
//           : item
//       )
//     );
//   };

//   // Clear entire cart
//   const clearCart = () => {
//     setCartItems([]);
//   };

//   // Get total items count
//   const getTotalItems = () => {
//     return cartItems.reduce((total, item) => total + item.quantity, 0);
//   };

//   // Get total price
//   const getTotalPrice = () => {
//     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
//   };

//   return (
//     <CartContext.Provider value={{
//       cartItems,
//       addToCart,
//       removeFromCart,
//       updateQuantity,
//       clearCart,
//       getTotalItems,
//       getTotalPrice
//     }}>
//       {children}
//     </CartContext.Provider>
//   );
// };
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create Context
const CartContext = createContext();

// Custom hook to use Cart
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  // 🔥 FIXED: Load from localStorage with error handling
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('aether_cart');
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Ensure it's an array
        return Array.isArray(parsed) ? parsed : [];
      }
      return [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // 🔥 FIXED: Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem('aether_cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  // Add item to cart (or increase quantity)
  const addToCart = (product) => {
    if (!product || !product._id) {
      console.error('Invalid product:', product);
      return;
    }
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  // Update quantity (increase or decrease)
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Get total items count
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  // Get total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 0)), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};