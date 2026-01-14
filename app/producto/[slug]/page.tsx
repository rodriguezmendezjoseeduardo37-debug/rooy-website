import { client, urlFor } from "@/lib/sanity";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

/* ======================
   METADATA (SEO + SHARE)
====================== */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      title,
      description,
      image
    }`,
    { slug }
  );

  if (!product) {
    return { title: "Producto no encontrado | ROOY" };
  }

  return {
    title: `${product.title} | ROOY`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [
        {
          url: urlFor(product.image).width(1200).height(630).url(),
        },
      ],
    },
  };
}

/* ======================
   FETCH PRODUCTO
====================== */
async function getProduct(slug: string) {
  return await client.fetch(
    `*[_type == "product" && slug.current == $slug][0]{
      title,
      price,
      description,
      image,
      gallery[]
    }`,
    { slug }
  );
}

/* ======================
   PAGE
====================== */
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!slug) notFound();

  const product = await getProduct(slug);
  if (!product) notFound();

  const images = [
    product.image,
    ...(product.gallery || []),
  ].filter(Boolean);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-2 gap-16 items-start">

        {/* GALERÍA */}
        <div className="space-y-6">
          {images.map((img: any, i: number) => (
            <Image
              key={i}
              src={urlFor(img).width(900).height(900).url()}
              alt={`${product.title} ${i + 1}`}
              width={900}
              height={900}
              className="rounded-xl border border-neutral-200"
              priority={i === 0}
            />
          ))}
        </div>

        {/* INFO */}
        <div className="sticky top-24">
          <h1 className="text-4xl uppercase tracking-widest font-light mb-6">
            {product.title}
          </h1>

          <p className="text-2xl font-medium tracking-wide mb-8">
            ${product.price} MXN
          </p>

          <p className="text-neutral-600 leading-relaxed mb-12">
            {product.description}
          </p>

          {/* BOTÓN WHATSAPP */}
          <a
            href={`https://wa.me/522228732164?text=Hola,%20me%20interesa%20el%20producto%20${product.title}`}
            target="_blank"
            className="inline-flex items-center gap-3 bg-black text-white px-10 py-4 uppercase tracking-widest text-sm hover:opacity-80 transition"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
