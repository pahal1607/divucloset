"use client";

import { useState } from "react";
import { findOrder } from "../components/orderUtils";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [searched, setSearched] = useState(false);
  const [order, setOrder] = useState<any>(null);

  const handleTrack = () => {
    const foundOrder = findOrder(orderId.trim(), phone.trim());
    setOrder(foundOrder || null);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Track Order</h1>
        <p className="mt-2 text-zinc-400">
          Enter your Order ID and phone number to check order status.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID"
            className="w-full rounded-xl bg-zinc-900 p-3 text-white outline-none"
          />
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full rounded-xl bg-zinc-900 p-3 text-white outline-none"
          />
        </div>

        <button
          onClick={handleTrack}
          className="mt-5 rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
        >
          Track Order
        </button>

        {searched && !order && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300">
            No order found. Please check your Order ID and phone number.
          </div>
        )}

        {order && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  Order ID
                </p>
                <p className="mt-2 text-2xl font-bold">{order.orderId}</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  Status
                </p>
                <p className="mt-2 text-2xl font-bold">{order.status}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  Customer
                </p>
                <p className="mt-2">{order.customerName}</p>
                <p className="text-zinc-400">{order.phone}</p>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  Payment
                </p>
                <p className="mt-2">UTR: {order.utrNumber}</p>
                <p className="text-zinc-400">
                  App: {order.paymentApp || "Not provided"}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                Items
              </p>
              <div className="mt-4 space-y-3">
                {order.items.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between gap-4 rounded-xl border border-white/10 bg-black p-4"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-zinc-400">
                        Size: {item.size} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-white/10 pt-4">
              <p className="text-2xl font-bold">Total: ₹{order.total}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}