import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartApi } from '../api/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();

  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
      return;
    }

    try {
      const response = await cartApi.getCart();
      if (response?.data) {
        setCart(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch cart', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toastError('Please log in to add items to your cart.');
      return;
    }

    setLoading(true);
    try {
      const response = await cartApi.addItem(productId, quantity);
      if (response?.data) {
        setCart(response.data);
        success('Added to cart!');
        setIsDrawerOpen(true);
      }
    } catch (err) {
      toastError(err.message || 'Could not add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }

    try {
      const response = await cartApi.updateQuantity(itemId, quantity);
      if (response?.data) {
        setCart(response.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update quantity');
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await cartApi.removeItem(itemId);
      if (response?.data) {
        setCart(response.data);
        success('Item removed');
      }
    } catch (err) {
      toastError(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clearCart();
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    } catch (err) {
      console.error('Failed to clear cart', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        setIsDrawerOpen,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        fetchCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
