"use client";

import { useEffect, useState } from "react";
import { createClient } from "../components/supabaseBrowser";
import {
  ensureMyProfile,
  getMyProfile,
  updateMyProfile,
} from "../components/profileDb";
import { getErrorMessage } from "../components/errorUtils";
import Link from "next/link";

export default function AccountPage() {
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setUser(user);

        if (user) {
          let profileData = await getMyProfile(user.id);

          if (!profileData) {
            profileData = await ensureMyProfile({
              id: user.id,
              email: user.email || "",
              full_name: user.user_metadata?.full_name || "",
              phone: user.user_metadata?.phone || "",
            });
          }

          setFullName(profileData?.full_name || "");
          setPhone(profileData?.phone || "");
        }
      } catch (error) {
        setMessage(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateMyProfile(user.id, {
        full_name: fullName,
        phone,
      });
      setMessage("Profile updated");
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl">Loading account...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-zinc-950 p-8">
          <h1 className="text-3xl font-bold">You are not logged in</h1>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-black"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">My Account</h1>
        <p className="mt-2 text-zinc-400">Manage your profile and saved addresses.</p>

        {message && (
          <div className="mt-4 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-zinc-300">
            {message}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-6">
            <h2 className="text-2xl font-bold">Profile</h2>

            <div className="mt-6 space-y-4">
              <input
                value={user.email || ""}
                disabled
                className="w-full rounded-xl bg-black p-3 text-zinc-500 outline-none"
              />

              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full rounded-xl bg-black p-3 text-white outline-none"
              />

              <button
                onClick={handleSave}
                className="rounded-xl bg-white px-6 py-3 font-semibold text-black hover:bg-zinc-200"
              >
                Save Profile
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/addresses"
              className="block rounded-2xl border border-white/10 bg-zinc-950 p-5 hover:border-white/20"
            >
              <h3 className="text-xl font-semibold">Saved Addresses</h3>
              <p className="mt-2 text-sm text-zinc-400">Manage your delivery addresses.</p>
            </Link>

            <Link
              href="/orders"
              className="block rounded-2xl border border-white/10 bg-zinc-950 p-5 hover:border-white/20"
            >
              <h3 className="text-xl font-semibold">My Orders</h3>
              <p className="mt-2 text-sm text-zinc-400">View your orders.</p>
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-left hover:bg-red-500/20"
            >
              <h3 className="text-xl font-semibold text-red-300">Logout</h3>
              <p className="mt-2 text-sm text-red-200/80">Sign out of your account.</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}