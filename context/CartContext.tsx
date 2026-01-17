"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types";

export interface CartItem extends Product {
  quantity: number;
  size?: string; // Opcional: si quieres manejar tallas
}

type CartContextType = {
  cart: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, size?: string) => void;
  removeFromCart: (id: string) => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    setMounted(true);
    const savedCart = localStorage.getItem("rooy_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Guardar en localStorage cada vez que cambia
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("rooy_cart", JSON.stringify(cart));
    }
  }, [cart, mounted]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addToCart = (product: Product, size = "M") => {
    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item._id === product._id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, size }];
    });
    setIsOpen(true); // Abrir carrito al agregar
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, isOpen, openCart, closeCart, addToCart, removeFromCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}