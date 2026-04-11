"use client";

import { useState } from "react";
import { supabase } from "../components/supabaseClient";

export default function SupabaseTestPage() {
  const [message, setMessage] = useState("Not tested yet");

  const testConnection = async () => {
    const { error } = await supabase.from("products").select("*").limit(1);

    if (error) {
      setMessage(`Connected, but table issue: ${error.message}`);
    } else {
      setMessage("Supabase connected successfully");
    }
  };

  return (
    <div className="min-h-screen bg-black p-10 text-white">
      <h1 className="text-3xl font-bold">Supabase Test</h1>

      <button
        onClick={testConnection}
        className="mt-6 rounded-xl bg-white px-6 py-3 font-semibold text-black"
      >
        Test Supabase
      </button>

      <p className="mt-4 text-zinc-300">{message}</p>
    </div>
  );
}