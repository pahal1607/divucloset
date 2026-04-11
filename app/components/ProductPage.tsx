"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { addToCart as addItemToCart } from "./cartUtils";
import { getProducts } from "./productDb";

type ToastType = "success" | "error";

export default function ProductPage({ title }: { title: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data || []);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categoryProducts = useMemo(() => {
    return products.filter(
      (product) => product.category?.toLowerCase() === title.toLowerCase()
    );
  }, [products, title]);

  const filteredProducts = useMemo(() => {
    return categoryProducts.filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [categoryProducts, search]);

  const handleSize = (id: number, size: string, qty: number) => {
    if (qty <= 0) return;
    setSelectedSizes((prev) => ({ ...prev, [id]: size }));
  };

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const addToCart = (
    id: number,
    name: string,
    price: number,
    image: string | null,
    sizes: Record<string, number>
  ) => {
    const selectedSize = selectedSizes[id];

    if (!selectedSize) {
      showToast("Please select a size first", "error");
      return;
    }

    const availableQty = sizes?.[selectedSize] ?? 0;
    if (availableQty <= 0) {
      showToast("Selected size is out of stock", "error");
      return;
    }

    addItemToCart({
      id,
      name,
      price,
      image: image || "",
      size: selectedSize,
      quantity: 1,
    });

    showToast(`${name} (${selectedSize}) added to cart`, "success");
  };

  const slug = title.toLowerCase().replace(/ /g, "-");

  return (
    <div className="min-h-screen bg-black p-6 text-white">
      {toastMessage && (
        <div
          className={`fixed right-6 top-24 z-[100] rounded-xl border px-5 py-3 text-sm font-medium shadow-2xl ${
            toastType === "success"
              ? "border-green-500/30 bg-green-500 text-black"
              : "border-red-500/30 bg-red-500 text-white"
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-zinc-400">
          Browse and shop the latest {title.toLowerCase()} collection.
        </p>

        <input
          placeholder={`Search ${title}...`}
          className="mt-6 w-full rounded-xl border border-white/10 bg-white p-3 text-black outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <p className="mt-8 text-zinc-400">Loading products...</p>
        ) : filteredProducts.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-zinc-400">No products found in {title}.</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => {
              const totalStock = Object.values(product.sizes || {}).reduce(
                (sum: number, qty: any) => sum + Number(qty || 0),
                0
              );

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-white/10 bg-zinc-950 p-4"
                >
                  <Link href={`/${slug}/${product.id}`}>
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-60 w-full cursor-pointer rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-60 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500">
                        No Image
                      </div>
                    )}

                    <h3 className="mt-4 cursor-pointer text-lg font-semibold">
                      {product.name}
                    </h3>

                    <p className="mt-2 cursor-pointer text-sm text-zinc-400">
                      {product.description || "No description available"}
                    </p>

                    <p className="mt-3 cursor-pointer text-xl font-bold">
                      ₹{product.price}
                    </p>

                    <p className="mt-2 text-sm text-zinc-400">
                      Stock: {totalStock}
                    </p>
                  </Link>

                  <div className="mt-4">
                    <p className="mb-2 text-sm text-zinc-300">Select Size</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(product.sizes || {}).map(([size, qty]) => (
                        <button
                          key={size}
                          disabled={Number(qty) <= 0}
                          onClick={() => handleSize(product.id, size, Number(qty))}
                          className={`rounded-lg border px-3 py-1 text-sm transition ${
                            selectedSizes[product.id] === size
                              ? "bg-white text-black"
                              : "border-white/20 text-white hover:bg-white hover:text-black"
                          } ${Number(qty) <= 0 ? "cursor-not-allowed opacity-30" : ""}`}
                        >
                          {size} ({Number(qty)})
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      addToCart(
                        product.id,
                        product.name,
                        product.price,
                        product.image_url || null,
                        product.sizes || {}
                      )
                    }
                    className="mt-5 w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Add to Cart
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}