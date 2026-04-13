"use client";

import { useEffect, useState } from "react";

export default function Loader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1800); // ⏱ 1.8 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700">
      
      <div className="text-center animate-fadeIn">
        
        {/* Brand */}
        <h1 className="text-3xl font-bold tracking-[0.4em] text-white sm:text-5xl">
          DIVUCLOSET
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-xs tracking-widest text-zinc-500 sm:text-sm">
          by Divyanshi
        </p>

        {/* Loading dots */}
        <div className="mt-6 flex justify-center gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-white"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-white delay-150"></span>
          <span className="h-2 w-2 animate-bounce rounded-full bg-white delay-300"></span>
        </div>

      </div>
    </div>
  );
}