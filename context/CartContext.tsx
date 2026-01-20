"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product } from "@/types";
import { useCallback } from "react";

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem | Product, openSidebar?: boolean) => void;
  removeFromCart: (id: string, size?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  isCartOpen: boolean;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cargar del localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("rooy_cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setMounted(true);
  }, []);

  // Guardar en localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rooy_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  // --- LÓGICA CORREGIDA PARA SEPARAR TALLAS ---
  const addToCart = (product: CartItem | Product, openSidebar = true) => {
    setCart((prevCart) => {
      // 1. Obtenemos la talla que el usuario quiere agregar.
      // Si el componente no envió talla, asumimos "Unitalla".
      const incomingSize = (product as CartItem).size || "Unitalla";
      const incomingQty = (product as CartItem).quantity || 1;

      // 2. Buscamos si YA existe un producto con EL MISMO ID **Y** LA MISMA TALLA.
      const existingItemIndex = prevCart.findIndex(
        (item) => item._id === product._id && (item.size || "Unitalla") === incomingSize
      );

      // ESCENARIO A: Ya existe esa combinación exacta (ID + Talla) -> Sumamos cantidad
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += incomingQty;
        return newCart;
      } 
      
      // ESCENARIO B: Es una talla nueva o producto nuevo -> Agregamos como item separado
      else {
        const newItem: CartItem = { 
            ...product, 
            quantity: incomingQty,
            size: incomingSize 
        };
        return [...prevCart, newItem];
      }
    });

    if (openSidebar) {
      setIsCartOpen(true);
    }
  };

  const removeFromCart = (id: string, size?: string) => {
    const targetSize = size || "Unitalla";
    setCart((prevCart) => 
      prevCart.filter((item) => {
        // Solo eliminamos si COINCIDE el ID y COINCIDE la Talla
        if (item._id === id && (item.size || "Unitalla") === targetSize) {
            return false; // Adiós
        }
        return true; // Se queda
      })
    );
  };
  
 const clearCart = useCallback(() => {
  setCart([]);
}, []);
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, clearCart, openCart, closeCart, isCartOpen, total }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de un CartProvider");
  return context;
};