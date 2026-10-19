"use client";

import { useEffect, useState } from "react";
import { createClient } from "../components/supabaseBrowser";
import { getMyOrders, getOrderItems } from "../components/orderDb";
import Link from "next/link";

type OrderWithItems = {
  id: number;
  order_id: string;
  status: string;
  total: number;
  created_at: string;
  expected_delivery?: string;
  items: any[];
};

export default function OrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setOrders([]);
          setLoading(false);
          return;
        }

        const ordersData = await getMyOrders(user.id);

        const withItems = await Promise.all(
          (ordersData || []).map(async (order: any) => {
            const items = await getOrderItems(order.id);
            return { ...order, items: items || [] };
          })
        );

        setOrders(withItems);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="mt-2 text-zinc-400">View your order history and current status.</p>

        {loading ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-zinc-400">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-zinc-400">No orders found for your account yet.</p>
            <Link
              href="/women"
              className="mt-4 inline-block rounded-xl bg-white px-5 py-3 font-semibold text-black"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-2xl border border-white/10 bg-zinc-950 p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                      Order ID
                    </p>
                    <p className="mt-2 text-xl font-bold">{order.order_id}</p>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                      Status
                    </p>
                    <p className="mt-2 text-xl font-bold">{order.status}</p>
                  </div>

                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                      Total
                    </p>
                    <p className="mt-2 text-xl font-bold">₹{order.total}</p>
                  </div>
                </div>

                {order.expected_delivery && order.status !== "Cancelled" && (
                  <p className="mt-4 text-sm text-zinc-400">
                    Expected delivery: {new Date(order.expected_delivery).toLocaleDateString()}
                  </p>
                )}

                <div className="mt-6 space-y-3">
                  {order.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between gap-4 rounded-xl border border-white/10 bg-black p-4"
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
  );
}