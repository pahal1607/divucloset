"use client";

import { useEffect, useMemo, useState } from "react";
import { Upload } from "lucide-react";
import { getCart, saveCart, CartItem } from "../components/cartUtils";
import {
  createOrder,
  createOrderItems,
  generateOrderId,
  getExpectedDeliveryDate,
} from "../components/orderDb";
import { createClient } from "../components/supabaseBrowser";
import { getMyProfile } from "../components/profileDb";
import { getMyAddresses } from "../components/addressDb";

export default function CheckoutPage() {
  const supabase = createClient();

  const [userId, setUserId] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const [placedOrderId, setPlacedOrderId] = useState("");
  const [placedEta, setPlacedEta] = useState("");
  const [paymentApp, setPaymentApp] = useState("");
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotName, setScreenshotName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setCartItems(getCart());

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setUserId(user.id);

      const profileData = await getMyProfile(user.id);
      const addressData = await getMyAddresses(user.id);

      setProfile(profileData);
      setAddresses(addressData || []);

      const defaultAddress = (addressData || []).find((a: any) => a.is_default);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if ((addressData || []).length > 0) {
        setSelectedAddressId(addressData[0].id);
      }
    };

    load();
  }, [supabase]);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const placeOrder = async () => {
    if (!userId) {
      setError("Please login first");
      return;
    }

    if (!profile?.full_name || !profile?.phone) {
      setError("Please complete your profile first");
      return;
    }

    if (!selectedAddress) {
      setError("Please add and select an address");
      return;
    }

    if (!utrNumber.trim()) {
      setError("Please enter UTR / reference number");
      return;
    }

    if (!screenshotName.trim()) {
      setError("Please upload payment screenshot");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const publicOrderId = generateOrderId();
      const expectedDelivery = getExpectedDeliveryDate(5);
      const fullAddress = `${selectedAddress.line1}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`;

      const order = await createOrder({
        user_id: userId,
        order_id: publicOrderId,
        customer_name: profile.full_name,
        phone: profile.phone,
        address: fullAddress,
        payment_app: paymentApp,
        utr_number: utrNumber,
        screenshot_name: screenshotName,
        total,
        status: "Payment Verification",
        expected_delivery: expectedDelivery,
        stock_applied: false,
      });

      await createOrderItems(
        cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.id ?? null,
          product_name: item.name,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        }))
      );

      saveCart([]);
      window.dispatchEvent(new Event("cartUpdated"));
      setPlacedOrderId(publicOrderId);
      setPlacedEta(expectedDelivery);
    } catch (err: any) {
      setError(err.message || "Failed to submit order");
    } finally {
      setLoading(false);
    }
  };

  if (placedOrderId) {
    return (
      <div className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-zinc-950 p-8 text-center">
          <h1 className="text-4xl font-bold">Order Submitted 🎉</h1>
          <p className="mt-4 text-zinc-400">Your payment is waiting for verification.</p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Your Order ID
            </p>
            <p className="mt-3 text-3xl font-bold">{placedOrderId}</p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black p-6">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">
              Expected Delivery
            </p>
            <p className="mt-3 text-2xl font-bold">
              {new Date(placedEta).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="/orders"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
            >
              My Orders
            </a>
            <a
              href="/"
              className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white hover:text-black"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
        <div>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-zinc-400">Choose an address and complete payment.</p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <h2 className="text-xl font-bold">Profile</h2>
            <p className="mt-3 text-zinc-300">
              {profile?.full_name || "No name"} • {profile?.phone || "No phone"}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Select Address</h2>
              <a
                href="/addresses"
                className="rounded-xl border border-white/20 px-4 py-2 text-sm hover:bg-white hover:text-black"
              >
                Manage Addresses
              </a>
            </div>

            <div className="mt-4 space-y-3">
              {addresses.length === 0 ? (
                <p className="text-zinc-400">No saved addresses. Add one first.</p>
              ) : (
                addresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex cursor-pointer gap-3 rounded-xl border border-white/10 bg-black p-4"
                  >
                    <input
                      type="radio"
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                    />
                    <div>
                      <p className="font-medium">{address.full_name}</p>
                      <p className="text-sm text-zinc-400">{address.phone}</p>
                      <p className="mt-1 text-sm text-zinc-400">
                        {address.line1}, {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <input
              value={paymentApp}
              onChange={(e) => setPaymentApp(e.target.value)}
              placeholder="Payment App (GPay / PhonePe / Paytm)"
              className="w-full rounded-xl bg-zinc-900 p-3 text-white outline-none"
            />

            <input
              value={utrNumber}
              onChange={(e) => setUtrNumber(e.target.value)}
              placeholder="UTR / Reference Number"
              className="w-full rounded-xl bg-zinc-900 p-3 text-white outline-none"
            />
            {/* UTR / Reference */}
<input
  placeholder="UTR Number"
  value={utrNumber}
  onChange={(e) => setUtrNumber(e.target.value)}
  className="w-full rounded-xl bg-black p-3 text-white"
/>

{/* 🔥 Upload Payment Screenshot */}
<div className="mt-4">
  <p className="text-sm text-zinc-400">Upload Payment Screenshot</p>

  <input
    type="file"
    accept="image/*"
    className="mt-2"
    onChange={async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const fileName = `${Date.now()}-${file.name}`;

        const { error } = await supabase.storage
          .from("payment-proofs")
          .upload(fileName, file);

        if (error) throw error;

        const { data } = supabase.storage
          .from("payment-proofs")
          .getPublicUrl(fileName);

        setScreenshotName(data.publicUrl);
      } catch (err) {
        console.error(err);
      }
    }}
  />
</div>

            <div className="rounded-xl border border-white/10 bg-zinc-900 p-4">
              <p className="mb-3 text-sm text-zinc-300">Upload Payment Screenshot</p>

              <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-black px-4 py-4 text-sm text-zinc-300 hover:border-white/40">
                <Upload className="h-5 w-5" />
                <span>{screenshotName ? screenshotName : "Choose screenshot file"}</span>
                {/* 🔥 SCREENSHOT UPLOAD START */}
<input
  type="file"
  accept="image/*"
  onChange={async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileName = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("payment-proofs")
        .upload(fileName, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(fileName);

      setScreenshotName(data.publicUrl);
    } catch (err) {
      console.error(err);
      setError("Upload failed");
    }
  }}
/>
{/* 🔥 SCREENSHOT UPLOAD END */}
              </label>
            </div>
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
          <h2 className="text-2xl font-bold">Order Summary</h2>

          <div className="mt-4 space-y-3">
            {cartItems.map((item, i) => (
              <div key={i} className="flex justify-between gap-4 text-sm">
                <span>
                  {item.name} ({item.size}) x{item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-white/10 pt-4">
            <p className="text-2xl font-bold">Total: ₹{total}</p>
            <p className="mt-2 text-sm text-zinc-400">
              Expected delivery: {new Date(getExpectedDeliveryDate(5)).toLocaleDateString()}
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black p-5">
            <p className="text-lg font-semibold">Pay using UPI QR</p>
            <img
              src="/qr.png"
              alt="UPI QR"
              className="mt-4 w-52 rounded-xl border border-white/10"
            />
            <p className="mt-3 text-sm text-zinc-400">
              Scan this QR and pay the exact amount.
            </p>
          </div>

          <button
            onClick={placeOrder}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-white px-4 py-3 font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Order"}
          </button>
        </div>
      </div>
    </div>
  );
}