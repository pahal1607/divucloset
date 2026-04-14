"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "../components/supabaseBrowser";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  updateProductSizes,
} from "../components/productDb";
import {
  getAllOrders,
  getOrderItems,
  updateOrderFields,
  OrderStatus,
} from "../components/orderDb";

const supabase = createClient();

type Product = {
  id?: number;
  name: string;
  category: string;
  description: string;
  price: number;
  image_url: string;
  sizes?: {
    S: number;
    M: number;
    L: number;
    XL: number;
  };
};

type AdminOrder = {
  id: number;
  order_id: string;
  customer_name: string;
  phone: string;
  address: string;
  payment_app: string;
  utr_number: string;
  screenshot_name: string;
  total: number;
  status: OrderStatus;
  created_at: string;
  expected_delivery?: string;
  stock_applied?: boolean;
  items?: any[];
};

const statusOptions: OrderStatus[] = [
  "Pending Payment",
  "Payment Verification",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const emptySizes = { S: "", M: "", L: "", XL: "" };

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Women");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [sizes, setSizes] = useState(emptySizes);

  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const loadProducts = async () => {
    const data = await getProducts();
    setProducts(data || []);
  };

  const loadOrders = async () => {
    const ordersData = await getAllOrders();

    const withItems = await Promise.all(
      (ordersData || []).map(async (order: any) => {
        const items = await getOrderItems(order.id);
        return { ...order, items: items || [] };
      })
    );

    setOrders(withItems);
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([loadProducts(), loadOrders()]);
    } catch (error: any) {
      setMessage(error.message || "Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.order_id?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.phone?.toLowerCase().includes(orderSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearch, statusFilter]);

  const resetForm = () => {
    setEditingProductId(null);
    setName("");
    setCategory("Women");
    setDescription("");
    setPrice("");
    setImageUrl("");
    setSizes(emptySizes);
  };

  // 🔥 Upload images to Supabase
const uploadProductImages = async (files: File[]) => {
  const uploadedUrls: string[] = [];

  for (const file of files) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    uploadedUrls.push(data.publicUrl);
  }

  return uploadedUrls;
};

  const handleEditProduct = (product: Product) => {
    setEditingProductId(product.id || null);
    setName(product.name || "");
    setCategory(product.category || "Women");
    setDescription(product.description || "");
    setPrice(String(product.price || ""));
    setImageUrl(product.image_url || "");
    setSizes({
      S: String(product.sizes?.S ?? 0),
      M: String(product.sizes?.M ?? 0),
      L: String(product.sizes?.L ?? 0),
      XL: String(product.sizes?.XL ?? 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProduct = async () => {
    if (!name.trim() || !category.trim() || !price.trim()) {
      setMessage("Please fill product name, category, and price");
      return;
    }
let uploadedImageUrls: string[] = [];

if (imageFiles.length > 0) {
  uploadedImageUrls = await uploadProductImages(imageFiles);
}

const finalMainImage = uploadedImageUrls[0] || imageUrl || "";
const finalImages =
  uploadedImageUrls.length > 0
    ? uploadedImageUrls
    : imageUrl
    ? [imageUrl]
    : [];

    const payload = {
  name,
  category,
  description,
  price: Number(price),
  image_url: finalMainImage,
  images: finalImages,
  sizes: {
    S: Number(sizes.S || 0),
    M: Number(sizes.M || 0),
    L: Number(sizes.L || 0),
    XL: Number(sizes.XL || 0),
  },
};

    try {
      setLoading(true);
      setMessage("");

      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        setMessage("Product updated successfully");
      } else {
        await addProduct(payload);
        setMessage("Product added successfully");
      }

      resetForm();
      await loadProducts();
    } catch (error: any) {
      setMessage(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      setLoading(true);
      setMessage("");
      await deleteProduct(id);
      setMessage("Product deleted successfully");
      await loadProducts();
    } catch (error: any) {
      setMessage(error.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  const reduceStockForOrder = async (order: AdminOrder) => {
    if (!order.items || order.items.length === 0) return;

    for (const item of order.items) {
      if (!item.product_id || !item.size) continue;

      const product = await getProductById(item.product_id);
      if (!product) continue;

      const currentSizes = product.sizes || { S: 0, M: 0, L: 0, XL: 0 };
      const selectedSize = item.size as keyof typeof currentSizes;
      const currentQty = Number(currentSizes[selectedSize] || 0);
      const orderQty = Number(item.quantity || 0);

      if (currentQty < orderQty) {
        throw new Error(
          `Not enough stock for ${item.product_name} (${item.size}). Available: ${currentQty}`
        );
      }

      const updatedSizes = {
        ...currentSizes,
        [selectedSize]: currentQty - orderQty,
      };

      await updateProductSizes(product.id, updatedSizes);
    }
  };

  const increaseStockForOrder = async (order: AdminOrder) => {
    if (!order.items || order.items.length === 0) return;

    for (const item of order.items) {
      if (!item.product_id || !item.size) continue;

      const product = await getProductById(item.product_id);
      if (!product) continue;

      const currentSizes = product.sizes || { S: 0, M: 0, L: 0, XL: 0 };
      const selectedSize = item.size as keyof typeof currentSizes;
      const currentQty = Number(currentSizes[selectedSize] || 0);
      const orderQty = Number(item.quantity || 0);

      const updatedSizes = {
        ...currentSizes,
        [selectedSize]: currentQty + orderQty,
      };

      await updateProductSizes(product.id, updatedSizes);
    }
  };

  const handleUpdateStatus = async (order: AdminOrder, nextStatus: OrderStatus) => {
    try {
      setLoading(true);
      setMessage("");

      const alreadyApplied = !!order.stock_applied;

      if (nextStatus === "Confirmed" && !alreadyApplied) {
        await reduceStockForOrder(order);
        await updateOrderFields(order.id, {
          status: "Confirmed",
          stock_applied: true,
        });
        setMessage("Order confirmed and stock reduced");
      } else if (nextStatus === "Cancelled" && alreadyApplied) {
        await increaseStockForOrder(order);
        await updateOrderFields(order.id, {
          status: "Cancelled",
          stock_applied: false,
        });
        setMessage("Order cancelled and stock restored");
      } else {
        await updateOrderFields(order.id, {
          status: nextStatus,
        });
        setMessage("Order status updated");
      }

      await loadAll();
    } catch (error: any) {
      setMessage(error.message || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-2 text-zinc-400">Manage products, stock, and orders.</p>

        {message && (
          <div className="mt-6 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-8 xl:grid-cols-[430px_1fr]">
          <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold">
                {editingProductId ? "Edit Product" : "Add Product"}
              </h2>

              {editingProductId && (
                <button
                  onClick={resetForm}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product Name"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              >
                <option value="Women">Women</option>
                <option value="Men">Men</option>
                <option value="Shoes">Shoes</option>
                <option value="Beauty Products">Beauty Products</option>
                <option value="Jewelry">Jewelry</option>
              </select>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                rows={4}
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Price"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              {/* 🔥 Upload Product Images */}
<div>
  <p className="mb-2 text-sm text-zinc-300">Upload Images</p>

  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      const files = Array.from(e.target.files || []);
      setImageFiles(files);
    }}
    className="w-full rounded-xl bg-black p-3 text-white outline-none"
  />

  {/* Preview */}
  <div className="mt-3 flex gap-2 flex-wrap">
    {imageFiles.map((file, i) => (
      <img
        key={i}
        src={URL.createObjectURL(file)}
        className="h-16 w-16 rounded object-cover"
      />
    ))}
  </div>
</div>

              <div>
                <p className="mb-2 text-sm text-zinc-300">Stock by Size</p>
                <div className="grid grid-cols-2 gap-3">
                  {["S", "M", "L", "XL"].map((size) => (
                    <input
                      key={size}
                      placeholder={`${size} stock`}
                      value={sizes[size as keyof typeof sizes]}
                      onChange={(e) =>
                        setSizes({ ...sizes, [size]: e.target.value })
                      }
                      className="rounded-xl bg-black p-3 text-white outline-none"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveProduct}
                disabled={loading}
                className="w-full rounded-2xl bg-white px-4 py-3 font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : editingProductId
                  ? "Update Product"
                  : "Add Product"}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-bold">All Products</h2>
                <button
                  onClick={loadAll}
                  className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black"
                >
                  Refresh
                </button>
              </div>

              {loading && products.length === 0 ? (
                <p className="mt-6 text-zinc-400">Loading products...</p>
              ) : products.length === 0 ? (
                <p className="mt-6 text-zinc-400">No products found.</p>
              ) : (
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => {
                    const totalStock =
                      Number(product.sizes?.S || 0) +
                      Number(product.sizes?.M || 0) +
                      Number(product.sizes?.L || 0) +
                      Number(product.sizes?.XL || 0);

                    return (
                      <div
                        key={product.id}
                        className="rounded-3xl border border-white/10 bg-black p-4"
                      >
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-44 w-full rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="flex h-44 w-full items-center justify-center rounded-2xl bg-zinc-900 text-sm text-zinc-500">
                            No Image
                          </div>
                        )}

                        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-500">
                          {product.category}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">{product.name}</h3>
                        <p className="mt-2 text-sm text-zinc-400">
                          {product.description || "No description"}
                        </p>
                        <p className="mt-3 text-xl font-bold">₹{product.price}</p>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-400">
                          <p>S: {product.sizes?.S ?? 0}</p>
                          <p>M: {product.sizes?.M ?? 0}</p>
                          <p>L: {product.sizes?.L ?? 0}</p>
                          <p>XL: {product.sizes?.XL ?? 0}</p>
                        </div>

                        <div className="mt-3">
                          {totalStock <= 5 ? (
                            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-300">
                              Low Stock: {totalStock}
                            </span>
                          ) : (
                            <span className="rounded-full border border-white/10 bg-zinc-950 px-3 py-1 text-xs font-medium text-zinc-300">
                              Stock: {totalStock}
                            </span>
                          )}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="rounded-xl border border-white/20 px-4 py-2 font-semibold hover:bg-white hover:text-black"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(product.id!)}
                            className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 font-semibold text-red-300 hover:bg-red-500/20"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-950 p-5 sm:p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h2 className="text-2xl font-bold">Orders</h2>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search order ID / name / phone"
                    className="rounded-xl bg-black px-4 py-3 text-sm text-white outline-none"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl bg-black px-4 py-3 text-sm text-white outline-none"
                  >
                    <option value="All">All Statuses</option>
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {loading && orders.length === 0 ? (
                <p className="mt-6 text-zinc-400">Loading orders...</p>
              ) : filteredOrders.length === 0 ? (
                <p className="mt-6 text-zinc-400">No matching orders found.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-3xl border border-white/10 bg-black p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                            Order ID
                          </p>
                          <p className="mt-2 break-all text-xl font-bold">{order.order_id}</p>
                          <p className="mt-2 text-sm text-zinc-400">
                            {order.customer_name} • {order.phone}
                          </p>
                          <p className="mt-1 text-sm text-zinc-400">{order.address}</p>
                          <p className="mt-2 text-sm text-zinc-400">
                            Payment App: {order.payment_app || "Not provided"}
                          </p>
                          <p className="text-sm text-zinc-400">
                            UTR: {order.utr_number || "Not provided"}
                          </p>

                          {order.screenshot_name && (
                            <a
                              href={order.screenshot_name}
                              target="_blank"
                              className="mt-2 inline-block text-sm text-blue-400 underline"
                            >
                              View Screenshot
                            </a>
                          )}

                          {order.expected_delivery && order.status !== "Cancelled" && (
                            <p className="mt-2 text-sm text-zinc-400">
                              Expected delivery:{" "}
                              {new Date(order.expected_delivery).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        <div className="w-full lg:max-w-[240px]">
                          <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                            Status
                          </p>
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order, e.target.value as OrderStatus)
                            }
                            className="mt-2 w-full rounded-xl bg-zinc-900 p-3 text-white outline-none"
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <p className="mt-3 text-xl font-bold">₹{order.total}</p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-3">
                        {order.items?.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-zinc-950 p-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="font-medium">{item.product_name}</p>
                              <p className="text-sm text-zinc-400">
                                Size: {item.size} | Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                          </div>
                        ))}
                      </div>

                      <p className="mt-4 text-sm text-zinc-500">
                        Ordered on: {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}