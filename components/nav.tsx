"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  FileText,
  HeartPulse,
  Home,
  Info,
  MapPin,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/learn", label: "Learn", icon: BookOpen },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/report", label: "Report", icon: FileText },
  { href: "/habits", label: "Habits", icon: Sparkles },
  { href: "/nearby", label: "Nearby", icon: MapPin },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/60 bg-clay/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5" aria-label="MedVerse home">
            <span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-grape to-[#9a8bf5] text-white shadow-lg shadow-grape/30">
              <HeartPulse className="size-5" aria-hidden />
            </span>
            <span className="text-lg font-black tracking-tight">
              Med<span className="text-grape">Verse</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {items.map((item) => {
              const active = isActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-extrabold transition",
                    active
                      ? "bg-white text-ink shadow-md shadow-ink/5"
                      : "text-muted hover:bg-white/60 hover:text-ink",
                  )}
                >
                  <Icon className="size-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/about"
              aria-current={isActive(pathname, "/about") ? "page" : undefined}
              className={cn(
                "ml-1 flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-extrabold transition",
                isActive(pathname, "/about")
                  ? "bg-white text-ink shadow-md shadow-ink/5"
                  : "text-muted hover:bg-white/60 hover:text-ink",
              )}
            >
              <Info className="size-4" aria-hidden />
              About
            </Link>
          </nav>

          <Link
            href="/about"
            aria-label="About and sources"
            className="grid size-10 place-items-center rounded-2xl bg-white text-muted shadow-md shadow-ink/5 md:hidden"
          >
            <Info className="size-5" aria-hidden />
          </Link>
        </div>
      </header>

      <nav
        aria-label="Main"
        className="fixed inset-x-3 bottom-3 z-40 rounded-[26px] border border-white/70 bg-white/85 px-2 py-2 shadow-[0_20px_40px_-18px_rgba(43,36,64,0.5)] backdrop-blur-xl md:hidden"
      >
        <div className="flex items-center justify-between">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-1.5 text-[10px] font-extrabold transition",
                  active ? "bg-grape-soft text-[#4b3a86]" : "text-muted",
                )}
              >
                <Icon className="size-5" aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
