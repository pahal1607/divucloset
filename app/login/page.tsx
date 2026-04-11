"use client";

import { useState } from "react";
import { createClient } from "../components/supabaseBrowser";

export default function LoginPage() {
  const supabase = createClient();

  const [isSignup, setIsSignup] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);
      setMessage("");

      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
            },
          },
        });

        if (error) throw error;
        setMessage("Account created. Login now.");
        setIsSignup(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        window.location.href = "/account";
      }
    } catch (error: any) {
      setMessage(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.35em] text-zinc-500">
            {isSignup ? "Create Account" : "Login"}
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            {isSignup ? "Join DivuCloset" : "Welcome back"}
          </h2>
        </div>

        <div className="mb-6 flex rounded-full border border-white/10 bg-black p-1">
          <button
            onClick={() => setIsSignup(false)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              !isSignup ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsSignup(true)}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition ${
              isSignup ? "bg-white text-black" : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="space-y-4">
          {isSignup && (
            <>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Full Name"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Phone Number"
                className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
              />
            </>
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-white outline-none"
          />

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black hover:bg-zinc-200 disabled:opacity-60"
          >
            {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-zinc-300">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}