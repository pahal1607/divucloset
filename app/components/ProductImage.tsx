import Image from "next/image";

// Images stored in Supabase Storage go through Next's optimizer (resized, WebP/AVIF,
// lazy-loaded). Anything else is served as-is so an unexpected host can never crash a page.
const OPTIMIZED_HOST =
  /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i;

/** Fills its parent — the parent must be `relative` and have a size/aspect ratio. */
export default function ProductImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "object-cover",
}: {
  src?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-xs text-zinc-500">
        No image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={!OPTIMIZED_HOST.test(src)}
      className={className}
    />
  );
}
