import { client } from "@/sanity/lib/client";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

async function getData(category?: string) {
  const productsQuery = category 
    ? `*[_type == "product" && category->title == $category]`
    : `*[_type == "product"]`;

  const [products, categories] = await Promise.all([
    client.fetch(`${productsQuery} | order(_createdAt desc){
      _id,
      title,
      price,
      image,
      slug
    }`, { category }),
    client.fetch(`*[_type == "category"]{_id, title}`)
  ]);

  return { products, categories };
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const { products, categories } = await getData(category);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 min-h-[60vh]">
      <div className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <h1 className="text-3xl md:text-4xl uppercase tracking-[0.3em]">
          {category ? `Categoría: ${category}` : "Catálogo Completo"}
        </h1>
      </div>

      {/* BARRA DE FILTROS */}
      <div className="flex gap-6 mb-12 overflow-x-auto pb-4 border-b border-neutral-100 dark:border-neutral-900 scrollbar-hide">
        <Link 
          href="/catalogo" 
          className={`text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-all ${!category ? 'font-bold border-b-2 border-black dark:border-white pb-1' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}
        >
          Todos
        </Link>
        {categories.map((cat: any) => (
          <Link 
            key={cat._id} 
            href={`/catalogo?category=${cat.title}`}
            className={`text-xs uppercase tracking-[0.2em] whitespace-nowrap transition-all ${category === cat.title ? 'font-bold border-b-2 border-black dark:border-white pb-1' : 'text-neutral-500 hover:text-black dark:hover:text-white'}`}
          >
            {cat.title}
          </Link>
        ))}
      </div>

      {products.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12 animate-fade-in">
          {products.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <p className="text-neutral-500 uppercase tracking-widest text-lg">
          No hay productos en esta categoría.
        </p>
      )}
    </main>
  );
}