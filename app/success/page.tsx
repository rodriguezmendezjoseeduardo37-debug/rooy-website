"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  // IMPORTANTE: Traemos también 'cart' para verificar si tiene items
  const { clearCart, cart } = useCart(); 
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    // CONDICIÓN MÁGICA: Solo borramos si hay items (cart.length > 0)
    // Esto rompe el bucle infinito
    if (sessionId && cart.length > 0) {
      clearCart();
    }
  }, [sessionId, cart.length, clearCart]);

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-6 rounded-full mb-8 animate-bounce">
        <FaCheckCircle size={60} />
      </div>

      <h1 className="text-4xl uppercase tracking-widest font-bold mb-4">
        ¡Gracias por tu compra!
      </h1>
      
      <p className="text-neutral-500 max-w-md mb-8">
        Tu pago ha sido procesado exitosamente. Hemos enviado un recibo a tu correo electrónico.
      </p>

      {sessionId && (
        <p className="text-xs text-neutral-400 mb-8 font-mono bg-neutral-100 dark:bg-neutral-900 p-2 rounded">
          ID de Orden: {sessionId.slice(-10)}...
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/catalogo"
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase tracking-widest text-sm font-bold hover:opacity-80 transition"
        >
          Seguir Comprando
        </Link>
        <Link
          href="/cuenta"
          className="border border-current px-8 py-3 uppercase tracking-widest text-sm font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
        >
          Ver mis Pedidos
        </Link>
      </div>
    </main>
  );
}