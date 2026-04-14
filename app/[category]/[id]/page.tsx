"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { addToCart } from "../../components/cartUtils";
import { getProductById } from "../../components/productDb";

type ToastType = "success" | "error";
type TabType = "description" | "highlights" | "details";

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
  const [selectedImage, setSelectedImage] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("description");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await getProductById(Number(id));
        setProduct(data);

        const gallery =
          data?.images && Array.isArray(data.images) && data.images.length > 0
            ? data.images
            : data?.image_url
            ? [data.image_url]
            : [];

        setSelectedImage(gallery[0] || "");
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

  const galleryImages = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images;
    }
    if (product.image_url) return [product.image_url];
    return [];
  }, [product]);

  const title = category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const availableSizes = useMemo(() => {
    return Object.entries(product?.sizes || {})
      .filter(([, qty]) => Number(qty) > 0)
      .map(([size]) => size)
      .join(", ");
  }, [product]);

  const fakeMrp = useMemo(() => {
    return product?.price ? Math.round(Number(product.price) * 1.35) : 0;
  }, [product]);

  const discountPercent = useMemo(() => {
    if (!product?.price || !fakeMrp) return 0;
    return Math.round(((fakeMrp - Number(product.price)) / fakeMrp) * 100);
  }, [fakeMrp, product]);

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
      image: selectedImage || product.image_url || "",
      size: selectedSize,
      quantity,
    });

    showToast(`${product.name} added to cart`, "success");
  };

  const goPrevImage = () => {
    if (galleryImages.length <= 1) return;
    const currentIndex = galleryImages.indexOf(selectedImage);
    const prevIndex =
      currentIndex <= 0 ? galleryImages.length - 1 : currentIndex - 1;
    setSelectedImage(galleryImages[prevIndex]);
  };

  const goNextImage = () => {
    if (galleryImages.length <= 1) return;
    const currentIndex = galleryImages.indexOf(selectedImage);
    const nextIndex =
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(galleryImages[nextIndex]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-4 py-10 text-white sm:px-6">
        <div className="mx-auto max-w-7xl">
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

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 xl:grid-cols-[560px_1fr]">
          {/* LEFT SIDE */}
          <div className="grid gap-4 md:grid-cols-[92px_1fr]">
            {/* Thumbnails */}
            <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:max-h-[640px] md:flex-col md:overflow-y-auto md:overflow-x-hidden">
              {galleryImages.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`shrink-0 overflow-hidden rounded-2xl border-2 ${
                    selectedImage === img ? "border-white" : "border-white/10"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="h-20 w-20 object-cover md:h-24 md:w-24"
                  />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="order-1 md:order-2">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={product.name}
                    className="h-[360px] w-full object-cover sm:h-[460px] xl:h-[640px]"
                  />
                ) : (
                  <div className="flex h-[360px] w-full items-center justify-center text-zinc-500 sm:h-[460px] xl:h-[640px]">
                    No Image
                  </div>
                )}

                {galleryImages.length > 1 && (
                  <>
                    <button
                      onClick={goPrevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={goNextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/70 p-2 text-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-2">
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
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              {product.category || title}
            </p>

            <div className="mt-3 flex items-start justify-between gap-4">
              <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
                {product.name}
              </h1>
              <button
                type="button"
                className="rounded-full border border-white/10 p-3 text-zinc-300"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-3xl font-bold">₹{product.price}</span>
              <span className="text-lg text-zinc-500 line-through">₹{fakeMrp}</span>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
                {discountPercent}% off
              </span>
            </div>

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

            <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <h2 className="text-lg font-semibold">Select Size</h2>
              <div className="mt-4 flex flex-wrap gap-3">
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

            <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 p-5">
              <h2 className="text-lg font-semibold">Quantity</h2>
              <div className="mt-4 flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-black p-2">
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

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
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

            {/* Tabs */}
            <div className="mt-8 rounded-[2rem] border border-white/10 bg-zinc-950 p-5">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    activeTab === "description"
                      ? "bg-white text-black"
                      : "border border-white/10 text-white"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("highlights")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    activeTab === "highlights"
                      ? "bg-white text-black"
                      : "border border-white/10 text-white"
                  }`}
                >
                  Product Highlights
                </button>
                <button
                  onClick={() => setActiveTab("details")}
                  className={`rounded-xl px-4 py-2 text-sm font-medium ${
                    activeTab === "details"
                      ? "bg-white text-black"
                      : "border border-white/10 text-white"
                  }`}
                >
                  All Details
                </button>
              </div>

              {activeTab === "description" && (
                <div className="mt-6">
                  <p className="text-base leading-7 text-zinc-300">
                    {product.description || "No description available"}
                  </p>
                </div>
              )}

              {activeTab === "highlights" && (
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-sm text-zinc-500">Category</p>
                    <p className="mt-1 text-zinc-300">{product.category || "-"}</p>
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-sm text-zinc-500">Available Sizes</p>
                    <p className="mt-1 text-zinc-300">{availableSizes || "-"}</p>
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-sm text-zinc-500">Current Stock</p>
                    <p className="mt-1 text-zinc-300">{totalStock}</p>
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <p className="text-sm text-zinc-500">Price</p>
                    <p className="mt-1 text-zinc-300">₹{product.price}</p>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
                  <div className="grid grid-cols-2 border-b border-white/10 bg-black">
                    <div className="p-4 text-sm text-zinc-500">Product Name</div>
                    <div className="p-4 text-sm text-zinc-300">{product.name}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/10 bg-zinc-950">
                    <div className="p-4 text-sm text-zinc-500">Category</div>
                    <div className="p-4 text-sm text-zinc-300">{product.category}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/10 bg-black">
                    <div className="p-4 text-sm text-zinc-500">Price</div>
                    <div className="p-4 text-sm text-zinc-300">₹{product.price}</div>
                  </div>
                  <div className="grid grid-cols-2 border-b border-white/10 bg-zinc-950">
                    <div className="p-4 text-sm text-zinc-500">Stock</div>
                    <div className="p-4 text-sm text-zinc-300">{totalStock}</div>
                  </div>
                  <div className="grid grid-cols-2 bg-black">
                    <div className="p-4 text-sm text-zinc-500">Sizes</div>
                    <div className="p-4 text-sm text-zinc-300">{availableSizes || "-"}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-5 text-sm text-zinc-400">
              <p>✔ Premium dark shopping experience</p>
              <p className="mt-2">✔ Easy category browsing</p>
              <p className="mt-2">✔ Real stock connected from admin panel</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}