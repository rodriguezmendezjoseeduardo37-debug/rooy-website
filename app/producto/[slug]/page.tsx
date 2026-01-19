import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Product } from "@/types";
import { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";

// IMPORTAMOS EL ZOOM Y SUS ESTILOS
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

// --- METADATA ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{ title, description, image }`,
    { slug }
  );

  if (!product) return { title: "Producto no encontrado | ROOY" };

  return {
    title: `${product.title} | ROOY`,
    description: product.description,
    openGraph: {
      images: product.image ? [urlFor(product.image).width(1200).url()] : [],
    },
  };
}

// --- FETCH ---
async function getProduct(slug: string): Promise<Product> {
  return await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      _id, title, price, description, image, gallery[], slug
    }`,
    { slug }
  );
}

// --- PÁGINA ---
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const images = [product.image, ...(product.gallery || [])].filter(Boolean);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-16 items-start">
        
        {/* GALERÍA DE IMÁGENES CON ZOOM */}
        <div className="space-y-6">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 cursor-zoom-in">
              {/* ENVOLVEMOS LA IMAGEN CON ZOOM */}
              <Zoom>
                <Image
                  src={urlFor(img).width(900).height(1125).url()}
                  alt={`${product.title} ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Zoom>
            </div>
          ))}
        </div>

        {/* INFO PRODUCTO */}
        <div className="sticky top-28">
          <h1 className="text-3xl md:text-5xl uppercase tracking-widest font-bold mb-6">
            {product.title}
          </h1>

          <p className="text-3xl font-light tracking-wide mb-8">
            ${product.price} MXN
          </p>

          <div className="prose dark:prose-invert mb-12 text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm uppercase tracking-wide">
            {product.description}
          </div>

          {/* BOTÓN DE CARRITO (CLIENT COMPONENT) */}
          <div className="mt-8">
             <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </section>
  );
}