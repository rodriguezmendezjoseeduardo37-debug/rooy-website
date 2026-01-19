"use client";

import { useCart } from "@/context/CartContext";
import { FaTimes, FaTrash } from "react-icons/fa";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function CartSidebar() {
  const { cart, removeFromCart, isCartOpen, closeCart, total } = useCart(); 
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop (Fondo oscuro detrás) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="
                fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col shadow-2xl
                /* ESTILOS GLASS (VIDRIO) */
                backdrop-blur-xl
                /* MODO CLARO: Blanco sólido y limpio con borde gris */
                bg-white/95 border-l border-neutral-200
                /* MODO OSCURO: Negro transparente con borde sutil */
                dark:bg-black/80 dark:border-white/10
            "
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-200 dark:border-white/10 flex justify-between items-center">
              <h2 className="text-xl uppercase tracking-widest font-bold text-black dark:text-white">
                Tu Pedido ({cart.length})
              </h2>
              <button 
                onClick={closeCart} 
                className="p-2 hover:bg-neutral-100 dark:hover:bg-white/10 rounded-full transition text-black dark:text-white"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Lista de productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                  <p className="uppercase tracking-widest text-sm font-medium">Tu bolsa está vacía</p>
                  <button onClick={closeCart} className="text-xs underline hover:opacity-100">
                    Seguir comprando
                  </button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={`${item._id}-${idx}`} className="flex gap-4">
                    {/* Imagen con borde suave */}
                    <div className="relative w-20 h-24 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 rounded-md overflow-hidden border border-neutral-200 dark:border-white/5">
                      {item.image && (
                        <Image
                          src={urlFor(item.image).width(200).url()}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    
                    {/* Detalles */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="text-sm uppercase tracking-wider font-bold text-black dark:text-white">
                            {item.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Talla: {item.size || "Unitalla"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-bold text-black dark:text-white">
                            ${item.price * item.quantity}
                        </p>
                       <button 
  // Ahora pasamos TAMBIÉN la talla para saber cuál borrar exactamente
  onClick={() => removeFromCart(item._id, item.size || "Unitalla")}
  className="text-neutral-400 hover:text-red-600 transition p-1"
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
              <div className="p-6 border-t border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-black/20">
                <div className="flex justify-between mb-6 text-lg font-bold uppercase tracking-widest text-black dark:text-white">
                  <span>Total</span>
                  <span>${total} MXN</span>
                </div>
                
                <Link 
                    href="/checkout"
                    onClick={closeCart} 
                    className="
                        block w-full text-center py-4 uppercase tracking-[0.2em] font-bold text-xs rounded-lg transition shadow-lg
                        /* Botón Negro en Claro / Blanco en Oscuro */
                        bg-black text-white hover:opacity-80
                        dark:bg-white dark:text-black
                    "
                >
                  Ir a Pagar
                </Link>
                <p className="text-[10px] text-center text-neutral-400 mt-4 uppercase tracking-wide">
                    Envío e impuestos calculados en el pago
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}