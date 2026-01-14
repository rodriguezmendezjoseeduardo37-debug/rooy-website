import { client } from "@/lib/sanity";
import ProductCard from "@/components/ProductCard";

async function getProducts() {
  return await client.fetch(`
    *[_type == "product"] | order(_createdAt desc){
      _id,
      title,
      price,
      image,
      slug
    }
  `);
}

export default async function CatalogoPage() {
  const products = await getProducts();

  return (
    <main className="max-w-7xl mx-auto px-6 py-14">
      <h1 className="text-4xl font-bold uppercase tracking-widest mb-12">
        Catálogo ROOY
      </h1>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </section>
    </main>
  );
}
