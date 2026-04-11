"use client";

import { useEffect, useState } from "react";
import { createClient } from "../components/supabaseBrowser";
import {
  addProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProductSizes,
} from "../components/productDb";
import {
  getAllOrders,
  getOrderItems,
  updateOrderFields,
  OrderStatus,
} from "../components/orderDb";

const ADMIN_EMAIL = "keertidwivedi2008@gmail.com";

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

export default function AdminPage() {
  const supabase = createClient();

  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [category, setCategory] = useState("Women");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sizes, setSizes] = useState({ S: "", M: "", L: "", XL: "" });

  // ✅ FIXED ADMIN CHECK
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.email?.toLowerCase().trim() !== ADMIN_EMAIL) {
        window.location.href = "/";
        return;
      }

      setIsCheckingAdmin(false);
    };

    checkAdmin();
  }, [supabase]);

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isCheckingAdmin) loadAll();
  }, [isCheckingAdmin]);

  const handleAddProduct = async () => {
    if (!name || !price) {
      setMessage("Fill name & price");
      return;
    }

    await addProduct({
      name,
      category,
      description,
      price: Number(price),
      image_url: imageUrl,
      sizes: {
        S: Number(sizes.S || 0),
        M: Number(sizes.M || 0),
        L: Number(sizes.L || 0),
        XL: Number(sizes.XL || 0),
      },
    });

    setName("");
    setPrice("");
    setMessage("Product added");
    loadProducts();
  };

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    loadProducts();
  };

  if (isCheckingAdmin) {
    return <div className="p-10 text-white">Checking admin...</div>;
  }

  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold">Admin Panel</h1>

      <div className="mt-6">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 text-black"
        />
        <input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="ml-2 p-2 text-black"
        />
        <button onClick={handleAddProduct} className="ml-2 bg-white px-4 py-2 text-black">
          Add
        </button>
      </div>

      <h2 className="mt-10 text-xl">Products</h2>
      {products.map((p) => (
        <div key={p.id} className="mt-2 flex justify-between">
          <span>{p.name} - ₹{p.price}</span>
          <button onClick={() => handleDeleteProduct(p.id!)}>Delete</button>
        </div>
      ))}

      <h2 className="mt-10 text-xl">Orders</h2>
      {orders.map((o) => (
        <div key={o.id} className="mt-2">
          {o.order_id} - {o.status}
        </div>
      ))}
    </div>
  );
}