import { client } from "@/lib/sanity";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";
import Link from "next/link";

// Fetch optimizado
async function getProducts(): Promise<Product[]> {
  return await client.fetch(`
    *[_type == "product"] | order(_createdAt desc)[0...6]{
      _id,
      title,
      price,
      slug,
      image
    }
  `, {}, { next: { revalidate: 3600 } });
}

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="flex-1">
      {/* HERO SECTION SIMPLE */}
      <section className="px-6 py-12 md:py-20 text-center border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest mb-4">
          Nueva Colección
        </h1>
        <p className="text-neutral-500 uppercase tracking-widest text-sm mb-8">
          Streetwear / Gothic / Minimal
        </p>
        <Link 
          href="/catalogo" 
          className="inline-block bg-black text-white dark:bg-white dark:text-black px-10 py-4 uppercase tracking-[0.2em] font-bold text-sm hover:opacity-80 transition"
        >
          Ver Todo
        </Link>
      </section>

      {/* PRODUCT GRID */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}