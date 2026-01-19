"use client"; // Importante: Ahora tiene interacción

import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import { Product } from "@/types";
import { useShopStore } from "@/store/shopStore";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import FadeIn from "./FadeIn";

export default function ProductCard({ product }: { product: Product }) {
  const { favorites, toggleFavorite } = useShopStore();
  const isFavorite = favorites.some((f) => f._id === product._id);

  return (
    <FadeIn>
      <div className="group relative">
        {/* Botón Favorito Flotante */}
        <button
          onClick={(e) => {
            e.preventDefault(); // Evita que abra el enlace del producto
            toggleFavorite(product);
          }}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:scale-110 transition shadow-sm"
        >
          {isFavorite ? (
            <FaHeart className="text-red-500" />
          ) : (
            <FaRegHeart className="text-neutral-500" />
          )}
        </button>

       <Link href={`/producto/${product.slug.current}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-4 border border-neutral-200 dark:border-neutral-800">
            {product.image && (
              <Image
                src={urlFor(product.image).width(600).height(750).url()}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            )}
            
            {/* Overlay "Ver Producto" (Estilo Streetwear) */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
               <span className="text-white uppercase tracking-widest text-xs font-bold border border-white px-4 py-2">
                 Ver Pieza
               </span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <h3 className="uppercase tracking-widest text-sm font-medium pr-4 group-hover:underline underline-offset-4 line-clamp-1">
              {product.title}
            </h3>
            <p className="text-sm font-bold opacity-80 whitespace-nowrap">
              ${product.price}
            </p>
          </div>
        </Link>
      </div>
    </FadeIn>
  );
}