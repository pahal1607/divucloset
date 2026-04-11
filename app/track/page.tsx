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
    <div className="min-h-screen bg-black p-6 text-white">
      <h1 className="text-2xl font-bold">Track Order</h1>

      <div className="mt-6 space-y-4">
        <input
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-3 text-black"
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 text-black"
        />

        <button onClick={handleTrack} className="bg-white px-4 py-2 text-black">
          Track
        </button>
      </div>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {order && (
        <div className="mt-6">
          <p>Status: {order.status}</p>
          <p>Total: ₹{order.total}</p>
          <p>Expected Delivery: {order.expected_delivery}</p>
        </div>
      )}
    </div>
  );
}