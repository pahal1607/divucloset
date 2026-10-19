"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CartItem, getCart, saveCart } from "../components/cartUtils";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(getCart());
  }, []);

  const updateQuantity = (index: number, change: number) => {
    const updated = [...cartItems];
    updated[index].quantity += change;

    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }

    setCartItems(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        <p className="mt-2 text-zinc-400">Review your selected products below.</p>

        {cartItems.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <p className="text-zinc-400">Your cart is empty.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.id}-${item.size}-${index}`}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-zinc-950 p-4 md:flex-row"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-32 w-full rounded-xl object-cover md:w-32"
                    />
                  ) : (
                    <div className="flex h-32 w-full items-center justify-center rounded-xl bg-zinc-900 text-sm text-zinc-500 md:w-32">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="mt-1 text-sm text-zinc-400">Size: {item.size}</p>
                    <p className="mt-2 text-lg font-bold">₹{item.price}</p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(index, -1)}
                        className="rounded-lg border border-white/20 px-3 py-1"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, 1)}
                        className="rounded-lg border border-white/20 px-3 py-1"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-white/10 bg-zinc-950 p-6">
              <h2 className="text-2xl font-bold">Order Summary</h2>
              <p className="mt-4 text-zinc-400">Items: {cartItems.length}</p>
              <p className="mt-2 text-2xl font-bold">Total: ₹{total}</p>

              <Link
                href="/checkout"
                className="mt-6 block w-full rounded-xl bg-white px-4 py-3 text-center font-semibold text-black hover:bg-zinc-200"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}