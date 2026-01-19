"use client";

import { useCart } from "@/context/CartContext";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session?.user) {
      signIn("google");
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (response.ok) {
        window.location.href = data.url;
      } else {
        alert("Error: " + data.message);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-xl font-bold uppercase tracking-widest mb-4">
            Tu bolsa está vacía
        </h1>
        <Link href="/catalogo" className="underline text-sm text-neutral-500 hover:text-black dark:hover:text-white transition">
          Volver a la tienda
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full px-6 py-16 lg:py-24">
      
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl font-light uppercase tracking-[0.3em] mb-4 text-black dark:text-white">
            Resumen de Compra
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
             Estás a un paso de tener tu ROOY. La información de envío se solicitará de forma segura en la siguiente pantalla.
          </p>
        </div>

        {/* TARJETA PRINCIPAL */}
        <div className="
            backdrop-blur-xl 
            /* MODO CLARO: Blanco casi sólido y borde gris suave (Limpio) */
            bg-white/90 border border-neutral-200 shadow-xl
            /* MODO OSCURO: Negro transparente y borde sutil (Glass) */
            dark:bg-black/50 dark:border-white/10 dark:shadow-2xl
            p-8 md:p-12 
            rounded-2xl 
        ">
          
          {/* LISTA DE PRODUCTOS */}
          <div className="space-y-6 mb-8">
            {cart.map((item, idx) => (
              <div 
                key={`${item._id}-${idx}`} 
                className="flex items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6 last:border-0"
              >
                <div className="flex items-center gap-6">
                  {/* Imagen */}
                  <div className="relative w-20 h-24 bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 overflow-hidden rounded-md shadow-sm border border-neutral-100 dark:border-neutral-700">
                    {item.image && (
                      <Image
                        src={urlFor(item.image).width(150).url()}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="text-left">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-black dark:text-white">
                        {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        Talla: {item.size || "Unitalla"}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Cantidad: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-sm text-black dark:text-white">
                    ${item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* TOTALES */}
          <div className="flex flex-col gap-3 border-t border-neutral-200 dark:border-white/10 pt-8 mb-8">
            <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
              <span>Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">Envío</span>
              <span className="text-green-600 dark:text-green-400 font-bold uppercase text-xs tracking-wider">Gratis</span>
            </div>
            <div className="flex justify-between text-2xl font-bold uppercase tracking-widest mt-4 text-black dark:text-white">
              <span>Total</span>
              <span>${total} MXN</span>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button 
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-black text-white dark:bg-white dark:text-black py-5 uppercase tracking-[0.25em] font-bold text-sm hover:opacity-80 transition shadow-lg disabled:opacity-50 rounded-lg"
          >
            {loading ? "Redirigiendo..." : "Pagar con Stripe"}
          </button>
          
          <p className="text-[10px] text-center text-neutral-400 dark:text-neutral-500 mt-6 uppercase tracking-wide flex items-center justify-center gap-2">
             🔒 Pagos procesados de forma segura por Stripe
          </p>
        </div>
      </div>
    </main>
  );
}