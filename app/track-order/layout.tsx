import type { Metadata } from "next";

// Private / transactional pages: keep them out of Google.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
