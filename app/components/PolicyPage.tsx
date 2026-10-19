import { siteConfig } from "../lib/site";

/** Shared layout for About / Shipping / Privacy / Terms pages. */
export default function PolicyPage({
  eyebrow,
  title,
  intro,
  showUpdated = true,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  showUpdated?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <header className="animate-fade-up">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 leading-7 text-zinc-400">{intro}</p>}
        {showUpdated && (
          <p className="mt-3 text-xs text-zinc-500">
            Last updated: {siteConfig.policies.lastUpdated}
          </p>
        )}
      </header>

      <div className="mt-10 text-zinc-400 [&_a]:text-gold [&_a]:underline-offset-2 hover:[&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-white [&_li]:mt-2 [&_p]:mt-3 [&_p]:leading-7 [&_strong]:font-semibold [&_strong]:text-zinc-200 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:leading-7">
        {children}
      </div>
    </div>
  );
}
