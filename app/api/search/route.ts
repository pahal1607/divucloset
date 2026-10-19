import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "../../lib/product-data";
import { productPath } from "../../lib/product-utils";

// Lightweight suggestions for the header search box.
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const products = await searchProducts(q, 6);

  return NextResponse.json(
    {
      results: products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        image_url: p.image_url ?? null,
        href: productPath(p),
      })),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    }
  );
}
