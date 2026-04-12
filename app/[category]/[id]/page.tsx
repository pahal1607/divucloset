"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart, Minus, Plus, ShieldCheck, Truck } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
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

  const totalStock = useMemo(() => {
    if (!product?.sizes) return 0;
    return Object.values(product.sizes).reduce(
      (sum: number, qty: any) => sum + Number(qty || 0),
      0
    );
  }, [product]);

  const selectedStock = useMemo(() => {
    if (!product?.sizes || !selectedSize) return 0;
    return Number(product.sizes[selectedSize] || 0);
  }, [product, selectedSize]);

  const title = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const showToast = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleIncrease = () => {
    if (!selectedSize) {
      showToast("Select a size first", "error");
      return;
    }
    if (quantity >= selectedStock) {
      showToast("No more stock for selected size", "error");
      return;
    }
    setQuantity((q) => q + 1);
  };

  const handleDecrease = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleSelectSize = (size: string) => {
    setSelectedSize(size);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (!selectedSize) {
      showToast("Please select a size first", "error");
      return;
    }

    if (selectedStock <= 0) {
      showToast("Selected size is out of stock", "error");
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url || "",
      size: selectedSize,
      quantity,
    });

    showToast(`${product.name} added to cart`, "success");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-zinc-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/10 bg-zinc-950 p-8">
          <h1 className="text-3xl font-bold">Product not found</h1>
          <p className="mt-3 text-zinc-400">
            This product does not exist or could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      {toastMessage && (
        <div
          className={`fixed right-4 top-24 z-[100] rounded-xl border px-5 py-3 text-sm font-medium shadow-2xl sm:right-6 ${
            toastType === "success"
              ? "border-green-500/30 bg-green-500 text-black"
              : "border-red-500/30 bg-red-500 text-white"
          }`}
        >
          {toastMessage}
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
        <div>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-[340px] w-full rounded-[2rem] object-cover sm:h-[460px] lg:h-[620px]"
            />
          ) : (
            <div className="flex h-[340px] w-full items-center justify-center rounded-[2rem] bg-zinc-900 text-zinc-500 sm:h-[460px] lg:h-[620px]">
              No Image
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
            {product.category || title}
          </p>

          <div className="mt-3 flex items-start justify-between gap-4">
            <h1 className="text-3xl font-bold sm:text-4xl">{product.name}</h1>
            <button
              type="button"
              className="rounded-full border border-white/10 p-3 text-zinc-300"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-4 text-3xl font-bold">₹{product.price}</p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/10 bg-zinc-950 px-4 py-2 text-zinc-300">
              Total stock: {totalStock}
            </span>
            {totalStock <= 5 && totalStock > 0 && (
              <span className="rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-300">
                Only {totalStock} left
              </span>
            )}
            {totalStock === 0 && (
              <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-300">
                Out of stock
              </span>
            )}
          </div>

          <p className="mt-6 text-base leading-7 text-zinc-400">
            {product.description || "No description available"}
          </p>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-zinc-300">Select Size</p>
            <div className="flex flex-wrap gap-3">
              {Object.entries(product.sizes || {}).map(([size, qty]) => (
                <button
                  key={size}
                  disabled={Number(qty) <= 0}
                  onClick={() => handleSelectSize(size)}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    selectedSize === size
                      ? "bg-white text-black"
                      : "border-white/20 text-white hover:bg-white hover:text-black"
                  } ${Number(qty) <= 0 ? "cursor-not-allowed opacity-30" : ""}`}
                >
                  {size} ({Number(qty)})
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-medium text-zinc-300">Quantity</p>
            <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-zinc-950 p-2">
              <button
                type="button"
                onClick={handleDecrease}
                className="rounded-xl border border-white/10 p-3"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[40px] text-center text-lg font-semibold">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                className="rounded-xl border border-white/10 p-3"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {selectedSize && (
              <p className="mt-3 text-sm text-zinc-400">
                Available in {selectedSize}: {selectedStock}
              </p>
            )}
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <button
              onClick={handleAddToCart}
              className="rounded-2xl bg-white px-6 py-4 font-semibold text-black hover:bg-zinc-200"
            >
              Add to Cart
            </button>

            <Link
              href="/checkout"
              className="rounded-2xl border border-white/20 px-6 py-4 text-center font-semibold text-white hover:bg-white hover:text-black"
            >
              Buy Now
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-zinc-300" />
                <div>
                  <p className="font-medium">Fast Delivery</p>
                  <p className="text-sm text-zinc-400">Quick shipping across cities</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-zinc-300" />
                <div>
                  <p className="font-medium">Secure Shopping</p>
                  <p className="text-sm text-zinc-400">Trusted checkout experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-5 text-sm text-zinc-400">
            <p>✔ Premium dark shopping experience</p>
            <p className="mt-2">✔ Easy category browsing</p>
            <p className="mt-2">✔ Real stock connected from admin panel</p>
          </div>
        </div>
      </div>
    </div>
  );
}