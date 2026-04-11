"use client";

import { useState } from "react";
import { supabase } from "../components/supabaseClient";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrack = async () => {
    setError("");
    setOrder(null);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .eq("phone", phone)
      .single();

    if (error) {
      setError("Order not found");
    } else {
      setOrder(data);
    }
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6 sm:p-8">
        <h1 className="text-3xl font-bold">Track Order</h1>
        <p className="mt-2 text-zinc-400">
          Enter your order ID and phone number.
        </p>

        <div className="mt-6 space-y-4">
          <input
            placeholder="Order ID"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full rounded-xl bg-black p-3 text-white outline-none"
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl bg-black p-3 text-white outline-none"
          />

          <button
            onClick={handleTrack}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black"
          >
            Track Order
          </button>
        </div>

        {error && <p className="mt-4 text-red-400">{error}</p>}

        {order && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-black p-5">
            <p className="text-sm text-zinc-500">Order ID</p>
            <p className="mt-1 text-xl font-bold">{order.order_id}</p>

            <p className="mt-4 text-sm text-zinc-500">Status</p>
            <p className="mt-1 text-lg font-semibold">{order.status}</p>

            <p className="mt-4 text-sm text-zinc-500">Total</p>
            <p className="mt-1 text-lg font-semibold">₹{order.total}</p>

            {order.expected_delivery && order.status !== "Cancelled" && (
              <>
                <p className="mt-4 text-sm text-zinc-500">Expected Delivery</p>
                <p className="mt-1 text-lg font-semibold">
                  {new Date(order.expected_delivery).toLocaleDateString()}
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}