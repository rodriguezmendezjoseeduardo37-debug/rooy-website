"use client";

import { useShopStore } from "@/store/shopStore";
import { FaTimes, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const { cart, removeFromCart, isCartOpen, toggleCart } = useShopStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Calcular total
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop oscuro */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-neutral-900 z-[70] shadow-2xl border-l border-neutral-200 dark:border-neutral-800 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
              <h2 className="text-xl uppercase tracking-widest font-bold">Tu Pedido</h2>
              <button onClick={toggleCart} className="hover:rotate-90 transition duration-300">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
                  <p className="uppercase tracking-widest">El carrito está vacío</p>
                  <button onClick={toggleCart} className="text-sm underline">Seguir comprando</button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item._id}-${item.size}`} className="flex gap-4">
                    <div className="relative w-20 h-24 bg-neutral-100 flex-shrink-0">
                      {item.image && (
                        <Image
                          src={urlFor(item.image).width(200).url()}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm uppercase tracking-wider font-medium">{item.title}</h3>
                        <p className="text-xs text-neutral-500 mt-1">Talla: {item.size || "Única"}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold">${item.price * item.quantity}</p>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-neutral-400 hover:text-red-500 transition"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-black">
                <div className="flex justify-between mb-4 text-lg font-bold uppercase tracking-widest">
                  <span>Total</span>
                  <span>${total} MXN</span>
                </div>
                <button className="w-full bg-black dark:bg-white text-white dark:text-black py-4 uppercase tracking-[0.2em] font-bold text-sm hover:opacity-90 transition">
                  Ir a Pagar
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}