"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirigir si no está logueado
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Cargar pedidos
  useEffect(() => {
    if (session?.user) {
      fetch("/api/user/orders")
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orders || []);
          setLoading(false);
        });
    }
  }, [session]);

  if (status === "loading") return <div className="p-20 text-center">Cargando perfil...</div>;

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 min-h-[80vh]">
      
      {/* HEADER DEL PERFIL */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 border-b border-neutral-200 dark:border-neutral-800 pb-12">
        <div className="flex items-center gap-6">
          {session?.user?.image ? (
            <Image 
              src={session.user.image} 
              alt="Avatar" 
              width={100} 
              height={100} 
              className="rounded-full border border-neutral-300"
            />
          ) : (
            <div className="w-24 h-24 bg-neutral-200 rounded-full flex items-center justify-center text-3xl font-bold text-neutral-500">
              {session?.user?.name?.charAt(0)}
            </div>
          )}
          
          <div>
            <h1 className="text-3xl uppercase tracking-widest font-bold">
              {session?.user?.name}
            </h1>
            <p className="text-neutral-500 text-sm">{session?.user?.email}</p>
          </div>
        </div>

        <button 
          onClick={() => signOut({ callbackUrl: "/" })}
          className="border border-red-500 text-red-500 px-6 py-2 uppercase tracking-widest text-xs hover:bg-red-500 hover:text-white transition"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* HISTORIAL DE PEDIDOS */}
      <section>
        <h2 className="text-xl uppercase tracking-[0.2em] font-bold mb-8">
          Historial de Pedidos
        </h2>

        {loading ? (
          <p>Cargando pedidos...</p>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-900 rounded">
            <p className="mb-4 uppercase tracking-wide text-neutral-500">Aún no has realizado compras.</p>
            <Link href="/catalogo" className="underline underline-offset-4 font-bold">
              Ir a la tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col md:flex-row justify-between gap-6">
                <div>
                  <p className="text-xs text-neutral-500 uppercase mb-1">Orden #</p>
                  <p className="font-bold font-mono text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-neutral-400 mt-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex-1">
                  <p className="text-xs text-neutral-500 uppercase mb-2">Productos</p>
                  <ul className="text-sm space-y-1">
                    {order.items.map((item: any, i: number) => (
                      <li key={i}>
                        {item.quantity}x <strong>{item.title}</strong> ({item.size})
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-right">
                  <p className="text-xs text-neutral-500 uppercase mb-1">Total</p>
                  <p className="text-xl font-bold">${order.total}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-[10px] uppercase font-bold tracking-widest rounded-full 
                    ${order.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {order.status === 'pending' ? 'Pendiente' : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}