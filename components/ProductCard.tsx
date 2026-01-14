import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";

export default function ProductCard({ product }: any) {
  return (
    <Link href={`/producto/${product.slug.current}`}>
      <div className="group border border-current p-4 transition hover:opacity-80">
        {product.image && (
          <Image
            src={urlFor(product.image).width(600).height(600).url()}
            alt={product.title}
            width={600}
            height={600}
            className="mb-4"
          />
        )}

        <h3 className="uppercase tracking-widest text-sm mb-2">
          {product.title}
        </h3>

        <p className="text-sm">${product.price} MXN</p>
      </div>
    </Link>
  );
}
