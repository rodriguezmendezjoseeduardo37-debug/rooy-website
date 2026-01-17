"use client";

import { useCart } from "@/context/CartContext";
import { Product } from "@/types";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    setLoading(true);
    // Simulamos un pequeño delay para feedback visual
    setTimeout(() => {
        addToCart(product);
        setLoading(false);
    }, 500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="w-full bg-black dark:bg-white text-white dark:text-black py-4 uppercase tracking-[0.2em] font-bold text-sm hover:opacity-80 transition disabled:opacity-50"
    >
      {loading ? "Agregando..." : "Agregar al Carrito"}
    </button>
  );
}