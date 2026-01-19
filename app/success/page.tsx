"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { FaCheckCircle } from "react-icons/fa";

// 1. Creamos un componente interno que tiene la lógica
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();

  useEffect(() => {
    if (sessionId) {
      clearCart();
    }
  }, [sessionId, clearCart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-100 dark:bg-black p-4 text-center">
      <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-xl max-w-md w-full border border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-center mb-6">
          <FaCheckCircle className="text-green-500 text-6xl" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">
          ¡Pago Exitoso!
        </h1>
        
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">
          Gracias por tu compra. Hemos recibido tu pedido correctamente.
        </p>

        <div className="space-y-4">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm text-neutral-500 dark:text-neutral-400">
            ID de Referencia: <span className="font-mono text-xs">{sessionId?.slice(-8) || "..."}</span>
          </div>

          <Link 
            href="/"
            className="block w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-full font-bold hover:opacity-90 transition"
          >
            Volver a la Tienda
          </Link>
        </div>
      </div>
    </div>
  );
}

// 2. El componente PRINCIPAL solo envuelve al otro con Suspense
export default function SuccessPage() {
  return (
    // Esto es lo que soluciona el error de "prerender"
    <Suspense fallback={<div className="p-10 text-center">Cargando confirmación...</div>}>
      <SuccessContent />
    </Suspense>
  );
}