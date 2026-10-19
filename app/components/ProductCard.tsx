import Link from "next/link";
import ProductImage from "./ProductImage";
import {
  discountPercent,
  formatPrice,
  getMrp,
  productPath,
  totalStock,
  type Product,
} from "../lib/product-utils";

export default function ProductCard({
  product,
  priority = false,
  headingLevel = 3,
}: {
  product: Product;
  priority?: boolean;
  headingLevel?: 2 | 3;
}) {
  const stock = totalStock(product);
  const mrp = getMrp(product);
  const off = discountPercent(product);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="group h-full">
      <Link
        href={productPath(product)}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 transition duration-300 hover:-translate-y-1.5 hover:border-gold/40 hover:shadow-[0_18px_40px_-18px_rgba(212,180,131,0.25)]"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-zinc-900">
          <ProductImage
            src={product.image_url}
            alt={product.name}
            priority={priority}
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />

          <div className="absolute left-2 top-2 flex flex-col items-start gap-1.5 sm:left-3 sm:top-3">
            {off > 0 && (
              <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black">
                {off}% off
              </span>
            )}
            {stock === 0 ? (
              <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-200">
                Sold out
              </span>
            ) : stock <= 5 ? (
              <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                Only {stock} left
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-zinc-500">
            {product.subcategory || product.category}
          </p>
          <Heading className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-white sm:text-[15px]">
            {product.name}
          </Heading>
          <p className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="text-base font-semibold text-gold-soft sm:text-lg">
              {formatPrice(product.price)}
            </span>
            {mrp && (
              <span className="text-xs text-zinc-500 line-through">
                {formatPrice(mrp)}
              </span>
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
