"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import ProductCard from "@/components/ProductCard";

async function getProducts() {
  return await client.fetch(`
    *[_type == "product"] | order(_createdAt desc){
      _id,
      title,
      price,
      slug,
      image
    }
  `);
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <main className={`${dark ? "bg-black text-white" : "bg-white text-black"} min-h-screen transition-colors duration-500`}>

      {/* HEADER */}
      <header className="flex items-center justify-between px-8 py-10">
        <h1 className="text-3xl uppercase tracking-widest font-light">
          ROOY
        </h1>

        {/* TOGGLE */}
        <button
          onClick={() => setDark(!dark)}
          className="border px-6 py-2 uppercase tracking-widest text-sm hover:opacity-70 transition"
        >
          {dark ? "Modo Blanco" : "Modo Negro"}
        </button>
      </header>

      {/* GRID */}
      <section className="max-w-7xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
