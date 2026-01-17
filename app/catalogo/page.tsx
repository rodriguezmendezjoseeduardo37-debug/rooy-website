import { client } from "@/lib/sanity";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

async function getProducts(search?: string): Promise<Product[]> {
  const query = search 
    ? `*[_type == "product" && title match $search + "*"]`
    : `*[_type == "product"]`;
    
  return await client.fetch(
    `${query} | order(_createdAt desc){
      _id,
      title,
      price,
      image,
      slug
    }`,
    { search }
  );
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const products = await getProducts(search);

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 min-h-[60vh]">
      <div className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <h1 className="text-3xl md:text-4xl uppercase tracking-[0.3em]">
          {search ? `Resultados: "${search}"` : "Catálogo Completo"}
        </h1>
      </div>

      {products.length > 0 ? (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      ) : (
        <p className="text-neutral-500 uppercase tracking-widest text-lg">
          No se encontraron productos.
        </p>
      )}
    </main>
  );
}