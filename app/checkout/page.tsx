"use client";

import { useCart } from "@/context/CartContext";
import { urlFor } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const [loading, setLoading] = useState(false);

  // Si el carrito está vacío, mostramos mensaje y botón de regreso
  if (cart.length === 0) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl uppercase tracking-widest font-bold mb-4">
          Tu carrito está vacío
        </h1>
        <p className="text-neutral-500 mb-8">
          Parece que aún no has agregado nada.
        </p>
        <Link
          href="/catalogo"
          className="bg-black dark:bg-white text-white dark:text-black px-8 py-3 uppercase tracking-widest text-sm font-bold"
        >
          Ir al Catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-4xl uppercase tracking-widest font-light mb-12 text-center md:text-left">
        Finalizar Compra
      </h1>

      <div className="grid md:grid-cols-2 gap-16">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <section>
          <h2 className="text-xl uppercase tracking-widest font-bold mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            Datos de Envío
          </h2>
          
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide font-bold">Nombre</label>
                <input type="text" className="w-full bg-neutral-100 dark:bg-neutral-900 border-none p-4 outline-none focus:ring-1 focus:ring-current" placeholder="Juan" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide font-bold">Apellido</label>
                <input type="text" className="w-full bg-neutral-100 dark:bg-neutral-900 border-none p-4 outline-none focus:ring-1 focus:ring-current" placeholder="Pérez" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wide font-bold">Dirección</label>
              <input type="text" className="w-full bg-neutral-100 dark:bg-neutral-900 border-none p-4 outline-none focus:ring-1 focus:ring-current" placeholder="Calle, Número, Colonia" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide font-bold">Ciudad</label>
                <input type="text" className="w-full bg-neutral-100 dark:bg-neutral-900 border-none p-4 outline-none focus:ring-1 focus:ring-current" />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wide font-bold">Código Postal</label>
                <input type="text" className="w-full bg-neutral-100 dark:bg-neutral-900 border-none p-4 outline-none focus:ring-1 focus:ring-current" />
              </div>
            </div>

            <div className="space-y-2">
               <label className="text-xs uppercase tracking-wide font-bold">Teléfono</label>
               <input type="tel" className="w-full bg-neutral-100 dark:bg-neutral-900 border-none p-4 outline-none focus:ring-1 focus:ring-current" placeholder="55 1234 5678" />
            </div>
          </form>
        </section>

        {/* COLUMNA DERECHA: RESUMEN */}
        <section className="bg-neutral-50 dark:bg-neutral-900 p-8 h-fit">
          <h2 className="text-xl uppercase tracking-widest font-bold mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            Resumen del Pedido
          </h2>

          <div className="space-y-6 mb-8">
            {cart.map((item, idx) => (
              <div key={`${item._id}-${idx}`} className="flex gap-4 items-center">
                <div className="relative w-16 h-20 bg-neutral-200 flex-shrink-0">
                  {item.image && (
                    <Image
                      src={urlFor(item.image).width(100).url()}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm uppercase font-bold">{item.title}</h3>
                  <p className="text-xs text-neutral-500">Talla: {item.size || "M"}</p>
                  <p className="text-xs text-neutral-500">x{item.quantity}</p>
                </div>
                <p className="font-bold text-sm">${item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-6 space-y-2 mb-8">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500 uppercase tracking-wide">Subtotal</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500 uppercase tracking-wide">Envío</span>
              <span>Gratis</span>
            </div>
            <div className="flex justify-between text-xl font-bold uppercase tracking-widest mt-4">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>

          <button 
            className="w-full bg-black text-white dark:bg-white dark:text-black py-4 uppercase tracking-[0.2em] font-bold hover:opacity-90 transition"
          >
            Pagar Ahora
          </button>
          
          <p className="text-xs text-center text-neutral-500 mt-4 uppercase tracking-wide">
            Pagos seguros procesados por Stripe (Próximamente)
          </p>
        </section>
      </div>
    </main>
  );
}