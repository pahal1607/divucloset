import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-10">
          <div className="mx-auto max-w-7xl">
            <p className="text-zinc-400">Loading search...</p>
          </div>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}