import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false); // 👈 Add this

  // ✅ Load cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    console.log("Cart loaded from localStorage:", storedCart);
    setIsInitialized(true); // 👈 Only allow saving AFTER this
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        const serializedCart = JSON.stringify(cart);
        localStorage.setItem("cart", serializedCart);
      } catch (err) {
        console.error("❌ Error saving cart to localStorage:", err);
        console.log("Problematic cart:", cart);
      }
    }
  }, [cart, isInitialized]);

  const updateQuantity = (itemId, quantity) => {
  setCart((prevCart) =>
    prevCart.map((item) =>
      item.itemId === itemId ? { ...item, quantity } : item
    )
  );
};

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.itemId === product.itemId);
      if (existing) {
        return prevCart.map((item) =>
          item.itemId === product.itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.itemId !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
