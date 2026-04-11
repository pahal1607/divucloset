"use client";

import { useSearchParams } from "next/navigation";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold">Search Page</h1>

      <p className="mt-4 text-zinc-400">
        You searched for:
      </p>

      <p className="mt-2 text-xl font-semibold">
        {q || "Nothing"}
      </p>
    </div>
  );
}