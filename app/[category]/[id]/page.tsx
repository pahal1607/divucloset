"use client";

import { use, useEffect, useState } from "react";
import { addToCart } from "../../components/cartUtils";
import { getProductById } from "../../components/productDb";

type ToastType = "success" | "error";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; id: string }>;
}) {
  const { category, id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Failed to load product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(""), 2200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      showToast("Please select a size first", "error");
      return;
    }

    const availableQty = product.sizes?.[selectedSize] ?? 0;
    if (availableQty <= 0) {
      showToast("Selected size is out of stock", "error");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "",
      size: selectedSize,
      quantity: 1,
    });

    showToast(`${product.name} (${selectedSize}) added to cart`, "success");
  };

  const title = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-zinc-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black px-6 py-10 text-white">
        <div className="mx-auto max-w-6xl rounded-2xl border border-white/10 bg-zinc-950 p-8">
          <h1 className="text-3xl font-bold">Product not found</h1>
          <p className="mt-3 text-zinc-400">
            This product does not exist or could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  const totalStock = Object.values(product.sizes || {}).reduce(
    (sum: number, qty: any) => sum + Number(qty || 0),
    0
  );

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
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

      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2">
        <div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-3xl object-cover"
            />
          ) : (
            <div className="flex h-[500px] w-full items-center justify-center rounded-3xl bg-zinc-900 text-zinc-500">
              No Image
            </div>
          )}
        </div>

        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
            {product.category || title}
          </p>

          <h1 className="mt-3 text-4xl font-bold">{product.name}</h1>

          <p className="mt-4 text-3xl font-bold">₹{product.price}</p>

          <p className="mt-3 text-sm text-zinc-400">Total stock: {totalStock}</p>

          <p className="mt-6 text-zinc-400">
            {product.description || "No description available"}
          </p>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(product.sizes || {}).map(([size, qty]) => (
                <button
                  key={size}
                  disabled={Number(qty) <= 0}
                  onClick={() => setSelectedSize(size)}
                  className={`rounded-xl border px-4 py-2 ${
                    selectedSize === size
                      ? "bg-white text-black"
                      : "border-white/20 hover:bg-white hover:text-black"
                  } ${Number(qty) <= 0 ? "cursor-not-allowed opacity-30" : ""}`}
                >
                  {size} ({Number(qty)})
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 rounded-xl bg-white px-6 py-3 font-semibold text-black"
            >
              Add to Cart
            </button>

            <a
              href="/checkout"
              className="flex-1 rounded-xl border border-white/20 px-6 py-3 text-center font-semibold text-white hover:bg-white hover:text-black"
            >
              Buy Now
            </a>
          </div>

          <div className="mt-10 space-y-2 text-sm text-zinc-400">
            <p>✔ Free delivery available</p>
            <p>✔ Easy returns within 7 days</p>
            <p>✔ Secure payment</p>
          </div>
        </div>
      </div>
    </div>
  );
}